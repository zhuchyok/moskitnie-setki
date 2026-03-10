import { defineStore } from 'pinia'

export const useTenantStore = defineStore('tenant', () => {
  const config = ref({
    dealer_id: '',
    dealer_name: '',
    city: '',
    phone: '',
    email: '' as string,
    branding: {
      logo_url: '',
      favicon_url: '',
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

  const fetchConfig = async (ssrOrigin?: string) => {
    try {
      const runtimeConfig = useRuntimeConfig()
      const apiBase = runtimeConfig.public.apiUrl || ''
      const route = useRoute()
      
      // Запрос конфига — на текущий origin, чтобы бэкенд получил Host дилера и вернул его конфиг (фавикон и лого дилера, не головного сайта)
      // На клиенте: baseURL '' = текущий origin. На SSR: если передан ssrOrigin (Host из запроса) — запрашиваем с домена дилера
      const configBaseUrl = process.client && typeof window !== 'undefined'
        ? ''
        : (ssrOrigin || apiBase)
      
      const dealerId = !route.path.startsWith('/admin') ? route.query.dealer_id : null
      const queryParams = dealerId ? { dealer_id: String(dealerId) } : {}
      
      const data = await $fetch('/api/v1/tenant/config', {
        baseURL: configBaseUrl,
        query: queryParams
      }) as any
      
      if (data) {
        // Полная замена конфига из API; email и contacts.emails нужны для заявок дилера (callback)
        config.value = { ...config.value, ...data, email: data.email ?? config.value?.email ?? '' }
        const base = process.client && typeof window !== 'undefined'
          ? window.location.origin
          : (ssrOrigin || (runtimeConfig.public.apiUrl as string) || '')
        const baseClean = base ? base.replace(/\/$/, '') : ''
        // Логотип: относительный путь → полный URL от текущего origin (SSR: домен запроса)
        if (data.branding?.logo_url && data.branding.logo_url.startsWith('/')) {
          config.value.branding.logo_url = baseClean + data.branding.logo_url
        }
        // Фавикон: favicon_url из конфига или не трогаем (layout возьмёт logo_url)
        if (data.branding?.favicon_url && data.branding.favicon_url.startsWith('/')) {
          config.value.branding.favicon_url = baseClean + data.branding.favicon_url
        } else if (data.branding?.favicon_url) {
          config.value.branding.favicon_url = data.branding.favicon_url
        }
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
