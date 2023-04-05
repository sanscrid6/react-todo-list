import React from "react";
import './Input.css'


function Input({type, label, defaultValue, error}, ref){
  return (
    <fieldset className='input-container'>
      <label htmlFor='input'>{label}</label>
      <input type={type} id='input' className='input' ref={ref} defaultValue={defaultValue} />
      {error && <div className="input__error-text">{error}</div>}
    </fieldset>
  )
}


export default React.forwardRef(Input);