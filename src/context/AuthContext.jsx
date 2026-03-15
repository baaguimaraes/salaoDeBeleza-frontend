import React, { createContext, useState, useContext } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (email, senha) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.login(email, senha)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao fazer login'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  const isAuthenticated = !!token

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider')
  }
  return context
}
