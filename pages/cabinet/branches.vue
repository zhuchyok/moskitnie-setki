<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const config = useRuntimeConfig()

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const title = 'Мои филиалы — Кабинет'
useHead({ title })

const branches = ref<any[]>([])
const isLoading = ref(true)
const isModalOpen = ref(false)
const isSaving = ref(false)

const form = reactive({
  id: null,
  name: '',
  domain: '',
  city: '',
  margin_config: {
    branch_multiplier: 1.0
  }
})

const notification = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notification.message = message
  notification.type = type
  notification.show = true
  setTimeout(() => { notification.show = false }, 5000)
}

const fetchBranches = async () => {
  if (!auth.user?.dealer_id) return
  isLoading.value = true
  try {
    const data = await $fetch(`${config.public.apiBase}/v1/cabinet/${auth.user.dealer_id}/branches`, {
      headers: { 'Authorization': `Bearer ${auth.token}` }
    }) as any[]
    branches.value = data
  } catch (e) {
    console.error('Failed to fetch branches', e)
  } finally {
    isLoading.value = false
  }
}

const openCreateModal = () => {
  form.id = null
  form.name = ''
  form.domain = ''
  form.city = ''
  form.margin_config = { branch_multiplier: 1.0 }
  isModalOpen.value = true
}

const handleSave = async () => {
  if (!auth.user?.dealer_id) return
  isSaving.value = true
  try {
    await $fetch(`${config.public.apiBase}/v1/cabinet/${auth.user.dealer_id}/branches`, {
      method: 'POST',
      body: {
        name: form.name,
        domain: form.domain || undefined,
        city: form.city || undefined,
        branch_multiplier: form.margin_config?.branch_multiplier ?? 1.0
      },
      headers: { 'Authorization': `Bearer ${auth.token}` }
    })
    
    await fetchBranches()
    showNotification('Филиал успешно добавлен')
    isModalOpen.value = false
  } catch (e: any) {
    console.error('Save failed', e)
    showNotification(e.data?.message || 'Ошибка при сохранении', 'error')
  } finally {
    isSaving.value = false
  }
}

onMounted(fetchBranches)
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20">
    <div class="bg-white border-b border-gray-100 mb-8">
      <div class="container mx-auto px-4 py-6 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <NuxtLink to="/cabinet" class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-brand-blue transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </NuxtLink>
          <h1 class="text-2xl font-black text-brand-dark uppercase tracking-tighter">Мои филиалы (Сайты)</h1>
        </div>
        <button @click="openCreateModal" class="admin-btn-primary font-black py-3 px-8 rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">
          Добавить филиал
        </button>
      </div>
    </div>

    <div class="container mx-auto px-4">
      <div v-if="isLoading" class="p-20 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
        <p class="text-gray-400 font-black uppercase text-[10px] tracking-widest">Загрузка филиалов...</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="b in branches" :key="b.id" class="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 relative group overflow-hidden flex flex-col">
          <div class="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -mr-16 -mt-16 group-hover:bg-brand-blue/10 transition-colors duration-500"></div>
          
          <div class="relative z-10 flex-1">
            <div class="w-14 h-14 bg-brand-blue rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-blue/30 mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            
            <h3 class="text-xl font-black text-brand-dark uppercase tracking-tighter mb-2">{{ b.name }}</h3>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-6">{{ b.city }}</p>
            
            <div class="space-y-4 mb-8">
              <div class="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Домен</span>
                <span class="text-xs font-black text-brand-blue">{{ b.domain || 'Не привязан' }}</span>
              </div>
              <div class="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Наценка филиала</span>
                <span class="text-xs font-black text-brand-dark">x{{ b.margin_config.branch_multiplier || 1.0 }}</span>
              </div>
            </div>
          </div>

          <div class="relative z-10 pt-6 border-t border-gray-50 flex justify-between items-center">
            <span :class="['px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest', b.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600']">
              {{ b.is_active ? 'Активен' : 'Выключен' }}
            </span>
            <button class="text-[10px] font-black text-gray-300 hover:text-brand-blue uppercase tracking-widest transition-colors">Настроить</button>
          </div>
        </div>

        <div v-if="branches.length === 0" class="col-span-full p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
          <p class="text-gray-300 font-black uppercase text-xs tracking-[0.2em]">У вас пока нет филиалов</p>
          <button @click="openCreateModal" class="mt-6 text-brand-blue font-black uppercase text-[10px] tracking-widest hover:underline">Создать первый филиал</button>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isModalOpen = false"></div>
          <div class="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-300">
            <h3 class="text-2xl font-black text-brand-dark uppercase tracking-tighter mb-8 text-center">Новый филиал</h3>
            
            <form @submit.prevent="handleSave" class="space-y-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Название филиала</label>
                <input v-model="form.name" type="text" required placeholder="Например: Офис Центр" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Город</label>
                  <input v-model="form.city" type="text" required class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Домен (опц)</label>
                  <input v-model="form.domain" type="text" placeholder="sub.domain.ru" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Множитель цены (x1.0 = без наценки)</label>
                <input v-model.number="form.margin_config.branch_multiplier" type="number" step="0.01" min="1" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                <p class="text-[8px] text-gray-400 uppercase ml-4">Этот коэффициент будет умножать цену для клиента на сайте этого филиала</p>
              </div>
              
              <div class="flex gap-4 pt-4">
                <button type="button" @click="isModalOpen = false" class="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all">Отмена</button>
                <button type="submit" :disabled="isSaving" class="flex-[2] admin-btn-primary py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 active:scale-95">
                  {{ isSaving ? 'Создание...' : 'Создать филиал' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Notification -->
    <Teleport to="body">
      <div v-if="notification.show" class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transform animate-in fade-in slide-in-from-bottom-10 duration-500">
        <div :class="['px-8 py-4 rounded-2xl shadow-2xl font-black text-sm uppercase tracking-widest flex items-center gap-4 border-2', notification.type === 'success' ? 'bg-white border-brand-blue text-brand-blue' : 'bg-red-50 border-red-500 text-red-500']">
          {{ notification.message }}
        </div>
      </div>
    </Teleport>
  </div>
</template>
