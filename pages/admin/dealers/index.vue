<script setup lang="ts">
import { reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

const notification = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notification.message = message
  notification.type = type
  notification.show = true
  setTimeout(() => {
    notification.show = false
  }, 5000)
}

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const title = 'Управление дилерами — Сетки 21'
useHead({ 
  title
})

const dealers = ref([])
const isLoading = ref(true)
const isModalOpen = ref(false)
const isSaving = ref(false)
const isActivating = ref(false)
const activeTab = ref('basic')

const handleActivateDomain = async () => {
  if (!form.id || !form.domain) return
  
  isActivating.value = true
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiUrl || 'http://localhost:8081'
    
    const response = await $fetch(`/api/v1/admin/dealers/${form.id}/activate_domain`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${auth.token}` },
      baseURL: apiBase
    }) as any
    
    if (response.success) {
      showNotification(response.message || 'Домен успешно активирован')
    }
  } catch (e: any) {
    console.error('Activation failed', e)
    const msg = e.data?.message || 'Ошибка при активации домена'
    showNotification(msg, 'error')
  } finally {
    isActivating.value = false
  }
}

const form = reactive({
  id: null,
  name: '',
  city: '',
  phone: '',
  email: '',
  domain: '',
  margin_percent: 1.30,
  is_active: true,
  branding: {
    logo_url: '',
    primary_color: '#2196F3',
    short_description: '',
    full_description: '',
    working_hours: ''
  },
  contacts: {
    phones: [],
    emails: [],
    additional_cities: []
  },
  legal_info: {
    requisites: '',
    privacy_policy_url: '',
    privacy_policy_text: ''
  },
  seo_config: {
    title_template: '',
    description_template: '',
    keywords: ''
  }
})

const fetchDealers = async () => {
  isLoading.value = true
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiUrl || 'http://localhost:8081'
    const response = await $fetch('/api/v1/admin/dealers', {
      baseURL: apiBase,
      headers: { 'Authorization': `Bearer ${auth.token}` }
    }) as any
    dealers.value = response
  } catch (e) {
    console.error('Failed to fetch dealers', e)
  } finally {
    isLoading.value = false
  }
}

const openCreateModal = () => {
  form.id = null
  form.name = ''
  form.city = ''
  form.phone = ''
  form.email = ''
  form.domain = ''
  form.margin_percent = 1.30
  form.is_active = true
  form.branding = { logo_url: '', primary_color: '#2196F3', short_description: '', full_description: '', working_hours: '' }
  form.contacts = { phones: [], emails: [], additional_cities: [] }
  form.legal_info = { requisites: '', privacy_policy_url: '', privacy_policy_text: '' }
  form.seo_config = { title_template: '', description_template: '', keywords: '' }
  isModalOpen.value = true
}

const openEditModal = (dealer: any) => {
  form.id = dealer.id
  form.name = dealer.name
  form.city = dealer.city
  form.phone = dealer.phone
  form.email = dealer.email || ''
  form.domain = dealer.domain || ''
  form.margin_percent = dealer.margin_percent
  form.is_active = dealer.is_active
  form.branding = { ...dealer.branding }
  form.contacts = { ...dealer.contacts }
  form.legal_info = { ...dealer.legal_info }
  form.seo_config = { ...dealer.seo_config }
  isModalOpen.value = true
}

const handleSave = async () => {
  isSaving.value = true
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiUrl || 'http://localhost:8081'
    
    const body = { ...form, domain: (form.domain && form.domain.trim()) || null }
    if (form.id) {
      await $fetch(`/api/v1/admin/dealers/${form.id}`, {
        method: 'PUT',
        baseURL: apiBase,
        body,
        headers: { 'Authorization': `Bearer ${auth.token}` }
      })
    } else {
      await $fetch('/api/v1/admin/dealers', {
        method: 'POST',
        baseURL: apiBase,
        body,
        headers: { 'Authorization': `Bearer ${auth.token}` }
      })
    }
    
    await fetchDealers()
    showNotification('Данные дилера сохранены')
  } catch (e) {
    console.error('Failed to save dealer', e)
    showNotification('Ошибка при сохранении дилера', 'error')
  } finally {
    isSaving.value = false
  }
}

const handleLogoUpload = async (event: any) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiUrl || 'http://localhost:8081'
    
    const response = await $fetch('/api/v1/admin/upload', {
      method: 'POST',
      baseURL: apiBase,
      body: formData,
      headers: { 'Authorization': `Bearer ${auth.token}` }
    }) as any
    
    if (response.url) {
      form.branding.logo_url = response.url
    }
  } catch (e) {
    console.error('Upload failed', e)
    showNotification('Ошибка при загрузке логотипа', 'error')
  }
}

onMounted(fetchDealers)
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20">
    <AdminHeader />

    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl font-black text-brand-dark uppercase tracking-tighter">Список дилеров</h2>
        </div>
        <button @click="openCreateModal" class="bg-brand-blue text-white font-black py-3 px-8 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-105 transition-transform">
          Добавить дилера
        </button>
      </div>
      <div v-if="isLoading" class="p-20 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
        <p class="text-gray-400 font-black uppercase text-[10px] tracking-widest">Загрузка списка...</p>
      </div>
      <div v-else class="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th class="p-10">Название</th>
                <th class="p-10">Город</th>
                <th class="p-10">Статус</th>
                <th class="p-10"></th>
              </tr>
            </thead>
            <tbody class="text-sm font-bold text-brand-dark">
              <tr v-for="dealer in dealers" :key="dealer.id" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="p-10">
                  <div>{{ dealer.name }}</div>
                  <div class="text-[10px] text-gray-400 font-medium">{{ dealer.phone }}</div>
                </td>
                <td class="p-10 text-gray-400">{{ dealer.city }}</td>
                <td class="p-10">
                  <span :class="[
                    'px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest',
                    dealer.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  ]">
                    {{ dealer.is_active ? 'Активен' : 'Приостановлен' }}
                  </span>
                </td>
                <td class="p-10 text-right">
                  <button @click="openEditModal(dealer)" class="text-gray-300 hover:text-brand-blue transition-colors">Настроить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Drawer (Выдвижная панель) -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex justify-end">
          <!-- Overlay -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isModalOpen = false"></div>
          
          <!-- Panel -->
          <div class="relative bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <!-- Header -->
            <div class="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <div>
                <h3 class="text-2xl font-black text-brand-dark uppercase tracking-tighter">
                  {{ form.id ? 'Настройка дилера' : 'Новый дилер' }}
                </h3>
                <p v-if="form.id" class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">ID: {{ form.id }}</p>
              </div>
              <button @click="isModalOpen = false" class="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-lg text-gray-400 hover:text-brand-blue transition-all active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Tabs -->
            <div class="px-8 pt-6 flex gap-2 overflow-x-auto no-scrollbar">
              <button @click="activeTab = 'basic'" :class="['text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all whitespace-nowrap', activeTab === 'basic' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-gray-400 hover:bg-gray-50']">Основное и Брендинг</button>
              <button @click="activeTab = 'contacts'" :class="['text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all whitespace-nowrap', activeTab === 'contacts' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-gray-400 hover:bg-gray-50']">Контакты</button>
              <button @click="activeTab = 'legal'" :class="['text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all whitespace-nowrap', activeTab === 'legal' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-gray-400 hover:bg-gray-50']">Юр. данные</button>
            </div>
            
            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <form @submit.prevent="handleSave" id="dealerForm" class="space-y-8">
                <div v-if="activeTab === 'basic'" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Название компании</label>
                    <input v-model="form.name" type="text" required class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Город</label>
                      <input v-model="form.city" type="text" required class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                    </div>
                    <div class="space-y-2">
                      <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Телефон</label>
                      <input v-model="form.phone" type="text" required class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email для уведомлений</label>
                    <input v-model="form.email" type="email" required class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" placeholder="info@example.ru" />
                    <p class="text-[8px] text-gray-400 ml-4 uppercase">На этот адрес дилер будет получать заявки с сайта</p>
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Краткое описание (подпись)</label>
                    <input v-model="form.branding.short_description" type="text" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                  </div>

                  <!-- Привязка домена (NPM + SSL) -->
                  <div v-if="form.domain && form.id" class="pt-10 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div class="bg-gradient-to-br from-white to-blue-50/30 p-8 md:p-10 rounded-[3rem] border-2 border-blue-100/50 shadow-xl relative overflow-hidden group">
                      <!-- Декоративный элемент -->
                      <div class="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand-blue/10 transition-colors duration-500"></div>
                      
                      <div class="flex items-start gap-6 relative z-10">
                        <div class="w-14 h-14 bg-brand-blue rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-blue/30 shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div class="flex-1">
                          <h3 class="text-xl font-black text-brand-dark uppercase tracking-tighter mb-2">Привязка домена</h3>
                          <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-8 opacity-70">Настройка собственного адреса для дилера</p>
                          
                          <div class="space-y-8">
                            <!-- Шаг 1 -->
                            <div class="space-y-4">
                              <div class="flex items-center gap-3">
                                <span class="text-[10px] font-black text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">Шаг 1</span>
                                <h4 class="text-[10px] font-black text-brand-dark uppercase tracking-widest">Настройка DNS</h4>
                              </div>
                              <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-blue-100 shadow-inner">
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Направьте домен на IP сервера:</p>
                                <div class="flex items-center gap-4">
                                  <code class="text-2xl font-black text-brand-blue tracking-tighter">45.10.43.248</code>
                                  <span class="text-[8px] font-black text-gray-300 uppercase tracking-widest">Создайте A-запись в панели регистратора</span>
                                </div>
                              </div>
                            </div>

                            <!-- Шаг 2 -->
                            <div class="space-y-4">
                              <div class="flex items-center gap-3">
                                <span class="text-[10px] font-black text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">Шаг 2</span>
                                <h4 class="text-[10px] font-black text-brand-dark uppercase tracking-widest">Активация в системе</h4>
                              </div>
                              <button type="button" 
                                      @click="handleActivateDomain"
                                      :disabled="isActivating"
                                      class="w-full bg-brand-dark text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-brand-dark/20 active:scale-[0.98] uppercase text-[10px] tracking-[0.2em] hover:bg-black group flex items-center justify-center gap-3 disabled:opacity-50">
                                <span v-if="isActivating" class="animate-pulse">Активация...</span>
                                <template v-else>
                                  <span class="group-hover:translate-x-1 transition-transform">Активировать сайт (NPM + SSL)</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                  </svg>
                                </template>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Домен сайта</label>
                    <input v-model="form.domain" type="text" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" placeholder="setki21.ru или www.setki21.ru" />
                    <p class="text-[9px] text-gray-400 ml-4">Если указан — при заходе на этот домен подставляются настройки этого дилера (брендинг, контакты, SEO).</p>
                  </div>

                  <!-- Брендинг -->
                  <div class="pt-4 border-t border-gray-50 space-y-8">
                    <div class="space-y-2">
                      <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Логотип</label>
                      <div class="flex items-center gap-4 p-6 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 hover:border-brand-blue transition-colors relative group">
                        <img v-if="form.branding.logo_url" :src="form.branding.logo_url" alt="Логотип дилера" class="h-16 w-16 object-contain rounded-xl shadow-sm bg-white p-2" />
                        <div v-else class="h-16 w-16 bg-gray-200 rounded-xl flex items-center justify-center text-2xl">🖼️</div>
                        <div class="flex-1">
                          <input type="file" @change="handleLogoUpload" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" />
                          <p class="text-[10px] font-black text-brand-blue uppercase tracking-widest">Загрузить файл</p>
                          <p class="text-[8px] text-gray-400 uppercase">PNG, JPG до 2MB</p>
                        </div>
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-2">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Основной цвет</label>
                        <div class="flex gap-4">
                          <input v-model="form.branding.primary_color" type="color" class="h-14 w-20 bg-gray-50 border-2 border-transparent rounded-2xl outline-none cursor-pointer" />
                          <input v-model="form.branding.primary_color" type="text" class="flex-1 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                        </div>
                      </div>
                      <div class="space-y-2">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Режим работы</label>
                        <input v-model="form.branding.working_hours" type="text" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" placeholder="Пн-Пт 9:00-18:00" />
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="activeTab === 'contacts'" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div class="space-y-4">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Дополнительные телефоны</label>
                    <div v-for="(p, i) in form.contacts.phones" :key="i" class="flex gap-2">
                      <input v-model="form.contacts.phones[i]" type="text" class="flex-1 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                      <button @click="form.contacts.phones.splice(i, 1)" type="button" class="text-red-400 px-4 hover:scale-125 transition-transform">×</button>
                    </div>
                    <button @click="form.contacts.phones.push('')" type="button" class="text-[10px] font-black text-brand-blue uppercase tracking-widest ml-4 flex items-center gap-2 hover:opacity-70 transition-all">
                      <span class="w-6 h-6 rounded-lg bg-brand-blue/10 flex items-center justify-center">+</span>
                      Добавить телефон
                    </button>
                  </div>
                </div>

                <div v-if="activeTab === 'legal'" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Реквизиты</label>
                    <textarea v-model="form.legal_info.requisites" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner resize-none" rows="6"></textarea>
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">URL политики конфиденциальности</label>
                    <input v-model="form.legal_info.privacy_policy_url" type="text" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                  </div>
                  <div class="flex items-center gap-4 p-6 bg-gray-50 rounded-3xl border-2 border-transparent hover:border-brand-blue/10 transition-all group cursor-pointer" @click="form.is_active = !form.is_active">
                    <div :class="['w-12 h-6 rounded-full relative transition-all duration-300', form.is_active ? 'bg-brand-blue' : 'bg-gray-200']">
                      <div :class="['absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300', form.is_active ? 'left-7' : 'left-1']"></div>
                    </div>
                    <label class="text-xs font-black uppercase tracking-widest text-brand-dark cursor-pointer">Активный партнер</label>
                  </div>
                </div>
                
                <input v-model.number="form.margin_percent" type="hidden" />
              </form>
            </div>

            <!-- Footer -->
            <div class="p-8 border-t border-gray-50 bg-gray-50/30 flex gap-4">
              <button type="button" @click="isModalOpen = false" class="flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-white hover:shadow-lg transition-all active:scale-95">Отмена</button>
              <button type="submit" form="dealerForm" :disabled="isSaving" class="flex-[2] bg-brand-blue text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-blue/30 hover:shadow-brand-blue/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 active:scale-95">
                {{ isSaving ? 'Сохранение...' : 'Сохранить изменения' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Уведомление -->
    <Teleport to="body">
      <div v-if="notification.show"
           class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transform animate-in fade-in slide-in-from-bottom-10 duration-500">
        <div :class="[
          'px-8 py-4 rounded-2xl shadow-2xl font-black text-sm uppercase tracking-widest flex items-center gap-4 border-2',
          notification.type === 'success' ? 'bg-white border-brand-blue text-brand-blue' : 'bg-red-50 border-red-500 text-red-500'
        ]">
          <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ notification.message }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>
