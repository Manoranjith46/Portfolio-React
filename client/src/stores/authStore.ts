import { create } from 'zustand'
import type { User } from '@/types/auth'
import * as authApi from '@/api/auth'

interface AuthStore {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  loginModalOpen: boolean
  setLoginModalOpen: (open: boolean) => void
  setAuth: (user: User, accessToken: string) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<boolean>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  loginModalOpen: false,
  setLoginModalOpen: (open) => set({ loginModalOpen: open }),
  setAuth: (user, accessToken) =>
    set({ user, accessToken, isAuthenticated: true, loginModalOpen: false }),
  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const { user, accessToken } = await authApi.login({ email, password })
      set({ user, accessToken, isAuthenticated: true, loginModalOpen: false, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
  logout: async () => {
    try {
      await authApi.logout()
    } finally {
      set({ user: null, accessToken: null, isAuthenticated: false })
    }
  },
  refresh: async () => {
    try {
      const { accessToken } = await authApi.refresh()
      set({ accessToken })
      return true
    } catch {
      set({ user: null, accessToken: null, isAuthenticated: false })
      return false
    }
  },
}))
