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

const statusMap: Record<string, string> = {
  new: 'НОВЫЙ',
  confirmed: 'ПОДТВЕРЖДЁН',
  in_production: 'В ПРОИЗВОДСТВЕ',
  inproduction: 'В ПРОИЗВОДСТВЕ',
  ready: 'ГОТОВ',
  in_installation: 'НА МОНТАЖЕ',
  ininstallation: 'НА МОНТАЖЕ',
  completed: 'ЗАВЕРШЁН',
  cancelled: 'ОТМЕНЁН'
}

const meshTypeMap: Record<string, string> = {
  standart: 'Стандарт',
  antimoshka: 'Антимошка',
  antikoshka: 'Антикошка',
  ultravyu: 'Ультравью',
  antipyl: 'Антипыль',
  vstavnaya: 'Вставная VSN'
}

const handleTypeMap: Record<string, string> = {
  pvc: 'ПВХ',
  metal: 'Металл'
}

const normalizeStatus = (status: string | null | undefined) => {
  if (!status) return ''
  const raw = String(status).trim()
  const snake = raw.replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/\s+/g, '_').toLowerCase()
  return statusMap[snake] || raw.toUpperCase()
}

const formatCurrency = (value: number | string | null | undefined) => {
  const n = Number(value || 0)
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0
  }).format(Number.isFinite(n) ? n : 0)
}

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString('ru-RU')
}

const parseItemParams = (params: unknown): Record<string, any> => {
  if (!params) return {}
  if (typeof params === 'string') {
    try {
      const parsed = JSON.parse(params)
      return parsed && typeof parsed === 'object' ? parsed as Record<string, any> : {}
    } catch {
      return {}
    }
  }
  if (typeof params === 'object') return params as Record<string, any>
  return {}
}

const formatMeshType = (value: string | null | undefined) => {
  if (!value) return '—'
  return meshTypeMap[String(value).toLowerCase()] || value
}

const formatHandleType = (value: string | null | undefined) => {
  if (!value) return '—'
  return handleTypeMap[String(value).toLowerCase()] || value
}

const itemCards = computed(() => {
  const items = Array.isArray(order.value?.items) ? order.value.items : []
  return items.map((item: any, index: number) => {
    const params = parseItemParams(item.params)
    const width = Number(params.width ?? 0)
    const height = Number(params.height ?? 0)
    const quantity = Number(item.quantity ?? 1)
    const unitPrice = Number(item.unit_price ?? 0)
    const totalPrice = Number(item.total_price ?? unitPrice * quantity)
    const itemTitle = String(item.name || 'СЕТКА').toUpperCase()

    const rawHandle =
      params.handle_type ??
      params.handleType ??
      (itemTitle.includes('МЕТАЛЛ') ? 'metal' : (itemTitle.includes('ПВХ') ? 'pvc' : null))

    const rawInstallation =
      typeof params.installation === 'boolean'
        ? params.installation
        : (typeof params.installation === 'string'
            ? ['true', '1', 'yes', 'да'].includes(params.installation.toLowerCase())
            : (itemTitle.includes('МОНТАЖ') ? true : false))

    return {
      id: item.id || index,
      index: index + 1,
      title: itemTitle,
      width: Number.isFinite(width) && width > 0 ? width : '—',
      height: Number.isFinite(height) && height > 0 ? height : '—',
      quantity,
      unitPrice,
      totalPrice,
      meshType: formatMeshType(params.mesh_type),
      frameType: params.frame_type || '—',
      color: params.color || '—',
      handleType: formatHandleType(rawHandle),
      installation: rawInstallation ? 'Да' : 'Нет',
      measurementMethod: params.measurement_method || '—'
    }
  })
})

const loadFromList = async (apiBase: string, endpoint: string) => {
  const list = await $fetch<any[]>(endpoint, {
    baseURL: apiBase,
    headers: { Authorization: `Bearer ${auth.token}` }
  })
  return list.find((o: any) => o.id === orderId.value) || null
}

