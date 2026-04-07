import { create } from 'zustand'
import type { User } from '@/types'

interface UserState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

const useUserStore = create<UserState>((set) => ({
  user: (() => {
    try {
      const u = localStorage.getItem('user')
      return u ? JSON.parse(u) : null
    } catch {
      return null
    }
  })(),
  token: localStorage.getItem('token'),
  get isLoggedIn() {
    return !!this.token
  },

  login: (user, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },

  updateUser: (partial) => {
    set((state) => {
      if (!state.user) return state
      const updated = { ...state.user, ...partial }
      localStorage.setItem('user', JSON.stringify(updated))
      return { user: updated }
    })
  },
}))

export default useUserStore
