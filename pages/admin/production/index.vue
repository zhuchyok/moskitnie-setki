<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const title = 'Управление производством — Сетки 21'
useHead({ 
  title
})

const orders = ref([])
const isLoading = ref(true)

const fetchProductionOrders = async () => {
  isLoading.value = true
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiUrl || 'http://localhost:8081'
    
    const response = await $fetch('/api/v1/admin/production/orders', {
      baseURL: apiBase,
      headers: { 'Authorization': `Bearer ${auth.token}` }
    }) as any

    orders.value = (response || []).map((o: any) => ({
      id: o.id,
      order_number: o.order_number || o.id?.substring(0, 8) || '—',
      date: o.created_at ? new Date(o.created_at).toLocaleDateString('ru-RU') : '—',
      client: o.client_name || '—',
      status: o.status,
      sub_status: o.production_sub_status || 'pending',
      items: o.items || []
    }))
  } catch (e) {
    console.error('Failed to fetch production orders', e)
    orders.value = []
  } finally {
    isLoading.value = false
  }
}

const updateSubStatus = async (orderId: string, newSubStatus: string) => {
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiUrl || 'http://localhost:8081'
    
    await $fetch(`/api/v1/admin/orders/${orderId}/status`, {
      method: 'PUT',
      baseURL: apiBase,
      headers: { 'Authorization': `Bearer ${auth.token}` },
      body: { 
        status: 'in_production',
        production_sub_status: newSubStatus 
      }
    })
    
    await fetchProductionOrders()
  } catch (e) {
    console.error('Failed to update sub-status', e)
  }
}

const markReady = async (orderId: string) => {
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiUrl || 'http://localhost:8081'
    
    await $fetch(`/api/v1/admin/orders/${orderId}/status`, {
      method: 'PUT',
      baseURL: apiBase,
      headers: { 'Authorization': `Bearer ${auth.token}` },
      body: { status: 'ready' }
    })
    
    await fetchProductionOrders()
  } catch (e) {
    console.error('Failed to mark as ready', e)
  }
}

const subStatuses = [
  { id: 'pending', label: 'В очереди', color: 'gray' },
  { id: 'cutting', label: 'Распил', color: 'blue' },
  { id: 'assembly', label: 'Сборка', color: 'blue' },
  { id: 'packaging', label: 'Упаковка', color: 'green' }
]

onMounted(fetchProductionOrders)
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20">
    <AdminHeader />

    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-black text-brand-dark uppercase tracking-tighter">Цех: Заказы в работе</h2>
        <button @click="fetchProductionOrders" class="text-[10px] font-black text-brand-blue uppercase tracking-widest">Обновить</button>
      </div>

      <div class="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div v-if="isLoading" class="p-20 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p class="text-gray-400 font-black uppercase text-[10px] tracking-widest">Загрузка очереди...</p>
        </div>
        
        <div v-else-if="orders.length === 0" class="p-20 text-center">
          <p class="text-gray-400 font-black uppercase text-[10px] tracking-widest">В цеху пока пусто</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th class="p-10">Заказ</th>
                <th class="p-10">Состав</th>
                <th class="p-10">Этап производства</th>
                <th class="p-10">Действие</th>
              </tr>
            </thead>
            <tbody class="text-sm font-bold text-brand-dark">
              <tr v-for="order in orders" :key="order.id" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="p-10">
                  <div class="font-black text-brand-blue">{{ order.order_number }}</div>
                  <div class="text-[10px] text-gray-400 mt-1">{{ order.date }}</div>
                  <div class="text-xs mt-2">{{ order.client }}</div>
                </td>
                <td class="p-10">
                  <div v-for="item in order.items" :key="item.id" class="mb-2">
                    <div class="text-xs">{{ item.name }}</div>
                    <div class="text-[10px] text-gray-400">{{ item.quantity }} шт.</div>
                  </div>
                </td>
                <td class="p-10">
                  <div class="flex flex-wrap gap-2">
                    <button 
                      v-for="ss in subStatuses" 
                      :key="ss.id"
                      @click="updateSubStatus(order.id, ss.id)"
                      :class="[
                        'px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all',
                        order.sub_status === ss.id 
                          ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 scale-105' 
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                      ]"
                    >
                      {{ ss.label }}
                    </button>
                  </div>
                </td>
                <td class="p-10">
                  <button 
                    @click="markReady(order.id)"
                    class="bg-green-500 text-white font-black py-3 px-6 rounded-xl text-[9px] uppercase tracking-widest shadow-lg shadow-green-500/20 hover:scale-105 transition-transform"
                  >
                    Готов к выдаче
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
