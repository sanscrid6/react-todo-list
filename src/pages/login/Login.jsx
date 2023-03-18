import React from 'react';
import loginImg from '../../../public/app-icon.png'
import './Login.css'
import {useNavigation} from "../../router/useNavigation.js";
import Input from "../../components/Input/Input";

export default function Login(){
  const {pushState} = useNavigation();
  function signUpHandler(e){
    e.preventDefault();
    pushState('/app');
  }

  return (
    <main className='login-page'>
      <div className='login-page__container'>
        <div className='login-page__icon-container'>
          <img src={loginImg} alt='login' className='login-page__icon'/>
        </div>
        <form action="" className='login-page__form' onSubmit={signUpHandler} >
          <Input type='text' label='Login' />
          <Input type='password' label='Password' />
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
