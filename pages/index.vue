<script setup lang="ts">
const store = useOrderStore()
const tenant = useTenantStore()
onMounted(() => {
  store.updateConfig({ frameType: 'standart', type: 'standart', typeName: 'СТАНДАРТ' })
})

const title = computed(() => tenant.config.seo?.title || `Москитные сетки на окна в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'} — цены от 850 руб | ${tenant.config.dealer_name || 'Сетки 21'}`)
const description = computed(() => tenant.config.seo?.description || `Производство и установка москитных сеток в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'} от компании ${tenant.config.dealer_name || 'Сетки 21'}. Замер за 1 день, металлические крепления в комплекте. Закажите онлайн!`)
const keywords = computed(() => tenant.config.seo?.keywords || `москитные сетки, москитная сетка, окна, ${tenant.config.city}, ${tenant.config.dealer_name}, заказать, купить, цена, установка, замер, производство, антикошка, антипыль, vsn`)
const url = 'https://www.setki21.ru/'
const image = computed(() => tenant.config.branding?.logo_url || 'https://www.setki21.ru/images/logo_final_v58.png')

const localBusinessSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${url}#organization`,
      name: tenant.config.dealer_name || 'Сетки 21',
      url,
      logo: image.value,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: tenant.config.phone || '+7 (8352) 38-14-20',
        contactType: 'customer service',
        areaServed: [tenant.config.city || 'Чебоксары', 'Новочебоксарск'],
        availableLanguage: 'Russian'
      }
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${url}#localbusiness`,
      parentOrganization: { '@id': `${url}#organization` },
      name: `${tenant.config.dealer_name || 'Сетки 21'} ${tenant.config.city || 'Чебоксары'}`,
      image: image.value,
      telephone: tenant.config.phone || '+7 (8352) 38-14-20',
      email: tenant.config.contacts?.emails?.[0] || 'info@setki21.ru',
      priceRange: 'RUB',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '10:00',
          closes: '18:00'
        }
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: tenant.config.contacts?.address || 'ул. Гражданская, 53',
        addressLocality: tenant.config.city || 'Чебоксары',
        addressRegion: tenant.config.city?.includes('Чебоксар') ? 'Чувашия' : '',
        addressCountry: 'RU'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '56.1287',
        longitude: '47.2087'
      }
    }
  ]
}))

const websiteSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${url}#website`,
  name: tenant.config.dealer_name || 'Сетки 21',
  url,
  description: `Производство и установка москитных сеток в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'}.`,
  publisher: { '@id': `${url}#organization` }
}))

const productSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Рамочная москитная сетка',
  description: `Рамочная москитная сетка Fiberglass на окна в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'}. Металлический крепёж в комплекте, изготовление за 1 день.`,
  image: 'https://www.setki21.ru/images/optimized/e09/e09007396221ccbae983f19a970e4be5.webp',
  brand: { '@type': 'Brand', name: tenant.config.dealer_name || 'Сетки 21' },
  offers: {
    '@type': 'Offer',
    url,
    priceCurrency: 'RUB',
    price: '850',
    availability: 'https://schema.org/InStock',
    seller: { '@id': `${url}#organization` }
  }
}))

const faqSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Как замерить окно для москитной сетки?', acceptedAnswer: { '@type': 'Answer', text: 'Измерьте ширину и высоту створки окна (по внутреннему проёму). Этого достаточно для предварительного расчёта. Точный замер при необходимости сделает наш специалист.' } },
    { '@type': 'Question', name: `Сколько стоит москитная сетка в ${tenant.config.city || 'Чебоксарах'}?`, acceptedAnswer: { '@type': 'Answer', text: `Рамочная москитная сетка от 850 ₽. Цена зависит от размера и типа полотна (стандарт, антимошка, антикошка, антипыль). Металлические крепления в комплекте от компании ${tenant.config.dealer_name || 'Сетки 21'}.` } },
    { '@type': 'Question', name: 'За какой срок изготавливаете?', acceptedAnswer: { '@type': 'Answer', text: `Изготовление за 1 день. После замера или расчёта на сайте можно забрать готовую сетку или заказать доставку в ${tenant.config.city || 'Чебоксары и Новочебоксарск'}.` } }
  ]
}))

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

const workGallerySchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  name: `Наши работы — москитные сетки в ${tenant.config.city}`,
  description: `Фотографии установленных москитных сеток компанией ${tenant.config.dealer_name} в ${tenant.config.city}`,
  image: [1, 2, 3, 4].map(i => ({
    '@type': 'ImageObject',
    contentUrl: `https://www.setki21.ru/images/works/work-${i}.jpg`,
    name: `Установка москитной сетки в ${tenant.config.city}`,
    author: tenant.config.dealer_name
  }))
}))

