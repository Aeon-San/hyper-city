'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || '/api').replace(/\/$/, '')

const parseResponse = async (response) => {
  let payload = {}

  try {
    payload = await response.json()
  } catch {
    payload = {}
  }

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || 'Request failed')
  }

  return payload
}

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasHydrated: false,

      setHydrated: () => set({ hasHydrated: true }),
      clearError: () => set({ error: null }),

      login: async ({ email, password }) => {
        set({ isLoading: true, error: null })

        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          })

          const payload = await parseResponse(response)

          set({
            user: payload.data || null,
            token: payload.token || null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          return payload
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Login failed',
          })
          throw error
        }
      },

      signup: async ({ name, email, phone, password, role, adminSecret }) => {
        set({ isLoading: true, error: null })

        try {
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, email, phone, password, role, adminSecret }),
          })

          const payload = await parseResponse(response)

          set({
            user: payload.data || null,
            token: payload.token || null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          return payload
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Signup failed',
          })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null })

        try {
          const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
          })

          await parseResponse(response)
        } catch {
          // Regardless of API response, clear local auth state for client consistency.
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        }
      },

      updateProfile: async ({ name, email, phone, password }) => {
        set({ isLoading: true, error: null })

        try {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, email, phone, password }),
          })

          const payload = await parseResponse(response)

          set((state) => ({
            user: payload.data || state.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          }))

          return payload
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Profile update failed',
          })
          throw error
        }
      },
    }),
    {
      name: 'hypercity-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)
