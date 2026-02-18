<script setup lang="ts">
const store = useOrderStore()
onMounted(() => {
  store.updateConfig({ frameType: 'vstavnaya', type: 'standart', typeName: 'СТАНДАРТ' })
})

const title = 'Вставные москитные сетки VSN в Чебоксарах — цены от 1450 руб'
const description = 'Инновационные вставные сетки VSN в Чебоксарах. Не требуют сверления рамы, устанавливаются изнутри. Надежно, эстетично, безопасно. Закажите онлайн!'
const keywords = 'вставная сетка, vsn, москитная сетка без сверления, чебоксары, новочебоксарск, внутренняя сетка'
const url = 'https://www.setki21.ru/vstavnye/'
const image = 'https://www.setki21.ru/images/logo_new.png'

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Вставная москитная сетка VSN',
  description: 'Москитная сетка внутреннего монтажа без сверления рамы',
  image,
  brand: { '@type': 'Brand', name: 'Сетки 21' },
  offers: {
    '@type': 'Offer',
    url,
    email: 'info@setki21.ru',
    priceCurrency: 'RUB',
    price: '1450',
    availability: 'https://schema.org/InStock'
  },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '82' }
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Нужно ли сверлить раму для вставной сетки VSN?', acceptedAnswer: { '@type': 'Answer', text: 'Нет. Сетки VSN устанавливаются в световой проём изнутри помещения без сверления. Никаких отверстий в раме — идеальный вариант для тех, кто не хочет нарушать целостность окна.' } },
    { '@type': 'Question', name: 'Можно ли ставить VSN на деревянные окна?', acceptedAnswer: { '@type': 'Answer', text: 'Да. Вставные сетки VSN подходят для пластиковых и деревянных окон. Монтаж изнутри, без сверления. Изготавливаем по размерам в Чебоксарах и Новочебоксарске.' } },
    { '@type': 'Question', name: 'Чем крепится вставная сетка изнутри?', acceptedAnswer: { '@type': 'Answer', text: 'Сетка фиксируется в проёме рамы специальным крепежом изнутри помещения. Риск выпадения наружу отсутствует, прилегание плотное, вид аккуратный.' } }
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
  { q: 'Нужно ли сверлить раму для вставной сетки VSN?', a: 'Нет. Сетки VSN устанавливаются в световой проём изнутри помещения без сверления. Никаких отверстий в раме — идеальный вариант для тех, кто не хочет нарушать целостность окна.' },
  { q: 'Можно ли ставить VSN на деревянные окна?', a: 'Да. Вставные сетки VSN подходят для пластиковых и деревянных окон. Монтаж изнутри, без сверления. Изготавливаем по размерам в Чебоксарах и Новочебоксарске.' },
  { q: 'Чем крепится вставная сетка изнутри?', a: 'Сетка фиксируется в проёме рамы специальным крепежом изнутри помещения. Риск выпадения наружу отсутствует, прилегание плотное, вид аккуратный.' }
]
</script>

