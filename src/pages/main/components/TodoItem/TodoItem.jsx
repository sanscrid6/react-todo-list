import React, { useCallback } from "react";
import './TodoItem.css';
import { openModal} from "../../../../state";
import { dateService } from "../../../../services/dateService";
import { todoService } from "../../../../services/todoService";


export default function TodoItem({forwardedRef, id, name, deadline, listId, calendarEventId, ...props}){
  const deleteHandler = useCallback(async (e) => {
    e.stopPropagation();
    try {
      todoService.deleteTodo({id, status: listId, calendarEventId})
    } catch (error) {
      console.error(error) 
    }
  }, [id, listId]);

  const updateHandler = useCallback((e) => {
    openModal({
      id,
      name,
      deadline,
      status: listId,
    })
  }, [id, name, deadline, listId]);

  return (
    <li ref={forwardedRef} className='todo-item' onClick={updateHandler} {...props}>
      <button className="todo-item__delete-btn" onClick={deleteHandler}>X</button>
      <p className='todo-item__text'>{name}</p>
      <time className='todo-item__date'>{dateService.format(new Date(deadline))}</time>
    </li>
  )
}
