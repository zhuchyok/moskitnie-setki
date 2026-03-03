<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useTenantStore } from '~/stores/tenant'
import { usePricingStore } from '~/stores/pricing'

const auth = useAuthStore()
const tenant = useTenantStore()
const pricing = usePricingStore()

// Инициализация при загрузке
const { data: tenantConfig } = await useAsyncData('tenant-config', async () => {
  await tenant.fetchConfig()
  return tenant.config
})

const { data: pricingData } = await useAsyncData('pricing-config', async () => {
  await pricing.fetchPricing()
  return pricing.pricing
})

onMounted(() => {
  auth.initAuth()
  // Если по какой-то причине данные не загрузились в SSR (например, локальная разработка)
  if (!tenant.isLoaded) {
    tenant.fetchConfig()
  }
  if (!pricing.pricing) {
    pricing.fetchPricing()
  }
})
useHead({
  title: computed(() => tenant.config.seo?.title || 'Москитные сетки в Чебоксарах и Новочебоксарске — Сетки 21'),
  meta: computed(() => [
    { name: 'description', content: tenant.config.seo?.description || '' },
    { property: 'og:title', content: tenant.config.seo?.title || '' },
    { property: 'og:description', content: tenant.config.seo?.description || '' },
    { property: 'og:image', content: tenant.config.branding?.logo_url || 'https://www.setki21.ru/images/logo_final_v58.png' },
    { name: 'twitter:image', content: tenant.config.branding?.logo_url || 'https://www.setki21.ru/images/logo_final_v58.png' }
  ])
})
</script>

<template>
  <div :class="{ 'opacity-0': !tenant.isLoaded }" class="transition-opacity duration-300">
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
