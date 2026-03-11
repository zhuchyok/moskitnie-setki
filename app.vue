<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useTenantStore } from '~/stores/tenant'
import { usePricingStore } from '~/stores/pricing'

const auth = useAuthStore()
const tenant = useTenantStore()
const pricing = usePricingStore()

// Конфиг тенанта: на SSR — по Host из запроса (чтобы фавикон/лого дилера в первом HTML), на клиенте — по текущему origin
const event = import.meta.server ? useRequestEvent() : null
const ssrOrigin = event?.node?.req?.headers?.host
  ? `${(event.node.req as any).headers['x-forwarded-proto'] === 'https' ? 'https' : 'http'}://${event.node.req.headers.host}`
  : undefined
// OG-image: от текущего origin + logo_url (аудит 2026-03-10), не хардкод www.setki21.ru
const requestURL = useRequestURL()
const siteOrigin = requestURL?.origin || ''

const { data: tenantConfig } = await useAsyncData('tenant-config', async () => {
  await tenant.fetchConfig(ssrOrigin)
  return tenant.config
})

const { data: pricingData } = await useAsyncData('pricing-config', async () => {
  await pricing.fetchPricing()
  return pricing.pricing
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
  title: computed(() => tenant.config.seo?.title || 'Москитные сетки в Чебоксарах и Новочебоксарске — Сетки 21'),
  meta: computed(() => {
    const ogImage = tenant.config.branding?.logo_url || (siteOrigin ? `${siteOrigin}/images/logo_final_v58.png` : 'https://www.setki21.ru/images/logo_final_v58.png')
    const faviconUrl = tenant.config.branding?.favicon_url || (siteOrigin ? `${siteOrigin}/favicon.ico` : '/favicon.ico')
    return [
      { name: 'description', content: tenant.config.seo?.description || '' },
      { property: 'og:title', content: tenant.config.seo?.title || '' },
      { property: 'og:description', content: tenant.config.seo?.description || '' },
      { property: 'og:image', content: ogImage },
      { name: 'twitter:image', content: ogImage }
    ]
  }),
  link: computed(() => {
    const faviconUrl = tenant.config.branding?.favicon_url || (siteOrigin ? `${siteOrigin}/favicon.ico` : '/favicon.ico')
    return [
      { rel: 'icon', type: 'image/x-icon', href: faviconUrl, dataHid: 'favicon' },
      { rel: 'shortcut icon', type: 'image/x-icon', href: faviconUrl, dataHid: 'shortcut' },
      { rel: 'apple-touch-icon', href: faviconUrl, dataHid: 'apple' }
    ]
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
