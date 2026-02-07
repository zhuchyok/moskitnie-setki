<script setup lang="ts">
const store = useOrderStore()
onMounted(() => {
  store.updateConfig({ frameType: 'standart', type: 'antimoshka', typeName: 'АНТИМОШКА' })
})

const title = 'Москитная сетка Антимошка в Чебоксарах — цены от 1000 руб'
const description = 'Сетки Антимошка с уменьшенной ячейкой 0.8х0.8 мм. Защита от мелких насекомых и тополиного пуха в Чебоксарах и Новочебоксарске.'
const keywords = 'антимошка, микромеш, москитная сетка, чебоксары, новочебоксарск, защита от мошек'
const url = 'https://www.setki21.ru/antimoshka/'
const image = 'https://www.setki21.ru/images/logo_new.png'

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Москитная сетка Антимошка',
  description: 'Эффективная москитная сетка для защиты от комаров и мошек в Чебоксарах и Новочебоксарске',
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
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '94' }
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Чем Антимошка отличается от обычной сетки?', acceptedAnswer: { '@type': 'Answer', text: 'У Антимошки ячейка 0,8×0,8 мм — в 2 раза мельче обычной (1,2×1,2 мм). Она задерживает мелких мошек, гнус и тополиный пух, которые проходят через стандартную сетку.' } },
    { '@type': 'Question', name: 'Какая ячейка у сетки Антимошка?', acceptedAnswer: { '@type': 'Answer', text: 'Полотно Micro Mesh с размером ячейки 0,8×0,8 мм. Прозрачность около 50%, воздух проходит свободно.' } },
    { '@type': 'Question', name: 'Подойдёт ли Антимошка для балконной двери?', acceptedAnswer: { '@type': 'Answer', text: 'Да. Изготавливаем Антимошку любых размеров под створки окон и балконных дверей в Чебоксарах и Новочебоксарске. Цена от 1000 ₽, металлический крепёж в комплекте.' } }
  ]
}

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ],
  link: [{ rel: 'canonical', href: url }],
  script: [
    { type: 'application/ld+json', children: JSON.stringify(productSchema) },
    { type: 'application/ld+json', children: JSON.stringify(faqSchema) }
  ]
})

const openFaq = ref<number | null>(null)
const faqItems = [
  { q: 'Чем Антимошка отличается от обычной сетки?', a: 'У Антимошки ячейка 0,8×0,8 мм — в 2 раза мельче обычной (1,2×1,2 мм). Она задерживает мелких мошек, гнус и тополиный пух, которые проходят через стандартную сетку.' },
  { q: 'Какая ячейка у сетки Антимошка?', a: 'Полотно Micro Mesh с размером ячейки 0,8×0,8 мм. Прозрачность около 50%, воздух проходит свободно.' },
  { q: 'Подойдёт ли Антимошка для балконной двери?', a: 'Да. Изготавливаем Антимошку любых размеров под створки окон и балконных дверей в Чебоксарах и Новочебоксарске. Цена от 1000 ₽, металлический крепёж в комплекте.' }
]
</script>

