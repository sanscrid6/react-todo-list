import React, { useCallback, useMemo, useState } from "react";
import './TodoList.css';
import TodoItem from "../TodoItem/TodoItem";
import { Draggable } from "../../../../dnd/Draggable";
import { DraggableListProvider } from "../../../../dnd/DraggableListProvider";

import { v4 as uuid } from "uuid";
import { $todos, openModal, updateTodos } from "../../../../state";
import { useStore } from "effector-react";

export default function TodoList({bgColor, title, canCreate = false, ...props}){
  const todos = useStore($todos.map(todos => todos[title]));
 
  const createHandler = useCallback(() => {
   openModal({});
  }, [])

  const onItemsChanged = useCallback((items) => {
    updateTodos({status: title, items});
  }, [])


  const buttonId = useMemo(() => (uuid()), []);

  return (
      <section
            className={`todo-list-container ${props.className}`}
          >
            <header className='todo-list__header'>
              <h1>{title}</h1>
            </header>
            <DraggableListProvider listName={title} onDragEnd={onItemsChanged}>
              {({forwardedRef, ...props}) => (
                <ul ref={forwardedRef} {...props} className="todo-list__content">
                  {todos.map((todoItem, index) => (
                    <Draggable key={index} itemData={todoItem}>
                      {({ref, ...rest}) => (
                        <TodoItem
                          forwardedRef={ref}
                          listId={title}
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
