import { create } from 'zustand'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  loginWithGoogle: (user: User) => void
}

// Load initial state from localStorage
const getInitialState = (): Partial<AuthState> => {
  if (typeof window === 'undefined') {
    return { user: null, token: null, isAuthenticated: false }
  }

  try {
    const stored = localStorage.getItem('auth-storage')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.state && parsed.state.user && parsed.state.token) {
        return parsed.state
      }
    }
  } catch (e) {
    // Ignore parse errors
  }

  return { user: null, token: null, isAuthenticated: false }
}

const initialState = getInitialState()

export const useAuthStore = create<AuthState>((set) => ({
  user: initialState.user || null,
  token: initialState.token || null,
  isAuthenticated: initialState.isAuthenticated || false,
  login: (user, token) => {
    set({ user, token, isAuthenticated: true })
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-storage', JSON.stringify({ state: { user, token, isAuthenticated: true } }))
    }
  },
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-storage')
    }
  },
  loginWithGoogle: (user) => {
    const token = 'google-token'
    set({ user, token, isAuthenticated: true })
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-storage', JSON.stringify({ state: { user, token, isAuthenticated: true } }))
    }
  },
}))

