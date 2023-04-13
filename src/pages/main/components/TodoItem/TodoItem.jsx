import React, { useCallback } from "react";
import './TodoItem.css';
import { $todos, openModal, updateTodos } from "../../../../state";
import { supabase, googleUrl } from "../../../../supabase";
import {useSession} from '@supabase/auth-helpers-react';

const dateFormatter = new Intl.DateTimeFormat('en', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: 'numeric'
})

export default function TodoItem({forwardedRef, id, name, deadline, listId, calendarEventId, ...props}){
  const session = useSession();

  const deleteHandler = useCallback(async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(googleUrl + `/${calendarEventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + session.provider_token
        },
      });
  
      await supabase
                  .from('todos')
                  .update([{userId: localStorage.getItem('userId'), data: JSON.stringify($todos.getState())}])
                  .eq('userId', localStorage.getItem('userId'))
  
      updateTodos({status: listId, items: $todos.getState()[listId].filter(item => item.id !== id)})
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
      <time className='todo-item__date'>{dateFormatter.format(new Date(deadline))}</time>
    </li>
  )
}
