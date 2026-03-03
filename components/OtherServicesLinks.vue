<script setup lang="ts">
import { useTenantStore } from '~/stores/tenant'
const props = defineProps<{
  /** Current route path (without trailing slash) to exclude from list */
  exclude?: string
}>()

const tenant = useTenantStore()

const services = computed(() => [
  { path: '/', anchor: `Москитные сетки в ${tenant.config.city || 'Чебоксарах'}` },
  { path: '/antimoshka', anchor: `Сетка Антимошка в ${tenant.config.city}` },
  { path: '/antikoshka', anchor: `Сетка Антикошка в ${tenant.config.city}` },
  { path: '/antipyl', anchor: `Сетка Антипыль в ${tenant.config.city}` },
  { path: '/ultravyu', anchor: `Сетка Ультравью в ${tenant.config.city}` },
  { path: '/vstavnye', anchor: `Вставная сетка VSN в ${tenant.config.city}` },
  { path: '/remont', anchor: `Ремонт сеток в ${tenant.config.city}` },
  { path: '/contacts', anchor: 'Контакты' },
  { path: '/delivery', anchor: 'Доставка и замер' },
])

const normalizedExclude = computed(() => (props.exclude || '').replace(/\/$/, '') || '/')
const filtered = computed(() => services.value.filter((s) => s.path !== normalizedExclude.value))

const brandPrimary = computed(() => tenant.config.branding?.primary_color || '#2A6AB2')
</script>

<template>
  <section
    class="mt-16 pt-12 border-t border-gray-200 other-services-section"
    aria-label="Другие услуги"
    :style="{ '--brand-primary': brandPrimary }"
  >
    <h2 class="text-xl md:text-2xl font-black mb-6 uppercase tracking-tight text-gray-500 text-center">
      Другие услуги
    </h2>
    <nav class="flex flex-wrap justify-center gap-3">
      <NuxtLink
        v-for="item in filtered"
        :key="item.path"
        :to="item.path"
        class="other-services-link inline-flex items-center px-4 py-2 rounded-xl bg-gray-50 text-sm font-medium text-gray-500 border border-gray-100 transition-colors hover:text-white"
      >
        {{ item.anchor }}
      </NuxtLink>
    </nav>
  </section>
</template>

<style scoped>
.other-services-link:hover,
.other-services-link.router-link-active {
  background-color: var(--brand-primary) !important;
  border-color: var(--brand-primary) !important;
  color: white !important;
}
</style>
