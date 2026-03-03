<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useTenantStore } from '~/stores/tenant'
import { usePricingStore } from '~/stores/pricing'

const auth = useAuthStore()
const tenant = useTenantStore()
const pricing = usePricingStore()

// Инициализация при загрузке: не блокируем первый рендер (при холодном старте API первый запрос может не успеть)
onMounted(() => {
  auth.initAuth()
  Promise.all([
    tenant.fetchConfig(),
    pricing.fetchPricing()
  ]).catch(() => {}).then(() => {
    // Повторная попытка через 2 с, если API ещё не проснулся (Docker/VDS cold start)
    if (!pricing.pricing) {
      setTimeout(() => pricing.fetchPricing(), 2000)
    }
  })
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage :key="$route.fullPath" />
  </NuxtLayout>
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
