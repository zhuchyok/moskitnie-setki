<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const config = useRuntimeConfig()

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const title = 'Управление командой — Кабинет'
useHead({ title })

const managers = ref<any[]>([])
const subdealers = ref<any[]>([])
const isLoading = ref(true)
const activeTab = ref('managers')

const isModalOpen = ref(false)
const isSubDealerModal = ref(false)
const isSaving = ref(false)

const generatedPassword = ref('')
const showPasswordModal = ref(false)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  city: '',
  margin_percent: 30
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

const fetchData = async () => {
  if (!auth.user?.dealer_id) return
  isLoading.value = true
  try {
    const [m, s] = await Promise.all([
      $fetch(`${config.public.apiBase}/v1/cabinet/${auth.user.dealer_id}/managers`, {
        headers: { 'Authorization': `Bearer ${auth.token}` }
      }),
      $fetch(`${config.public.apiBase}/v1/cabinet/${auth.user.dealer_id}/subdealers`, {
        headers: { 'Authorization': `Bearer ${auth.token}` }
      })
    ]) as [any[], any[]]
    managers.value = m
    subdealers.value = s
  } catch (e) {
    console.error('Failed to fetch team data', e)
  } finally {
    isLoading.value = false
  }
}

const openCreateModal = (subDealer = false) => {
  isSubDealerModal.value = subDealer
  form.name = ''
  form.email = ''
  form.phone = ''
  form.city = ''
  form.margin_percent = 30
  isModalOpen.value = true
}

const handleSave = async () => {
  if (!auth.user?.dealer_id) return
  isSaving.value = true
  try {
    const endpoint = isSubDealerModal.value ? 'subdealers' : 'managers'
    const response = await $fetch(`${config.public.apiBase}/v1/cabinet/${auth.user.dealer_id}/${endpoint}`, {
      method: 'POST',
      body: form,
      headers: { 'Authorization': `Bearer ${auth.token}` }
    }) as any
    
    if (response.password) {
      generatedPassword.value = response.password
      showPasswordModal.value = true
      isModalOpen.value = false
    }
    
    await fetchData()
    showNotification(isSubDealerModal.value ? 'Суб-дилер создан' : 'Менеджер добавлен')
  } catch (e: any) {
    console.error('Save failed', e)
    showNotification(e.data?.message || 'Ошибка при сохранении', 'error')
  } finally {
    isSaving.value = false
  }
}

