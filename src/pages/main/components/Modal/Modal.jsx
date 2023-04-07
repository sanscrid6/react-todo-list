import React, {useEffect, useRef} from "react";
import './Modal.css'
import closeIcon from './close-icon.png';
import { $modalActive, $modalProps, $todos, ITEM_STATUS, closeModal, updateTodos } from "../../../../state";
import { useStore } from "effector-react";
import Input from '../../../../components/Input/Input'

import {v4 as uuid} from 'uuid';
import { useState } from "react";

export default function Modal(){
  const [errors, setErrors] = useState({});

  const show = useStore($modalActive);
  const modalProps = useStore($modalProps);

  const nameRef = useRef(null);
  const deadlineRef = useRef(null);

  const isCreateModal = !modalProps?.id;

  function closeHandler(){
    closeModal();
  }

  function handleSubmit(e){
    e.preventDefault();
    const errors = {};
  
    const name = nameRef.current.value;
    const deadline = deadlineRef.current.value;

    if(!name){
      errors.name = 'Name is required';
    }

    if(!deadline){
      errors.deadline = 'Expired date is required';
    }
    const d = new Date(deadline);
    const now = new Date();
    d.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    if(d.getTime() < now.getTime()){
      errors.deadline = 'Choose valid date';
    }

    if(Object.keys(errors).length > 0){
      setErrors(errors);
    } else {
      setErrors({});
      
      if(isCreateModal){
        updateTodos({status: ITEM_STATUS.TODO, items: [...$todos.getState().TODO, {name, deadline, id: uuid()}]})
      } else {
        const listToUpdate = $todos.getState()[modalProps.status];
        const index = listToUpdate.findIndex(item => item.id == modalProps.id);
        listToUpdate[index] = {name, deadline, id: listToUpdate[index].id}
        updateTodos({status: modalProps.status, items: listToUpdate});
      }

      closeModal();

    }
  }

  useEffect(() => {
    if(show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [show])

  return (
    <>
      {show &&
        <dialog className='modal-container' >
          <div className='modal' >
            <header className='modal__header'>
              <p>{isCreateModal ? 'Create todo' : 'Update todo'}</p>
              <img
                src={closeIcon}
                alt='close icon'
                role='button'
                onClick={closeHandler}
                className='modal__header__close-icon'
              />
            </header>
            <div className='modal__content'>
              <form className='create-todo-modal' onSubmit={handleSubmit}>
                <Input 
                  type='text' 
                  label='Name' 
                  defaultValue={modalProps.name} 
                  ref={nameRef} 
                  error={errors['name']}
                />
                <Input 
                  type='date' 
                  label='Expired date' 
                  defaultValue={modalProps.deadline} 
                  ref={deadlineRef} 
                  error={errors['deadline']}
                />
                <button
                  type='submit'
                  className='create-todo-modal__submit'
                >
                  {isCreateModal ? 'Create' : 'Update'}
                </button>
              </form>
            </div>
          </div>
        </dialog>
      }
    </>
  )
}