useHead({
  link: [
    { rel: 'preload', href: '/images/optimized/e09/e09007396221ccbae983f19a970e4be5.webp', as: 'image', type: 'image/webp' }
  ],
  script: [
    { type: 'application/ld+json', children: computed(() => JSON.stringify(websiteSchema.value)) },
    { type: 'application/ld+json', children: computed(() => JSON.stringify(localBusinessSchema.value)) },
    { type: 'application/ld+json', children: computed(() => JSON.stringify(productSchema.value)) },
    { type: 'application/ld+json', children: computed(() => JSON.stringify(faqSchema.value)) },
    { type: 'application/ld+json', children: computed(() => JSON.stringify(workGallerySchema.value)) }
  ]
})

const openFaq = ref<number | null>(null)
const faqMain = computed(() => [
  { q: 'Как замерить окно для москитной сетки?', a: 'Измерьте ширину и высоту створки окна (по внутреннему проёму). Этого достаточно для предварительного расчёта. Точный замер при необходимости сделает наш специалист.' },
  { q: `Сколько стоит москитная сетка в ${tenant.config.city || 'Чебоксарах'}?`, a: `Рамочная москитная сетка от 850 ₽. Цена зависит от размера и типа полотна (стандарт, антимошка, антикошка, антипыль). Металлические крепления в комплекте.` },
  { q: 'За какой срок изготавливаете?', a: `Изготовление за 1 день. После замера или расчёта на сайте можно забрать готовую сетку или заказать доставку в ${tenant.config.city || 'Чебоксары и Новочебоксарск'}.` },
  { q: 'Какие цвета рамок доступны?', a: 'Белая, коричневая, антрацит и покраска по RAL под заказ.' },
  { q: `Доставляете ли в ${tenant.config.city || 'Новочебоксарск'}?`, a: `Да. Доставка по ${tenant.config.city || 'Чебоксарам и Новочебоксарске'}. Возможен самовывоз из наших офисов.` },
  { q: 'Нужно ли сверлить раму окна?', a: 'Рамочные сетки крепятся на Z-образные зажимы снаружи, со сверлением. Вставные сетки VSN устанавливаются изнутри, без отверстий в раме.' }
])
</script>

