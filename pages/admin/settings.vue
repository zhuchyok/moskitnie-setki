<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const title = 'Настройки кабинета — Сетки 21'
useHead({ title })

const isLoading = ref(true)
const isSaving = ref(false)
const activeTab = ref('branding')

const form = reactive({
  name: '',
  city: '',
  phone: '',
  email: '',
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
    
    // В реальности здесь должен быть эндпоинт для текущего дилера
    // Для примера используем ID из профиля пользователя
    const dealerId = auth.user?.dealer_id
    if (!dealerId) return

    const response = await $fetch(`/api/v1/admin/dealers/${dealerId}`, {
      baseURL: apiBase,
      headers: { 'Authorization': `Bearer ${auth.token}` }
    }) as any
    
    Object.assign(form, response)
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
    const dealerId = auth.user?.dealer_id
    
    await $fetch(`/api/v1/admin/dealers/${dealerId}`, {
      method: 'PUT',
      baseURL: apiBase,
      body: form,
      headers: { 'Authorization': `Bearer ${auth.token}` }
    })
    
    alert('Настройки успешно сохранены')
  } catch (e) {
    console.error('Failed to save settings', e)
    alert('Ошибка при сохранении настроек')
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
    alert('Ошибка при загрузке логотипа')
  }
}

onMounted(fetchSettings)
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20">
    <div class="container mx-auto px-4 pt-10">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-black text-brand-dark uppercase tracking-tighter mb-10">Настройки вашего кабинета</h2>
        
        <div v-if="isLoading" class="p-20 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p class="text-gray-400 font-black uppercase text-[10px] tracking-widest">Загрузка настроек...</p>
        </div>

        <div v-else class="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
          <!-- Tabs -->
          <div class="flex gap-4 p-10 border-b border-gray-50 overflow-x-auto bg-gray-50/30">
            <button @click="activeTab = 'branding'" :class="['text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all', activeTab === 'branding' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-gray-400 hover:bg-white']">Брендинг</button>
            <button @click="activeTab = 'contacts'" :class="['text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all', activeTab === 'contacts' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-gray-400 hover:bg-white']">Контакты</button>
            <button @click="activeTab = 'seo'" :class="['text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all', activeTab === 'seo' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-gray-400 hover:bg-white']">SEO</button>
            <button @click="activeTab = 'legal'" :class="['text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all', activeTab === 'legal' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-gray-400 hover:bg-white']">Юр. данные</button>
          </div>

          <form @submit.prevent="handleSave" class="p-10 space-y-10">
            <!-- Branding -->
            <div v-if="activeTab === 'branding'" class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Ваш логотип</label>
                  <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-brand-blue transition-colors relative group">
                    <img v-if="form.branding.logo_url" :src="form.branding.logo_url" class="h-12 w-12 object-contain rounded-lg" />
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
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Краткое описание (подпись)</label>
                <input v-model="form.branding.short_description" type="text" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Режим работы</label>
                <input v-model="form.branding.working_hours" type="text" class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none font-bold shadow-inner" placeholder="Пн-Пт 9:00-18:00" />
              </div>
            </div>

            <!-- Contacts -->
            <div v-if="activeTab === 'contacts'" class="space-y-8">
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
            <div v-if="activeTab === 'seo'" class="space-y-8">
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
            <div v-if="activeTab === 'legal'" class="space-y-8">
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
    </div>
  </div>
</template>
