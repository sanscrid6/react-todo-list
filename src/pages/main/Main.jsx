import React, {useEffect} from 'react';
import './Main.css';
import TodoList from "./components/TodoList/TodoList";
import Modal from "./components/Modal/Modal";
import { DragProvider } from '../../dnd/DragProvider';
import {ITEM_STATUS, initTodos } from '../../state';
import { supabaseApi } from '../../apis/supabaseApi';
import { todoService } from '../../services/todoService';


export default function Main(){
  useEffect(() => {
    async function getTodos(){
      await todoService.initTodos()
    }

    getTodos()
  }, [])

  async function saveItems(items){
    try {
      await supabaseApi.updateTodos(items);
    } catch (error) {
      console.error(error) 
    }
  }

  return (
    <DragProvider onDragEnd={saveItems}>
      <div className='app_container'>
        <main id='app'>
          <TodoList className='bg-red' title={ITEM_STATUS.TODO} canCreate={true}/>
          <TodoList className='bg-yellow' title={ITEM_STATUS.IN_PROGRESS} />
          <TodoList className='bg-green' title={ITEM_STATUS.DONE} />
        </main>
        <Modal />
      </div>
    </DragProvider>
  )
}
