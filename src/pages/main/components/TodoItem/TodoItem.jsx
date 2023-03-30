import React from "react";
import './TodoItem.css';

const dateFormatter = new Intl.DateTimeFormat('en', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: 'numeric'
})

export default function TodoItem({forwardedRef, title, date, ...props}){

  return (
    <li ref={forwardedRef} className='todo-item' {...props}>
      <p className='todo-item__text'>{title}</p>
      <p className='todo-item__date'>{dateFormatter.format(date)}</p>
    </li>
  )
}
