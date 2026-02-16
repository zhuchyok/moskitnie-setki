<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const route = useRoute()

const userName = computed(() => auth.user?.name || 'Пользователь')
const userRoleLabel = computed(() => {
  if (auth.isAdmin) return 'Администратор производства'
  if (auth.isDealer) return 'Дилер'
  return 'Сотрудник'
})

const handleLogout = () => {
  const cookies = ['auth_token', 'user_data', 'user_role']
  cookies.forEach(name => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  })
  
  const token = useCookie('auth_token')
  const user = useCookie('user_data')
  const role = useCookie('user_role')
  token.value = null
  user.value = null
  role.value = null
  
  auth.logout()
  window.location.replace('/dealers')
}

// Проверка активного пункта меню
const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="bg-white border-b border-gray-100 py-8 mb-8">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-black text-brand-dark uppercase tracking-tighter">Панель управления</h1>
          <p class="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">
            {{ userRoleLabel }}: {{ userName }}
          </p>
        </div>
        <div class="flex items-center gap-4">
          <button 
            @click="handleLogout"
            class="bg-gray-50 text-gray-400 hover:text-red-500 p-3 rounded-2xl transition-colors group relative"
            title="Выйти"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex flex-wrap gap-4">
        <!-- Admin Menu -->
        <template v-if="auth.isAdmin">
          <NuxtLink to="/admin" class="admin-nav-link" :class="{ 'active-link': isActive('/admin') && route.path === '/admin' }">
            <span class="admin-nav-text">Обзор</span>
          </NuxtLink>
          <NuxtLink to="/admin/orders" class="admin-nav-link" :class="{ 'active-link': isActive('/admin/orders') }">
            <span class="admin-nav-text">Все заказы</span>
          </NuxtLink>
          <NuxtLink to="/admin/dealers" class="admin-nav-link" :class="{ 'active-link': isActive('/admin/dealers') }">
            <span class="admin-nav-text">Дилеры</span>
          </NuxtLink>
          <NuxtLink to="/admin/pricing" class="admin-nav-link" :class="{ 'active-link': isActive('/admin/pricing') }">
            <span class="admin-nav-text">Цены</span>
          </NuxtLink>
          <NuxtLink to="/admin/calculator" class="admin-nav-link" :class="{ 'active-link': isActive('/admin/calculator') }">
            <span class="admin-nav-text">Калькулятор</span>
          </NuxtLink>
        </template>

        <!-- Dealer Menu -->
        <template v-if="auth.isDealer">
          <NuxtLink to="/admin" class="admin-nav-link" :class="{ 'active-link': route.path === '/admin' }">
            <span class="admin-nav-text">Мои заказы</span>
          </NuxtLink>
          <NuxtLink to="/admin/calculator" class="admin-nav-link" :class="{ 'active-link': isActive('/admin/calculator') }">
            <span class="admin-nav-text">Калькулятор</span>
          </NuxtLink>
          <NuxtLink to="/admin/profile" class="admin-nav-link" :class="{ 'active-link': isActive('/admin/profile') }">
            <span class="admin-nav-text">Профиль</span>
          </NuxtLink>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Сбрасываем любые глобальные стили для ссылок в админке */
.admin-nav-link {
  display: inline-block !important;
  padding: 1rem 0.5rem !important;
  border-radius: 1rem !important;
  background-color: #ffffff !important;
  border: 2px solid #f9fafb !important; /* border-gray-100/50 */
  transition: all 0.2s ease !important;
  text-decoration: none !important;
  text-align: center !important;
  min-width: 140px !important;
}

/* Стили текста */
.admin-nav-text {
  font-weight: 900 !important;
  font-size: 10px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.1em !important;
  color: #9ca3af !important; /* Серый по умолчанию */
  transition: color 0.2s ease !important;
  display: block !important;
}

/* Ховер для неактивных - подсвечиваем рамку */
.admin-nav-link:not(.active-link):hover {
  border-color: rgba(42, 106, 178, 0.2) !important;
}

.admin-nav-link:not(.active-link):hover .admin-nav-text {
  color: #2A6AB2 !important;
}

/* АКТиВНОЕ СОСТОЯНИЕ - Кнопка синяя БЕЗ РАМКИ (как на скриншоте) */
.admin-nav-link.active-link {
  background-color: #2A6AB2 !important;
  border-color: #2A6AB2 !important;
  box-shadow: 0 20px 50px -10px rgba(42, 106, 178, 0.3) !important;
  cursor: default !important;
}

/* АКТИВНОЕ СОСТОЯНИЕ - Текст белый */
.admin-nav-link.active-link .admin-nav-text {
  color: #ffffff !important;
}

/* ПРИНУДИТЕЛЬНО БЕЛЫЙ ПРИ ХОВЕРЕ НА АКТИВНУЮ КНОПКУ */
.admin-nav-link.active-link:hover .admin-nav-text {
  color: #ffffff !important;
}

/* Фикс для NuxtLink: перебиваем глобальный .router-link-active */
:deep(.router-link-active.admin-nav-link) {
  background-color: #2A6AB2 !important;
  border-color: #2A6AB2 !important;
}

:deep(.router-link-active.admin-nav-link) .admin-nav-text,
:deep(.router-link-active.admin-nav-link:hover) .admin-nav-text {
  color: #ffffff !important;
}

.admin-nav-link.active-link:hover {
  transform: none !important;
  opacity: 1 !important;
}
</style>