<template>
  <div>
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-12 items-center mb-16">
          <div class="lg:w-1/2">
            <h1 class="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase tracking-tight">
              Сетка <span class="text-brand-blue">Антимошка</span> — Micro Mesh
            </h1>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed font-medium text-justify">
              Сетка Антимошка в Чебоксарах и Новочебоксарске от 1000 ₽, за 2 дня. Мелкая ячейка 0,8×0,8 мм защищает от насекомых, тополиного пуха и мошек — уникальная москитная сетка для дверей и окон.
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p class="font-black text-brand-blue text-2xl mb-1">Micro Mesh</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Ячейка 0.8х0.8 мм</p>
              </div>
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p class="font-black text-brand-blue text-2xl mb-1">50%</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Прозрачность</p>
              </div>
            </div>
          </div>
          <div class="lg:w-1/2 relative">
            <HeroImage
              src="/upload/iblock/e09/e09007396221ccbae983f19a970e4be5.png"
              webp-src="/images/optimized/e09/e09007396221ccbae983f19a970e4be5.webp"
              alt="Москитная сетка Антимошка с мелкой ячейкой 0.8×0.8 мм в Чебоксарах"
              class="rounded-[3rem] shadow-2xl border-4 border-white"
              :width="600"
              :height="400"
              loading="lazy"
            />
            <div class="hidden lg:block absolute -top-6 -left-6 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 transform -rotate-3">
              <p class="text-brand-blue font-black text-xl leading-none italic uppercase">Extra Protection</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase mt-1">От мелкого гнуса</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-12">
      <div class="container mx-auto px-4 text-center mb-8">
        <h2 class="text-3xl font-black mb-2 uppercase tracking-tight text-brand-dark">Расчет Антимошки</h2>
        <p class="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Металлические крепления в комплекте!</p>
      </div>
      <Calculator />
    </section>

    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
          <div class="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div class="relative group">
              <video controls muted playsinline preload="metadata" class="rounded-3xl shadow-lg w-full" title="Как замерить окно для москитной сетки Антимошка">
                <source src="/zamer.mp4" type="video/mp4">
                Ваш браузер не поддерживает видео.
              </video>
            </div>
            <div class="order-1 md:order-2">
              <h2 class="text-3xl font-black mb-6 uppercase tracking-tight">Технология Micro Mesh</h2>
              <p class="text-gray-600 mb-6 leading-relaxed italic border-l-4 border-brand-blue pl-6 bg-blue-50/30 py-4 rounded-r-2xl font-medium text-justify">
                "Полотна Micro Mesh изготавливают из нейлона и стекловолокна. Конструкция выходит прочной, надежной и не мешает воздухообмену."
              </p>
              <p class="text-gray-600 leading-relaxed font-medium text-justify">
                Прозрачность данного полотна ровна 50%, а прочность 70 %. Полотно «Антимошка» отлично подойдет для загородных домов, коттеджей, городских квартир, веранд. При нагревании не выделяет токсины.
              </p>
            </div>
          </div>

          <div class="bg-brand-dark rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div class="relative z-10">
              <h2 class="text-3xl font-black mb-12 uppercase tracking-widest text-center">Плюсы Антимошки</h2>
              <div class="grid md:grid-cols-2 gap-12">
                <div class="flex gap-6">
                  <div class="text-brand-blue text-5xl font-black opacity-50">01</div>
                  <div>
                    <h4 class="font-bold text-lg mb-2 uppercase tracking-wider">Защита</h4>
                    <p class="text-gray-400 text-sm leading-relaxed font-medium">Предотвращает проникновение мошек, жуков, защищает от листьев и грязи с дорог.</p>
                  </div>
                </div>
                <div class="flex gap-6">
                  <div class="text-brand-blue text-5xl font-black opacity-50">02</div>
                  <div>
                    <h4 class="font-bold text-lg mb-2 uppercase tracking-wider">Комфорт</h4>
                    <p class="text-gray-400 text-sm leading-relaxed font-medium">Легко очищается, сдерживает солнечные лучи, обеспечивая фильтрацию света.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-blue/10 rounded-full blur-[100px] -mr-[20rem] -mt-[20rem]"></div>
          </div>
          <SeoTextBlock title="Сетка Антимошка в Чебоксарах и Новочебоксарске" class="mt-20">
            <p>
              Заказать москитную сетку <strong>Антимошка</strong> в Чебоксарах и Новочебоксарске можно на нашем сайте: укажите размеры створки в <NuxtLink to="/" class="text-brand-blue underline font-bold">калькуляторе</NuxtLink> и получите расчёт за минуту. Мы изготавливаем сетки с полотном Micro Mesh (ячейка 0,8×0,8 мм) для окон и балконных дверей — защита от комаров, мошек и тополиного пуха при сохранении вентиляции.
            </p>
            <p>
              Помимо Антимошки, в Чебоксарах и Новочебоксарске доступны <NuxtLink to="/ultravyu" class="text-brand-blue underline font-bold">Ультравью</NuxtLink> (прозрачность и защита), <NuxtLink to="/antikoshka" class="text-brand-blue underline font-bold">сетки Антикошка</NuxtLink> (для питомцев), <NuxtLink to="/antipyl" class="text-brand-blue underline font-bold">Антипыль</NuxtLink> (для аллергиков) и <NuxtLink to="/vstavnye" class="text-brand-blue underline font-bold">вставные сетки VSN</NuxtLink> без сверления. Замер, производство и установка — за 2 дня.
            </p>
            <p>
              Для кого подходит Антимошка: дачи и квартиры у парков (защита от тополиного пуха и гнуса), балконы и лоджии. Полотно Micro Mesh не выгорает на солнце, легко моется. Заказать москитную сетку Антимошка в Чебоксарах и Новочебоксарске можно с доставкой или самовывозом из офисов.
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
