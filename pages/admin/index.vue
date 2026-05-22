<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
} from 'chart.js'
import { useAuthStore } from '~/stores/auth'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Filler
)

const auth = useAuthStore()

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const title = 'Панель управления — Сетки 21'
useHead({ 
  title
})

// Инициализация данных при загрузке
const userName = computed(() => auth.user?.name || 'Пользователь')
const userRoleLabel = computed(() => {
  if (auth.isAdmin) return 'Администратор производства'
  if (auth.isDealer) return 'Дилер'
  return 'Сотрудник'
})

const showCalculator = ref(false)
const statsData = ref<{ dealers_count?: number; orders_in_progress?: number; revenue_month?: number; new_orders_today?: number } | null>(null)
const chartData = ref<any>(null)
const financialDealers = ref<Array<{ id: string; name: string; balance: number; credit_limit: number; is_active: boolean }>>([])

const formatPrice = (p: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(p)

const salesChartData = computed(() => ({
  labels: chartData.value?.labels || [],
  datasets: [
    {
      label: 'Выручка',
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      borderColor: '#2196F3',
      pointBackgroundColor: '#2196F3',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#2196F3',
      fill: true,
      tension: 0.4,
      data: chartData.value?.sales || []
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: '#1a1a1a',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (context: any) => ` ${context.dataset.label}: ${formatPrice(context.raw)}`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { display: true, color: 'rgba(0,0,0,0.03)' },
      ticks: {
        font: { size: 10, weight: 'bold' },
        callback: (value: any) => `${value / 1000}k`
      }
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 10, weight: 'bold' } }
    }
  }
}

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
    const apiBase = config.public.apiUrl || ''
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
    const apiBase = config.public.apiUrl || ''
    const data = await $fetch<{ dealers_count: number; orders_in_progress: number; revenue_month: number; new_orders_today: number }>('/api/v1/admin/stats', {
      baseURL: apiBase,
      headers: { 'Authorization': `Bearer ${auth.token}` }
    })
    statsData.value = data

    // Глобальные графики
    if (auth.user?.dealer_id) {
      chartData.value = await $fetch(`/api/v1/admin/dealers/${auth.user.dealer_id}/chart`, {
        baseURL: apiBase,
        headers: { 'Authorization': `Bearer ${auth.token}` }
      })
    }
    // Финансовое здоровье сети (балансы дилеров)
    const list = await $fetch<any[]>('/api/v1/admin/dealers', {
      baseURL: apiBase,
      headers: { 'Authorization': `Bearer ${auth.token}` }
    })
    financialDealers.value = (list || []).map((d: any) => ({
      id: d.id,
      name: d.name,
      balance: Number(d.balance ?? 0),
      credit_limit: Number(d.credit_limit ?? 0),
      is_active: d.is_active !== false
    }))
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

        <!-- Финансовое здоровье сети (Owner Only) -->
        <div v-if="auth.isAdmin && financialDealers.length" class="mb-12 bg-white p-10 rounded-[3.5rem] shadow-2xl border border-gray-100">
          <h2 class="text-2xl font-black text-brand-dark uppercase tracking-tighter mb-2">Финансовое здоровье сети</h2>
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Баланс и кредитный лимит дилеров</p>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th class="pb-4 pr-6">Дилер</th>
                  <th class="pb-4 pr-6">Баланс</th>
                  <th class="pb-4 pr-6">Кредитный лимит</th>
                  <th class="pb-4">Статус</th>
                </tr>
              </thead>
              <tbody class="text-sm font-bold text-brand-dark">
                <tr v-for="d in financialDealers" :key="d.id" class="border-b border-gray-50 hover:bg-gray-50/50">
                  <td class="py-4 pr-6">{{ d.name }}</td>
                  <td class="py-4 pr-6" :class="{ 'text-red-600': d.balance < 0 }">{{ formatPrice(d.balance) }}</td>
                  <td class="py-4 pr-6 text-gray-600">{{ formatPrice(d.credit_limit) }}</td>
                  <td class="py-4">
                    <span v-if="!d.is_active" class="text-gray-400 uppercase text-[10px]">Неактивен</span>
                    <span v-else-if="d.balance < 0" class="text-red-600 font-black uppercase text-[10px]">Низкий баланс</span>
                    <span v-else class="text-green-600 uppercase text-[10px]">Ок</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Global Charts (Owner Only) -->
        <div v-if="auth.isAdmin && chartData" class="mb-12 bg-white p-10 rounded-[3.5rem] shadow-2xl border border-gray-100">
          <div class="flex justify-between items-center mb-10">
            <div>
              <h2 class="text-2xl font-black text-brand-dark uppercase tracking-tighter">Аналитика сети</h2>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Динамика выручки по всем дилерам</p>
            </div>
          </div>
          <div class="h-80">
            <Line :data="salesChartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Orders Table -->
        <div class="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div class="p-10 border-b border-gray-50 flex justify-between items-center">
            <h2 class="text-2xl font-black text-brand-dark uppercase tracking-tighter">
              {{ auth.isAdmin ? 'Последние заказы по всем дилерам' : 'Мои последние заказы' }}
            </h2>
            <button v-if="auth.isDealer" @click="showCalculator = true" class="admin-btn-primary font-black py-3 px-8 rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">
              Новый расчет
            </button>
            <NuxtLink v-else to="/admin/orders" class="admin-btn-primary font-black py-3 px-8 rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 transition-transform inline-block">
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
                    <button type="button" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border-2 border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-brand-blue/30 hover:text-brand-blue transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Просмотр
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
