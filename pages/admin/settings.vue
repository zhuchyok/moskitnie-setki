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

const title = 'Настройки кабинета — Сетки 21'
useHead({ 
  title
})

const isLoading = ref(true)
const isSaving = ref(false)
const activeTab = ref('site')

const form = reactive({
  name: '',
  city: '',
  phone: '',
  email: '',
  domain: '',
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

const fetchSettings = async () => {
  isLoading.value = true
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiUrl || 'http://localhost:8081'
    
    let dealerId = auth.user?.dealer_id
    if (!dealerId && auth.isAdmin) {
      dealerId = '00000000-0000-0000-0000-000000000001'
    }

    if (!dealerId) return

    const response = (await $fetch(`/api/v1/admin/dealers/${dealerId}`, {
      baseURL: apiBase,
      headers: { 'Authorization': `Bearer ${auth.token}` }
    })) as any
    
    // Очищаем форму от null значений, которые могут прийти из базы
    const cleanResponse = { ...response }
    if (!cleanResponse.branding) cleanResponse.branding = { ...form.branding }
    if (!cleanResponse.contacts) cleanResponse.contacts = { ...form.contacts }
    if (!cleanResponse.legal_info) cleanResponse.legal_info = { ...form.legal_info }
    if (!cleanResponse.seo_config) cleanResponse.seo_config = { ...form.seo_config }
    
    Object.assign(form, cleanResponse)
  } catch (e) {
    console.error('Failed to fetch settings', e)
  } finally {
    isLoading.value = false
  }
}

const handleSave = async () => {
  isSaving.value = true
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiUrl || 'http://localhost:8081'
    let dealerId = auth.user?.dealer_id
    
    // Если мы админ и dealer_id почему-то нет, пробуем использовать ID производителя
    if (!dealerId && auth.isAdmin) {
      dealerId = '00000000-0000-0000-0000-000000000001'
    }

    if (!dealerId) {
      throw new Error('ID дилера не найден. Попробуйте перезайти в систему.')
    }
    
    const body = {
      name: form.name,
      city: form.city,
      phone: form.phone,
      email: form.email || null,
      domain: (form.domain && form.domain.trim()) || null,
      branding: {
        logo_url: form.branding.logo_url || null,
        primary_color: form.branding.primary_color || null,
        short_description: form.branding.short_description || null,
        full_description: form.branding.full_description || null,
        working_hours: form.branding.working_hours || null
      },
      contacts: {
        phones: Array.isArray(form.contacts.phones) ? form.contacts.phones.filter(p => p) : [],
        emails: Array.isArray(form.contacts.emails) ? form.contacts.emails.filter(e => e) : [],
        additional_cities: Array.isArray(form.contacts.additional_cities) ? form.contacts.additional_cities.filter(c => c) : []
      },
      legal_info: {
        requisites: form.legal_info.requisites || null,
        privacy_policy_url: form.legal_info.privacy_policy_url || null,
        privacy_policy_text: form.legal_info.privacy_policy_text || null
      },
      seo_config: {
        title_template: form.seo_config.title_template || null,
        description_template: form.seo_config.description_template || null,
        keywords: form.seo_config.keywords || null
      }
    }

    await $fetch(`/api/v1/admin/dealers/${dealerId}`, {
      method: 'PUT',
      baseURL: apiBase,
      body,
      headers: { 'Authorization': `Bearer ${auth.token}` },
      onResponseError({ response }) {
        console.error('API Error Details:', response._data)
        if (response._data && response._data.message) {
          throw new Error(`Ошибка сервера: ${response._data.message}`)
        }
      }
    })
    
    showNotification('Настройки успешно сохранены')
  } catch (e: any) {
    console.error('Failed to save settings', e)
    showNotification(e.message || 'Ошибка при сохранении настроек', 'error')
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

onMounted(fetchSettings)
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20">
    <AdminHeader />

    <div class="container mx-auto px-4">
      <!-- Stats Grid (как в обзоре) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div class="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Статус кабинета</p>
          <p class="text-3xl font-black text-brand-dark tracking-tighter">Активен</p>
        </div>
        <div class="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Город</p>
          <p class="text-3xl font-black text-brand-dark tracking-tighter">{{ form.city || '—' }}</p>
        </div>
      </div>

      <div class="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div class="p-10 border-b border-gray-50 flex justify-between items-center">
          <h2 class="text-2xl font-black text-brand-dark uppercase tracking-tighter">Настройки кабинета</h2>
          <div class="flex gap-2 flex-wrap">
            <button @click="activeTab = 'site'" :class="['text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all', activeTab === 'site' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-gray-400 hover:bg-gray-50']">Основное</button>
            <button @click="activeTab = 'contacts'" :class="['text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all', activeTab === 'contacts' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-gray-400 hover:bg-gray-50']">Контакты</button>
            <button @click="activeTab = 'legal'" :class="['text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all', activeTab === 'legal' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-gray-400 hover:bg-gray-50']">Юр. данные</button>
          </div>
        </div>

        <div v-if="isLoading" class="p-20 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p class="text-gray-400 font-black uppercase text-[10px] tracking-widest">Загрузка настроек...</p>
        </div>

        <form v-else @submit.prevent="handleSave" class="p-10 space-y-10">
          <!-- Основное (Сайт + Брендинг) -->
          <div v-if="activeTab === 'site'" class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Домен сайта</label>
              <input v-model="form.domain" type="text" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" placeholder="setki21.ru или www.setki21.ru" />
              <p class="text-[9px] text-gray-400 ml-4 mt-2">При заходе на этот адрес посетители увидят ваши настройки (брендинг, контакты, SEO). Укажите домен вашего сайта, например setki21.ru</p>
            </div>

            <div class="pt-6 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Ваш логотип</label>
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
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Основной цвет сайта</label>
                <div class="flex gap-4">
                  <input v-model="form.branding.primary_color" type="color" class="h-14 w-20 bg-gray-50 border-2 border-transparent rounded-2xl outline-none cursor-pointer" />
                  <input v-model="form.branding.primary_color" type="text" class="flex-1 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Краткое описание (подпись)</label>
                <input v-model="form.branding.short_description" type="text" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Режим работы</label>
                <input v-model="form.branding.working_hours" type="text" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" placeholder="Пн-Пт 9:00-18:00" />
              </div>
            </div>
          </div>

          <!-- Contacts -->
          <div v-if="activeTab === 'contacts'" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="space-y-4">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Дополнительные города</label>
              <div v-for="(c, i) in form.contacts.additional_cities" :key="i" class="flex gap-2">
                <input v-model="form.contacts.additional_cities[i]" type="text" class="flex-1 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                <button @click="form.contacts.additional_cities.splice(i, 1)" type="button" class="text-red-400 px-4 hover:scale-125 transition-transform">×</button>
              </div>
              <button @click="form.contacts.additional_cities.push('')" type="button" class="text-[10px] font-black text-brand-blue uppercase tracking-widest ml-4 hover:underline">+ Добавить город</button>
            </div>
            <div class="space-y-4">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Телефоны для связи</label>
              <div v-for="(p, i) in form.contacts.phones" :key="i" class="flex gap-2">
                <input v-model="form.contacts.phones[i]" type="text" class="flex-1 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                <button @click="form.contacts.phones.splice(i, 1)" type="button" class="text-red-400 px-4 hover:scale-125 transition-transform">×</button>
              </div>
              <button @click="form.contacts.phones.push('')" type="button" class="text-[10px] font-black text-brand-blue uppercase tracking-widest ml-4 hover:underline">+ Добавить телефон</button>
            </div>
            <div class="space-y-4">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email адреса</label>
              <div v-for="(e, i) in form.contacts.emails" :key="i" class="flex gap-2">
                <input v-model="form.contacts.emails[i]" type="email" class="flex-1 bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
                <button @click="form.contacts.emails.splice(i, 1)" type="button" class="text-red-400 px-4 hover:scale-125 transition-transform">×</button>
              </div>
              <button @click="form.contacts.emails.push('')" type="button" class="text-[10px] font-black text-brand-blue uppercase tracking-widest ml-4 hover:underline">+ Добавить email</button>
            </div>
          </div>

          <!-- SEO -->
          <div v-if="activeTab === 'seo'" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Шаблон заголовка (Title)</label>
              <input v-model="form.seo_config.title_template" type="text" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" placeholder="Москитные сетки в {city} - {dealer_name}" />
              <p class="text-[9px] text-gray-400 ml-4">Доступные переменные: {city}, {dealer_name}</p>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Шаблон описания (Description)</label>
              <textarea v-model="form.seo_config.description_template" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" rows="3"></textarea>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Ключевые слова</label>
              <input v-model="form.seo_config.keywords" type="text" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
            </div>
          </div>

          <!-- Legal -->
          <div v-if="activeTab === 'legal'" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Реквизиты организации</label>
              <textarea v-model="form.legal_info.requisites" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" rows="6" placeholder="ООО 'Ромашка', ИНН..."></textarea>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Ссылка на политику конфиденциальности</label>
              <input v-model="form.legal_info.privacy_policy_url" type="text" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" placeholder="https://..." />
            </div>
          </div>

          <div class="pt-10 border-t border-gray-50">
            <button type="submit" :disabled="isSaving" class="w-full md:w-auto bg-brand-blue text-white font-black py-5 px-12 rounded-2xl text-[10px] uppercase tracking-widest shadow-2xl shadow-brand-blue/30 hover:scale-105 transition-all disabled:opacity-50">
              {{ isSaving ? 'Сохранение...' : 'Сохранить изменения' }}
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
