import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'dealer'
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
    setAuth(user: User, token: string) {
      this.user = user
      this.token = token
      
      const userCookie = useCookie('auth_user', { maxAge: 60 * 60 * 24 * 7 })
      const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 })
      
      userCookie.value = JSON.stringify(user)
      tokenCookie.value = token
    },

    initAuth() {
      const userCookie = useCookie('auth_user')
      const tokenCookie = useCookie('auth_token')
      
      if (userCookie.value && tokenCookie.value) {
        this.user = userCookie.value as any
        this.token = tokenCookie.value as any
      }
    },

    logout() {
      this.user = null
      this.token = null
      
      const userCookie = useCookie('auth_user')
      const tokenCookie = useCookie('auth_token')
      
      userCookie.value = null
      tokenCookie.value = null
      
      navigateTo('/')
    }
  }
})
