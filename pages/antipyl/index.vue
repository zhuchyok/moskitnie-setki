<script setup lang="ts">
const store = useOrderStore()
onMounted(() => {
  store.updateConfig({ frameType: 'standart', type: 'antipyl', typeName: 'АНТИПЫЛЬ' })
})

const title = 'Москитная сетка Антипыль (Poll-Tex) в Чебоксарах — цены от 1400 руб'
const description = 'Сетки для аллергиков Poll-Tex в Чебоксарах и Новочебоксарске. Нейлоновое полотно притягивает пыль и пыльцу. Чистый воздух в вашем доме. Закажите расчет!'
const keywords = 'антипыль, poll-tex, москитная сетка для аллергиков, чебоксары, новочебоксарск, чистый воздух'
const url = 'https://www.setki21.ru/antipyl/'
const image = 'https://www.setki21.ru/images/logo_new.png'

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Москитная сетка Антипыль',
  description: 'Специальная сетка-фильтр для защиты от пыли и пыльцы в Чебоксарах',
  image,
  brand: { '@type': 'Brand', name: 'Сетки 21' },
  offers: {
    '@type': 'Offer',
    url,
    email: 'info@setki21.ru',
    priceCurrency: 'RUB',
    price: '1400',
    availability: 'https://schema.org/InStock'
  },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '76' }
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Для кого подходит сетка Антипыль?', acceptedAnswer: { '@type': 'Answer', text: 'Для аллергиков, жителей домов у дорог и тех, кто хочет меньше пыли в квартире. Полотно Poll-Tex задерживает до 90% пыльцы и уличной пыли благодаря электростатическому эффекту.' } },
    { '@type': 'Question', name: 'Как часто нужно мыть сетку Антипыль?', acceptedAnswer: { '@type': 'Answer', text: 'Рекомендуем промывать под душем 1–2 раза в сезон или по мере загрязнения. Нейлоновое полотно легко очищается, подоконники остаются чище в 3 раза дольше.' } },
    { '@type': 'Question', name: 'Чем Антипыль отличается от обычной москитной сетки?', acceptedAnswer: { '@type': 'Answer', text: 'Обычная сетка задерживает насекомых и крупный мусор. Антипыль (Poll-Tex) дополнительно притягивает мелкую пыль и пыльцу за счёт электростатики — это фильтр для воздуха в окно.' } }
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
  { q: 'Для кого подходит сетка Антипыль?', a: 'Для аллергиков, жителей домов у дорог и тех, кто хочет меньше пыли в квартире. Полотно Poll-Tex задерживает до 90% пыльцы и уличной пыли благодаря электростатическому эффекту.' },
  { q: 'Как часто нужно мыть сетку Антипыль?', a: 'Рекомендуем промывать под душем 1–2 раза в сезон или по мере загрязнения. Нейлоновое полотно легко очищается, подоконники остаются чище в 3 раза дольше.' },
  { q: 'Чем Антипыль отличается от обычной москитной сетки?', a: 'Обычная сетка задерживает насекомых и крупный мусор. Антипыль (Poll-Tex) дополнительно притягивает мелкую пыль и пыльцу за счёт электростатики — это фильтр для воздуха в окно.' }
]
</script>

