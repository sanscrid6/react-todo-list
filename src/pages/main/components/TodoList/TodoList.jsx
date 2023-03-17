import React from "react";
import './TodoList.css';
import TodoItem from "../TodoItem/TodoItem";

export default function TodoList({bgColor, title, ...props}){
  const items = new Array(3).fill({
    title: 'aboba',
    date: Date.now() - 10 * 3600 * 1000
  })

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
      </ul>
    </section>
  );
}
