import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import Calendar from './components/Calendar.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     (<><Calendar /></>)
  </StrictMode>,
)
