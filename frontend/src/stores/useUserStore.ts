import { create } from 'zustand'
import type { User } from '@/types'

interface UserState {
  user: User | null
  initializing: boolean  // 应用启动时验证 session，期间为 true

  setUser: (user: User) => void
  setInitializing: (v: boolean) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  initializing: true, // 默认 true，AppRoot 完成 profile 检查后置 false

  setUser: (user) => set({ user }),

  setInitializing: (v) => set({ initializing: v }),

  logout: () => set({ user: null }),

  updateUser: (partial) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : null,
    })),
}))

export default useUserStore
