import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/login'
import Dashboard from './pages/dashoard'
import ProtectedRoute from './comppmemtss/ProtectedRouter'
import 

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App