const fetchOrder = async () => {
  if (!orderId.value) return
  isLoading.value = true
  errorMessage.value = ''

  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiUrl || ''

    if (auth.isAdmin) {
      try {
        order.value = await $fetch<any>(`/api/v1/admin/orders/${orderId.value}`, {
          baseURL: apiBase,
          headers: { Authorization: `Bearer ${auth.token}` }
        })
      } catch {
        order.value = await loadFromList(apiBase, '/api/v1/admin/orders')
      }
    } else {
      try {
        order.value = await $fetch<any>(`/api/v1/dealer/orders/${orderId.value}`, {
          baseURL: apiBase,
          headers: { Authorization: `Bearer ${auth.token}` }
        })
      } catch {
        order.value = await loadFromList(apiBase, '/api/v1/dealer/orders')
      }
    }

    if (!order.value) {
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
  title: computed(() => order.value ? `Заказ ${order.value.order_number} — Сетки 21` : 'Заказ — Сетки 21')
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

      <template v-else>
        <section class="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-10 mb-8">
          <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h2 class="text-2xl md:text-3xl font-black text-brand-dark uppercase tracking-tight">ЗАКАЗ {{ order.order_number }}</h2>
                <span class="px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-[10px] font-black uppercase tracking-widest">{{ normalizeStatus(order.status) }}</span>
              </div>
              <p class="text-gray-500 font-semibold">{{ formatDateTime(order.created_at) }}</p>
            </div>

            <div class="text-left md:text-right">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">ИТОГО К ОПЛАТЕ</p>
              <p class="text-4xl font-black text-brand-blue leading-none">{{ formatCurrency(order.total_amount) }} ₽</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="rounded-2xl border border-gray-100 p-5 bg-white">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">КЛИЕНТ</p>
              <p class="text-xl font-black text-brand-dark">{{ order.client_name || '—' }}</p>
              <p class="text-brand-blue font-bold mt-1">{{ order.client_phone || '—' }}</p>
            </div>

            <div class="rounded-2xl border border-gray-100 p-5 bg-white">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">ДИЛЕР</p>
              <p class="text-xl font-black text-brand-dark">{{ order.dealer_name || '—' }}</p>
            </div>
          </div>

          <div v-if="order.comment" class="mt-6 rounded-2xl border border-yellow-100 bg-yellow-50/40 p-5">
            <p class="text-[10px] font-black text-yellow-700 uppercase tracking-[0.2em] mb-2">КОММЕНТАРИЙ КЛИЕНТА</p>
            <p class="text-brand-dark font-semibold">{{ order.comment }}</p>
          </div>
        </section>

        <section v-if="itemCards.length > 0" class="space-y-6">
          <article
            v-for="item in itemCards"
            :key="item.id"
            class="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-6 md:p-8"
          >
            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-brand-blue text-white text-sm font-black flex items-center justify-center">{{ item.index }}</div>
                <h3 class="text-xl font-black text-brand-dark uppercase tracking-tight">{{ item.title }}</h3>
              </div>

              <div class="text-left md:text-right">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">КОЛИЧЕСТВО</p>
                <p class="text-3xl font-black text-brand-dark leading-none">{{ item.quantity }} шт.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-5">
              <div class="rounded-3xl border border-gray-100 bg-gray-50/50 p-5">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">РАЗМЕРЫ ИЗДЕЛИЯ (ММ)</p>
                <div class="flex items-end gap-3 mb-5">
                  <div>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ШИРИНА</p>
                    <p class="text-4xl font-black text-brand-dark leading-none">{{ item.width }}</p>
                  </div>
                  <p class="text-4xl font-black text-gray-400 leading-none">×</p>
                  <div>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ВЫСОТА</p>
                    <p class="text-4xl font-black text-brand-dark leading-none">{{ item.height }}</p>
                  </div>
                </div>

                <div class="rounded-2xl border border-gray-100 bg-white p-4">
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">КОНСТРУКЦИЯ И МАТЕРИАЛЫ</p>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div class="rounded-xl border border-gray-100 p-3">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ТИП ПОЛОТНА</p>
                      <p class="font-black text-brand-dark uppercase">{{ item.meshType }}</p>
                    </div>
                    <div class="rounded-xl border border-gray-100 p-3">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ТИП РАМЫ</p>
                      <p class="font-black text-brand-dark uppercase">{{ item.frameType }}</p>
                    </div>
                    <div class="rounded-xl border border-gray-100 p-3">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ЦВЕТ</p>
                      <p class="font-black text-brand-dark uppercase">{{ item.color }}</p>
                    </div>
                    <div class="rounded-xl border border-gray-100 p-3">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">РУЧКИ</p>
                      <p class="font-black text-brand-dark uppercase">{{ item.handleType }}</p>
                    </div>
                    <div class="rounded-xl border border-gray-100 p-3">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">МОНТАЖ</p>
                      <p class="font-black text-brand-dark uppercase">{{ item.installation }}</p>
                    </div>
                    <div class="rounded-xl border border-gray-100 p-3">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">МЕТОД ЗАМЕРА</p>
                      <p class="font-black text-brand-dark uppercase">{{ item.measurementMethod }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="rounded-3xl border border-gray-100 bg-gray-50/50 p-5 flex flex-col justify-between">
                <div>
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">ЦЕНА ЗА ЕДИНИЦУ</p>
                  <p class="text-5xl font-black text-brand-dark leading-none">{{ formatCurrency(item.unitPrice) }} ₽</p>
                </div>
                <div class="pt-6 mt-6 border-t border-gray-100">
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">ВСЕГО ЗА {{ item.quantity }} ШТ.</p>
                  <p class="text-5xl font-black text-brand-blue leading-none">{{ formatCurrency(item.totalPrice) }} ₽</p>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section v-else class="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-10 text-center">
          <p class="text-gray-400 font-black uppercase text-[10px] tracking-widest">Позиции заказа не найдены</p>
        </section>
      </template>
    </div>
  </div>
</template>
