<script setup lang="ts">
const props = defineProps<{
  /** Current route path (without trailing slash) to exclude from list */
  exclude?: string
}>()

const services = [
  { path: '/', anchor: 'Москитные сетки в Чебоксарах и Новочебоксарске' },
  { path: '/antimoshka', anchor: 'Москитная сетка Антимошка' },
  { path: '/antikoshka', anchor: 'Москитная сетка Антикошка' },
  { path: '/antipyl', anchor: 'Москитная сетка Антипыль' },
  { path: '/vstavnye', anchor: 'Вставная москитная сетка VSN' },
  { path: '/remont', anchor: 'Ремонт москитных сеток' },
  { path: '/contacts', anchor: 'Контакты' },
  { path: '/delivery', anchor: 'Доставка и замер' },
]

const normalizedExclude = computed(() => (props.exclude || '').replace(/\/$/, '') || '/')
const filtered = computed(() => services.filter((s) => s.path !== normalizedExclude.value))
</script>

<template>
  <section class="mt-16 pt-12 border-t border-gray-200" aria-label="Другие услуги">
    <h2 class="text-xl md:text-2xl font-black mb-6 uppercase tracking-tight text-brand-dark text-center">
      Другие услуги
    </h2>
    <nav class="flex flex-wrap justify-center gap-3">
      <NuxtLink
        v-for="item in filtered"
        :key="item.path"
        :to="item.path"
        class="inline-flex items-center px-4 py-2 rounded-xl bg-gray-100 hover:bg-brand-blue hover:text-white text-sm font-bold text-gray-700 transition-colors"
      >
        {{ item.anchor }}
      </NuxtLink>
    </nav>
  </section>
</template>
