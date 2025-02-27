import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import EmployeeContextProvider from './context/EmployeeContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  
    <EmployeeContextProvider>
    <App />
    </EmployeeContextProvider>
  
  </BrowserRouter>,
)
