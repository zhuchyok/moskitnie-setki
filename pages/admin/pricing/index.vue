<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const title = 'Управление ценами — Сетки 21'
useHead({ title })

const pricing = reactive({
  mesh: [],
  profiles: [],
  components: [],
  services: [],
  markup: {
    dealer: 0,
    client: 0,
    manufacturing_base: 0,
    manufacturing_percent: 0,
    measurement_base: 0,
    measurement_percent: 0,
    measurement_profit_factor: 0,
    urgent_profit_factor: 0,
    installation_profit_factor: 0,
    delivery_profit_factor: 0
  }
})

const isLoading = ref(true)
const isSaving = ref(false)
const showSuccess = ref(false)
const errorMessage = ref('')

const fetchPricing = async () => {
  isLoading.value = true
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiUrl || 'http://localhost:8081'
    
    const response = await $fetch('/api/v1/admin/pricing', {
      baseURL: apiBase,
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    }) as any
    
    console.log('Pricing response:', response)
    
    if (response) {
      pricing.mesh = response.mesh || []
      pricing.profiles = response.profiles || []
      pricing.components = response.components || []
      pricing.services = response.services || []
      pricing.markup = response.markup || { 
        dealer: 0, 
        client: 0, 
        manufacturing_base: 0, 
        manufacturing_percent: 0,
        measurement_base: 0,
        measurement_percent: 0,
        measurement_profit_factor: 0,
        urgent_profit_factor: 0,
        installation_profit_factor: 0,
        delivery_profit_factor: 0
      }
    }
  } catch (e) {
    console.error('Failed to fetch pricing', e)
  } finally {
    isLoading.value = false
  }
}

const handleSave = async () => {
  console.log('Save button clicked, current pricing state:', JSON.stringify(pricing))
  isSaving.value = true
  errorMessage.value = ''
  
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiUrl || 'http://localhost:8081'
    
    const response = await fetch(`${apiBase}/api/v1/admin/pricing`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(pricing)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(errorData.message || `Ошибка сервера: ${response.status}`)
    }

    isSaving.value = false
    showSuccess.value = true
    
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
    
  } catch (e: any) {
    isSaving.value = false
    errorMessage.value = e.message
    console.error('Failed to save pricing', e)
  }
}

