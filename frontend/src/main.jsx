import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './context/AdminContext.jsx'
import EmployeeContextProvider from './context/EmployeeContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <EmployeeContextProvider>
  <AdminContextProvider>
    
    <App />
    
    </AdminContextProvider>
    </EmployeeContextProvider>
  </BrowserRouter>,
)
