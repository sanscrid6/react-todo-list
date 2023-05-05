import React from 'react';
import loginImg from '../../../public/app-icon.png'
import './Login.css'
import {useNavigate} from "react-router-dom";
import {useSession} from '@supabase/auth-helpers-react'
import { supabaseApi } from '../../apis/supabaseApi';


export default function Login(){
  const session = useSession();
  const navigate = useNavigate();

  if(session){
    localStorage.setItem('userId', session.user.id)
    localStorage.setItem('providerToken', session.provider_token)
    navigate('app')

    return null;
  }

  async function signUpHandler(e){
    e.preventDefault();
    const {error} = await supabaseApi.signIn();

    if(error){
      console.log(error)
    }
  }

  return (
    <main className='login-page'>
      <div className='login-page__container'>
        <div className='login-page__icon-container'>
          <img src={loginImg} alt='login' className='login-page__icon'/>
        </div>
        <form action="" className='login-page__form' onSubmit={signUpHandler} >
          {/*<Input type='text' label='Login' ref={loginRef} />
          <Input type='password' label='Password' ref={passRef} />*/}
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
