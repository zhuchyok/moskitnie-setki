<script setup lang="ts">
const store = useOrderStore()
const tenant = useTenantStore()
onMounted(() => {
  store.updateConfig({ frameType: 'vstavnaya', type: 'standart', typeName: 'СТАНДАРТ' })
})

const title = computed(() => tenant.config.seo?.title || `Вставные москитные сетки VSN в ${tenant.config.city || 'Чебоксарах'} — цены от 1450 руб | ${tenant.config.dealer_name || 'Сетки 21'}`)
const description = computed(() => tenant.config.seo?.description || `Инновационные вставные сетки VSN в ${tenant.config.city || 'Чебоксарах'} от компании ${tenant.config.dealer_name || 'Сетки 21'}. Не требуют сверления рамы, устанавливаются изнутри. Надежно, эстетично, безопасно. Закажите онлайн!`)
const keywords = computed(() => tenant.config.seo?.keywords || `вставная сетка, vsn, москитная сетка без сверления, ${tenant.config.city}, внутренняя сетка, сетка в проем, установка без шурупов, ${tenant.config.dealer_name}`)
const url = 'https://www.setki21.ru/vstavnye/'
const image = computed(() => tenant.config.branding?.logo_url || 'https://www.setki21.ru/images/logo_new.png')

const productSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Вставная москитная сетка VSN',
  description: `Москитная сетка внутреннего монтажа без сверления рамы в ${tenant.config.city}`,
  image: image.value,
  brand: { '@type': 'Brand', name: tenant.config.dealer_name || 'Сетки 21' },
  offers: {
    '@type': 'Offer',
    url,
    email: tenant.config.contacts?.emails?.[0] || 'info@setki21.ru',
    priceCurrency: 'RUB',
    price: '1450',
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
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '82' }
}))

const faqSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Нужно ли сверлить раму для вставной сетки VSN?', acceptedAnswer: { '@type': 'Answer', text: 'Нет. Сетки VSN устанавливаются в световой проём изнутри помещения без сверления. Никаких отверстий в раме — идеальный вариант для тех, кто не хочет нарушать целостность окна.' } },
    { '@type': 'Question', name: `Можно ли ставить VSN на деревянные окна в ${tenant.config.city}?`, acceptedAnswer: { '@type': 'Answer', text: `Да. Вставные сетки VSN подходят для пластиковых и деревянных окон. Монтаж изнутри, без сверления. Изготавливаем по размерам в ${tenant.config.city}.` } },
    { '@type': 'Question', name: 'Чем крепится вставная сетка изнутри?', acceptedAnswer: { '@type': 'Answer', text: 'Сетка фиксируется в проёме рамы специальным крепежом изнутри помещения. Риск выпадения наружу отсутствует, прилегание плотное, вид аккуратный.' } }
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
  { q: 'Нужно ли сверлить раму для вставной сетки VSN?', a: 'Нет. Сетки VSN устанавливаются в световой проём изнутри помещения без сверления. Никаких отверстий в раме — идеальный вариант для тех, кто не хочет нарушать целостность окна.' },
  { q: `Можно ли ставить VSN на деревянные окна в ${tenant.config.city}?`, a: `Да. Вставные сетки VSN подходят для пластиковых и деревянных окон. Монтаж изнутри, без сверления. Изготавливаем по размерам в ${tenant.config.city}.` },
  { q: 'Чем крепится вставная сетка изнутри?', a: 'Сетка фиксируется в проёме рамы специальным крепежом изнутри помещения. Риск выпадения наружу отсутствует, прилегание плотное, вид аккуратный.' }
])
</script>

