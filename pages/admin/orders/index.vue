<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const title = 'Управление заказами — Сетки 21'
useHead({ title })

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
    orders.value = response
  } catch (e) {
    console.error('Failed to fetch orders', e)
    // Заглушка для демонстрации, если API еще не возвращает данные
    orders.value = [
      { id: 'MS-2024021501', date: '15.02.2024', client: 'Иван И.', amount: '3 450 ₽', status: 'В производстве', statusColor: 'blue' },
      { id: 'MS-2024021408', date: '14.02.2024', client: 'Мария С.', amount: '1 200 ₽', status: 'Готов', statusColor: 'green' },
    ]
  } finally {
    isLoading.value = false
  }
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
              <tr v-for="order in orders" :key="order.id" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="p-10">{{ order.id }}</td>
                <td class="p-10 text-gray-400">{{ order.date }}</td>
                <td class="p-10">{{ order.client }}</td>
                <td v-if="auth.isAdmin" class="p-10 text-gray-400">ООО "Окна Плюс"</td>
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
                  <button class="text-gray-300 hover:text-brand-blue transition-colors">Просмотр</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
