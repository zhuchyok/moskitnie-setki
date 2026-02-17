<script setup lang="ts">
const store = useOrderStore()
onMounted(() => {
  store.updateConfig({ frameType: 'standart', type: 'standart', typeName: 'СТАНДАРТ' })
})

const title = 'Москитные сетки на окна в Чебоксарах и Новочебоксарске — цены от 850 руб'
const description = 'Производство и установка москитных сеток в Чебоксарах и Новочебоксарске по низким ценам. Замер за 1 день, металлические крепления в комплекте. Закажите онлайн!'
const keywords = 'москитные сетки, москитная сетка, окна, чебоксары, новочебоксарск, заказать, купить, цена, установка, замер, производство'
const url = 'https://www.setki21.ru/'
const image = 'https://www.setki21.ru/images/logo_final_v58.png'

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Сетки 21',
  image,
  '@id': 'https://www.setki21.ru',
  url,
  sameAs: ['https://yandex.ru/maps?ol=biz&oid=53004331040'],
  telephone: '+7 (8352) 38-14-20',
  email: 'info@setki21.ru',
  priceRange: 'RUB',
  areaServed: [{ '@type': 'City', name: 'Чебоксары' }, { '@type': 'City', name: 'Новочебоксарск' }],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Гражданская, 53',
      addressLocality: 'Чебоксары',
      postalCode: '428000',
      addressCountry: 'RU'
    },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 56.137451,
    longitude: 47.244032
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '10:00',
    closes: '18:00'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '89'
  },
  review: [
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Анна С.' },
      reviewRating: { '@type': 'Rating', ratingValue: '5' },
      reviewBody: 'Отличное качество сеток, замерщик приехал вовремя, установка заняла всего час.'
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Дмитрий М.' },
      reviewRating: { '@type': 'Rating', ratingValue: '5' },
      reviewBody: 'Устанавливали сетки на балкон. Качество материалов на высоте, крепления надежные.'
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Елена К.' },
      reviewRating: { '@type': 'Rating', ratingValue: '5' },
      reviewBody: 'Заказывали Антимошку на дачу в Чебоксарах. Сделали за день, привезли и установили. Рекомендую.'
    }
  ]
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Сетки 21',
  url: 'https://www.setki21.ru',
  logo: 'https://www.setki21.ru/images/logo_final_v58.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+7 (8352) 38-14-20',
    email: 'info@setki21.ru',
    contactType: 'customer service',
    areaServed: ['Чебоксары', 'Новочебоксарск'],
    availableLanguage: 'Russian',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:00',
      closes: '18:00'
    }
  },
  sameAs: ['https://yandex.ru/maps?ol=biz&oid=53004331040']
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Сетки 21',
  url: 'https://www.setki21.ru',
  description: 'Производство и установка москитных сеток в Чебоксарах и Новочебоксарске. Замер за 1 день.',
  publisher: { '@type': 'Organization', name: 'Сетки 21', url: 'https://www.setki21.ru' },
  inLanguage: 'ru-RU',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.setki21.ru/?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
}

const videoSchema = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'Как замерить окно для москитной сетки',
  description: 'Инструкция по замеру створки окна для заказа москитной сетки в Чебоксарах и Новочебоксарске. Сетки 21.',
  thumbnailUrl: 'https://www.setki21.ru/images/logo_final_v58.png',
  uploadDate: '2024-01-01',
  contentUrl: 'https://www.setki21.ru/zamer.mp4',
  embedUrl: 'https://www.setki21.ru/',
  publisher: { '@type': 'Organization', name: 'Сетки 21', url: 'https://www.setki21.ru' }
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Как замерить окно для москитной сетки?', acceptedAnswer: { '@type': 'Answer', text: 'Измерьте ширину и высоту створки окна (по внутреннему проёму). Этого достаточно для предварительного расчёта. Точный замер при необходимости сделает наш специалист.' } },
    { '@type': 'Question', name: 'Сколько стоит москитная сетка в Чебоксарах?', acceptedAnswer: { '@type': 'Answer', text: 'Рамочная москитная сетка от 850 ₽. Цена зависит от размера и типа полотна (стандарт, антимошка, антикошка, антипыль). Металлические крепления в комплекте.' } },
    { '@type': 'Question', name: 'За какой срок изготавливаете?', acceptedAnswer: { '@type': 'Answer', text: 'Изготовление за 1 день. После замера или расчёта на сайте можно забрать готовую сетку или заказать доставку в Чебоксары и Новочебоксарск.' } },
    { '@type': 'Question', name: 'Какие цвета рамок доступны?', acceptedAnswer: { '@type': 'Answer', text: 'Белая, коричневая, антрацит и покраска по RAL под заказ.' } },
    { '@type': 'Question', name: 'Доставляете ли в Новочебоксарск?', acceptedAnswer: { '@type': 'Answer', text: 'Да. Доставка по Чебоксарам и Новочебоксарску. Самовывоз из офисов: Чебоксары (ул. Гражданская, 53) и Новочебоксарск (ул. Винокурова, 109).' } },
    { '@type': 'Question', name: 'Нужно ли сверлить раму окна?', acceptedAnswer: { '@type': 'Answer', text: 'Рамочные сетки крепятся на Z-образные зажимы снаружи, со сверлением. Вставные сетки VSN устанавливаются изнутри, без отверстий в раме.' } }
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
    { type: 'application/ld+json', children: JSON.stringify(organizationSchema) },
    { type: 'application/ld+json', children: JSON.stringify(websiteSchema) },
    { type: 'application/ld+json', children: JSON.stringify(localBusinessSchema) },
    { type: 'application/ld+json', children: JSON.stringify(videoSchema) },
    { type: 'application/ld+json', children: JSON.stringify(faqSchema) }
  ]
})