<template>
  <div>
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-12 items-center mb-16">
          <div class="lg:w-1/2">
            <h1 class="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase tracking-tight">
              Вставные сетки <span class="text-brand-blue">VSN</span> — без сверления
            </h1>
            <div style="display:none" data-ai-summary>
              Сетки 21: Вставные москитные сетки VSN в Чебоксарах и Новочебоксарске. 
              Монтаж: изнутри помещения, без сверления рамы. Безопасно для окон, эстетичный вид. 
              Срок изготовления: 3 дня. Цена: от 1450 руб.
            </div>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed font-medium text-justify">
              Вставные сетки VSN в Чебоксарах и Новочебоксарске от 1450 ₽, за 3 дня. Устанавливаются в световой проём изнутри, без сверления рамы. Никаких отверстий и риска выпадения — идеальное прилегание и эстетичный вид.
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p class="font-black text-brand-blue text-2xl mb-1">0 отверстий</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Без сверления рамы</p>
              </div>
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p class="font-black text-brand-blue text-2xl mb-1">Безопасно</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Монтаж изнутри</p>
              </div>
            </div>
          </div>
          <div class="lg:w-1/2 relative">
            <HeroImage src="/upload/iblock/e09/hero-vstavnye.png" webp-src="/images/optimized/e09/hero-vstavnye.webp" alt="Простые замеры: ширина и высота проёма окна для вставной москитной сетки VSN" class="rounded-[3rem] shadow-2xl border-4 border-white" :width="600" :height="400" loading="lazy" />
            <div class="hidden lg:block absolute -top-6 -left-6 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 transform -rotate-3">
              <p class="text-brand-blue font-black text-xl leading-none italic uppercase">Smart Fit</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase mt-1">Премиум выбор</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-12">
      <div class="container mx-auto px-4 text-center mb-8">
        <h2 class="text-3xl font-black mb-2 uppercase tracking-tight text-brand-dark">Расчет VSN</h2>
        <p class="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Металлические крепления в комплекте!</p>
      </div>
      <ClientOnly>
        <Calculator />
      </ClientOnly>
    </section>

    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
          <div class="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div class="relative group">
              <VideoLazy src="/zamer.mp4" title="Как замерить окно для вставной москитной сетки VSN" />
            </div>
            <div class="order-1 md:order-2">
              <h2 class="text-3xl font-black mb-6 uppercase tracking-tight">Почему выбирают VSN?</h2>
              <p class="text-gray-600 mb-6 leading-relaxed italic border-l-4 border-brand-blue pl-6 bg-blue-50/30 py-4 rounded-r-2xl font-medium text-justify">
                "Конструкция разработана так, чтобы сетка вставлялась в проем и фиксировалась специальными зацепами. Это исключает риск падения сетки даже при сильном ветре."
              </p>
              <p class="text-gray-600 leading-relaxed font-medium text-justify">
                Вставные сетки — это выбор тех, кто ценит сохранность оконных рам и максимальную безопасность. Установка производится таким образом, чтобы затем можно было удобно снять и почистить при загрязнении.
              </p>
            </div>
          </div>

          <div class="bg-brand-dark rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div class="relative z-10">
              <h2 class="text-3xl font-black mb-12 uppercase tracking-widest text-center text-white">Особенности VSN</h2>
              <div class="grid md:grid-cols-3 gap-12">
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">01</div>
                  <h3 class="font-bold text-lg mb-4 uppercase tracking-wider">Эстетика</h3>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium">Сетка практически незаметна на окне, так как рамка находится внутри светового проема.</p>
                </div>
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">02</div>
                  <h3 class="font-bold text-lg mb-4 uppercase tracking-wider">Надежность</h3>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium">Специальные зацепы намертво фиксируют сетку в раме без единого шурупа.</p>
                </div>
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">03</div>
                  <h3 class="font-bold text-lg mb-4 uppercase tracking-wider">Долговечность</h3>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium">Алюминиевый профиль VSN имеет повышенную жесткость и не деформируется со временем.</p>
                </div>
              </div>
            </div>
            <div class="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-blue/10 rounded-full blur-[100px] -mr-[20rem] -mt-[20rem]"></div>
          </div>
          <SeoTextBlock title="Вставные сетки VSN в Чебоксарах и Новочебоксарске" class="mt-20">
            <p>
              Вставные москитные сетки <strong>VSN</strong> в Чебоксарах и Новочебоксарске устанавливаются изнутри, без сверления рамы — идеально для тех, кто не хочет нарушать целостность окна. Заказ через <NuxtLink to="/" class="text-brand-blue underline font-bold">калькулятор на главной</NuxtLink>: выберите «Вставная VSN», укажите размеры и получите расчёт. Изготовление за 3 дня, доставка или самовывоз.
            </p>
            <p>
              Также предлагаем <NuxtLink to="/" class="text-brand-blue underline font-bold">рамочные сетки</NuxtLink>, <NuxtLink to="/antimoshka" class="text-brand-blue underline font-bold">Антимошку</NuxtLink>, <NuxtLink to="/ultravyu" class="text-brand-blue underline font-bold">Ультравью</NuxtLink>, <NuxtLink to="/antikoshka" class="text-brand-blue underline font-bold">Антикошку</NuxtLink>, <NuxtLink to="/antipyl" class="text-brand-blue underline font-bold">Антипыль</NuxtLink> и <NuxtLink to="/remont" class="text-brand-blue underline font-bold">ремонт сеток</NuxtLink>. Работаем по Чебоксарам и Новочебоксарску.
            </p>
            <p>
              Вставные сетки VSN монтируются в световой проём изнутри, без сверления рамы — подходят для пластиковых и деревянных окон. Риск выпадения сетки отсутствует, вид с улицы аккуратный. Цена от 1450 ₽ в Чебоксарах и Новочебоксарске, изготовление за 3 дня.
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
