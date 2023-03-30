import React from "react";
import './TodoList.css';
import TodoItem from "../TodoItem/TodoItem";
import {$showModal} from "../../Main.jsx";
import { Draggable } from "../../../../dnd/Draggable";
import { DraggableListProvider } from "../../../../dnd/ListContext";

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
            <DraggableListProvider>
              {({forwardedRef}) => (
                <ul ref={forwardedRef}>
                  {items.map((todoItem, index) => (
                    <Draggable key={index}>
                      {({ref, ...rest}) => (
                        <TodoItem
                          forwardedRef={ref}
                          {...rest}
                          {...todoItem}
                        />
                      )}
                    </Draggable>
                  ))}
                {canCreate && (
                  <Draggable canDrag={false}>
                    {({ref, ...rest}) => (
                        <button
                        className='todo-list__plus'
                        onClick={createHandler}
                        {...rest}
                        ref={ref}
                      >
                        +
                      </button>
                    )}
                  </Draggable>
                )}
              </ul>
              )}
            </DraggableListProvider>
          </section>
  );
}