onMounted(fetchPricing)
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20">
    <AdminHeader />

    <div class="container mx-auto px-4">
      <!-- Уведомления в стиле сайта -->
      <Transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showSuccess" class="fixed top-10 right-10 z-[100] bg-brand-blue text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-b-4 border-brand-dark">
          <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <span class="font-black uppercase text-xs tracking-widest">Цены успешно сохранены</span>
        </div>
      </Transition>

      <Transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="errorMessage" class="fixed top-10 right-10 z-[100] bg-red-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex flex-col gap-2 border-b-4 border-red-700">
          <div class="flex items-center gap-4">
            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="font-black uppercase text-xs tracking-widest">Ошибка сохранения</span>
          </div>
          <p class="text-[10px] opacity-80 font-bold">{{ errorMessage }}</p>
        </div>
      </Transition>

      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl font-black text-brand-dark uppercase tracking-tighter">Глобальные цены</h2>
        </div>
        <button 
          @click="handleSave"
          :disabled="isSaving || isLoading"
          class="bg-brand-blue text-white font-black py-3 px-8 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-105 transition-transform disabled:opacity-50"
        >
          {{ isSaving ? 'Сохранение...' : 'Сохранить изменения' }}
        </button>
      </div>
      <div v-if="isLoading" class="p-20 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
        <p class="text-gray-400 font-black uppercase text-[10px] tracking-widest">Загрузка цен...</p>
      </div>
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Полотно -->
        <div class="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
          <div class="p-8 border-b border-gray-50">
            <h2 class="text-xl font-black text-brand-dark uppercase tracking-tighter">Стоимость полотна (за м²)</h2>
          </div>
          <div class="p-8 space-y-6">
            <div v-for="item in pricing.mesh" :key="item.id" class="flex items-center justify-between gap-4">
              <span class="font-bold text-gray-600 truncate">{{ item.name }}</span>
              <div class="flex items-center gap-3 shrink-0 min-w-[140px] justify-end">
                <input v-model.number="item.price" type="number" class="w-24 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-xl px-4 py-2 text-right font-black text-brand-blue outline-none transition-all" />
                <span class="text-[10px] font-black text-gray-300 uppercase w-10">₽/м²</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Профили -->
        <div class="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
          <div class="p-8 border-b border-gray-50">
            <h2 class="text-xl font-black text-brand-dark uppercase tracking-tighter">Стоимость профиль (за мп)</h2>
          </div>
          <div class="p-8 space-y-6">
            <div v-for="item in pricing.profiles" :key="item.id" class="flex items-center justify-between gap-4">
              <span class="font-bold text-gray-600 truncate">{{ item.name }}</span>
              <div class="flex items-center gap-3 shrink-0 min-w-[140px] justify-end">
                <input v-model.number="item.price" type="number" class="w-24 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-xl px-4 py-2 text-right font-black text-brand-blue outline-none transition-all" />
                <span class="text-[10px] font-black text-gray-300 uppercase w-8">₽/мп</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Комплектующие -->
        <div class="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
          <div class="p-8 border-b border-gray-50">
            <h2 class="text-xl font-black text-brand-dark uppercase tracking-tighter">Комплектующие</h2>
          </div>
          <div class="p-8 space-y-6">
            <div v-for="item in pricing.components" :key="item.id" class="flex items-center justify-between gap-4">
              <span class="font-bold text-gray-600 truncate">{{ item.name }}</span>
              <div class="flex items-center gap-3 shrink-0 min-w-[140px] justify-end">
                <input v-model.number="item.price" type="number" class="w-24 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-xl px-4 py-2 text-right font-black text-brand-blue outline-none transition-all" />
                <span class="text-[10px] font-black text-gray-300 uppercase w-8">₽/шт</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Работы -->
        <div class="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
          <div class="p-8 border-b border-gray-50">
            <h2 class="text-xl font-black text-brand-dark uppercase tracking-tighter">Работы и услуги</h2>
          </div>
          <div class="p-8 space-y-6">
            <div v-for="item in pricing.services" :key="item.id" class="flex items-center justify-between gap-4">
              <span class="font-bold text-gray-600 truncate">{{ item.name }}</span>
              <div class="flex items-center gap-3 shrink-0 min-w-[140px] justify-end">
                <input v-model.number="item.price" type="number" class="w-24 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-xl px-4 py-2 text-right font-black text-brand-blue outline-none transition-all" />
                <span class="text-[10px] font-black text-gray-300 uppercase w-8">
                  {{ item.id === 'installation_plisse' ? '₽/м2' : '₽' }}
                </span>
              </div>
            </div>

            <!-- Разделитель -->
            <div class="h-px bg-gray-100 my-4"></div>

            <!-- Изготовление -->
            <div class="space-y-4">
              <div class="flex items-center justify-between gap-4">
                <span class="font-bold text-gray-600 truncate">Изготовление: База</span>
                <div class="flex items-center gap-3 shrink-0 min-w-[140px] justify-end">
                  <input v-model.number="pricing.markup.manufacturing_base" type="number" class="w-24 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-xl px-4 py-2 text-right font-black text-brand-blue outline-none transition-all" />
                  <span class="text-[10px] font-black text-gray-300 uppercase w-8">₽</span>
                </div>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="font-bold text-gray-600 truncate">Изготовление: % от мат.</span>
                <div class="flex items-center gap-3 shrink-0 min-w-[140px] justify-end">
                  <input v-model.number="pricing.markup.manufacturing_percent" type="number" step="0.1" class="w-24 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-xl px-4 py-2 text-right font-black text-brand-blue outline-none transition-all" />
                  <span class="text-[10px] font-black text-gray-300 uppercase w-8">%</span>
                </div>
              </div>
            </div>

            <!-- Разделитель -->
            <div class="h-px bg-gray-100 my-4"></div>

            <!-- Замер -->
            <div class="space-y-4">
              <div class="flex items-center justify-between gap-4">
                <span class="font-bold text-gray-600 truncate">Замер: База</span>
                <div class="flex items-center gap-3 shrink-0 min-w-[140px] justify-end">
                  <input v-model.number="pricing.markup.measurement_base" type="number" class="w-24 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-xl px-4 py-2 text-right font-black text-brand-blue outline-none transition-all" />
                  <span class="text-[10px] font-black text-gray-300 uppercase w-8">₽</span>
                </div>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="font-bold text-gray-600 truncate">Замер: % от мат.</span>
                <div class="flex items-center gap-3 shrink-0 min-w-[140px] justify-end">
                  <input v-model.number="pricing.markup.measurement_percent" type="number" step="0.1" class="w-24 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-xl px-4 py-2 text-right font-black text-brand-blue outline-none transition-all" />
                  <span class="text-[10px] font-black text-gray-300 uppercase w-8">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Коэффициенты -->
        <div class="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden lg:col-span-2">
          <div class="p-8 border-b border-gray-50">
            <h2 class="text-xl font-black text-brand-dark uppercase tracking-tighter">Глобальные наценки</h2>
          </div>
          <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div class="space-y-4">
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Коэффициент дилера</label>
              <div class="flex items-center gap-4">
                <input v-model.number="pricing.markup.dealer" type="number" step="0.01" class="flex-1 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 font-black text-2xl text-brand-blue outline-none transition-all" />
              </div>
            </div>
            <div class="space-y-4">
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Коэффициент клиента</label>
              <div class="flex items-center gap-4">
                <input v-model.number="pricing.markup.client" type="number" step="0.01" class="flex-1 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 font-black text-2xl text-brand-blue outline-none transition-all" />
              </div>
            </div>
            <div class="space-y-4">
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Коэффициент срочности</label>
              <div class="flex items-center gap-4">
                <input v-model.number="pricing.markup.urgent_profit_factor" type="number" step="0.1" class="flex-1 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 font-black text-2xl text-brand-blue outline-none transition-all" />
              </div>
            </div>
            <div class="space-y-4">
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Коэффициент монтажа</label>
              <div class="flex items-center gap-4">
                <input v-model.number="pricing.markup.installation_profit_factor" type="number" step="0.1" class="flex-1 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 font-black text-2xl text-brand-blue outline-none transition-all" />
              </div>
            </div>
            <div class="space-y-4">
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Коэффициент доставки</label>
              <div class="flex items-center gap-4">
                <input v-model.number="pricing.markup.delivery_profit_factor" type="number" step="0.1" class="flex-1 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 font-black text-2xl text-brand-blue outline-none transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
