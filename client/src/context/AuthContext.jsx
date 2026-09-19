import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null)
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    if (token) {
      const stored = localStorage.getItem('admin_info')
      if (stored) {
        try {
          setAdmin(JSON.parse(stored))
        } catch { setAdmin(null) }
      }
    }
  }, [token])

  const login = (tokenValue, adminInfo) => {
    localStorage.setItem('admin_token', tokenValue)
    localStorage.setItem('admin_info', JSON.stringify(adminInfo))
    setToken(tokenValue)
    setAdmin(adminInfo)
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_info')
    setToken(null)
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ token, admin, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
