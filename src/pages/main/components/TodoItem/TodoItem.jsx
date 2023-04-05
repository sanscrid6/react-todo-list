import React, { useCallback } from "react";
import './TodoItem.css';
import { $todos, openModal, updateTodos } from "../../../../state";

const dateFormatter = new Intl.DateTimeFormat('en', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: 'numeric'
})

export default function TodoItem({forwardedRef, id, name, deadline, listId, ...props}){

  const deleteHandler = useCallback((e) => {
    e.stopPropagation();
    updateTodos({status: listId, items: $todos.getState()[listId].filter(item => item.id !== id)})
  }, [id, listId]);

  const updateHandler = useCallback((e) => {
    console.log('click')
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
