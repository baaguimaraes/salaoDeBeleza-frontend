import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Profissionais from './pages/Profissionais'
import Agendamentos from './pages/Agendamentos'
import Pagamentos from './pages/Pagamentos'
import Navbar from './components/Navbar'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Navbar />
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <PrivateRoute>
                <Navbar />
                <Clientes />
              </PrivateRoute>
            }
          />
          <Route
            path="/profissionais"
            element={
              <PrivateRoute>
                <Navbar />
                <Profissionais />
              </PrivateRoute>
            }
          />
          <Route
            path="/agendamentos"
            element={
              <PrivateRoute>
                <Navbar />
                <Agendamentos />
              </PrivateRoute>
            }
          />
          <Route
            path="/pagamentos"
            element={
              <PrivateRoute>
                <Navbar />
                <Pagamentos />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
