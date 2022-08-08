import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppSetup } from './components/AppSetup'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppSetup />
  </React.StrictMode>
)
