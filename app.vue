<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useTenantStore } from '~/stores/tenant'
import { usePricingStore } from '~/stores/pricing'

const auth = useAuthStore()
const tenant = useTenantStore()
const pricing = usePricingStore()
const route = useRoute()

// Конфиг тенанта: на SSR — по Host из запроса (чтобы фавикон/лого дилера в первом HTML), на клиенте — по текущему origin
const event = import.meta.server ? useRequestEvent() : null
const headers = event?.node?.req?.headers
const ssrHost = (headers?.['x-forwarded-host'] as string) || headers?.host
const ssrProto = (headers?.['x-forwarded-proto'] as string) || 'http'
const ssrOrigin = ssrHost ? `${ssrProto}://${ssrHost}` : undefined

      // OG-image и Canonical: от текущего origin (аудит 2026-03-10), не хардкод www.setki21.ru
const requestURL = useRequestURL()
const siteOrigin = (import.meta.server && ssrOrigin) ? ssrOrigin : (requestURL?.origin || '')

const { data: tenantConfig } = await useAsyncData('tenant-config', async () => {
  await tenant.fetchConfig(ssrOrigin)
  return tenant.config
}, {
  watch: [computed(() => ssrOrigin)]
})

const { data: pricingData } = await useAsyncData('pricing-config', async () => {
  await pricing.fetchPricing()
  return pricing.pricing
})

// Вычисляем канонический URL для текущей страницы
const canonicalUrl = computed(() => {
  const origin = siteOrigin || 'https://www.setki21.ru'
  const path = route.path.replace(/\/$/, '') || '/'
  return `${origin}${path === '/' ? '' : path}`
})

onMounted(() => {
  auth.initAuth()
  // Всегда запрашиваем конфиг на клиенте: при статическом деплое payload из пререндера пустой,
  // и только так для сайта дилера подставляется правильный tenant и фавикон
  if (import.meta.client) {
    tenant.fetchConfig()
  }
  if (!pricing.pricing) {
    pricing.fetchPricing()
  }
})

useHead({
  title: computed(() => tenantConfig.value?.seo?.title || 'Москитные сетки в Чебоксарах и Новочебоксарске — Сетки 21'),
  meta: computed(() => {
    const ogImage = tenantConfig.value?.branding?.logo_url || (siteOrigin ? `${siteOrigin}/images/logo_final_v58.png` : 'https://www.setki21.ru/images/logo_final_v58.png')
    const verificationTag = tenantConfig.value?.seo?.verification_tag
    return [
      { name: 'description', content: tenantConfig.value?.seo?.description || '' },
      { property: 'og:title', content: tenantConfig.value?.seo?.title || '' },
      { property: 'og:description', content: tenantConfig.value?.seo?.description || '' },
      { property: 'og:image', content: ogImage },
      { name: 'twitter:image', content: ogImage },
      { name: 'robots', content: 'index, follow' },
      ...(verificationTag ? [{
        name: 'yandex-verification',
        content: verificationTag
      }] : [])
    ]
  }),
  link: computed(() => {
    const faviconUrl = tenantConfig.value?.branding?.favicon_url || (siteOrigin ? `${siteOrigin}/favicon.ico` : '/favicon.ico')
    return [
      { rel: 'canonical', href: canonicalUrl.value },
      { rel: 'icon', type: 'image/x-icon', href: faviconUrl },
      { rel: 'shortcut icon', type: 'image/x-icon', href: faviconUrl },
      { rel: 'apple-touch-icon', href: faviconUrl }
    ]
  }),
  script: computed(() => {
    const scripts = []
    if (tenantConfig.value?.seo?.analytics_code) {
      scripts.push({
        innerHTML: tenantConfig.value.seo.analytics_code,
        type: 'text/javascript',
        body: true
      })
    }
    return scripts
  })
})
</script>

<template>
  <div
    :class="{ 'opacity-0': !tenant.isLoaded }"
    class="transition-opacity duration-300"
    :style="{ '--brand-primary': tenant.config.branding?.primary_color || '#2A6AB2', '--brand-blue': tenant.config.branding?.primary_color || '#2A6AB2' }"
  >
    <NuxtLayout>
      <NuxtPage :key="$route.fullPath" />
    </NuxtLayout>
  </div>
</template>

<style>
/* Critical CSS - Above the fold styles */
html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #ffffff;
  color: #334155;
}

/* Critical button styles */
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all shadow-lg;
}

.btn-secondary {
  @apply bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 px-6 rounded-full transition-all;
}
</style>
