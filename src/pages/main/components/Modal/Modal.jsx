import React, {useEffect, useRef} from "react";
import './Modal.css'
import closeIcon from './close-icon.png';
import { $modalActive, $modalProps, $todos, ITEM_STATUS, closeModal, updateTodos } from "../../../../state";
import { useStore } from "effector-react";
import Input from '../../../../components/Input/Input'

import {v4 as uuid} from 'uuid';
import { useState } from "react";
import { googleUrl } from "../../../../supabase";
import {useSession} from '@supabase/auth-helpers-react';
import { supabase } from "../../../../supabase";

export default function Modal(){
  const [errors, setErrors] = useState({});
  const session = useSession();

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
          const res = await fetch(googleUrl, {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + session.provider_token
            },
            body: JSON.stringify({
              summary: name,
              description: name,
              start: {
                dateTime: d.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions.timeZone
              },
              end: {
                dateTime: new Date(d.getTime() + 24*3600*1000).toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions.timeZone
              }
            })
          }).then(res => res.json());

          if(!res.id){
            console.error(res)
            return;
          }

          updateTodos({status: ITEM_STATUS.TODO, items: [...$todos.getState().TODO, {name, deadline, id: uuid(), calendarEventId: res.id}]})
        } else {
          const listToUpdate = $todos.getState()[modalProps.status];
          const index = listToUpdate.findIndex(item => item.id == modalProps.id);
          const res = await fetch(googleUrl + `/${listToUpdate[index].calendarEventId}`, {
            method: 'PUT',
            headers: {
              'Authorization': 'Bearer ' + session.provider_token
            },
            body: JSON.stringify({
              summary: name,
              description: name,
              start: {
                dateTime: d.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions.timeZone
              },
              end: {
                dateTime: new Date(d.getTime() + 24*3600*1000).toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions.timeZone
              }
            })
          }).then(res => res.json());

          if(!res.id){
            console.error(res)
            return;
          }

          listToUpdate[index] = {...listToUpdate[index], name, deadline}
          updateTodos({status: modalProps.status, items: listToUpdate});
        }

        await supabase
                  .from('todos')
                  .update([{userId: localStorage.getItem('userId'), data: JSON.stringify($todos.getState())}])
                  .eq('userId', localStorage.getItem('userId'))

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
