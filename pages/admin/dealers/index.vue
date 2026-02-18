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
useHead({ title })

const dealers = ref([])
const isLoading = ref(true)
const isModalOpen = ref(false)
const isSaving = ref(false)
const activeTab = ref('basic')

const form = reactive({
  id: null,
  name: '',
  city: '',
  phone: '',
  email: '',
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
    
    if (form.id) {
      await $fetch(`/api/v1/admin/dealers/${form.id}`, {
        method: 'PUT',
        baseURL: apiBase,
        body: form,
        headers: { 'Authorization': `Bearer ${auth.token}` }
      })
    } else {
      await $fetch('/api/v1/admin/dealers', {
        method: 'POST',
        baseURL: apiBase,
        body: form,
        headers: { 'Authorization': `Bearer ${auth.token}` }
      })
    }
    
    await fetchDealers()
    isModalOpen.value = false
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

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg p-12 relative overflow-y-auto max-h-[90vh]">
        <h3 class="text-2xl font-black text-brand-dark mb-8 uppercase tracking-tighter">
          {{ form.id ? 'Настройка дилера' : 'Новый дилер' }}
        </h3>

        <!-- Tabs -->
        <div class="flex gap-4 mb-8 border-b border-gray-100 pb-4 overflow-x-auto">
          <button @click="activeTab = 'basic'" :class="['text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-colors', activeTab === 'basic' ? 'bg-brand-blue text-white' : 'text-gray-400 hover:bg-gray-50']">Основное</button>
          <button @click="activeTab = 'branding'" :class="['text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-colors', activeTab === 'branding' ? 'bg-brand-blue text-white' : 'text-gray-400 hover:bg-gray-50']">Брендинг</button>
          <button @click="activeTab = 'contacts'" :class="['text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-colors', activeTab === 'contacts' ? 'bg-brand-blue text-white' : 'text-gray-400 hover:bg-gray-50']">Контакты</button>
          <button @click="activeTab = 'seo'" :class="['text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-colors', activeTab === 'seo' ? 'bg-brand-blue text-white' : 'text-gray-400 hover:bg-gray-50']">SEO</button>
          <button @click="activeTab = 'legal'" :class="['text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-colors', activeTab === 'legal' ? 'bg-brand-blue text-white' : 'text-gray-400 hover:bg-gray-50']">Юр. данные</button>
        </div>
        
        <form @submit.prevent="handleSave" class="space-y-6">
          <div v-if="activeTab === 'basic'" class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Название компании</label>
              <input v-model="form.name" type="text" required class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Город</label>
                <input v-model="form.city" type="text" required class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Телефон</label>
                <input v-model="form.phone" type="text" required class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
              </div>
            </div>
            <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <input type="checkbox" v-model="form.is_active" id="is_active" class="w-6 h-6 rounded-lg accent-brand-blue" />
              <label for="is_active" class="text-xs font-black uppercase tracking-widest text-gray-500 cursor-pointer">Активный партнер</label>
            </div>
          </div>

          <div v-if="activeTab === 'branding'" class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Логотип</label>
              <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-brand-blue transition-colors relative group">
                <img v-if="form.branding.logo_url" :src="form.branding.logo_url" alt="Логотип дилера" class="h-12 w-12 object-contain rounded-lg" />
                <div v-else class="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center text-xl">🖼️</div>
                <div class="flex-1">
                  <input type="file" @change="handleLogoUpload" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" />
                  <p class="text-[10px] font-black text-brand-blue uppercase tracking-widest">Загрузить файл</p>
                  <p class="text-[8px] text-gray-400 uppercase">PNG, JPG до 2MB</p>
                </div>
              </div>
              <input v-model="form.branding.logo_url" type="text" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-2 outline-none text-[10px] font-bold shadow-inner mt-2" placeholder="Или вставьте прямую ссылку на логотип" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Основной цвет</label>
              <div class="flex gap-4">
                <input v-model="form.branding.primary_color" type="color" class="h-14 w-20 bg-gray-50 border-2 border-transparent rounded-2xl outline-none cursor-pointer" />
                <input v-model="form.branding.primary_color" type="text" class="flex-1 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Краткое описание</label>
              <input v-model="form.branding.short_description" type="text" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Режим работы</label>
              <input v-model="form.branding.working_hours" type="text" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" placeholder="Пн-Пт 9:00-18:00" />
            </div>
          </div>

          <div v-if="activeTab === 'contacts'" class="space-y-6">
            <div class="space-y-4">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Дополнительные телефоны</label>
              <div v-for="(p, i) in form.contacts.phones" :key="i" class="flex gap-2">
                <input v-model="form.contacts.phones[i]" type="text" class="flex-1 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                <button @click="form.contacts.phones.splice(i, 1)" type="button" class="text-red-400 px-4">×</button>
              </div>
              <button @click="form.contacts.phones.push('')" type="button" class="text-[10px] font-black text-brand-blue uppercase tracking-widest ml-4">+ Добавить телефон</button>
            </div>
            <div class="space-y-4">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email адреса</label>
              <div v-for="(e, i) in form.contacts.emails" :key="i" class="flex gap-2">
                <input v-model="form.contacts.emails[i]" type="email" class="flex-1 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                <button @click="form.contacts.emails.splice(i, 1)" type="button" class="text-red-400 px-4">×</button>
              </div>
              <button @click="form.contacts.emails.push('')" type="button" class="text-[10px] font-black text-brand-blue uppercase tracking-widest ml-4">+ Добавить email</button>
            </div>
          </div>

          <div v-if="activeTab === 'seo'" class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Шаблон Title</label>
              <input v-model="form.seo_config.title_template" type="text" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" placeholder="Москитные сетки в {city} - {dealer_name}" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Шаблон Description</label>
              <textarea v-model="form.seo_config.description_template" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" rows="3"></textarea>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Ключевые слова</label>
              <input v-model="form.seo_config.keywords" type="text" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
            </div>
          </div>

          <div v-if="activeTab === 'legal'" class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Реквизиты</label>
              <textarea v-model="form.legal_info.requisites" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" rows="4"></textarea>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">URL политики конфиденциальности</label>
              <input v-model="form.legal_info.privacy_policy_url" type="text" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
            </div>
          </div>
            <!-- Скрываем индивидуальную наценку, так как она единая для всех -->
            <input v-model.number="form.margin_percent" type="hidden" />
            
            <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <input type="checkbox" v-model="form.is_active" id="is_active" class="w-6 h-6 rounded-lg accent-brand-blue" />
            <label for="is_active" class="text-xs font-black uppercase tracking-widest text-gray-500 cursor-pointer">Активный партнер</label>
          </div>

          <div class="flex gap-4 pt-4">
            <button type="button" @click="isModalOpen = false" class="flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-colors">Отмена</button>
            <button type="submit" :disabled="isSaving" class="flex-1 bg-brand-blue text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-blue/30 disabled:opacity-50">
              {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </div>
        </form>
      </div>
    </div>

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
