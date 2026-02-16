import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  
  // Инициализируем данные из куки, если стор пуст
  if (!auth.user) {
    auth.initAuth()
  }

  // Если токена нет, отправляем на страницу входа
  if (!auth.token) {
    return navigateTo('/dealers')
  }

  // Защита админских разделов
  if (to.path.startsWith('/admin/dealers') || to.path.startsWith('/admin/pricing')) {
    if (!auth.isAdmin) {
      return navigateTo('/admin')
    }
  }
})
