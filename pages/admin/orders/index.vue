<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const title = 'Управление заказами — Сетки 21'
useHead({ 
  title
})

const orders = ref([])
const isLoading = ref(true)

const fetchOrders = async () => {
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
    
    orders.value = response.map((o: any) => ({
      orderId: o.id,
      orderNumber: o.order_number || String(o.id).substring(0, 8),
      date: new Date(o.created_at).toLocaleDateString('ru-RU'),
      client: o.client_name,
      amount: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(o.total_amount),
      status: mapStatus(o.status).label,
      statusColor: mapStatus(o.status).color,
      dealer: o.dealer_name || '—'
    }))
  } catch (e) {
    console.error('Failed to fetch orders', e)
    orders.value = []
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

onMounted(fetchOrders)
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20">
    <AdminHeader />

    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-black text-brand-dark uppercase tracking-tighter">Все заказы</h2>
      </div>
      <div class="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div v-if="isLoading" class="p-20 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p class="text-gray-400 font-black uppercase text-[10px] tracking-widest">Загрузка заказов...</p>
        </div>
        <div v-else-if="orders.length === 0" class="p-20 text-center">
          <p class="text-gray-400 font-black uppercase text-[10px] tracking-widest">Заказов пока нет</p>
        </div>
        <div v-else class="overflow-x-auto">
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
            <tbody class="text-sm font-bold text-brand-dark">
              <tr v-for="order in orders" :key="order.orderId" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="p-10">{{ order.orderNumber }}</td>
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
                  <NuxtLink :to="`/admin/orders/${order.orderId}`" class="text-brand-blue hover:underline font-black text-[10px] uppercase tracking-widest">Просмотр</NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