<template>
  <div>
    <section class="pt-10 pb-4 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-12 items-stretch mb-8 min-h-[440px]">
          <div class="lg:w-1/2 flex flex-col justify-center min-h-[440px]">
            <h1 class="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase tracking-tight">
              Вставные сетки <span class="text-brand-blue">VSN</span> — без сверления
            </h1>
            <div style="display:none" data-ai-summary>
              {{ tenant.config.dealer_name || 'Сетки 21' }}: Вставные москитные сетки VSN в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }}. 
              Монтаж: изнутри помещения, без сверления рамы. Безопасно для окон, эстетичный вид. 
              Срок изготовления: 3 дня. Цена: от 1450 руб.
            </div>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed font-medium text-justify">
              {{ tenant.config.seo?.content?.vstavnye || `Вставные сетки VSN в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'} от 1450 ₽, за 3 дня. Устанавливаются в световой проём изнутри, без сверления рамы. Никаких отверстий и риска выпадения — идеальное прилегание и эстетичный вид от компании ${tenant.config.dealer_name || 'Сетки 21'}.` }}
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-6 rounded-2xl border transition-colors"
                   :style="{
                     backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '0D',
                     borderColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A'
                   }">
                <p class="font-black text-2xl mb-1" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Эстетично</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Без сверления рамы</p>
              </div>
              <div class="p-6 rounded-2xl border transition-colors"
                   :style="{
                     backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '0D',
                     borderColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A'
                   }">
                <p class="font-black text-2xl mb-1" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Безопасно</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Монтаж изнутри</p>
              </div>
            </div>
          </div>
          <div class="lg:w-1/2 relative flex items-center justify-end">
            <div class="relative w-full max-w-[640px]">
              <HeroImage src="/images/hero-vstavnaya-zamer.png" :alt="`Простые замеры: ширина и высота проёма окна для вставной москитной сетки VSN в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'}`" class="rounded-[3rem] shadow-2xl border-4 border-white w-full h-auto" :width="640" :height="400" loading="lazy" />
              
              <!-- Текст поверх картинки -->
              <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 pr-[30%] md:pr-[35%]">
                <div class="inline-flex flex-col items-stretch">
                  <div class="text-center">
                    <p class="text-[clamp(1rem,4vw,2.2rem)] font-black leading-[0.9] uppercase tracking-[0.05em] opacity-90 flex justify-between" 
                       style="font-family: 'Impact', 'Arial Black', sans-serif;"
                       :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">
                      <span>П</span><span>Р</span><span>О</span><span>С</span><span>Т</span><span>О</span><span>&nbsp;</span><span>З</span><span>А</span><span>М</span><span>Е</span><span>Р</span><span>Я</span><span>Е</span><span>М</span>
                    </p>
                    <p class="text-[clamp(1rem,4vw,2.2rem)] font-black leading-[0.9] uppercase tracking-[0.05em] opacity-90 mt-1 flex justify-between" 
                       style="font-family: 'Impact', 'Arial Black', sans-serif;"
                       :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">
                      <span>Р</span><span>А</span><span>З</span><span>М</span><span>Е</span><span>Р</span><span>Ы</span><span>&nbsp;</span><span>П</span><span>Р</span><span>О</span><span>Е</span><span>М</span><span>А</span>
                    </p>
                  </div>
                </div>
              </div>

              <div class="hidden lg:block absolute -top-6 -left-6 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 transform -rotate-3">
                <p class="text-brand-blue font-black text-xl leading-none italic uppercase" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Smart Fit</p>
                <p class="text-[10px] font-bold text-gray-400 uppercase mt-1">Премиум выбор</p>
              </div>
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
              <VideoLazy src="/zamer.mp4" title="Как замерить окно для вставной москитной сетки VSN" poster="/images/zamer-poster.jpg" />
            </div>
            <div class="order-1 md:order-2">
              <h2 class="text-3xl font-black mb-6 uppercase tracking-tight">Почему выбирают VSN?</h2>
              <p class="text-gray-600 mb-6 leading-relaxed italic border-l-4 pl-6 py-4 rounded-r-2xl font-medium text-justify"
                 :style="{ borderColor: tenant.config.branding?.primary_color || '#2A6AB2', backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '0D' }">
                "Конструкция разработана так, чтобы сетка вставлялась в проем и фиксировалась специальными зацепами. Это исключает риск падения сетки даже при сильном ветре."
              </p>
              <p class="text-gray-600 leading-relaxed font-medium text-justify">
                Вставные сетки — это выбор тех, кто ценит сохранность оконных рам и максимальную безопасность. Установка производится таким образом, чтобы затем можно было удобно снять и почистить при загрязнении. Специалисты {{ tenant.config.dealer_name || 'Сетки 21' }} помогут с выбором.
              </p>
            </div>
          </div>

          <div class="bg-brand-dark rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div class="relative z-10">
              <h2 class="text-3xl font-black mb-12 uppercase tracking-widest text-center text-white">Особенности VSN</h2>
              <div class="grid md:grid-cols-3 gap-12">
                <div class="text-center md:text-left group">
                  <div class="text-6xl mb-6 font-black opacity-20 group-hover:opacity-100 transition-opacity duration-500" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }" aria-hidden="true">01</div>
                  <h3 class="font-black text-xl mb-4 uppercase tracking-tighter text-white">Эстетика</h3>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-white/80 transition-colors">Сетка практически незаметна на окне, так как рамка находится внутри светового проема.</p>
                </div>
                <div class="text-center md:text-left group">
                  <div class="text-6xl mb-6 font-black opacity-20 group-hover:opacity-100 transition-opacity duration-500" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }" aria-hidden="true">02</div>
                  <h3 class="font-black text-xl mb-4 uppercase tracking-tighter text-white">Надежность</h3>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-white/80 transition-colors">Специальные зацепы намертво фиксируют сетку в раме без единого шурупа.</p>
                </div>
                <div class="text-center md:text-left group">
                  <div class="text-6xl mb-6 font-black opacity-20 group-hover:opacity-100 transition-opacity duration-500" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }" aria-hidden="true">03</div>
                  <h3 class="font-black text-xl mb-4 uppercase tracking-tighter text-white">Долговечность</h3>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-white/80 transition-colors">Алюминиевый профиль VSN имеет повышенную жесткость и не деформируется со временем.</p>
                </div>
              </div>
            </div>
            <div class="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full blur-[120px] -mr-[20rem] -mt-[20rem]" :style="{ backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A' }" style="will-change: filter; transform: translateZ(0);"></div>
          </div>
          <SeoTextBlock :title="`Вставные сетки VSN в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'}`" class="mt-20">
            <p>
              Вставные москитные сетки <strong>VSN</strong> в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }} устанавливаются изнутри, без сверления рамы — идеально для тех, кто не хочет нарушать целостность окна. Заказ через <NuxtLink to="/" class="text-brand-blue underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">калькулятор на главной</NuxtLink>: выберите «Вставная VSN», укажите размеры и получите расчёт. Изготовление за 3 дня, доставка или самовывоз.
            </p>
            <p>
              Также предлагаем <NuxtLink to="/" class="text-brand-blue underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">рамочные сетки</NuxtLink>, <NuxtLink to="/antimoshka" class="text-brand-blue underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антимошку</NuxtLink>, <NuxtLink to="/ultravyu" class="text-brand-blue underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Ультравью</NuxtLink>, <NuxtLink to="/antikoshka" class="text-brand-blue underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антикошку</NuxtLink>, <NuxtLink to="/antipyl" class="text-brand-blue underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антипыль</NuxtLink> и <NuxtLink to="/remont" class="text-brand-blue underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">ремонт сеток</NuxtLink>. Работаем по {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }}.
            </p>
            <p>
              Вставные сетки VSN монтируются в световой проём изнутри, без сверления рамы — подходят для пластиковых и деревянных окон. Риск выпадения сетки отсутствует, вид с улицы аккуратный от бренда {{ tenant.config.dealer_name || 'Сетки 21' }}. Цена от 1450 ₽ в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }}, изготовление за 3 дня.
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

          <OtherServicesLinks exclude="/vstavnye" />
      </div>
    </section>
  </div>
</template>
