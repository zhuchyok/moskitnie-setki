<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Кабинет Директора</h1>
      <div class="flex gap-4">
        <NuxtLink to="/cabinet/branches" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Мои филиалы
        </NuxtLink>
        <NuxtLink to="/cabinet/managers" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          Менеджеры
        </NuxtLink>
      </div>
    </div>

    <!-- Проактивные алерты (безопасно при отсутствии alerts в ответе API) -->
    <div v-if="(stats?.alerts || []).length" class="mb-6 space-y-3">
      <div
        v-for="(alert, i) in (stats?.alerts || [])"
        :key="i"
        class="flex items-center gap-4 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900"
      >
        <span class="text-2xl">⚠️</span>
        <p class="flex-1 font-medium">{{ alert?.message || 'Уведомление' }}</p>
      </div>
    </div>

    <!-- Статистика -->
    <div v-if="stats" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p class="text-sm text-gray-500 mb-1">Заказов за месяц</p>
        <p class="text-2xl font-bold text-gray-900">{{ stats.count }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p class="text-sm text-gray-500 mb-1">Общий оборот</p>
        <p class="text-2xl font-bold text-blue-600">{{ formatPrice(stats.total_sales) }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p class="text-sm text-gray-500 mb-1">Закупка у завода</p>
        <p class="text-2xl font-bold text-orange-600">{{ formatPrice(stats.total_buy_price) }}</p>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p class="text-sm text-gray-500 mb-1">Ваша прибыль</p>
        <p class="text-2xl font-bold text-green-600">{{ formatPrice(stats.total_profit) }}</p>
      </div>
    </div>

    <!-- Графики -->
    <div v-if="chartData" class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 class="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Динамика продаж (₽)</h3>
        <div class="h-64">
          <Line :data="salesChartData" :options="chartOptions" />
        </div>
      </div>
      <div class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 class="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Динамика прибыли (₽)</h3>
        <div class="h-64">
          <Line :data="profitChartData" :options="chartOptions" />
        </div>
      </div>
    </div>

    <!-- Баланс -->
    <div class="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8 flex items-center justify-between">
      <div>
        <p class="text-blue-800 font-medium">Ваш баланс</p>
        <p class="text-3xl font-black text-blue-900">{{ formatPrice(dealer?.balance || 0) }}</p>
        <p v-if="dealer?.credit_limit > 0" class="text-xs text-blue-600 mt-1 uppercase font-bold tracking-wider">
          Кредитный лимит: {{ formatPrice(dealer.credit_limit) }}
        </p>
      </div>
      <button @click="showTopUpInfo = true" class="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-95">
        Пополнить счет
      </button>
    </div>

    <!-- Аналитика по филиалам -->
    <div v-if="statsByBranch?.by_branch?.length" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-lg font-bold text-gray-900">Продажи по филиалам</h2>
        <p class="text-sm text-gray-500 mt-1">За период: {{ statsByBranch?.period?.start ? new Date(statsByBranch.period.start).toLocaleDateString('ru-RU') : '' }} — {{ statsByBranch?.period?.end ? new Date(statsByBranch.period.end).toLocaleDateString('ru-RU') : '' }}</p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
            <tr>
              <th class="px-6 py-4">Филиал</th>
              <th class="px-6 py-4">Заказов</th>
              <th class="px-6 py-4">Оборот</th>
              <th class="px-6 py-4">Прибыль</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="row in statsByBranch.by_branch" :key="row.branch_id || 'none'" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 font-medium text-gray-900">{{ row.branch_name }}</td>
              <td class="px-6 py-4 text-gray-600">{{ row.order_count }}</td>
              <td class="px-6 py-4 text-gray-900 font-bold">{{ formatPrice(row.total_sales) }}</td>
              <td class="px-6 py-4 text-green-600 font-medium">+{{ formatPrice(row.total_profit) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Вкладки -->
    <div class="flex gap-4 mb-6 border-b border-gray-100 pb-4 overflow-x-auto no-scrollbar">
      <button @click="activeTab = 'orders'" :class="['px-6 py-2 rounded-lg font-bold text-sm transition', activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50']">
        Заказы сети
      </button>
      <button @click="activeTab = 'transactions'" :class="['px-6 py-2 rounded-lg font-bold text-sm transition', activeTab === 'transactions' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50']">
        История транзакций
      </button>
    </div>

    <!-- Последние заказы -->
    <div v-if="activeTab === 'orders'" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-lg font-bold text-gray-900">Последние заказы сети</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
            <tr>
              <th class="px-6 py-4">№ Заказа</th>
              <th class="px-6 py-4">Клиент</th>
              <th class="px-6 py-4">Сумма</th>
              <th class="px-6 py-4">Прибыль</th>
              <th class="px-6 py-4">Статус</th>
              <th class="px-6 py-4">Дата</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 font-medium text-gray-900">{{ order.order_number }}</td>
              <td class="px-6 py-4 text-gray-600">{{ order.client_name }}</td>
              <td class="px-6 py-4 text-gray-900 font-bold">{{ formatPrice(order.total_amount) }}</td>
              <td class="px-6 py-4 text-green-600 font-medium">+{{ formatPrice(order.dealer_profit) }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {{ formatStatus(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-400 text-sm">
                {{ new Date(order.created_at).toLocaleDateString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- История транзакций -->
    <div v-if="activeTab === 'transactions'" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-lg font-bold text-gray-900">История финансовых операций</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
            <tr>
              <th class="px-6 py-4">Тип</th>
              <th class="px-6 py-4">Описание</th>
              <th class="px-6 py-4 text-right">Сумма</th>
              <th class="px-6 py-4 text-right">Остаток</th>
              <th class="px-6 py-4">Дата</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span :class="['w-2 h-2 rounded-full', tx.amount > 0 ? 'bg-green-500' : 'bg-red-500']"></span>
                  <span class="text-sm font-bold text-gray-900 uppercase tracking-tight">
                    {{ tx.type === 'deposit' ? 'Пополнение' : tx.type === 'order_payment' ? 'Оплата заказа' : tx.type }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ tx.description || '-' }}</td>
              <td :class="['px-6 py-4 text-right font-bold', tx.amount > 0 ? 'text-green-600' : 'text-red-600']">
                {{ tx.amount > 0 ? '+' : '' }}{{ formatPrice(tx.amount) }}
              </td>
              <td class="px-6 py-4 text-right text-gray-900 font-medium">{{ formatPrice(tx.balance_after) }}</td>
              <td class="px-6 py-4 text-gray-400 text-sm">
                {{ new Date(tx.created_at).toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Модалка пополнения (инфо) -->
    <Teleport to="body">
      <div v-if="showTopUpInfo" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showTopUpInfo = false"></div>
        <div class="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Пополнение баланса</h3>
          <p class="text-gray-600 mb-6">Для пополнения баланса, пожалуйста, свяжитесь с вашим менеджером или отделом бухгалтерии. После оплаты средства будут зачислены на ваш счет в течение 10-15 минут.</p>
          <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
            <p class="text-xs text-blue-800 font-bold uppercase mb-2">Наши контакты:</p>
            <p class="text-sm text-blue-900 font-bold">+7 (900) 123-45-67</p>
            <p class="text-sm text-blue-900 font-bold">finance@setki21.ru</p>
          </div>
          <button @click="showTopUpInfo = false" class="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition">Понятно</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

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
const config = useRuntimeConfig()

const dealer = ref<any>(null)
const stats = ref<any>(null)
const statsByBranch = ref<any>(null)
const chartData = ref<any>(null)
const orders = ref<any[]>([])
const transactions = ref<any[]>([])
const activeTab = ref('orders')
const showTopUpInfo = ref(false)

const formatPrice = (p: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(p)

const salesChartData = computed(() => ({
  labels: chartData.value?.labels || [],
  datasets: [
    {
      label: 'Продажи',
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

const profitChartData = computed(() => ({
  labels: chartData.value?.labels || [],
  datasets: [
    {
      label: 'Прибыль',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      borderColor: '#4CAF50',
      pointBackgroundColor: '#4CAF50',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#4CAF50',
      fill: true,
      tension: 0.4,
      data: chartData.value?.profit || []
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: '#1a1a1a',
      titleFont: { size: 12, weight: 'bold' },
      bodyFont: { size: 12 },
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
      grid: {
        display: true,
        color: 'rgba(0,0,0,0.03)'
      },
      ticks: {
        font: { size: 10, weight: 'bold' },
        callback: (value: any) => `${value / 1000}k`
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: { size: 10, weight: 'bold' }
      }
    }
  }
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-yellow-100 text-yellow-700',
    in_production: 'bg-purple-100 text-purple-700',
    ready: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const formatStatus = (status: string) => {
  const names: Record<string, string> = {
    new: 'Новый',
    confirmed: 'Подтвержден',
    in_production: 'В работе',
    ready: 'Готов',
    completed: 'Выполнен',
    cancelled: 'Отменен'
  }
  return names[status] || status
}

onMounted(async () => {
  if (!auth.user?.dealer_id) return

  try {
    // 1. Данные дилера
    dealer.value = await $fetch(`${config.public.apiBase}/v1/dealers/${auth.user.dealer_id}`)
    
    // 2. Статистика
    stats.value = await $fetch(`${config.public.apiBase}/v1/admin/dealers/${auth.user.dealer_id}/stats`)
    
    // 3. Заказы
    orders.value = await $fetch(`${config.public.apiBase}/v1/admin/orders`, {
      params: { dealer_id: auth.user.dealer_id }
    })

    // 4. Транзакции
    transactions.value = await $fetch(`${config.public.apiBase}/v1/admin/dealers/${auth.user.dealer_id}/transactions`)

    // 5. Графики
    chartData.value = await $fetch(`${config.public.apiBase}/v1/admin/dealers/${auth.user.dealer_id}/chart`)

    // 6. Аналитика по филиалам
    statsByBranch.value = await $fetch(`${config.public.apiBase}/v1/admin/dealers/${auth.user.dealer_id}/stats/by_branch`)
  } catch (e) {
    console.error('Failed to load cabinet data', e)
  }
})
</script>
