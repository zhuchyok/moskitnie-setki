<script setup lang="ts">
const store = useOrderStore()

const title = 'Карта сайта — Сетки 21'
const description = 'Все страницы сайта Сетки 21: москитные сетки, антимошка, ультравью, антикошка, антипыль, вставные сетки, ремонт. Чебоксары и Новочебоксарск.'
const url = 'https://www.setki21.ru/karta-sajta'
const image = 'https://www.setki21.ru/images/logo_final_v58.png'
const keywords = 'карта сайта, сетки 21, москитные сетки чебоксары, новочебоксарск, разделы сайта'

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description,
  url,
  publisher: { '@type': 'Organization', name: 'Сетки 21', url: 'https://www.setki21.ru' },
  inLanguage: 'ru-RU'
}

const pages = [
  { path: '/', name: 'Главная', desc: 'Рамочные москитные сетки, расчёт стоимости, заказ за 1 день' },
  { path: '/antimoshka', name: 'Антимошка', desc: 'Сетки с ячейкой 0,8×0,8 мм — защита от мошек и пуха' },
  { path: '/antikoshka', name: 'Антикошка', desc: 'Усиленные сетки для защиты от животных' },
  { path: '/ultravyu', name: 'Ультравью', desc: 'Повышенная прозрачность, защита от насекомых и пуха' },
  { path: '/antipyl', name: 'Антипыль', desc: 'Мелкая ячейка — меньше пыли и пыльцы' },
  { path: '/vstavnye', name: 'Вставная VSN', desc: 'Вставные москитные сетки в створку' },
  { path: '/remont', name: 'Ремонт', desc: 'Ремонт и замена москитных сеток' },
  { path: '/contacts', name: 'Контакты', desc: 'Адреса, телефон, режим работы' },
  { path: '/delivery', name: 'Доставка и замер', desc: 'Доставка по Чебоксарам и Новочебоксарску' },
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
  script: [{ type: 'application/ld+json', children: JSON.stringify(webPageSchema) }],
})
</script>

<template>
  <div>
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="bg-gray-50 rounded-[3rem] p-8 md:p-16 shadow-sm border border-gray-100">
          <h1 class="text-2xl md:text-3xl font-black mb-12 text-brand-blue uppercase tracking-tight text-center leading-tight">
            Карта сайта
          </h1>

          <div class="prose prose-blue max-w-none text-gray-600 space-y-10 font-medium text-sm md:text-base">
            <p class="text-center">
              Все разделы сайта Сетки 21. Чебоксары и Новочебоксарск — производство и установка москитных сеток.
            </p>

            <div class="section">
              <h2 class="text-xl font-black text-brand-blue uppercase tracking-wider mb-4">Разделы сайта</h2>
              <ul class="list-disc pl-6 space-y-3">
                <li v-for="page in pages" :key="page.path">
                  <NuxtLink :to="page.path" class="text-brand-blue underline hover:text-[#1e5a9a]">
                    {{ page.name }}
                  </NuxtLink>
                  — {{ page.desc }}
                </li>
              </ul>
            </div>

            <p class="text-xs text-gray-400 italic">
              Для поисковых систем: <a href="/sitemap.xml" class="text-brand-blue underline" target="_blank" rel="noopener">sitemap.xml</a>
            </p>
          </div>

          <div class="mt-16 text-center">
            <NuxtLink to="/" class="inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#1e5a9a] transition-all shadow-xl shadow-brand-blue/20 active:scale-95">
              ← Вернуться на главную
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
