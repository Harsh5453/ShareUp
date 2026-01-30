import { createContext, useEffect, useState } from 'react'
import authApi from '../api/auth.api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    const userId = localStorage.getItem('userId')

    if (token && role && userId) {
      setUser({ token, role, userId })
    }

    setLoading(false)
  }, [])

  const login = async data => {
    const res = await authApi.login(data)
    const { token, role, userId } = res.data

    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    localStorage.setItem('userId', userId)

    setUser({ token, role, userId })
    return role
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