onMounted(fetchData)
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
          <h1 class="text-2xl font-black text-brand-dark uppercase tracking-tighter">Команда и партнеры</h1>
        </div>
        <div class="flex gap-3">
          <button @click="openCreateModal(false)" class="bg-blue-50 text-brand-blue font-black py-3 px-6 rounded-xl text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all">
            + Менеджер
          </button>
          <button @click="openCreateModal(true)" class="admin-btn-primary font-black py-3 px-6 rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">
            + Суб-дилер
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4">
      <!-- Tabs -->
      <div class="flex gap-4 mb-8">
        <button @click="activeTab = 'managers'" :class="['px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all', activeTab === 'managers' ? 'bg-brand-dark text-white shadow-xl' : 'bg-white text-gray-400 hover:bg-gray-100']">
          Менеджеры ({{ managers.length }})
        </button>
        <button @click="activeTab = 'subdealers'" :class="['px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all', activeTab === 'subdealers' ? 'bg-brand-dark text-white shadow-xl' : 'bg-white text-gray-400 hover:bg-gray-100']">
          Суб-дилеры ({{ subdealers.length }})
        </button>
      </div>

      <div v-if="isLoading" class="p-20 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
        <p class="text-gray-400 font-black uppercase text-[10px] tracking-widest">Загрузка...</p>
      </div>

      <!-- Managers List -->
      <div v-else-if="activeTab === 'managers'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="m in managers" :key="m.id" class="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 relative group overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 group-hover:bg-blue-100 transition-colors duration-500"></div>
          <div class="relative z-10">
            <div class="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white font-black mb-6 shadow-lg shadow-blue-200">
              {{ m.name.charAt(0).toUpperCase() }}
            </div>
            <h3 class="text-lg font-black text-brand-dark uppercase tracking-tight mb-1">{{ m.name }}</h3>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-6">{{ m.email }}</p>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[8px] font-black uppercase tracking-widest">Активен</span>
              <span class="px-3 py-1 bg-gray-50 text-gray-400 rounded-lg text-[8px] font-black uppercase tracking-widest">Менеджер</span>
            </div>
          </div>
        </div>
        <div v-if="managers.length === 0" class="col-span-full p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
          <p class="text-gray-300 font-black uppercase text-xs tracking-[0.2em]">У вас пока нет менеджеров</p>
        </div>
      </div>

      <!-- Sub-dealers List -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="s in subdealers" :key="s.id" class="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 relative group overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -mr-12 -mt-12 group-hover:bg-orange-100 transition-colors duration-500"></div>
          <div class="relative z-10">
            <div class="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black mb-6 shadow-lg shadow-orange-200">
              {{ s.name.charAt(0).toUpperCase() }}
            </div>
            <h3 class="text-lg font-black text-brand-dark uppercase tracking-tight mb-1">{{ s.name }}</h3>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">{{ s.city }}</p>
            <p class="text-[10px] text-gray-400 font-medium mb-6">{{ s.phone }}</p>
            
            <div class="bg-gray-50 p-4 rounded-2xl mb-6 flex justify-between items-center">
              <div>
                <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Баланс</p>
                <p class="text-sm font-black text-brand-dark">{{ s.balance.toLocaleString() }} ₽</p>
              </div>
              <div class="text-right">
                <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Наценка</p>
                <p class="text-sm font-black text-brand-blue">{{ s.margin_config.base_margin_percent }}%</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span class="px-3 py-1 bg-blue-50 text-brand-blue rounded-lg text-[8px] font-black uppercase tracking-widest">Суб-дилер</span>
            </div>
          </div>
        </div>
        <div v-if="subdealers.length === 0" class="col-span-full p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
          <p class="text-gray-300 font-black uppercase text-xs tracking-[0.2em]">У вас пока нет суб-дилеров</p>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isModalOpen = false"></div>
          <div class="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-300">
            <h3 class="text-2xl font-black text-brand-dark uppercase tracking-tighter mb-8 text-center">
              {{ isSubDealerModal ? 'Новый суб-дилер' : 'Новый менеджер' }}
            </h3>
            
            <form @submit.prevent="handleSave" class="space-y-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">ФИО / Название</label>
                <input v-model="form.name" type="text" required class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email (Логин)</label>
                  <input v-model="form.email" type="email" required class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Телефон</label>
                  <input v-model="form.phone" type="tel" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                </div>
              </div>

              <template v-if="isSubDealerModal">
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Город</label>
                    <input v-model="form.city" type="text" required class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Наценка (%)</label>
                    <input v-model.number="form.margin_percent" type="number" step="0.1" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                  </div>
                </div>
              </template>
              
              <div class="flex gap-4 pt-4">
                <button type="button" @click="isModalOpen = false" class="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all">Отмена</button>
                <button type="submit" :disabled="isSaving" class="flex-[2] bg-brand-blue text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-blue/30 hover:shadow-brand-blue/40 transition-all disabled:opacity-50 active:scale-95">
                  {{ isSaving ? 'Создание...' : 'Создать' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Password Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showPasswordModal" class="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showPasswordModal = false"></div>
          <div class="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-300 text-center">
            <div class="w-20 h-20 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-black text-brand-dark uppercase tracking-tighter mb-2">Успешно создано!</h3>
            <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mb-8">Передайте эти данные для входа</p>
            
            <div class="bg-gray-50 p-8 rounded-[2rem] border-2 border-dashed border-gray-200 mb-8 space-y-4">
              <div>
                <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Логин (Email)</p>
                <p class="text-lg font-black text-brand-dark">{{ form.email }}</p>
              </div>
              <div class="pt-4 border-t border-gray-100">
                <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Временный пароль</p>
                <p class="text-3xl font-black text-brand-blue tracking-widest">{{ generatedPassword }}</p>
              </div>
            </div>
            
            <button @click="showPasswordModal = false" class="w-full bg-brand-dark text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-dark/20 hover:bg-black transition-all active:scale-95">
              Я сохранил данные
            </button>
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

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
