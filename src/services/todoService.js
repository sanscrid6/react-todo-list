import { $todos, ITEM_STATUS, initTodos, updateTodos } from "../state";
import { dateService } from "./dateService";
import { googleApi } from "../apis/googleApi";
import { supabaseApi } from "../apis/supabaseApi";
import {v4 as uuid} from 'uuid'

class TodoService {
    async initTodos(){
        const {data} = await supabaseApi.getTodos()
        if(!data[0]){
          await supabaseApi.createTodos()
        } else if (data[0].data){
            initTodos(JSON.parse(data[0].data)) 
        }
    }

    async deleteTodo({id, status, calendarEventId}){
        await googleApi.deleteEvent(calendarEventId)
        updateTodos({
            status,
            items: $todos.getState()[status].filter(item => item.id !== id)
        })
        await supabaseApi.updateTodos($todos.getState())
    }

    async updateTodo({name, deadline, status, id}){
        const errors = this.#validateTodo({name, deadline})

        if(Object.keys(errors).length > 0){
            return {errors}
        }

        const d = new Date(deadline)

        d.setHours(0)
        d.setMilliseconds(0)
        d.setMinutes(0)
        d.setSeconds(0)

        const listToUpdate = $todos.getState()[status];
        const index = listToUpdate.findIndex(item => item.id == id);

        const res = await googleApi.updateEvent({id: listToUpdate[index].calendarEventId, name, date: d})

        if(!res.id){
          console.error(res)
          return {
            errors: {
                name: "unknown error"
          }}
        }

        listToUpdate[index] = {...listToUpdate[index], name, deadline}
        updateTodos({status, items: listToUpdate});
        await supabaseApi.updateTodos($todos.getState())
        return {}
    }

    async createTodo({name, deadline}){
        const errors = this.#validateTodo({name, deadline})
       
        if(Object.keys(errors).length > 0){
            return {errors};
        } 
        const d = new Date(deadline)
        d.setHours(0)
        d.setMilliseconds(0)
        d.setMinutes(0)
        d.setSeconds(0)

        const res = await googleApi.createEvent({name, date: d})
        
        if(!res.id){
            console.error(res)
            return {
                errors: {
                    name: "unknown error"
            }}
        } 

        updateTodos({
            status: ITEM_STATUS.TODO,
            items: [
            ...$todos.getState().TODO,
            {
                name,
                deadline,
                id: uuid(),
                calendarEventId: res.id
            }]
        })

        await supabaseApi.updateTodos($todos.getState()) 

        return {}
    }

    #validateTodo({name, deadline}){
        let errors = {};

        if(!name){
            errors.name = 'Name is required';
        }

        if(!deadline){
            errors.deadline = 'Date is required';
        }
        const dateErrors = dateService.isValid(deadline)  
    
        errors = {...errors, ...dateErrors}

        return errors
    }

}

export const todoService = new TodoService()