<template>
  <div>
    <section class="pt-6 pb-10 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-12 items-center mb-10">
          <div class="lg:w-1/2">
            <h1 class="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase tracking-tight">
              Рамочная <span class="text-brand-blue" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">москитная сетка</span> — за 1 день
            </h1>
            <div style="display:none" data-ai-summary>
              {{ tenant.config.dealer_name || 'Сетки 21' }}: Производство и установка москитных сеток в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }}. Рамочные сетки Fiberglass от 850 руб, изготовление за 1 день. Металлический крепёж в комплекте. Типы: стандарт, Антимошка, Ультравью, Антикошка, Антипыль, вставные VSN.
            </div>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed font-medium text-justify">
              {{ tenant.config.seo?.content?.main || `Москитные сетки в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'} от 850 ₽, изготовление за 1 день. Изготовим на окна по индивидуальным размерам от компании ${tenant.config.dealer_name || 'Сетки 21'}, установка на любые пластиковые и деревянные окна с прочными металлическими крепежами.` }}
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-6 rounded-2xl border transition-colors"
                   :style="{ 
                     backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '0D',
                     borderColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A'
                   }">
                <p class="font-black text-2xl mb-1" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Fiberglass</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Полотно 1.2х1.2 мм</p>
              </div>
              <div class="p-6 rounded-2xl border transition-colors"
                   :style="{ 
                     backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '0D',
                     borderColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A'
                   }">
                <p class="font-black text-2xl mb-1" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Z-крепеж</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Металл в комплекте</p>
              </div>
            </div>
          </div>
          <div class="lg:w-1/2 relative">
            <HeroImage
              src="/upload/iblock/e09/e09007396221ccbae983f19a970e4be5.png"
              webp-src="/images/optimized/e09/e09007396221ccbae983f19a970e4be5.webp"
              :alt="`Рамочная москитная сетка на пластиковом окне в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'} — производство ${tenant.config.dealer_name || 'Сетки 21'}`"
              class="rounded-[3rem] shadow-2xl border-4 border-white"
              :width="600"
              :height="400"
              loading="eager"
              fetchpriority="high"
            />
            <div class="hidden lg:block absolute -top-6 -left-6 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 transform -rotate-3">
              <p class="font-black text-xl leading-none italic uppercase" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Best Seller</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase mt-1">Срок 1 день</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-12">
      <ClientOnly>
        <Calculator />
      </ClientOnly>
    </section>

    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
          <div class="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div class="relative group">
              <VideoLazy src="/zamer.mp4" :title="`Как замерить окно для москитной сетки в ${tenant.config.city}`" poster="/images/zamer-poster.jpg" />
            </div>
            <div class="order-1 md:order-2">
              <h2 class="text-3xl font-black mb-6 uppercase tracking-tight">Как замерить?</h2>
              <p class="text-gray-600 mb-6 leading-relaxed italic border-l-4 pl-6 py-4 rounded-r-2xl font-medium text-justify"
                 :style="{ borderColor: tenant.config.branding?.primary_color || '#2A6AB2', backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '0D' }">
                "Нужно лишь измерить ширину и высоту створки, для которой нужна москитная сетка. Этот способ замера предназначен для предварительного расчета стоимости."
              </p>
              <p class="text-gray-600 leading-relaxed font-medium text-justify">
                Полотно москитной сетки из стекловолокна Fiberglass с размером ячейки 1,2×1,2 мм обеспечивает отличную защиту от комаров, мух, ос, пчел и тополиного пуха, сохраняя при этом максимальную вентиляцию. Специалисты {{ tenant.config.dealer_name || 'Сетки 21' }} всегда готовы проконсультировать вас.
              </p>
            </div>
          </div>

          <div class="bg-brand-dark rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div class="relative z-10">
              <h2 class="text-3xl font-black mb-12 uppercase tracking-widest text-center text-white">Наши работы</h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div v-for="i in 4" :key="i" class="aspect-square rounded-2xl overflow-hidden border-2 border-white/10 hover:border-brand-blue transition-colors cursor-zoom-in">
                  <img :src="`/images/works/work-${i}.jpg`" :alt="`Пример установки москитной сетки ${tenant.config.dealer_name} в ${tenant.config.city}`" class="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
                </div>
              </div>
              <h2 class="text-3xl font-black mb-12 uppercase tracking-widest text-center text-white">Почему наши сетки?</h2>

              <div class="grid md:grid-cols-3 gap-12">
                <div class="text-center md:text-left group">
                  <div class="text-6xl mb-6 font-black opacity-20 group-hover:opacity-100 transition-opacity duration-500" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }" aria-hidden="true">01</div>
                  <h3 class="font-black text-xl mb-4 uppercase tracking-tighter text-white">Долговечность</h3>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-white/80 transition-colors">Прочная алюминиевая рамка окрашена порошковой краской. Не выгорает и не ржавеет.</p>
                </div>
                <div class="text-center md:text-left group">
                  <div class="text-6xl mb-6 font-black opacity-20 group-hover:opacity-100 transition-opacity duration-500" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }" aria-hidden="true">02</div>
                  <h3 class="font-black text-xl mb-4 uppercase tracking-tighter text-white">Защита</h3>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-white/80 transition-colors">Помогает задержать тополиный пух, уличную пыль и пыльцу растений, что важно для аллергиков.</p>
                </div>
                <div class="text-center md:text-left group">
                  <div class="text-6xl mb-6 font-black opacity-20 group-hover:opacity-100 transition-opacity duration-500" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }" aria-hidden="true">03</div>
                  <h3 class="font-black text-xl mb-4 uppercase tracking-tighter text-white">Безопасность</h3>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-white/80 transition-colors">Москитные сетки могут служить защитой от случайного выпадения из окон предметов домашнего обихода.</p>
                </div>
              </div>
            </div>
            <div class="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full blur-[120px] -mr-[20rem] -mt-[20rem]" :style="{ backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A' }" style="will-change: filter; transform: translateZ(0);"></div>
          </div>

          <SeoTextBlock :title="`Москитные сетки в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'}`" class="mt-20">
            <p>
              <strong>{{ tenant.config.dealer_name || 'Сетки 21' }}</strong> — производство и установка москитных сеток в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }}. Рамочные сетки на окна и балконные двери, металлический крепёж в комплекте, изготовление за 1 день. В каталоге: стандартная сетка Fiberglass, <NuxtLink to="/antimoshka" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антимошка</NuxtLink> (мелкая ячейка от мошек и пуха), <NuxtLink to="/ultravyu" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Ультравью</NuxtLink> (прозрачность и защита), <NuxtLink to="/antikoshka" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антикошка</NuxtLink> (усиленная для питомцев), <NuxtLink to="/antipyl" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антипыль</NuxtLink> (для аллергиков), <NuxtLink to="/vstavnye" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">вставные сетки VSN</NuxtLink> без сверления.
            </p>
            <p>
              Замер по {{ tenant.config.city || 'Чебоксарам и Новочебоксарске' }}, доставка и самовывоз. <NuxtLink to="/remont" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Ремонт сеток</NuxtLink> — замена полотна, ручек, уголков от 100 ₽.
            </p>
            <p>
              Цены на москитные сетки в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }} — от 850 ₽ за рамочную. Режим работы: {{ tenant.config.branding?.working_hours || 'Пн–Пт 10:00–18:00' }}. Звоните {{ tenant.config.phone || '+7 (8352) 38-14-20' }} или оставьте заявку через калькулятор — перезвоним и согласуем замер или самовывоз. <NuxtLink to="/contacts" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Контакты</NuxtLink>, <NuxtLink to="/delivery" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">доставка и замер</NuxtLink>.
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
                  <h3 class="font-black uppercase tracking-wider text-base" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">{{ item.q }}</h3>
                  <span class="shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-transform duration-200" 
                        :style="{ backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A', color: tenant.config.branding?.primary_color || '#2A6AB2' }"
                        :class="{ 'rotate-180': openFaq === i }">
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

          <OtherServicesLinks exclude="/" />
      </div>
    </section>
  </div>
</template>
