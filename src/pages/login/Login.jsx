import React, {useRef} from 'react';
import loginImg from '../../../public/app-icon.png'
import './Login.css'
import Input from "../../components/Input/Input";
import {useNavigate} from "react-router-dom";

export default function Login(){
  const loginRef = useRef(null);
  const passRef = useRef(null);

  const navigate = useNavigate();

  function signUpHandler(e){
    e.preventDefault();
    navigate('app');
  }

  return (
    <main className='login-page'>
      <div className='login-page__container'>
        <div className='login-page__icon-container'>
          <img src={loginImg} alt='login' className='login-page__icon'/>
        </div>
        <form action="" className='login-page__form' onSubmit={signUpHandler} >
          <Input type='text' label='Login' ref={loginRef} />
          <Input type='password' label='Password' ref={passRef} />
          <button
            type='submit'
            className='login-page__form__submit'
          >
            Sign Up
          </button>
        </form>
      </div>
    </main>
  )
}