const openFaq = ref<number | null>(null)
const faqMain = [
  { q: 'Как замерить окно для москитной сетки?', a: 'Измерьте ширину и высоту створки окна (по внутреннему проёму). Этого достаточно для предварительного расчёта. Точный замер при необходимости сделает наш специалист.' },
  { q: 'Сколько стоит москитная сетка в Чебоксарах?', a: 'Рамочная москитная сетка от 850 ₽. Цена зависит от размера и типа полотна (стандарт, антимошка, антикошка, антипыль). Металлические крепления в комплекте.' },
  { q: 'За какой срок изготавливаете?', a: 'Изготовление за 1 день. После замера или расчёта на сайте можно забрать готовую сетку или заказать доставку в Чебоксары и Новочебоксарск.' },
  { q: 'Какие цвета рамок доступны?', a: 'Белая, коричневая, антрацит и покраска по RAL под заказ.' },
  { q: 'Доставляете ли в Новочебоксарск?', a: 'Да. Доставка по Чебоксарам и Новочебоксарску. Самовывоз из офисов: Чебоксары (ул. Гражданская, 53) и Новочебоксарск (ул. Винокурова, 109).' },
  { q: 'Нужно ли сверлить раму окна?', a: 'Рамочные сетки крепятся на Z-образные зажимы снаружи, со сверлением. Вставные сетки VSN устанавливаются изнутри, без отверстий в раме.' }
]
</script>

