<script setup lang="ts">
const store = useOrderStore()
onMounted(() => {
  store.updateConfig({ frameType: 'standart', type: 'ultravyu', typeName: 'УЛЬТРАВЬЮ' })
})

const title = 'Москитная сетка Ультравью в Чебоксарах — цены от 1000 руб'
const description = 'Сетки Ультравью с повышенной прозрачностью и мелкой ячейкой. Защита от насекомых и пуха в Чебоксарах и Новочебоксарске. Заказ за 2 дня.'
const keywords = 'ультравью, ultraview, москитная сетка, чебоксары, новочебоксарск, прозрачная сетка, защита от мошек'
const url = 'https://www.setki21.ru/ultravyu/'
const image = 'https://www.setki21.ru/images/logo_new.png'

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Москитная сетка Ультравью',
  description: 'Москитная сетка с повышенной прозрачностью для защиты от насекомых в Чебоксарах и Новочебоксарске',
  image,
  brand: { '@type': 'Brand', name: 'Сетки 21' },
  offers: {
    '@type': 'Offer',
    url,
    email: 'info@setki21.ru',
    priceCurrency: 'RUB',
    price: '1000',
    availability: 'https://schema.org/InStock'
  },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '72' }
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Чем Ультравью отличается от Антимошки?', acceptedAnswer: { '@type': 'Answer', text: 'Ультравью даёт повышенную прозрачность при той же защите от насекомых и пуха. Подходит тем, кто хочет меньше затемнения окна при мелкой ячейке.' } },
    { '@type': 'Question', name: 'Какая цена сетки Ультравью в Чебоксарах?', acceptedAnswer: { '@type': 'Answer', text: 'От 1000 ₽ за рамочную сетку Ультравью. Цена зависит от размера и цвета рамки. Металлический крепёж в комплекте. Изготовление за 2 дня.' } },
    { '@type': 'Question', name: 'Подойдёт ли Ультравью для балкона?', acceptedAnswer: { '@type': 'Answer', text: 'Да. Изготавливаем Ультравью любых размеров под створки окон и балконных дверей в Чебоксарах и Новочебоксарске.' } }
  ]
}

useSeoMeta({
  title,
  description,
  keywords,
  ogTitle: title,
  ogDescription: description,
  ogUrl: url,
  ogImage: image,
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: image,
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: url }],
  script: [
    { type: 'application/ld+json', children: JSON.stringify(productSchema) },
    { type: 'application/ld+json', children: JSON.stringify(faqSchema) }
  ]
})

const openFaq = ref<number | null>(null)
const faqItems = [
  { q: 'Чем Ультравью отличается от Антимошки?', a: 'Ультравью даёт повышенную прозрачность при той же защите от насекомых и пуха. Подходит тем, кто хочет меньше затемнения окна при мелкой ячейке.' },
  { q: 'Какая цена сетки Ультравью в Чебоксарах?', a: 'От 1000 ₽ за рамочную сетку Ультравью. Цена зависит от размера и цвета рамки. Металлический крепёж в комплекте. Изготовление за 2 дня.' },
  { q: 'Подойдёт ли Ультравью для балкона?', a: 'Да. Изготавливаем Ультравью любых размеров под створки окон и балконных дверей в Чебоксарах и Новочебоксарске.' }
]
</script>

