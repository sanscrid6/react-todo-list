import React, {useEffect, useRef} from "react";
import './Modal.css'
import closeIcon from './close-icon.png';
import { $modalActive, $modalProps, $todos, ITEM_STATUS, closeModal, updateTodos } from "../../../../state";
import { useStore } from "effector-react";
import Input from '../../../../components/Input/Input'
import { useState } from "react";
import { todoService } from "../../../../services/todoService";

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

  async function handleSubmit(e){
    e.preventDefault();
    try {
      const name = nameRef.current.value;
      const deadline = deadlineRef.current.value;
      let errors
        
      if(isCreateModal){
        const res = await todoService.createTodo({name, deadline})
        errors = res.errors
      } else {
        const res = await todoService.updateTodo({
          name, 
          deadline,
          id: modalProps.id,
          status: modalProps.status
        })
        errors = res.errors
      }

      setErrors(errors || {})

      if(!errors){
        closeModal();
      }  
    } catch (error) {
        console.error(error)
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
