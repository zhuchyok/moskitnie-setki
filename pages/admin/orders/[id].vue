<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const route = useRoute()

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const orderId = computed(() => route.params.id as string)
const order = ref<any>(null)
const isLoading = ref(true)
const errorMessage = ref('')

const mapStatus = (status: string) => {
  const statuses: Record<string, string> = {
    new: 'Новый',
    confirmed: 'Подтверждён',
    in_production: 'В производстве',
    ready: 'Готов к выдаче',
    in_installation: 'На монтаже',
    completed: 'Завершён',
    cancelled: 'Отменён'
  }
  return statuses[status] || status
}

const fetchOrder = async () => {
  if (!orderId.value) return
  isLoading.value = true
  errorMessage.value = ''
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiUrl || 'http://localhost:8081'
    const list = await $fetch<any[]>(auth.isAdmin ? '/api/v1/admin/orders' : '/api/v1/dealer/orders', {
      baseURL: apiBase,
      headers: { 'Authorization': `Bearer ${auth.token}` }
    })
    const found = list.find((o: any) => o.id === orderId.value)
    if (found) {
      order.value = found
    } else {
      errorMessage.value = 'Заказ не найден'
    }
  } catch (e) {
    console.error('Failed to fetch order', e)
    errorMessage.value = 'Не удалось загрузить заказ'
  } finally {
    isLoading.value = false
  }
}

useHead({
  title: order.value ? `Заказ ${order.value.order_number} — Сетки 21` : 'Заказ — Сетки 21'
})

onMounted(fetchOrder)
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20">
    <AdminHeader />

    <div class="container mx-auto px-4">
      <div class="flex items-center gap-4 mb-8">
        <NuxtLink to="/admin/orders" class="text-brand-blue hover:underline font-black text-[10px] uppercase tracking-widest">← Все заказы</NuxtLink>
      </div>

      <div v-if="isLoading" class="p-20 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
        <p class="text-gray-400 font-black uppercase text-[10px] tracking-widest">Загрузка...</p>
      </div>

      <div v-else-if="errorMessage || !order" class="bg-white rounded-[3rem] shadow-xl border border-gray-100 p-12 text-center">
        <p class="text-red-500 font-bold">{{ errorMessage || 'Заказ не найден' }}</p>
      </div>

      <div v-else class="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
        <div class="p-8 border-b border-gray-50">
          <h2 class="text-xl font-black text-brand-dark uppercase tracking-tighter">Заказ {{ order.order_number }}</h2>
          <p class="text-gray-400 text-sm mt-1">{{ new Date(order.created_at).toLocaleString('ru-RU') }}</p>
        </div>
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Клиент</p>
            <p class="font-bold text-brand-dark">{{ order.client_name }}</p>
          </div>
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Телефон</p>
            <p class="font-bold text-brand-dark">{{ order.client_phone || '—' }}</p>
          </div>
          <div v-if="order.dealer_name">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Дилер</p>
            <p class="font-bold text-brand-dark">{{ order.dealer_name }}</p>
          </div>
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Статус</p>
            <p class="font-bold text-brand-blue">{{ mapStatus(order.status) }}</p>
          </div>
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Сумма</p>
            <p class="font-black text-2xl text-brand-blue">{{ new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(order.total_amount) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
