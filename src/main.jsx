import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {Router, BrowserRouter} from "react-router-dom";
import { supabase } from './supabase';
import {SessionContextProvider} from '@supabase/auth-helpers-react'

ReactDOM.createRoot(document.getElementById('root'))
  .render(
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
)
