<script setup lang="ts">
const tenant = useTenantStore()
const title = computed(() => `Ремонт москитных сеток в ${tenant.config.city || 'Чебоксарах'} — цены от 100 руб | ${tenant.config.dealer_name || 'Сетки 21'}`)
const description = computed(() => `Профессиональный ремонт москитных сеток в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'} от компании ${tenant.config.dealer_name || 'Сетки 21'}. Замена полотна, ручек, уголков. Быстро, качественно, недорого.`)
const keywords = computed(() => `ремонт сеток, замена полотна, москитная сетка ремонт, ${tenant.config.city}, ${tenant.config.dealer_name}, запчасти для сеток, перетяжка сетки, замена ручек`)
const url = 'https://www.setki21.ru/remont/'
const image = computed(() => tenant.config.branding?.logo_url || 'https://www.setki21.ru/images/logo_new.png')

const serviceSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Ремонт москитных сеток',
  description: `Замена комплектующих и полотна москитных сеток в ${tenant.config.city}`,
  provider: {
    '@type': 'LocalBusiness',
    name: tenant.config.dealer_name || 'Сетки 21',
    image: image.value,
    telephone: tenant.config.phone || '+7 (8352) 38-14-20',
    email: tenant.config.contacts?.emails?.[0] || 'info@setki21.ru',
    address: {
      '@type': 'PostalAddress',
      streetAddress: tenant.config.contacts?.address || 'ул. Гражданская, 53',
      addressLocality: tenant.config.city || 'Чебоксары',
      addressCountry: 'RU'
    }
  },
  areaServed: [{ '@type': 'City', name: tenant.config.city || 'Чебоксары' }],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Услуги по ремонту',
    itemListElement: services.map(s => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: s.name,
        description: s.desc
      },
      priceCurrency: 'RUB',
      price: s.price
    }))
  }
}))

const faqSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Что можно отремонтировать в москитной сетке?', acceptedAnswer: { '@type': 'Answer', text: 'Замена полотна (стандарт, Ультравью, Антикошка, Антипыль), замена ручек (металлических или силиконовых), замена уголков. Если рамка цела — ремонт дешевле новой сетки.' } },
    { '@type': 'Question', name: `Сколько занимает ремонт в ${tenant.config.city}?`, acceptedAnswer: { '@type': 'Answer', text: `За 3 дня. Вы можете обратиться в наш офис в ${tenant.config.city} и забрать готовую сетку в кратчайшие сроки.` } },
    { '@type': 'Question', name: 'Нужно ли привозить сетку в офис?', acceptedAnswer: { '@type': 'Answer', text: `Да. Ремонт делаем в офисе компании ${tenant.config.dealer_name || 'Сетки 21'}. Цена от 100 ₽ за замену ручек, от 400 ₽ за замену полотна.` } }
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
    { type: 'application/ld+json', children: computed(() => JSON.stringify(serviceSchema.value)) },
    { type: 'application/ld+json', children: computed(() => JSON.stringify(faqSchema.value)) }
  ]
})

const services = [
  { name: 'Замена полотна', desc: 'Перетянем сетку новым полотном (Стандарт, Ультравью, Антикошка или Антипыль).', price: '400' },
  { name: 'Замена ручек', desc: 'Установим новые металлические или силиконовые ручки вместо сломанных.', price: '100' },
  { name: 'Замена уголков', desc: 'Заменим треснувшие пластиковые уголки на новые усиленные.', price: '150' }
]

const openFaq = ref<number | null>(null)
const faqItems = computed(() => [
  { q: 'Что можно отремонтировать в москитной сетке?', a: 'Замена полотна (стандарт, Ультравью, Антикошка, Антипыль), замена ручек (металлических или силиконовых), замена уголков. Если рамка цела — ремонт дешевле новой сетки.' },
  { q: `Сколько занимает ремонт в ${tenant.config.city}?`, a: `За 3 дня. Вы можете обратиться в наш офис в ${tenant.config.city} и забрать готовую сетку в кратчайшие сроки.` },
  { q: 'Нужно ли привозить сетку в офис?', a: `Да. Ремонт делаем в офисе компании ${tenant.config.dealer_name || 'Сетки 21'}. Цена от 100 ₽ за замену ручек, от 400 ₽ за замену полотна.` }
])
</script>

