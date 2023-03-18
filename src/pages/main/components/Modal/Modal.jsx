import React, {useEffect} from "react";
import './Modal.css'
import closeIcon from './close-icon.png';
import {$showModal} from "../../Main.jsx";

export default function Modal({show, title, onClose, children}){

  function closeHandler(){
    onClose && onClose();
  }

  let offsetTop = 0;

  if(show){
    offsetTop = window.scrollY + window.innerHeight / 4;
  }

  return (
    <>
      {show &&
        <dialog className='modal-container' >
          <div className='modal' style={{top: `${offsetTop}px`}}>
            <header className='modal__header'>
              <p>{title}</p>
              <img
                src={closeIcon}
                alt='close icon'
                role='button'
                onClick={closeHandler}
                className='modal__header__close-icon'
              />
            </header>
            <div className='q'>
              {children}
            </div>
          </div>
        </dialog>
      }
    </>
  )
}
