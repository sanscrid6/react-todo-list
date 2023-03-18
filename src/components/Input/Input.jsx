import React from "react";
import './Input.css'

export default function Input({type, label}){
  return (
    <fieldset className='input-container'>
      <label htmlFor='input'>{label}</label>
      <input type={type} id='input' className='input'/>
    </fieldset>
  )
}
