import React, {useEffect} from 'react';
import './Main.css';
import TodoList from "./components/TodoList/TodoList";
import Modal from "./components/Modal/Modal";
import {createStore, useStore} from "../../state/state.js";
import Input from "../../components/Input/Input";
import { DragProvider } from '../../dnd/DragProvider';

export const $showModal = createStore(false);

export default function Main(){
  const showModal = useStore($showModal);

  function handleCreateTodo(e){
    e.preventDefault();
    $showModal.set(false);
  }

  return (
    <DragProvider>
      <div className='app_container'>
        <main id='app'>
          <TodoList className='bg-red' title='TO DO' canCreate={true}/>
          <TodoList className='bg-yellow' title='IN PROGRESS' />
          <TodoList className='bg-green' title='DONE' />
        </main>
        <Modal
          show={showModal}
          title='Create todo'
          onClose={() => $showModal.set(false)}
        >
          <form className='create-todo-modal'  onSubmit={handleCreateTodo}>
            <Input type='text' label='Name' />
            <Input type='date' label='Expired date' />
            <button
              type='submit'
              className='create-todo-modal__submit'
            >
              Create
            </button>
          </form>
        </Modal>
      </div>
    </DragProvider>
  )
}
