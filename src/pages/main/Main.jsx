import React, {useEffect} from 'react';
import './Main.css';
import TodoList from "./components/TodoList/TodoList";

export default function Main(){
  useEffect(() => {
    function checkResize(e){
      if(window.innerWidth < 700){
        const targetHeight = document.getElementById('main-frame').getBoundingClientRect().height;
        const gap = 50;
        document.getElementById('root').style.height = `${targetHeight + gap * 3}px`;
      } else {
        document.getElementById('root').style.height = '100%';
      }
    }

    window.addEventListener('resize', checkResize);

    return () => window.removeEventListener('resize', checkResize);
  }, [])

  return (
    <main id='main-frame'>
      <TodoList bgColor='#FFF4F4' title='TO DO' />
      <TodoList bgColor='#FEFCF3' title='IN PROGRESS' />
      <TodoList bgColor='#F7FFF3' title='DONE' />
    </main>
  )
}
