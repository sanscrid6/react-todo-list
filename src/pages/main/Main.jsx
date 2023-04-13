import React, {useEffect} from 'react';
import './Main.css';
import TodoList from "./components/TodoList/TodoList";
import Modal from "./components/Modal/Modal";
import { DragProvider } from '../../dnd/DragProvider';
import { $modalActive, ITEM_STATUS, closeModal, initTodos } from '../../state';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react'
import { supabase } from '../../supabase';


export default function Main(){
  const supabaseClient = useSupabaseClient();
  const session = useSession();


  function handleCreateTodo(e){
    e.preventDefault();
    closeModal();
  }

  function closeModalHandler(){
    closeModal();
  }

  useEffect(() => {
    async function getTodos(){
      const {data} = await supabase.from('todos').select('data').eq('userId', localStorage.getItem('userId'))
      if(!data[0]){
        await supabase.from('todos').insert([{userId: localStorage.getItem('userId'), data: ""}])
      } else {
        data[0].data && initTodos(JSON.parse(data[0].data))
      }
    }

    getTodos()
  }, [])

  async function saveItems(items){
    try {
      await supabase
                .from('todos')
                .update([{userId: localStorage.getItem('userId'), data: JSON.stringify(items)}])
                .eq('userId', localStorage.getItem('userId'))
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
