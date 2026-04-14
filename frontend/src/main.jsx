import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { SubjectProvider } from './context/SubjectContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SubjectProvider>
        <App />
      </SubjectProvider>
    </AuthProvider>
  </React.StrictMode>,
)
