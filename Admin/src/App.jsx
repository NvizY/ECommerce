import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Admin from './Pages/Admin/Admin'
import Login from './Components/Login/Login'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <div>
                  <Navbar/>
                  <Admin/>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
