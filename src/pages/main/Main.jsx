import React, {useEffect} from 'react';
import './Main.css';
import TodoList from "./components/TodoList/TodoList";
import Modal from "./components/Modal/Modal";
import Input from "../../components/Input/Input";
import { DragProvider } from '../../dnd/DragProvider';
import { $modalActive, ITEM_STATUS, closeModal } from '../../state';
import { useStore } from 'effector-react';

export default function Main(){
  const showModal = useStore($modalActive);

  function handleCreateTodo(e){
    e.preventDefault();
    closeModal();
  }

  function closeModalHandler(){
    closeModal();
  }

  return (
    <DragProvider>
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
