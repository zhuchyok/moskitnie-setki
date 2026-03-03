import { defineStore } from 'pinia'

export const useTenantStore = defineStore('tenant', () => {
  const config = ref({
    dealer_id: '',
    dealer_name: '',
    city: '',
    phone: '',
    branding: {
      logo_url: '',
      primary_color: '',
      short_description: '',
      working_hours: ''
    },
    contacts: {
      phones: [],
      emails: []
    },
    seo: {
      title: '',
      description: '',
      keywords: ''
    },
    legal: {
      requisites: '',
      privacy_policy_url: '/privacy'
    }
  })

  const isLoaded = ref(false)

  const fetchConfig = async () => {
    try {
      const runtimeConfig = useRuntimeConfig()
      const apiBase = runtimeConfig.public.apiUrl || 'http://localhost:8081'
      const route = useRoute()
      
      // Получаем конфиг по текущему домену или dealer_id из URL
      // Добавляем логирование для отладки в консоли браузера
      console.log('Fetching tenant config, query:', route.query)
      
      // Игнорируем dealer_id в query для админ-панели, чтобы не менять брендинг при редактировании дилера
      const dealerId = !route.path.startsWith('/admin') ? route.query.dealer_id : null
      const queryParams = dealerId ? { dealer_id: String(dealerId) } : {}
      
      const data = await $fetch('/api/v1/tenant/config', {
        baseURL: apiBase,
        query: queryParams
      }) as any
      
      if (data) {
        config.value = data
        isLoaded.value = true
        
        // Применяем основной цвет к CSS переменной (только на клиенте)
        if (process.client && data.branding?.primary_color) {
          document.documentElement.style.setProperty('--brand-blue', data.branding.primary_color)
        }
      }
    } catch (e) {
      console.error('Failed to fetch tenant config', e)
    }
  }

  return {
    config,
    isLoaded,
    fetchConfig
  }
})
