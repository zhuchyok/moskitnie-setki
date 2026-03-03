<script setup lang="ts">
const store = useOrderStore()
const tenant = useTenantStore()
onMounted(() => {
  store.updateConfig({ frameType: 'standart', type: 'ultravyu', typeName: 'УЛЬТРАВЬЮ' })
})

const title = computed(() => `Москитная сетка Ультравью в ${tenant.config.city || 'Чебоксарах'} — цены от 1000 руб | ${tenant.config.dealer_name || 'Сетки 21'}`)
const description = computed(() => `Сетки Ультравью с повышенной прозрачностью и мелкой ячейкой в ${tenant.config.city || 'Чебоксарах'} от компании ${tenant.config.dealer_name || 'Сетки 21'}. Защита от насекомых и пуха. Заказ за 2 дня.`)
const keywords = computed(() => `ультравью, ultraview, москитная сетка, ${tenant.config.city}, ${tenant.config.dealer_name}, прозрачная сетка, защита от мошек, тонкая сетка`)
const url = 'https://www.setki21.ru/ultravyu/'
const image = computed(() => tenant.config.branding?.logo_url || 'https://www.setki21.ru/images/logo_new.png')

const productSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Москитная сетка Ультравью',
  description: `Москитная сетка с повышенной прозрачностью для защиты от насекомых в ${tenant.config.city}`,
  image: image.value,
  brand: { '@type': 'Brand', name: tenant.config.dealer_name || 'Сетки 21' },
  offers: {
    '@type': 'Offer',
    url,
    email: tenant.config.contacts?.emails?.[0] || 'info@setki21.ru',
    priceCurrency: 'RUB',
    price: '1000',
    priceValidUntil: '2026-12-31',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'LocalBusiness',
      name: tenant.config.dealer_name || 'Сетки 21',
      image: image.value,
      telephone: tenant.config.phone || '+7 (8352) 38-14-20',
      address: {
        '@type': 'PostalAddress',
        streetAddress: tenant.config.contacts?.address || 'ул. Гражданская, 53',
        addressLocality: tenant.config.city || 'Чебоксары',
        addressCountry: 'RU'
      }
    }
  },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '72' }
}))

const faqSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Чем Ультравью отличается от Антимошки?', acceptedAnswer: { '@type': 'Answer', text: 'Ультравью даёт повышенную прозрачность при той же защите от насекомых и пуха. Подходит тем, кто хочет меньше затемнения окна при мелкой ячейке.' } },
    { '@type': 'Question', name: `Какая цена сетки Ультравью в ${tenant.config.city}?`, acceptedAnswer: { '@type': 'Answer', text: `От 1000 ₽ за рамочную сетку Ультравью. Цена зависит от размера и цвета рамки. Металлический крепёж в комплекте от компании ${tenant.config.dealer_name || 'Сетки 21'}. Изготовление за 2 дня.` } },
    { '@type': 'Question', name: `Подойдёт ли Ультравью для балкона в ${tenant.config.city}?`, acceptedAnswer: { '@type': 'Answer', text: `Да. Изготавливаем Ультравью любых размеров под створки окон и балконных дверей в ${tenant.config.city} и Новочебоксарске.` } }
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

useHead({
  script: [
    { type: 'application/ld+json', children: computed(() => JSON.stringify(productSchema.value)) },
    { type: 'application/ld+json', children: computed(() => JSON.stringify(faqSchema.value)) }
  ]
})

const openFaq = ref<number | null>(null)
const faqItems = computed(() => [
  { q: 'Чем Ультравью отличается от Антимошки?', a: 'Ультравью даёт повышенную прозрачность при той же защите от насекомых и пуха. Подходит тем, кто хочет меньше затемнения окна при мелкой ячейке.' },
  { q: `Какая цена сетки Ультравью в ${tenant.config.city}?`, a: `От 1000 ₽ за рамочную сетку Ультравью. Цена зависит от размера и цвета рамки. Металлический крепёж в комплекте. Изготовление за 2 дня.` },
  { q: `Подойдёт ли Ультравью для балкона в ${tenant.config.city}?`, a: `Да. Изготавливаем Ультравью любых размеров под створки окон и балконных дверей в ${tenant.config.city}.` }
])
</script>

