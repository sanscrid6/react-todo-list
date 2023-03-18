import React from "react";
import './TodoList.css';
import TodoItem from "../TodoItem/TodoItem";
import {$showModal} from "../../Main.jsx";

export default function TodoList({bgColor, title, canCreate = false, ...props}){
  const items = new Array(3).fill({
    title: 'aboba',
    date: Date.now() - 10 * 3600 * 1000
  })

  function createHandler(){
    $showModal.set(true)
  }

  return (
    <section
      style={{backgroundColor: bgColor}}
      className='todo-list-container'
    >
      <header className='todo-list__header'>
        <h1>{title}</h1>
      </header>
      <ul>
        {items.map((todoItem, index) => (
          <TodoItem
            key={index}
            {...todoItem}
          />
        ))}
        {canCreate && (
          <li
            className='todo-list__plus'
            role='button'
            onClick={createHandler}
          >
            +
          </li>
        )}
      </ul>
    </section>
  );
}
