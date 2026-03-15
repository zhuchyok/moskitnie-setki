<script setup lang="ts">
const tenant = useTenantStore()
const defaultDealerName = computed(() => tenant.config.city?.includes('Чебоксары') ? 'Сетки 21' : 'Сетки Москитки')

const requestURL = useRequestURL()
const origin = requestURL?.origin || 'https://www.setki21.ru'
const title = computed(() => `Карта сайта — ${tenant.config.dealer_name || defaultDealerName.value}`)
const description = computed(() => `Все страницы сайта ${tenant.config.dealer_name || defaultDealerName.value}: москитные сетки, антимошка, ультравью, антикошка, антипыль, вставные сетки, ремонт. ${tenant.config.city || 'Чебоксары и Новочебоксарск'}.`)
const url = `${origin}/karta-sajta`
const image = computed(() => tenant.config.branding?.logo_url || (requestURL?.origin ? `${requestURL.origin}/images/logo_final_v58.png` : 'https://www.setki21.ru/images/logo_final_v58.png'))
const keywords = computed(() => `карта сайта, ${tenant.config.dealer_name || defaultDealerName.value}, москитные сетки ${tenant.config.city || 'чебоксары'}, разделы сайта`)

const webPageSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title.value,
  description: description.value,
  url,
  publisher: { '@type': 'Organization', name: tenant.config.dealer_name || defaultDealerName.value, url: origin },
  inLanguage: 'ru-RU'
}))

const pages = [
  { path: '/', name: 'Главная', desc: 'Рамочные москитные сетки, расчёт стоимости, заказ за 1 день' },
  { path: '/antimoshka', name: 'Антимошка', desc: 'Сетки с ячейкой 0,8×0,8 мм — защита от мошек и пуха' },
  { path: '/antikoshka', name: 'Антикошка', desc: 'Усиленные сетки для защиты от животных' },
  { path: '/ultravyu', name: 'Ультравью', desc: 'Повышенная прозрачность, защита от насекомых и пуха' },
  { path: '/antipyl', name: 'Антипыль', desc: 'Мелкая ячейка — меньше пыли и пыльцы' },
  { path: '/vstavnye', name: 'Вставная VSN', desc: 'Вставные москитные сетки в створку' },
  { path: '/remont', name: 'Ремонт', desc: 'Ремонт и замена москитных сеток' },
  { path: '/contacts', name: 'Контакты', desc: 'Адреса, телефон, режим работы' },
  { path: '/delivery', name: 'Доставка и замер', desc: `Доставка по ${tenant.config.city || 'Чебоксарам и Новочебоксарску'}` },
  { path: '/privacy', name: 'Политика конфиденциальности', desc: 'Обработка персональных данных' },
]

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ],
  link: [{ rel: 'canonical', href: url }],
  script: [{ type: 'application/ld+json', children: computed(() => JSON.stringify(webPageSchema.value)) }],
})
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20">
    <!-- Hero Section -->
    <section class="bg-brand-dark text-white py-20 relative overflow-hidden">
      <div class="container mx-auto px-4 relative z-10 text-center">
        <h1 class="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter text-white">
          Карта <span :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">сайта</span>
        </h1>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Удобная навигация по всем разделам и услугам компании {{ tenant.config.dealer_name || defaultDealerName }}.
        </p>
      </div>
      <div class="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-blue/10 rounded-full blur-[120px] -mr-[20rem] -mt-[20rem]"></div>
    </section>

    <div class="container mx-auto px-4 -mt-10 relative z-20">
      <div class="bg-white p-10 md:p-16 rounded-[3rem] shadow-xl border border-gray-100">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink v-for="page in pages" :key="page.path" :to="page.path"
                    class="group p-8 rounded-[2rem] border border-gray-50 bg-gray-50/30 hover:bg-white hover:shadow-2xl hover:border-transparent transition-all duration-500 flex flex-col h-full">
            <h3 class="text-xl font-black text-brand-dark mb-4 uppercase tracking-tight group-hover:text-brand-blue transition-colors"
                :style="{ '--hover-color': tenant.config.branding?.primary_color || '#2A6AB2' }">
              {{ page.name }}
            </h3>
            <p class="text-gray-500 font-medium text-sm leading-relaxed flex-grow">
              {{ page.desc }}
            </p>
            <div class="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-brand-blue transition-colors"
                 :style="{ '--hover-color': tenant.config.branding?.primary_color || '#2A6AB2' }">
              Перейти
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </NuxtLink>
        </div>

        <div class="mt-16 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Технический файл: <a href="/sitemap.xml" class="underline hover:text-brand-dark transition-colors" target="_blank" rel="noopener">sitemap.xml</a>
          </p>
          <NuxtLink to="/" class="inline-flex items-center gap-3 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 hover:opacity-90"
                    :style="{ backgroundColor: tenant.config.branding?.primary_color || '#2A6AB2', boxShadow: `0 20px 50px -10px ${(tenant.config.branding?.primary_color || '#2A6AB2')}66` }">
            ← На главную
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