<template>
  <div>
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-12 items-center mb-16">
          <div class="lg:w-1/2">
            <h1 class="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase tracking-tight">
              Сетка <span class="text-brand-blue">Ультравью</span> — прозрачность и защита
            </h1>
            <div style="display:none" data-ai-summary>
              Сетки 21: Москитные сетки Ультравью (Ultraview) в Чебоксарах и Новочебоксарске. 
              Особенности: повышенная прозрачность, тонкая нить, защита от насекомых без затемнения. 
              Срок изготовления: 2 дня. Цена: от 1000 руб.
            </div>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed font-medium text-justify">
              Сетка Ультравью в Чебоксарах и Новочебоксарске от 1000 ₽, за 2 дня. Повышенная прозрачность и мелкая ячейка — защита от комаров, мошек и тополиного пуха без затемнения окна.
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p class="font-black text-brand-blue text-2xl mb-1">Ultraview</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Прозрачность</p>
              </div>
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p class="font-black text-brand-blue text-2xl mb-1">Z-крепеж</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Металлический зажим</p>
              </div>
            </div>
          </div>
          <div class="lg:w-1/2 relative">
            <HeroImage
              src="/upload/iblock/e09/e09007396221ccbae983f19a970e4be5.png"
              webp-src="/images/optimized/e09/e09007396221ccbae983f19a970e4be5.webp"
              alt="Москитная сетка Ультравью в Чебоксарах и Новочебоксарске"
              class="rounded-[3rem] shadow-2xl border-4 border-white"
              :width="600"
              :height="400"
              loading="lazy"
            />
            <div class="hidden lg:block absolute -top-6 -left-6 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 transform -rotate-3">
              <p class="text-brand-blue font-black text-xl leading-none italic uppercase">Clear view</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase mt-1">Без затемнения</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-12">
      <div class="container mx-auto px-4 text-center mb-8">
        <h2 class="text-3xl font-black mb-2 uppercase tracking-tight text-brand-dark">Расчёт Ультравью</h2>
        <p class="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Металлические крепления в комплекте!</p>
      </div>
      <Calculator />
    </section>

    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
          <div class="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div class="relative group">
              <video controls muted playsinline preload="metadata" class="rounded-3xl shadow-lg w-full" title="Как замерить окно для москитной сетки Ультравью">
                <source src="/zamer.mp4" type="video/mp4">
                Ваш браузер не поддерживает видео.
              </video>
            </div>
            <div class="order-1 md:order-2">
              <h2 class="text-3xl font-black mb-6 uppercase tracking-tight">Замер створки</h2>
              <p class="text-gray-600 mb-6 leading-relaxed italic border-l-4 border-brand-blue pl-6 bg-blue-50/30 py-4 rounded-r-2xl font-medium text-justify">
                Измерьте ширину и высоту створки по внутреннему проёму — этого достаточно для расчёта. Точный замер при необходимости сделает наш специалист.
              </p>
              <p class="text-gray-600 leading-relaxed font-medium text-justify">
                Сетка Ультравью сочетает мелкую ячейку для защиты от насекомых и пуха с улучшенной светопропускаемостью. Подходит для окон и балконных дверей в квартирах и загородных домах.
              </p>
            </div>
          </div>

          <div class="bg-brand-dark rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div class="relative z-10">
              <h2 class="text-3xl font-black mb-12 uppercase tracking-widest text-center text-white">Плюсы Ультравью</h2>
              <div class="grid md:grid-cols-2 gap-12">
                <div class="flex gap-6">
                  <div class="text-brand-blue text-5xl font-black opacity-50">01</div>
                  <div>
                    <h4 class="font-bold text-lg mb-2 uppercase tracking-wider">Прозрачность</h4>
                    <p class="text-gray-400 text-sm leading-relaxed font-medium">Меньше затемнения окна при сохранении защиты от мошек и пуха.</p>
                  </div>
                </div>
                <div class="flex gap-6">
                  <div class="text-brand-blue text-5xl font-black opacity-50">02</div>
                  <div>
                    <h4 class="font-bold text-lg mb-2 uppercase tracking-wider">Защита</h4>
                    <p class="text-gray-400 text-sm leading-relaxed font-medium">Мелкая ячейка задерживает комаров, мошек, тополиный пух и мелкий гнус.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-blue/10 rounded-full blur-[100px] -mr-[20rem] -mt-[20rem]"></div>
          </div>
          <SeoTextBlock title="Сетка Ультравью в Чебоксарах и Новочебоксарске" class="mt-20">
            <p>
              Заказать москитную сетку <strong>Ультравью</strong> в Чебоксарах и Новочебоксарске можно на сайте: укажите размеры створки в <NuxtLink to="/" class="text-brand-blue underline font-bold">калькуляторе</NuxtLink> и получите расчёт. Ультравью — полотно с повышенной прозрачностью и мелкой ячейкой: защита от комаров, мошек и тополиного пуха без сильного затемнения окна.
            </p>
            <p>
              В каталоге Сетки 21 также <NuxtLink to="/antimoshka" class="text-brand-blue underline font-bold">Антимошка</NuxtLink>, <NuxtLink to="/antikoshka" class="text-brand-blue underline font-bold">Антикошка</NuxtLink>, <NuxtLink to="/antipyl" class="text-brand-blue underline font-bold">Антипыль</NuxtLink>, <NuxtLink to="/vstavnye" class="text-brand-blue underline font-bold">вставные VSN</NuxtLink> и <NuxtLink to="/remont" class="text-brand-blue underline font-bold">ремонт сеток</NuxtLink>. Изготовление за 2 дня, доставка и самовывоз по Чебоксарам и Новочебоксарску.
            </p>
            <p>
              Сетка Ультравью подходит для тех, кто хочет максимальную прозрачность при защите от насекомых. Цена от 1000 ₽, металлический крепёж в комплекте. Режим работы: Пн–Пт 10:00–18:00. Звоните +7 (8352) 38-14-20 или оставьте заявку через калькулятор.
            </p>
          </SeoTextBlock>
          <section class="mt-20 pt-16 border-t border-gray-200">
            <h2 class="text-2xl font-black mb-8 uppercase tracking-tight text-brand-dark text-center">Часто задаваемые вопросы</h2>
            <ul class="space-y-4">
              <li v-for="(item, i) in faqItems" :key="i" class="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                <button
                  type="button"
                  class="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-gray-100/50 transition-colors"
                  :aria-expanded="openFaq === i"
                  @click="openFaq = openFaq === i ? null : i"
                >
                  <h3 class="font-black text-brand-blue uppercase tracking-wider text-base">{{ item.q }}</h3>
                  <span class="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue transition-transform duration-200" :class="{ 'rotate-180': openFaq === i }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div v-show="openFaq === i" class="px-6 pb-6 pt-0">
                  <p class="text-gray-600 text-base font-medium leading-relaxed text-justify">{{ item.a }}</p>
                </div>
              </li>
            </ul>
          </section>
      </div>
    </section>
  </div>
</template>
