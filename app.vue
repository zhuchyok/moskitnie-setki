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
// Принудительно используем https для канонических URL и ссылок на продакшене
const ssrProto = (headers?.['x-forwarded-proto'] as string) || (process.env.NODE_ENV === 'production' ? 'https' : 'http')
const ssrOrigin = ssrHost ? `${ssrProto}://${ssrHost}` : undefined

      // OG-image и Canonical: от текущего origin (аудит 2026-03-10), не хардкод www.setki21.ru
const requestURL = useRequestURL()
const siteOrigin = (import.meta.server && ssrOrigin) ? ssrOrigin : (requestURL?.origin || '')

// Исправляем протокол в siteOrigin, если он http на продакшене
const finalSiteOrigin = computed(() => {
  if (process.env.NODE_ENV === 'production' && siteOrigin.startsWith('http://')) {
    return siteOrigin.replace('http://', 'https://')
  }
  return siteOrigin
})

const { data: tenantConfig } = await useAsyncData('tenant-config', async () => {
  try {
    await tenant.fetchConfig(ssrOrigin)
  } catch {}
  return tenant.config
})

const { data: pricingData } = await useAsyncData('pricing-config', async () => {
  try {
    await pricing.fetchPricing()
  } catch {}
  return pricing.pricing
})

// Вычисляем канонический URL для текущей страницы
const canonicalUrl = computed(() => {
  const origin = finalSiteOrigin.value || 'https://www.setki21.ru'
  const path = route.path.replace(/\/$/, '') || '/'
  return `${origin}${path}${path === '/' ? '' : '/'}`
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

const pageTitle = computed(() => tenantConfig.value?.seo?.title || 'Москитные сетки в Чебоксарах и Новочебоксарске — Сетки 21')
const pageDescription = computed(() => tenantConfig.value?.seo?.description || 'Производство и установка москитных сеток. Замер за 1 день, металлические крепления в комплекте. Закажите онлайн!')
const ogImage = computed(() => tenantConfig.value?.branding?.logo_url || (siteOrigin ? `${siteOrigin}/images/logo_final_v58.png` : 'https://www.setki21.ru/images/logo_final_v58.png'))
const faviconUrl = computed(() => tenantConfig.value?.branding?.favicon_url || (siteOrigin ? `${siteOrigin}/api/v1/tenant/favicon` : '/api/v1/tenant/favicon'))

const yandexVerification = computed(() => tenantConfig.value?.seo?.verification_tag)
const analyticsCode = computed(() => tenantConfig.value?.seo?.analytics_code)

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:image', content: ogImage },
    { property: 'og:url', content: canonicalUrl },
    { name: 'twitter:image', content: ogImage },
    { name: 'robots', content: 'index, follow' },
    { name: 'yandex-verification', content: yandexVerification },
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl, key: 'canonical' },
  ],
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
