import React, {useRef} from 'react';
import loginImg from '../../../public/app-icon.png'
import './Login.css'
import Input from "../../components/Input/Input";
import {useNavigate} from "react-router-dom";
import {supabase } from '../../supabase';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react'


export default function Login(){
  const loginRef = useRef(null);
  const passRef = useRef(null);

  const session = useSession();
  const navigate = useNavigate();


  if(session){
    console.log(session)
    localStorage.setItem('userId', session.user.id)
    localStorage.setItem('providerToken', session.provider_token)
    navigate('app')

    return null;
  }

  async function signUpHandler(e){
    e.preventDefault();
    console.log(window.location.origin)
    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar',
        redirectTo: 'http://localhost:5173'
      }
    })

    if(error){
      console.log(error)
    } else {
      //navigate('app');
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
