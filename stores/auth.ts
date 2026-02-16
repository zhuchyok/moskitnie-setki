import { defineStore } from 'pinia'

export interface User {
  id: string
  email: string
  role: 'admin' | 'dealer' | 'manager' | 'installer'
  name?: string
  dealer_id?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: useCookie('auth_token').value || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    isDealer: (state) => state.user?.role === 'dealer',
  },

  actions: {
    setToken(token: string) {
      this.token = token
      const cookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 })
      cookie.value = token
    },

    setUser(user: User) {
      this.user = user
      const userCookie = useCookie('user_data', { maxAge: 60 * 60 * 24 * 7 })
      userCookie.value = JSON.stringify(user)
    },

    logout() {
      this.token = null
      this.user = null
      const tokenCookie = useCookie('auth_token')
      const userCookie = useCookie('user_data')
      const roleCookie = useCookie('user_role')
      tokenCookie.value = null
      userCookie.value = null
      roleCookie.value = null
      navigateTo('/dealers')
    },

    initAuth() {
      const userCookie = useCookie('user_data')
      const roleCookie = useCookie('user_role')
      const tokenCookie = useCookie('auth_token')
      
      if (tokenCookie.value) {
        this.token = tokenCookie.value
      }

      if (userCookie.value) {
        try {
          this.user = typeof userCookie.value === 'string' 
            ? JSON.parse(userCookie.value) 
            : userCookie.value
        } catch (e) {
          console.error('Failed to parse user data from cookie', e)
        }
      } else if (roleCookie.value) {
        // Fallback если есть только роль (из старой логики)
        this.user = {
          id: 'legacy',
          email: 'admin@setki-21.ru',
          role: roleCookie.value as any,
          name: roleCookie.value === 'admin' ? 'Администратор' : 'Дилер'
        }
      }
    }
  }
})
