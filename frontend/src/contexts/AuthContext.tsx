import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchCurrentUser, login as loginRequest, signup as signupRequest } from '../api/auth'
import { setUnauthorizedHandler } from '../api/client'
import type { User } from '../types/auth'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = () => {
    window.localStorage.removeItem('accessToken')
    setUser(null)
  }

  useEffect(() => {
    setUnauthorizedHandler(logout)
  }, [])

  useEffect(() => {
    const token = window.localStorage.getItem('accessToken')
    if (!token) {
      setIsLoading(false)
      return
    }
    fetchCurrentUser()
      .then(setUser)
      .catch(() => window.localStorage.removeItem('accessToken'))
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const { accessToken } = await loginRequest(email, password)
    window.localStorage.setItem('accessToken', accessToken)
    setUser(await fetchCurrentUser())
  }

  const signup = async (email: string, password: string) => {
    const { accessToken } = await signupRequest(email, password)
    window.localStorage.setItem('accessToken', accessToken)
    setUser(await fetchCurrentUser())
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
