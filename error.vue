<script setup lang="ts">
const props = defineProps({
  error: Object
})

const tenant = useTenantStore()

// error.vue не проходит через app.vue — загружаем конфиг явно
const requestURL = useRequestURL()
await useAsyncData('tenant-config', async () => {
  if (!tenant.isLoaded) {
    try {
      await tenant.fetchConfig(requestURL?.origin)
    } catch {}
  }
  return tenant.config
})

// На клиенте применяем CSS-переменную (на случай client-side навигации)
onMounted(() => {
  const color = tenant.config.branding?.primary_color
  if (color) {
    document.documentElement.style.setProperty('--brand-blue', color)
  }
})

const is404 = computed(() => props.error?.statusCode === 404)
const primaryColor = computed(() => tenant.config.branding?.primary_color || '#2A6AB2')
const siteName = computed(() => tenant.config.dealer_name || 'Сетки 21')
const phone = computed(() => tenant.config.phone || '+78352381420')
const phoneHref = computed(() => `tel:${phone.value.replace(/[^+\d]/g, '')}`)

useHead({
  title: computed(() => is404.value ? `Страница не найдена — ${siteName.value}` : `Ошибка сервера — ${siteName.value}`),
  meta: [
    ...(is404.value ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
    { name: 'description', content: computed(() => `Москитные сетки — ${siteName.value}.`) }
  ]
})

const handleError = () => clearError({ redirect: '/' })

const categories = [
  { name: 'Антикошка', path: '/antikoshka' },
  { name: 'Антимошка', path: '/antimoshka' },
  { name: 'Антипыль', path: '/antipyl' },
  { name: 'Ультравью', path: '/ultravyu' },
  { name: 'Вставные VSN', path: '/vstavnye' },
  { name: 'Ремонт', path: '/remont' },
]
</script>

<template>
  <div class="min-h-screen bg-brand-white flex items-center justify-center px-6 py-24 sm:py-32 lg:px-8 font-sans">
    <div class="text-center relative">
      <div class="absolute inset-0 -z-10 flex items-center justify-center opacity-[0.03]">
        <div class="w-96 h-96 border-[20px] rounded-full" :style="{ borderColor: primaryColor }"></div>
      </div>

      <p class="text-6xl font-black leading-none mb-4" :style="{ color: primaryColor }">
        {{ is404 ? '404' : '500' }}
      </p>
      <h1 class="mt-4 text-3xl font-black tracking-tight text-brand-dark sm:text-5xl uppercase">
        {{ is404 ? 'Страница не найдена' : 'Ошибка сервера' }}
      </h1>
      <p class="mt-6 text-base leading-7 text-gray-500 font-medium max-w-lg mx-auto">
        {{ is404 ? 'К сожалению, комар, которого мы пытались поймать, улетел вместе с этой страницей. Но наши сетки всё еще на месте!' : 'Что-то пошло не так. Попробуйте обновить страницу или вернитесь на главную.' }}
      </p>
      
      <div class="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
        <button 
          @click="handleError"
          class="rounded-2xl px-10 py-4 text-sm font-black text-white shadow-2xl transition-all active:scale-95 uppercase tracking-widest"
          :style="{ backgroundColor: primaryColor, boxShadow: `0 20px 40px -10px ${primaryColor}4d` }"
        >
          На главную
        </button>
        <a
          :href="phoneHref"
          class="text-sm font-black text-brand-dark uppercase tracking-widest transition-colors"
          :style="{ '--hover-color': primaryColor }"
          @mouseenter="($event.target as HTMLElement).style.color = primaryColor"
          @mouseleave="($event.target as HTMLElement).style.color = ''"
          @click="() => { try { (window as any).reachMetrikaGoal?.('CALL_CLICK') } catch (_) {} }"
        >
          Связаться с нами <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div class="mt-20">
        <h2 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Популярные разделы</h2>
        <div class="flex flex-wrap justify-center gap-3">
          <NuxtLink 
            v-for="cat in categories" 
            :key="cat.path"
            :to="cat.path"
            class="px-5 py-2.5 rounded-xl border-2 border-gray-100 text-[11px] font-black text-gray-400 uppercase tracking-wider transition-all"
            @mouseenter="(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = primaryColor; el.style.color = primaryColor; el.style.backgroundColor = `${primaryColor}10` }"
            @mouseleave="(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = ''; el.style.color = ''; el.style.backgroundColor = '' }"
          >
            {{ cat.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