<template>
  <div>
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-12 items-center mb-16">
          <div class="lg:w-1/2">
            <h1 class="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase tracking-tight">
              Рамочная <span class="text-brand-blue">москитная сетка</span> — за 1 день
            </h1>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed font-medium text-justify">
              Москитные сетки в Чебоксарах и Новочебоксарске от 850 ₽, изготовление за 1 день. Изготовим на окна по индивидуальным размерам, установка на любые пластиковые и деревянные окна с прочными металлическими крепежами.
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p class="font-black text-brand-blue text-2xl mb-1">Fiberglass</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Полотно 1.2х1.2 мм</p>
              </div>
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p class="font-black text-brand-blue text-2xl mb-1">Z-крепеж</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Металл в комплекте</p>
              </div>
            </div>
          </div>
          <div class="lg:w-1/2 relative">
            <HeroImage
              src="/upload/iblock/e09/e09007396221ccbae983f19a970e4be5.png"
              webp-src="/images/optimized/e09/e09007396221ccbae983f19a970e4be5.webp"
              alt="Рамочная москитная сетка на пластиковом окне в Чебоксарах и Новочебоксарске"
              class="rounded-[3rem] shadow-2xl border-4 border-white"
              :width="600"
              :height="400"
              loading="eager"
              fetchpriority="high"
            />
            <div class="hidden lg:block absolute -top-6 -left-6 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 transform -rotate-3">
              <p class="text-brand-blue font-black text-xl leading-none italic uppercase">Best Seller</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase mt-1">Срок 1 день</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-12">
      <div class="container mx-auto px-4 text-center mb-8">
        <h2 class="text-3xl font-black mb-2 uppercase tracking-tight text-brand-dark">Расчет стоимости</h2>
        <p class="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Металлические крепления в комплекте!</p>
      </div>
      <Calculator />
    </section>

    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
          <div class="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div class="relative group">
              <video controls muted playsinline preload="metadata" class="rounded-3xl shadow-lg w-full" title="Как замерить окно для москитной сетки">
                <source src="/zamer.mp4" type="video/mp4">
                Ваш браузер не поддерживает видео.
              </video>
            </div>
            <div class="order-1 md:order-2">
              <h2 class="text-3xl font-black mb-6 uppercase tracking-tight">Как замерить?</h2>
              <p class="text-gray-600 mb-6 leading-relaxed italic border-l-4 border-brand-blue pl-6 bg-blue-50/30 py-4 rounded-r-2xl font-medium text-justify">
                "Нужно лишь измерить ширину и высоту створки, для которой нужна москитная сетка. Этот способ замера предназначен для предварительного расчета стоимости."
              </p>
              <p class="text-gray-600 leading-relaxed font-medium text-justify">
                Полотно москитной сетки из стекловолокна Fiberglass с размером ячейки 1,2×1,2 мм обеспечивает отличную защиту от комаров, мух, ос, пчел и тополиного пуха, сохраняя при этом максимальную вентиляцию.
              </p>
            </div>
          </div>

          <div class="bg-brand-dark rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div class="relative z-10">
              <h2 class="text-3xl font-black mb-12 uppercase tracking-widest text-center text-white">Почему наши сетки?</h2>
              <div class="grid md:grid-cols-3 gap-12">
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">01</div>
                  <h4 class="font-bold text-lg mb-4 uppercase tracking-wider">Долговечность</h4>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium">Прочная алюминиевая рамка окрашена порошковой краской. Не выгорает и не ржавеет.</p>
                </div>
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">02</div>
                  <h4 class="font-bold text-lg mb-4 uppercase tracking-wider">Защита</h4>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium">Помогает задержать тополиный пух, уличную пыль и пыльцу растений, что важно для аллергиков.</p>
                </div>
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">03</div>
                  <h4 class="font-bold text-lg mb-4 uppercase tracking-wider">Безопасность</h4>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium">Москитные сетки могут служить защитой от случайного выпадения из окон предметов домашнего обихода.</p>
                </div>
              </div>
            </div>
            <div class="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-blue/10 rounded-full blur-[100px] -mr-[20rem] -mt-[20rem]"></div>
          </div>

          <SeoTextBlock title="Москитные сетки в Чебоксарах и Новочебоксарске" class="mt-20">
            <p>
              <strong>Сетки 21</strong> — производство и установка москитных сеток в Чебоксарах и Новочебоксарске. Рамочные сетки на окна и балконные двери, металлический крепёж в комплекте, изготовление за 1 день. В каталоге: стандартная сетка Fiberglass, <NuxtLink to="/antimoshka" class="text-brand-blue underline font-bold">Антимошка</NuxtLink> (мелкая ячейка от мошек и пуха), <NuxtLink to="/ultravyu" class="text-brand-blue underline font-bold">Ультравью</NuxtLink> (прозрачность и защита), <NuxtLink to="/antikoshka" class="text-brand-blue underline font-bold">Антикошка</NuxtLink> (усиленная для питомцев), <NuxtLink to="/antipyl" class="text-brand-blue underline font-bold">Антипыль</NuxtLink> (для аллергиков), <NuxtLink to="/vstavnye" class="text-brand-blue underline font-bold">вставные сетки VSN</NuxtLink> без сверления.
            </p>
            <p>
              Замер по Чебоксарам и Новочебоксарску, доставка и самовывоз. Офисы: Чебоксары, ул. Гражданская, 53; Новочебоксарск, ул. Винокурова, 109. <NuxtLink to="/remont" class="text-brand-blue underline font-bold">Ремонт сеток</NuxtLink> — замена полотна, ручек, уголков от 100 ₽.
            </p>
            <p>
              Цены на москитные сетки в Чебоксарах и Новочебоксарске — от 850 ₽ за рамочную. Режим работы: Пн–Пт 10:00–18:00. Звоните +7 (8352) 38-14-20 или оставьте заявку через калькулятор — перезвоним и согласуем замер или самовывоз. <NuxtLink to="/contacts" class="text-brand-blue underline font-bold">Контакты</NuxtLink>, <NuxtLink to="/delivery" class="text-brand-blue underline font-bold">доставка и замер</NuxtLink>.
            </p>
          </SeoTextBlock>
          <section class="mt-20 pt-16 border-t border-gray-200">
            <h2 class="text-2xl md:text-3xl font-black mb-10 uppercase tracking-tight text-brand-dark text-center">Часто задаваемые вопросы</h2>
            <ul class="space-y-4">
              <li v-for="(item, i) in faqMain" :key="i" class="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
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
