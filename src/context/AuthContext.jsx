import { createContext, useContext, useState } from 'react'
import { clearStoredToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [sessionState, setSessionState] = useState(() => {
    try {
      const session = localStorage.getItem('nb_user')
      const parsed = session ? JSON.parse(session) : null
      return {
        profile: parsed,
        role: parsed?.role ?? null,
        loading: false,
      }
    } catch {
      return {
        profile: null,
        role: null,
        loading: false,
      }
    }
  })

  function login(userData) {
    setSessionState({
      profile: userData,
      role: userData.role,
      loading: false,
    })
  }

  function logoutUser() {
    localStorage.removeItem('nb_user')
    clearStoredToken()
    setSessionState({
      profile: null,
      role: null,
      loading: false,
    })
  }

  return (
    <AuthContext.Provider value={{ ...sessionState, login, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
