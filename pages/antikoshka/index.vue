<script setup lang="ts">
const store = useOrderStore()
onMounted(() => {
  store.updateConfig({ frameType: 'standart', type: 'antikoshka', typeName: 'АНТИКОШКА' })
})

const title = 'Москитная сетка Антикошка в Чебоксарах — цены от 1300 руб'
const description = 'Усиленные москитные сетки Антикошка (Pet Screen) в Чебоксарах и Новочебоксарске. Выдерживают когти кошек, прочное полотно, металлический крепеж. Закажите расчет!'
const keywords = 'антикошка, москитная сетка антикошка, чебоксары, новочебоксарск, pet screen, защита животных, цена, купить'
const url = 'https://www.setki21.ru/antikoshka/'
const image = 'https://www.setki21.ru/images/logo_new.png'

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Москитная сетка Антикошка',
  description: 'Усиленная москитная сетка для защиты от кошек в Чебоксарах и Новочебоксарске',
  image,
  brand: { '@type': 'Brand', name: 'Сетки 21' },
  offers: {
    '@type': 'Offer',
    url,
    email: 'info@setki21.ru',
    priceCurrency: 'RUB',
    price: '1300',
    availability: 'https://schema.org/InStock'
  },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '89' }
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Выдержит ли сетка Антикошка когти кошки?', acceptedAnswer: { '@type': 'Answer', text: 'Да. Полотно Pet Screen из полиэстеровой нити с ПВХ-покрытием выдерживает когти кошек и птиц. Сетку невозможно разорвать когтями или прогнуть при прыжке питомца.' } },
    { '@type': 'Question', name: 'Чем крепится Антикошка к окну?', acceptedAnswer: { '@type': 'Answer', text: 'Металлическими Z-образными зажимами снаружи рамы, без сверления. Крепёж входит в комплект. Установка на любые пластиковые и деревянные окна.' } },
    { '@type': 'Question', name: 'Можно ли заказать Антикошку на балконную дверь?', acceptedAnswer: { '@type': 'Answer', text: 'Да. Изготавливаем по индивидуальным размерам для окон и балконных дверей. Цена от 1300 ₽ в Чебоксарах и Новочебоксарске.' } }
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
  { q: 'Выдержит ли сетка Антикошка когти кошки?', a: 'Да. Полотно Pet Screen из полиэстеровой нити с ПВХ-покрытием выдерживает когти кошек и птиц. Сетку невозможно разорвать когтями или прогнуть при прыжке питомца.' },
  { q: 'Чем крепится Антикошка к окну?', a: 'Металлическими Z-образными зажимами снаружи рамы, без сверления. Крепёж входит в комплект. Установка на любые пластиковые и деревянные окна.' },
  { q: 'Можно ли заказать Антикошку на балконную дверь?', a: 'Да. Изготавливаем по индивидуальным размерам для окон и балконных дверей. Цена от 1300 ₽ в Чебоксарах и Новочебоксарске.' }
]
</script>