<template>
  <div>
    <section class="py-10 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-12 items-center mb-10">
          <div class="lg:w-1/2">
            <h1 class="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase tracking-tight">
              Сетка <span class="text-brand-blue" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Ультравью</span> — прозрачность и защита
            </h1>
            <div style="display:none" data-ai-summary>
              {{ tenant.config.dealer_name || 'Сетки 21' }}: Москитные сетки Ультравью (Ultraview) в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }}. 
              Особенности: повышенная прозрачность, тонкая нить, защита от насекомых без затемнения. 
              Срок изготовления: 2 дня. Цена: от 1000 руб.
            </div>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed font-medium text-justify">
              {{ tenant.config.seo?.content?.ultravyu || `Сетка Ультравью в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'} от 1000 ₽, за 2 дня. Повышенная прозрачность и мелкая ячейка — защита от комаров, мошек и тополиного пуха без затемнения окна от компании ${tenant.config.dealer_name || 'Сетки 21'}.` }}
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-6 rounded-2xl border transition-colors"
                   :style="{
                     backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '0D',
                     borderColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A'
                   }">
                <p class="font-black text-2xl mb-1" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Ultraview</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Прозрачность</p>
              </div>
              <div class="p-6 rounded-2xl border transition-colors"
                   :style="{
                     backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '0D',
                     borderColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A'
                   }">
                <p class="font-black text-2xl mb-1" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Z-крепеж</p>
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
              <p class="font-black text-xl leading-none italic uppercase" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Clear view</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase mt-1">Без затемнения</p>
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
              <VideoLazy src="/zamer.mp4" title="Как замерить окно для москитной сетки Ультравью" poster="/images/zamer-poster.jpg" />
            </div>
            <div class="order-1 md:order-2">
              <h2 class="text-3xl font-black mb-6 uppercase tracking-tight">Замер створки</h2>
              <p class="text-gray-600 mb-6 leading-relaxed italic border-l-4 pl-6 py-4 rounded-r-2xl font-medium text-justify"
                 :style="{ borderColor: tenant.config.branding?.primary_color || '#2A6AB2', backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '0D' }">
                Измерьте ширину и высоту створки по внутреннему проёму — этого достаточно для расчёта. Точный замер при необходимости сделает наш специалист в {{ tenant.config.city }}.
              </p>
              <p class="text-gray-600 leading-relaxed font-medium text-justify">
                Сетка Ультравью сочетает мелкую ячейку для защиты от насекомых и пуха с улучшенной светопропускаемостью. Подходит для окон и балконных дверей в квартирах и загородных домах. Специалисты {{ tenant.config.dealer_name || 'Сетки 21' }} рекомендуют это полотно для жилых комнат.
              </p>
            </div>
          </div>

          <div class="bg-brand-dark rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div class="relative z-10">
              <h2 class="text-3xl font-black mb-12 uppercase tracking-widest text-center text-white">Плюсы Ультравью</h2>
              <div class="grid md:grid-cols-2 gap-12">
                <div class="flex gap-6 group">
                  <div class="text-6xl font-black opacity-20 group-hover:opacity-100 transition-opacity duration-500" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }" aria-hidden="true">01</div>
                  <div>
                    <h3 class="font-black text-xl mb-2 uppercase tracking-tighter text-white">Прозрачность</h3>
                    <p class="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-white/80 transition-colors">Меньше затемнения окна при сохранении защиты от мошек и пуха.</p>
                  </div>
                </div>
                <div class="flex gap-6 group">
                  <div class="text-6xl font-black opacity-20 group-hover:opacity-100 transition-opacity duration-500" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }" aria-hidden="true">02</div>
                  <div>
                    <h3 class="font-black text-xl mb-2 uppercase tracking-tighter text-white">Защита</h3>
                    <p class="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-white/80 transition-colors">Мелкая ячейка задерживает комаров, мошек, тополиный пух и мелкий гнус.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full blur-[120px] -mr-[20rem] -mt-[20rem]" :style="{ backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A' }" style="will-change: filter; transform: translateZ(0);"></div>
          </div>
          <SeoTextBlock :title="`Сетка Ультравью в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'}`" class="mt-20">
            <p>
              Заказать москитную сетку <strong>Ультравью</strong> в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }} можно на сайте: укажите размеры створки в <NuxtLink to="/" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">калькуляторе</NuxtLink> и получите расчёт. Ультравью — полотно с повышенной прозрачностью и мелкой ячейкой: защита от комаров, мошек и тополиного пуха без сильного затемнения окна от компании {{ tenant.config.dealer_name || 'Сетки 21' }}.
            </p>
            <p>
              В каталоге {{ tenant.config.dealer_name || 'Сетки 21' }} также <NuxtLink to="/antimoshka" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антимошка</NuxtLink>, <NuxtLink to="/antikoshka" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антикошка</NuxtLink>, <NuxtLink to="/antipyl" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антипыль</NuxtLink>, <NuxtLink to="/vstavnye" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">вставные VSN</NuxtLink> и <NuxtLink to="/remont" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">ремонт сеток</NuxtLink>. Изготовление за 2 дня, доставка и самовывоз по {{ tenant.config.city || 'Чебоксарам и Новочебоксарске' }}.
            </p>
            <p>
              Сетка Ультравью подходит для тех, кто хочет максимальную прозрачность при защите от насекомых. Цена от 1000 ₽, металлический крепёж в комплекте. Режим работы: {{ tenant.config.branding?.working_hours || 'Пн–Пт 10:00–18:00' }}. Звоните {{ tenant.config.phone || '+7 (8352) 38-14-20' }} или оставьте заявку через калькулятор.
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

          <OtherServicesLinks exclude="/ultravyu" />
      </div>
    </section>
  </div>
</template>
