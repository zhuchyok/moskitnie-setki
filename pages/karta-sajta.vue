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
  <div>
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="bg-gray-50 rounded-[3rem] p-8 md:p-16 shadow-sm border border-gray-100">
          <h1 class="text-2xl md:text-3xl font-black mb-12 uppercase tracking-tight text-center leading-tight"
              :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">
            Карта сайта
          </h1>

          <div class="prose prose-blue max-w-none text-gray-600 space-y-10 font-medium text-sm md:text-base">
            <p class="text-center">
              Все разделы сайта {{ tenant.config.dealer_name || defaultDealerName }}. {{ tenant.config.city || 'Чебоксары и Новочебоксарск' }} — производство и установка москитных сеток.
            </p>

            <div class="section">
              <h2 class="text-xl font-black uppercase tracking-wider mb-4"
                  :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Разделы сайта</h2>
              <ul class="list-disc pl-6 space-y-3">
                <li v-for="page in pages" :key="page.path">
                  <NuxtLink :to="page.path" class="underline hover:opacity-80"
                            :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">
                    {{ page.name }}
                  </NuxtLink>
                  — {{ page.desc }}
                </li>
              </ul>
            </div>

            <p class="text-xs text-gray-400 italic text-center">
              Для поисковых систем: <a href="/sitemap.xml" class="underline" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }" target="_blank" rel="noopener">sitemap.xml</a>
            </p>
          </div>

          <div class="mt-16 text-center">
            <NuxtLink to="/" class="inline-flex items-center gap-2 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95"
                      :style="{ backgroundColor: tenant.config.branding?.primary_color || '#2A6AB2', boxShadow: `0 20px 50px -10px ${(tenant.config.branding?.primary_color || '#2A6AB2')}66` }">
              ← Вернуться на главную
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
