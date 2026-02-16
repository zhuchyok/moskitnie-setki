import { defineStore } from 'pinia'

export const useTenantStore = defineStore('tenant', () => {
  const config = ref({
    dealer_id: '',
    dealer_name: 'Сетки 21',
    city: 'Чебоксары и Новочебоксарск',
    phone: '+7 (8352) 38-14-20',
    branding: {
      logo_url: '/images/logo_clean.png',
      primary_color: '#2A6AB2',
      short_description: 'Производство замер монтаж от 1 дня',
      working_hours: 'Пн–Пт 10:00–18:00'
    },
    contacts: {
      phones: [],
      emails: []
    },
    seo: {
      title: 'Москитные сетки в Чебоксарах и Новочебоксарске — Сетки 21',
      description: 'Заказать москитные сетки в Чебоксарах и Новочебоксарске от производителя. Изготовление за 1 день, качественные комплектующие, гарантия.',
      keywords: 'москитные сетки, чебоксары, новочебоксарск, купить, заказать, антикошка, антипыль'
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
      
      // Получаем конфиг по текущему домену
      const data = await $fetch('/api/v1/tenant/config', {
        baseURL: apiBase
      }) as any
      
      if (data) {
        config.value = data
        isLoaded.value = true
        
        // Применяем основной цвет к CSS переменной
        if (data.branding?.primary_color) {
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
