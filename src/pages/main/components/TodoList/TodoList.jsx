import React, { useCallback, useMemo, useState } from "react";
import './TodoList.css';
import TodoItem from "../TodoItem/TodoItem";
import {$showModal} from "../../Main.jsx";
import { Draggable } from "../../../../dnd/Draggable";
import { DraggableListProvider } from "../../../../dnd/ListContext";

import { v4 as uuid } from "uuid";

let items = new Array(8).fill({
  title: 'aboba',
  date: Date.now() - 10 * 3600 * 1000
})

items = items.map((item, index) => {
  return {...item, title: item.title + index}
})

export default function TodoList({bgColor, title, canCreate = false, ...props}){

  const [todos, setTodos] = useState(items);
 
  const createHandler = useCallback(() => {
    $showModal.set(true)
  }, [])

  const onItemsChanged = useCallback((items) => {
    setTodos(items);
  }, [])


  const buttonId = useMemo(() => (uuid()), []);

  return (
      <section
            //style={{backgroundColor: bgColor}}
            className={`todo-list-container ${props.className}`}
          >
            <header className='todo-list__header'>
              <h1>{title}</h1>
            </header>
            <DraggableListProvider listName={title} onDragEnd={onItemsChanged}>
              {({forwardedRef, ...props}) => (
                <ul ref={forwardedRef} {...props} className="q">
                  {todos.map((todoItem, index) => (
                    <Draggable key={index} itemData={todoItem}>
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
                  <Draggable canDrag={false} itemData={{id: buttonId}}>
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