<template>
  <div>
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-12 items-center mb-16">
          <div class="lg:w-1/2">
            <h1 class="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase tracking-tight">
              Сетка <span class="text-brand-blue">Антипыль</span> — Poll-Tex
            </h1>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed font-medium text-justify">
              Сетка Антипыль в Чебоксарах и Новочебоксарске от 1400 ₽, за 3 дня. Идеально для аллергиков и жителей домов у дорог — полотно Poll-Tex задерживает пыль, копоть и пыльцу благодаря электростатическому эффекту.
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p class="font-black text-brand-blue text-2xl mb-1">Poll-Tex</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Нейлоновое полотно</p>
              </div>
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p class="font-black text-brand-blue text-2xl mb-1">90%</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Защита от пыльцы</p>
              </div>
            </div>
          </div>
          <div class="lg:w-1/2 relative">
            <HeroImage src="/upload/iblock/e09/e09007396221ccbae983f19a970e4be5.png" webp-src="/images/optimized/e09/e09007396221ccbae983f19a970e4be5.webp" alt="Москитная сетка Антипыль Poll-Tex для аллергиков в Чебоксарах" class="rounded-[3rem] shadow-2xl border-4 border-white" :width="600" :height="400" loading="lazy" />
            <div class="hidden lg:block absolute -top-6 -left-6 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 transform -rotate-3">
              <p class="text-brand-blue font-black text-xl leading-none italic uppercase">Pure Air</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase mt-1">Фильтрация 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-12">
      <div class="container mx-auto px-4 text-center mb-8">
        <h2 class="text-3xl font-black mb-2 uppercase tracking-tight text-brand-dark">Расчет Антипыли</h2>
        <p class="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Металлические крепления в комплекте!</p>
      </div>
      <Calculator />
    </section>

    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
          <div class="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div class="relative group">
              <video controls muted playsinline preload="metadata" class="rounded-3xl shadow-lg w-full" title="Как замерить окно для москитной сетки Антипыль">
                <source src="/zamer.mp4" type="video/mp4">
                Ваш браузер не поддерживает видео.
              </video>
            </div>
            <div class="order-1 md:order-2">
              <h2 class="text-3xl font-black mb-6 uppercase tracking-tight">Как это работает?</h2>
              <p class="text-gray-600 mb-6 leading-relaxed italic border-l-4 border-brand-blue pl-6 bg-blue-50/30 py-4 rounded-r-2xl font-medium text-justify">
                "Нейлоновые нити полотна обладают электростатическим эффектом, буквально притягивая к себе частицы пыли и не давая им попасть в комнату."
              </p>
              <p class="text-gray-600 leading-relaxed font-medium text-justify">
                Сетка Антипыль (Poll-Tex) — это самый оптимальный способ обезопасить себя и своих близких от уличной пыли и пыльцы растений, что особенно важно для людей с аллергией. Подоконники остаются чистыми в 3 раза дольше.
              </p>
            </div>
          </div>

          <div class="bg-brand-dark rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div class="relative z-10">
              <h2 class="text-3xl font-black mb-12 uppercase tracking-widest text-center text-white">Преимущества Poll-Tex</h2>
              <div class="grid md:grid-cols-3 gap-12">
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">01</div>
                  <h4 class="font-bold text-lg mb-4 uppercase tracking-wider">Чистота</h4>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium">Блокирует до 90% пыльцы березы, злаковых и других аллергенов.</p>
                </div>
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">02</div>
                  <h4 class="font-bold text-lg mb-4 uppercase tracking-wider">Легкий уход</h4>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium">Достаточно просто промыть сетку под душем, чтобы смыть накопившуюся пыль.</p>
                </div>
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">03</div>
                  <h4 class="font-bold text-lg mb-4 uppercase tracking-wider">Защита</h4>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium">Помогает задержать тополиный пух и уличную копоть от дорог.</p>
                </div>
              </div>
            </div>
            <div class="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-blue/10 rounded-full blur-[100px] -mr-[20rem] -mt-[20rem]"></div>
          </div>
          <SeoTextBlock title="Сетка Антипыль в Чебоксарах и Новочебоксарске" class="mt-20">
            <p>
              Сетка <strong>Антипыль</strong> (Poll-Tex) в Чебоксарах и Новочебоксарске подойдёт аллергикам и жителям домов у дорог: нейлоновое полотно задерживает пыльцу и уличную пыль. Заказать расчёт можно на <NuxtLink to="/" class="text-brand-blue underline font-bold">главной странице</NuxtLink> — укажите размеры и выберите тип «Антипыль». Цена от 1400 ₽, металлический крепёж в комплекте, изготовление за 3 дня.
            </p>
            <p>
              В каталоге Сетки 21: <NuxtLink to="/antimoshka" class="text-brand-blue underline font-bold">Антимошка</NuxtLink>, <NuxtLink to="/ultravyu" class="text-brand-blue underline font-bold">Ультравью</NuxtLink>, <NuxtLink to="/antikoshka" class="text-brand-blue underline font-bold">Антикошка</NuxtLink>, <NuxtLink to="/vstavnye" class="text-brand-blue underline font-bold">вставные VSN</NuxtLink> и <NuxtLink to="/remont" class="text-brand-blue underline font-bold">ремонт сеток</NuxtLink>. Доставка и самовывоз по Чебоксарам и Новочебоксарску.
            </p>
            <p>
              Сетка Антипыль (Poll-Tex) снижает количество пыли и пыльцы в помещении за счёт электростатического эффекта нейлонового полотна. Рекомендуем аллергикам и жителям домов у дорог в Чебоксарах и Новочебоксарске. Промывка 1–2 раза в сезон — полотно легко чистится под душем.
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
