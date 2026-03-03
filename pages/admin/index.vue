<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const title = 'Панель управления — Сетки 21'
useHead({ title })

// Инициализация данных при загрузке
const userName = computed(() => auth.user?.name || 'Пользователь')
const userRoleLabel = computed(() => {
  if (auth.isAdmin) return 'Администратор производства'
  if (auth.isDealer) return 'Дилер'
  return 'Сотрудник'
})

const showCalculator = ref(false)
const statsData = ref<{ dealers_count?: number; orders_in_progress?: number; revenue_month?: number; new_orders_today?: number } | null>(null)

const stats = computed(() => {
  const fmt = (n: number) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M ₽` : new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(n) + ' ₽'
  if (auth.isAdmin) {
    const d = statsData.value
    return [
      { label: 'Всего дилеров', value: d?.dealers_count != null ? String(d.dealers_count) : '—', icon: 'users' },
      { label: 'Заказов в работе', value: d?.orders_in_progress != null ? String(d.orders_in_progress) : '—', icon: 'factory' },
      { label: 'Выручка (мес)', value: d?.revenue_month != null ? fmt(d.revenue_month) : '—', icon: 'trending-up' },
      { label: 'Новых сегодня', value: d?.new_orders_today != null ? String(d.new_orders_today) : '—', icon: 'plus-circle' }
    ]
  }
  return [
    { label: 'Мои заказы', value: '—', icon: 'shopping-bag' },
    { label: 'В производстве', value: '—', icon: 'factory' },
    { label: 'Готово к выдаче', value: '—', icon: 'check-circle' },
    { label: 'Баланс', value: '—', icon: 'wallet' }
  ]
})

const orders = ref([])
const isLoading = ref(true)

const fetchRecentOrders = async () => {
  isLoading.value = true
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiUrl || 'http://localhost:8081'
    const endpoint = auth.isAdmin ? '/api/v1/admin/orders' : '/api/v1/dealer/orders'
    
    const response = await $fetch(endpoint, {
      baseURL: apiBase,
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    }) as any
    
    // Берем последние 5 заказов
    orders.value = response.slice(0, 5).map((o: any) => ({
      id: o.order_number || o.id.substring(0, 8),
      date: new Date(o.created_at).toLocaleDateString('ru-RU'),
      client: o.client_name,
      amount: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(o.total_amount),
      status: mapStatus(o.status).label,
      statusColor: mapStatus(o.status).color,
      dealer: o.dealer_name || '—'
    }))
  } catch (e) {
    console.error('Failed to fetch recent orders', e)
    // Заглушка при ошибке
    orders.value = [
      { id: 'Ошибка', date: '-', client: 'Не удалось загрузить', amount: '0 ₽', status: 'Ошибка', statusColor: 'gray' },
    ]
  } finally {
    isLoading.value = false
  }
}

const mapStatus = (status: string) => {
  const statuses: Record<string, { label: string, color: string }> = {
    'new': { label: 'Новый', color: 'gray' },
    'confirmed': { label: 'Подтвержден', color: 'blue' },
    'in_production': { label: 'В производстве', color: 'blue' },
    'ready': { label: 'Готов', color: 'green' },
    'completed': { label: 'Завершен', color: 'green' },
    'cancelled': { label: 'Отменен', color: 'red' }
  }
  return statuses[status] || { label: status, color: 'gray' }
}

const fetchStats = async () => {
  if (!auth.isAdmin) return
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiUrl || 'http://localhost:8081'
    const data = await $fetch<{ dealers_count: number; orders_in_progress: number; revenue_month: number; new_orders_today: number }>('/api/v1/admin/stats', {
      baseURL: apiBase,
      headers: { 'Authorization': `Bearer ${auth.token}` }
    })
    statsData.value = data
  } catch (e) {
    console.error('Failed to fetch stats', e)
  }
}

onMounted(() => {
  fetchRecentOrders()
  fetchStats()
})

const handleLogout = () => {
  console.log('CRITICAL LOGOUT TRIGGERED')
  
  // 1. Очистка через document.cookie (самый надежный метод)
  const cookies = ['auth_token', 'user_data', 'user_role']
  cookies.forEach(name => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  })
  
  // 2. Очистка через Nuxt useCookie
  const token = useCookie('auth_token')
  const user = useCookie('user_data')
  const role = useCookie('user_role')
  token.value = null
  user.value = null
  role.value = null
  
  // 3. Очистка Pinia
  auth.logout()
  
  // 4. Жесткий редирект
  window.location.replace('/dealers')
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20">
    <AdminHeader />

    <div class="container mx-auto px-4">
      <!-- Calculator View -->
      <div v-if="showCalculator && auth.isDealer" class="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-black text-brand-dark uppercase tracking-tighter">Быстрый заказ</h2>
          <button @click="showCalculator = false" class="text-[10px] font-black text-gray-400 hover:text-brand-dark uppercase tracking-widest transition-colors">
            Вернуться к списку
          </button>
        </div>
        <Calculator />
      </div>

      <!-- Dashboard View -->
      <div v-else>
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div v-for="s in stats" :key="s.label" class="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{{ s.label }}</p>
            <p class="text-3xl font-black text-brand-dark tracking-tighter">{{ s.value }}</p>
          </div>
        </div>

        <!-- Orders Table -->
        <div class="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div class="p-10 border-b border-gray-50 flex justify-between items-center">
            <h2 class="text-2xl font-black text-brand-dark uppercase tracking-tighter">
              {{ auth.isAdmin ? 'Последние заказы по всем дилерам' : 'Мои последние заказы' }}
            </h2>
            <button v-if="auth.isDealer" @click="showCalculator = true" class="bg-brand-blue text-white font-black py-3 px-8 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-105 transition-transform">
              Новый расчет
            </button>
            <NuxtLink v-else to="/admin/orders" class="bg-brand-blue text-white font-black py-3 px-8 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-105 transition-transform">
              Все заказы
            </NuxtLink>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th class="p-10">Номер</th>
                  <th class="p-10">Дата</th>
                  <th class="p-10">Клиент</th>
                  <th v-if="auth.isAdmin" class="p-10">Дилер</th>
                  <th class="p-10">Сумма</th>
                  <th class="p-10">Статус</th>
                  <th class="p-10"></th>
                </tr>
              </thead>
              <tbody v-if="isLoading" class="text-sm font-bold text-brand-dark">
                <tr>
                  <td colspan="7" class="p-20 text-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-4"></div>
                    <p class="text-gray-400 font-black uppercase text-[8px] tracking-widest">Загрузка...</p>
                  </td>
                </tr>
              </tbody>
              <tbody v-else-if="orders.length === 0" class="text-sm font-bold text-brand-dark">
                <tr>
                  <td colspan="7" class="p-20 text-center">
                    <p class="text-gray-400 font-black uppercase text-[10px] tracking-widest">Заказов пока нет</p>
                  </td>
                </tr>
              </tbody>
              <tbody v-else class="text-sm font-bold text-brand-dark">
                <tr v-for="order in orders" :key="order.id" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td class="p-10">{{ order.id }}</td>
                  <td class="p-10 text-gray-400">{{ order.date }}</td>
                  <td class="p-10">{{ order.client }}</td>
                  <td v-if="auth.isAdmin" class="p-10 text-gray-400">{{ order.dealer }}</td>
                  <td class="p-10 text-brand-blue font-black">{{ order.amount }}</td>
                  <td class="p-10">
                    <span :class="[
                      'px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest',
                      order.statusColor === 'blue' ? 'bg-blue-50 text-brand-blue' : 
                      order.statusColor === 'green' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                    ]">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="p-10 text-right">
                    <button class="text-gray-300 hover:text-brand-blue transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