<template>
  <div>
    <section class="py-10 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-12 items-center mb-10">
          <div class="lg:w-1/2">
            <h1 class="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase tracking-tight">
              Ремонт <span class="text-brand-blue" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">сеток</span> — быстро и надежно
            </h1>
            <div style="display:none" data-ai-summary>
              {{ tenant.config.dealer_name || 'Сетки 21' }}: Профессиональный ремонт москитных сеток в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }}. 
              Услуги: замена полотна (стандарт, антикошка, антипыль), замена ручек и уголков. 
              Срок: 3 дня. Цена: от 100 руб.
            </div>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed font-medium text-justify">
              {{ tenant.config.seo?.content?.remont || `Ремонт москитных сеток в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'} от 100 ₽, за 3 дня. Если рамка цела, а полотно порвалось или сломались ручки — не обязательно покупать новую. Замена полотна, ручек, уголков от компании ${tenant.config.dealer_name || 'Сетки 21'}.` }}
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-6 rounded-2xl border transition-colors"
                   :style="{
                     backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '0D',
                     borderColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A'
                   }">
                <p class="font-black text-2xl mb-1" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">3 дня</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Срок ремонта</p>
              </div>
              <div class="p-6 rounded-2xl border transition-colors"
                   :style="{
                     backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '0D',
                     borderColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A'
                   }">
                <p class="font-black text-2xl mb-1" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">от 100 ₽</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Минимальная цена</p>
              </div>
            </div>
          </div>
          <div class="lg:w-1/2 relative flex items-center justify-end">
            <div class="relative w-full max-w-[600px]">
              <HeroImage src="/images/hero-remont-new.png" alt="Простые замеры: ширина и высота сетки для ремонта москитных сеток" class="rounded-[3rem] shadow-2xl border-4 border-white w-full h-auto" :width="600" :height="400" loading="lazy" />
              
              <!-- Текст поверх картинки -->
              <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 pr-[30%] md:pr-[35%]">
                <div class="inline-flex flex-col items-stretch">
                  <div class="text-center">
                    <p class="text-[clamp(1.1rem,4.5vw,2rem)] font-black leading-[0.9] uppercase tracking-[0.05em] opacity-90 flex justify-between" 
                       style="font-family: 'Impact', 'Arial Black', sans-serif;"
                       :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">
                      <span>П</span><span>Р</span><span>О</span><span>С</span><span>Т</span><span>О</span><span>&nbsp;</span><span>З</span><span>А</span><span>М</span><span>Е</span><span>Р</span><span>Я</span><span>Е</span><span>М</span>
                    </p>
                    <p class="text-[clamp(1.1rem,4.5vw,2rem)] font-black leading-[0.9] uppercase tracking-[0.05em] opacity-90 mt-1 flex justify-between" 
                       style="font-family: 'Impact', 'Arial Black', sans-serif;"
                       :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">
                      <span>Р</span><span>А</span><span>З</span><span>М</span><span>Е</span><span>Р</span><span>Ы</span><span>&nbsp;</span><span>С</span><span>Е</span><span>Т</span><span>К</span><span>И</span>
                    </p>
                  </div>
                </div>
              </div>

              <div class="hidden lg:block absolute -top-6 -left-6 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 transform -rotate-3">
                <p class="font-black text-xl leading-none italic uppercase" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Quick Fix</p>
                <p class="text-[10px] font-bold text-gray-400 uppercase mt-1">Гарантия на работы</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-24">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-black mb-12 uppercase tracking-tight text-center">Наши услуги</h2>
        <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div v-for="s in services" :key="s.name" 
               class="group p-10 bg-white rounded-[3rem] hover:shadow-2xl transition-all duration-500 border border-gray-100">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg transition-transform group-hover:scale-110"
                 :style="{ backgroundColor: tenant.config.branding?.primary_color || '#2A6AB2', shadowColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '4D' }">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="s.name === 'Замена полотна'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                <path v-else-if="s.name === 'Замена ручек'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1 0 113 0m-3 6a1.5 1 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1 0 00-3 0m-6-3V11m0-5.5v-1A1.5 1 0 0111 3h1a1.5 1 0 011.5 1.5V11" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 00-1 1v1a2 2 0 11-4 0v-1a1 1 0 00-1-1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <h3 class="text-xl font-black mb-4 uppercase tracking-tight">{{ s.name }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed mb-8 font-medium">{{ s.desc }}</p>
            <div class="flex items-baseline gap-2">
              <span class="text-[10px] font-black text-gray-300 uppercase tracking-widest">от</span>
              <span class="text-3xl font-black" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">{{ s.price }}</span>
              <span class="text-lg font-black text-gray-300">₽</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="bg-brand-dark rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
          <div class="relative z-10 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 class="text-3xl font-black mb-12 uppercase tracking-widest text-center md:text-left text-white">Как заказать?</h2>
              <div class="space-y-10">
                <div class="flex gap-6 group">
                  <div class="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-2xl opacity-20 group-hover:opacity-100 transition-opacity duration-500" 
                       :style="{ backgroundColor: tenant.config.branding?.primary_color || '#2A6AB2' }" aria-hidden="true">01</div>
                  <div>
                    <h3 class="font-black text-xl uppercase tracking-tighter mb-2 text-white">Привезите к нам</h3>
                    <p class="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-white/80 transition-colors">В наш офис в {{ tenant.config.city || 'Чебоксарах' }}. Сделаем за 3 дня.</p>
                  </div>
                </div>
                <div class="flex gap-6 group">
                  <div class="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-2xl opacity-20 group-hover:opacity-100 transition-opacity duration-500" 
                       :style="{ backgroundColor: tenant.config.branding?.primary_color || '#2A6AB2' }" aria-hidden="true">02</div>
                  <div>
                    <h3 class="font-black text-xl uppercase tracking-tighter mb-2 text-white">Вызовите мастера</h3>
                    <p class="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-white/80 transition-colors">Мастер приедет в удобное время в {{ tenant.config.city }}, заберет сетки и привезет отремонтированные через 3 дня.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="hidden md:block">
              <div class="aspect-square bg-white/5 rounded-[3rem] flex items-center justify-center p-12 border border-white/10">
                <div class="text-[12rem] opacity-20">🔧</div>
              </div>
            </div>
          </div>
          <div class="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full blur-[120px] -mr-[20rem] -mt-[20rem]" :style="{ backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A' }" style="will-change: filter; transform: translateZ(0);"></div>
        </div>
        <SeoTextBlock :title="`Ремонт москитных сеток в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'}`" class="mt-20">
          <p>
            <strong>Ремонт москитных сеток</strong> в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }} от компании {{ tenant.config.dealer_name || 'Сетки 21' }}: замена полотна (стандарт, Ультравью, Антикошка, Антипыль), ручек и уголков. Если рамка цела, ремонт выгоднее новой сетки. Привозите сетку в наш офис — готово за 3 дня.
          </p>
          <p>
            Новые сетки заказывайте на <NuxtLink to="/" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">главной</NuxtLink>: <NuxtLink to="/antimoshka" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антимошка</NuxtLink>, <NuxtLink to="/ultravyu" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Ультравью</NuxtLink>, <NuxtLink to="/antikoshka" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антикошка</NuxtLink>, <NuxtLink to="/antipyl" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антипыль</NuxtLink>, <NuxtLink to="/vstavnye" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">вставные сетки VSN</NuxtLink>. {{ tenant.config.dealer_name || 'Сетки 21' }} — производство и ремонт в одном месте.
          </p>
          <p>
            Ремонт москитных сеток в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }} выполняем за 3 дня: замена полотна от 400 ₽, ручек от 100 ₽, уголков от 150 ₽. При необходимости подберём полотно Антимошка, Ультравью, Антикошка или Антипыль.
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

          <OtherServicesLinks exclude="/remont" />
      </div>
    </section>
  </div>
</template>
