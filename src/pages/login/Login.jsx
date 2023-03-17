import React from 'react';
import loginImg from '../../../public/app-icon.png'
import './Login.css'

export default function Login({}){

  return (
    <main className='login-page'>
      <div className='login-page__container'>
        <div className='login-page__icon-container'>
          <img src={loginImg} alt='login' className='login-page__icon'/>
        </div>
        <form className='login-page__form'>
          <div className='login-page__form__input-container'>
            <label htmlFor='login'>Login</label>
            <input type='text' id='login' className='login-page__form__input'/>
          </div>
          <div className='login-page__form__input-container'>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' className='login-page__form__input'/>
          </div>
          <button type='submit' className='login-page__form__submit'>Sign Up</button>
        </form>
      </div>
    </main>
  )
}
