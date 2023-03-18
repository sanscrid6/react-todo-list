import React, {useEffect} from 'react';
import './Main.css';
import TodoList from "./components/TodoList/TodoList";
import Modal from "./components/Modal/Modal";
import {createStore, useStore} from "../../state/state.js";
import Input from "../../components/Input/Input";

export const $showModal = createStore(false);

export default function Main(){
  const showModal = useStore($showModal);

  function handleCreateTodo(e){
    e.preventDefault();
    $showModal.set(false);
  }

  return (
    <div className='app_container'>
      <main id='app'>
        <TodoList bgColor='#FFF4F4' title='TO DO' canCreate={true}/>
        <TodoList bgColor='#FEFCF3' title='IN PROGRESS' />
        <TodoList bgColor='#F7FFF3' title='DONE' />
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
  )
}