<template>
  <div>
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-12 items-center mb-16">
          <div class="lg:w-1/2">
            <h1 class="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase tracking-tight">
              Сетка <span class="text-brand-blue">Антикошка</span> — защита ваших питомцев
            </h1>
            <div style="display:none" data-ai-summary>
              Сетки 21: Производство усиленных москитных сеток Антикошка (Pet Screen) в Чебоксарах и Новочебоксарске. 
              Материал: полиэстеровая нить с ПВХ-покрытием. Крепление: металлические Z-зажимы. 
              Срок изготовления: 2 дня. Цена: от 1300 руб. Гарантия: 1 год.
            </div>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed font-medium text-justify">
              Сетка Антикошка в Чебоксарах и Новочебоксарске от 1300 ₽, за 2 дня. Изготовим по индивидуальным размерам. Полотно Pet Screen из прочной полиэстеровой нити с ПВХ выдерживает когти кошек и птиц.
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p class="font-black text-brand-blue text-2xl mb-1">Pet Screen</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Усиленное полотно</p>
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
              alt="Усиленная москитная сетка Антикошка Pet Screen в Чебоксарах и Новочебоксарске"
              class="rounded-[3rem] shadow-2xl border-4 border-white"
              :width="600"
              :height="400"
              loading="lazy"
            />
            <div class="hidden lg:block absolute -top-6 -left-6 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 transform -rotate-3">
              <p class="text-brand-blue font-black text-xl leading-none italic uppercase">Safety First</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase mt-1">Гарантия 1 год</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-12">
      <div class="container mx-auto px-4 text-center mb-8">
        <h2 class="text-3xl font-black mb-2 uppercase tracking-tight text-brand-dark">Расчет Антикошки</h2>
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
              <video controls muted playsinline preload="metadata" class="rounded-3xl shadow-lg w-full" title="Как замерить окно для москитной сетки Антикошка">
                <source src="/zamer.mp4" type="video/mp4">
                Ваш браузер не поддерживает видео.
              </video>
            </div>
            <div class="order-1 md:order-2">
              <h2 class="text-3xl font-black mb-6 uppercase tracking-tight">Особенности системы</h2>
              <p class="text-gray-600 mb-6 leading-relaxed italic border-l-4 border-brand-blue pl-6 bg-blue-50/30 py-4 rounded-r-2xl font-medium text-justify">
                "Обычная москитная сетка не способна выдержать вес домашнего животного. Для того, чтобы полотно было устойчивым к действиям кошек, его изготавливают из особых высокопрочных нитей."
              </p>
              <p class="text-gray-600 leading-relaxed font-medium text-justify">
                Сетку натягивают на алюминиевый профиль с повышенными прочностными характеристиками. Конструкция полностью устойчива к любым действиям домашних питомцев – сетку невозможно разорвать когтями или клювом.
              </p>
            </div>
          </div>

          <div class="bg-brand-dark rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div class="relative z-10">
              <h2 class="text-3xl font-black mb-12 uppercase tracking-widest text-center text-white">Преимущества Антикошки</h2>
              <div class="grid md:grid-cols-3 gap-12">
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">01</div>
                  <h4 class="font-bold text-lg mb-4 uppercase tracking-wider">Универсальность</h4>
                  <p class="text-gray-400 text-sm leading-relaxed">Устанавливаются в любые проемы: на балконах, лоджиях, в оконных рамах и входных группах.</p>
                </div>
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">02</div>
                  <h4 class="font-bold text-lg mb-4 uppercase tracking-wider">Надежность</h4>
                  <p class="text-gray-400 text-sm leading-relaxed">Домашний питомец не сможет ее открыть, разорвать или прогнуть под собственным весом при прыжке.</p>
                </div>
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">03</div>
                  <h4 class="font-bold text-lg mb-4 uppercase tracking-wider">Долговечность</h4>
                  <p class="text-gray-400 text-sm leading-relaxed">Металлические крепления устойчивы к ультрафиолету и служат долгие годы без потери прочности.</p>
                </div>
              </div>
            </div>
            <div class="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-blue/10 rounded-full blur-[100px] -mr-[20rem] -mt-[20rem]"></div>
          </div>
          <SeoTextBlock title="Сетка Антикошка в Чебоксарах и Новочебоксарске" class="mt-20">
            <p>
              Усиленная москитная сетка <strong>Антикошка</strong> (Pet Screen) в Чебоксарах и Новочебоксарске — решение для тех, у кого кошки или птицы могут повредить обычную сетку. Полотно выдерживает когти и прыжки питомцев. Рассчитать стоимость можно в <NuxtLink to="/" class="text-brand-blue underline font-bold">калькуляторе на главной</NuxtLink>: выберите тип «Антикошка», введите размеры и оформите заказ с доставкой или самовывозом.
            </p>
            <p>
              Мы также изготавливаем <NuxtLink to="/antimoshka" class="text-brand-blue underline font-bold">Антимошку</NuxtLink>, <NuxtLink to="/ultravyu" class="text-brand-blue underline font-bold">Ультравью</NuxtLink>, <NuxtLink to="/antipyl" class="text-brand-blue underline font-bold">Антипыль</NuxtLink> и <NuxtLink to="/vstavnye" class="text-brand-blue underline font-bold">вставные сетки VSN</NuxtLink>. Ремонт сеток — в разделе <NuxtLink to="/remont" class="text-brand-blue underline font-bold">Ремонт</NuxtLink>. Работаем по Чебоксарам и Новочебоксарску, изготовление за 2 дня.
            </p>
            <p>
              Сетка Антикошка (Pet Screen) подходит для окон и балконных дверей в квартирах и домах, где живут кошки или птицы. Полотно из полиэстера с ПВХ-покрытием не рвётся когтями. Цена от 1300 ₽ в Чебоксарах и Новочебоксарске, металлический крепёж в комплекте, гарантия на изделие.
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

