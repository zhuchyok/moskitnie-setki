<script setup lang="ts">
const store = useOrderStore()
const tenant = useTenantStore()
onMounted(() => {
  store.updateConfig({ frameType: 'standart', type: 'antikoshka', typeName: 'АНТИКОШКА' })
})

const title = computed(() => tenant.config.seo?.pages?.antikoshka?.title || `Москитная сетка Антикошка в ${tenant.config.city || 'Чебоксарах'} — цены от 1300 руб | ${tenant.config.dealer_name || 'Сетки 21'}`)
const description = computed(() => tenant.config.seo?.pages?.antikoshka?.description || `Усиленные москитные сетки Антикошка (Pet Screen) в ${tenant.config.city || 'Чебоксарах'} от компании ${tenant.config.dealer_name || 'Сетки 21'}. Выдерживают когти кошек, прочное полотно, металлический крепеж.`)
const keywords = computed(() => `антикошка, москитная сетка антикошка, ${tenant.config.city}, ${tenant.config.dealer_name}, pet screen, защита животных, цена, купить, сетка на окна от кошек`)

const unicodeOrigin = useUnicodeOrigin()
const url = computed(() => {
  const origin = unicodeOrigin || 'https://www.setki21.ru'
  return `${origin}/antikoshka/`
})
const image = computed(() => tenant.config.branding?.logo_url || (unicodeOrigin ? `${unicodeOrigin}/images/logo_new.png` : 'https://www.setki21.ru/images/logo_new.png'))

const productSchema = computed(() => {
  const rating = tenant.config.seo?.rating
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Москитная сетка Антикошка в ${tenant.config.city || 'Чебоксарах'}`,
    description: `Усиленная москитная сетка для защиты от кошек в ${tenant.config.city || 'Чебоксарах'}`,
    image: image.value,
    brand: { '@type': 'Brand', name: tenant.config.dealer_name || 'Сетки 21' },
    offers: {
      '@type': 'Offer',
      url: url.value,
      email: tenant.config.contacts?.emails?.[0] || 'info@setki21.ru',
      priceCurrency: 'RUB',
      price: '1300',
      priceValidUntil: '2026-12-31',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'LocalBusiness',
        name: tenant.config.dealer_name || 'Сетки 21',
        telephone: tenant.config.phone || '+7 (8352) 38-14-20',
        address: {
          '@type': 'PostalAddress',
          streetAddress: tenant.config.contacts?.address || 'ул. Гражданская, 53',
          addressLocality: tenant.config.city || 'Чебоксары',
          addressCountry: 'RU'
        },
      }
    },
  }
  if (rating?.ratingValue && rating?.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(rating.ratingValue),
      reviewCount: String(rating.reviewCount),
      bestRating: '5',
      worstRating: '1',
    }
  }
  return schema
})

const faqSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: `Выдержит ли сетка Антикошка когти кошки в ${tenant.config.city || 'Чебоксарах'}?`, acceptedAnswer: { '@type': 'Answer', text: `Да. Полотно Pet Screen из полиэстеровой нити с ПВХ-покрытием выдерживает когти кошек и птиц. В ${tenant.config.city || 'Чебоксарах'} мы устанавливаем усиленные сетки, которые невозможно разорвать когтями или прогнуть при прыжке питомца.` } },
    { '@type': 'Question', name: `Чем крепится Антикошка к окну в домах ${tenant.config.city || 'Чебоксар'}?`, acceptedAnswer: { '@type': 'Answer', text: 'Металлическими Z-образными зажимами снаружи рамы, без сверления. Крепёж входит в комплект. Установка на любые пластиковые и деревянные окна.' } },
    { '@type': 'Question', name: `Можно ли заказать Антикошку на балконную дверь в ${tenant.config.city || 'Чебоксарах'}?`, acceptedAnswer: { '@type': 'Answer', text: `Да. Изготавливаем по индивидуальным размерам для окон и балконных дверей в ${tenant.config.city || 'Чебоксарах'}. Цена от 1300 ₽, металлический крепёж в комплекте.` } }
  ]
}))

const localBusinessSchema = useLocalBusinessSchema(url)

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
  link: [
    { rel: 'canonical', href: url, key: 'canonical' }
  ],
  script: [
    { type: 'application/ld+json', children: computed(() => JSON.stringify(productSchema.value)) },
    { type: 'application/ld+json', children: computed(() => JSON.stringify(faqSchema.value)) },
    { type: 'application/ld+json', children: computed(() => JSON.stringify(localBusinessSchema.value)) },
  ]
})

const openFaq = ref<number | null>(null)
const faqItems = computed(() => [
  { q: 'Выдержит ли сетка Антикошка когти кошки?', a: 'Да. Полотно Pet Screen из полиэстеровой нити с ПВХ-покрытием выдерживает когти кошек и птиц. Сетку невозможно разорвать когтями или прогнуть при прыжке питомца.' },
  { q: 'Чем крепится Антикошка к окну?', a: 'Металлическими Z-образными зажимами снаружи рамы, без сверления. Крепёж входит в комплект. Установка на любые пластиковые и деревянные окна.' },
  { q: `Можно ли заказать Антикошку на балконную дверь в ${tenant.config.city}?`, a: `Да. Изготавливаем по индивидуальным размерам для окон и балконных дверей в ${tenant.config.city}. Цена от 1300 ₽, металлический крепёж в комплекте.` }
])
</script>

<template>
  <div>
    <section class="pt-10 pb-4 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-12 items-stretch mb-8 min-h-[440px]">
          <div class="lg:w-1/2 flex flex-col justify-start pt-4 min-h-[440px]">
            <h1 class="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase tracking-tight">
              Сетка <span class="text-brand-blue" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антикошка</span> — защита ваших питомцев
            </h1>
            <div style="display:none" data-ai-summary>
              {{ tenant.config.dealer_name || 'Сетки 21' }}: Собственное производство усиленных москитных сеток Антикошка (Pet Screen) в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }}. Опыт более 13 лет.
              Материал: полиэстеровая нить с ПВХ-покрытием. Крепление: металлические Z-зажимы. 
              Срок изготовления: 2 дня. Цена: от 1300 руб. Гарантия: 1 год. Профессиональный замер и монтаж.
            </div>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed font-medium text-justify">
              {{ tenant.config.seo?.content?.antikoshka || `Сетка Антикошка в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'} от 1300 ₽. Собственное производство, работаем для вас уже более 13 лет. Изготовим по индивидуальным размерам за 2 дня. Полотно Pet Screen выдерживает когти кошек и птиц. Профессиональный замер и монтаж от компании ${tenant.config.dealer_name || 'Сетки 21'}.` }}
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-6 rounded-2xl border transition-colors"
                   :style="{
                     backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '0D',
                     borderColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A'
                   }">
                <p class="font-black text-2xl mb-1" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Pet Screen</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Усиленное полотно</p>
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
          <div class="lg:w-1/2 relative flex items-start pt-4 justify-end">
            <div class="relative w-full max-w-[640px]">
              <HeroImage
                src="/images/hero-zamer-common.png"
                :alt="`Как замерить усиленную москитную сетку Антикошка Pet Screen на пластиковом окне в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'}`"
                :title="`Сетка Антикошка в ${tenant.config.city || 'Чебоксарах'}`"
                class="rounded-[3rem] shadow-2xl border-4 border-white w-full h-auto"
                :width="640"
                :height="400"
                loading="eager"
                fetchpriority="high"
              />
              
              <!-- Текст поверх картинки -->
              <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 pr-[30%] md:pr-[35%]">
                <div class="inline-flex flex-col items-stretch">
                  <div class="text-center">
                    <p class="text-[clamp(1rem,3.2vw,2rem)] font-black leading-[0.9] uppercase tracking-tighter opacity-90" 
                       style="font-family: 'Impact', 'Arial Black', sans-serif; letter-spacing: -0.02em;"
                       :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">
                      ПРОСТО ЗАМЕРЯЕМ
                    </p>
                    <p class="text-[clamp(1rem,3.2vw,2rem)] font-black leading-[0.9] uppercase tracking-tighter opacity-90 mt-1" 
                       style="font-family: 'Impact', 'Arial Black', sans-serif; letter-spacing: -0.02em;"
                       :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">
                      РАЗМЕРЫ СТВОРКИ
                    </p>
                  </div>
                </div>
              </div>

              <div class="hidden lg:block absolute -top-6 -left-6 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 transform -rotate-3">
                <p class="font-black text-xl leading-none italic uppercase" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Safety First</p>
                <p class="text-[10px] font-bold text-gray-400 uppercase mt-1">Гарантия 1 год</p>
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
              <VideoLazy src="/zamer.mp4" title="Как замерить окно для москитной сетки Антикошка" poster="/images/zamer-poster.jpg" />
            </div>
            <div class="order-1 md:order-2">
              <h2 class="text-3xl font-black mb-6 uppercase tracking-tight">Особенности системы</h2>
              <p class="text-gray-600 mb-6 leading-relaxed italic border-l-4 pl-6 py-4 rounded-r-2xl font-medium text-justify"
                 :style="{ borderColor: tenant.config.branding?.primary_color || '#2A6AB2', backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '0D' }">
                "Обычная москитная сетка не способна выдержать вес домашнего животного. Для того, чтобы полотно было устойчивым к действиям кошек, его изготавливают из особых высокопрочных нитей."
              </p>
              <p class="text-gray-600 leading-relaxed font-medium text-justify">
                Сетку натягивают на алюминиевый профиль с повышенными прочностными характеристиками. Конструкция от {{ tenant.config.dealer_name || 'Сетки 21' }} полностью устойчива к любым действиям домашних питомцев – сетку невозможно разорвать когтями или клювом.
              </p>
            </div>
          </div>

          <div class="bg-brand-dark rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div class="relative z-10">
              <h2 class="text-3xl font-black mb-12 uppercase tracking-widest text-center text-white">Почему наши сетки Антикошка?</h2>
              <div class="grid md:grid-cols-3 gap-12">
                <div class="text-center md:text-left group">
                  <div class="text-6xl mb-6 font-black opacity-20 group-hover:opacity-100 transition-opacity duration-500" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }" aria-hidden="true">01</div>
                  <h3 class="font-black text-xl mb-4 uppercase tracking-tighter text-white">Полотно Pet Screen</h3>
                  <p class="text-gray-400 text-sm leading-relaxed group-hover:text-white/80 transition-colors">Многослойная нить с ПВХ-покрытием, которую невозможно порвать когтями или клювом.</p>
                </div>
                <div class="text-center md:text-left group">
                  <div class="text-6xl mb-6 font-black opacity-20 group-hover:opacity-100 transition-opacity duration-500" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }" aria-hidden="true">02</div>
                  <h3 class="font-black text-xl mb-4 uppercase tracking-tighter text-white">Стальной крепеж</h3>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-white/80 transition-colors">Используем только металлические Z-отливы, которые надежно фиксируют раму в проеме.</p>
                </div>
                <div class="text-center md:text-left group">
                  <div class="text-6xl mb-6 font-black opacity-20 group-hover:opacity-100 transition-opacity duration-500" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }" aria-hidden="true">03</div>
                  <h3 class="font-black text-xl mb-4 uppercase tracking-tighter text-white">Безопасность 24/7</h3>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-white/80 transition-colors">Вы можете оставлять окна открытыми, не опасаясь за жизнь и здоровье вашего питомца.</p>
                </div>
              </div>
            </div>
            <div class="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full blur-[120px] -mr-[20rem] -mt-[20rem]" :style="{ backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A' }" style="will-change: filter; transform: translateZ(0);"></div>
          </div>
          <SeoTextBlock :title="`Сетка Антикошка в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'}`" class="mt-20">
            <p>
              Усиленная москитная сетка <strong>Антикошка</strong> (Pet Screen) в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }} — решение от компании {{ tenant.config.dealer_name || 'Сетки 21' }} для тех, у кого кошки или птицы могут повредить обычную сетку. Полотно выдерживает когти и прыжки питомцев. Рассчитать стоимость можно в <NuxtLink to="/" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">калькуляторе на главной</NuxtLink>: выберите тип «Антикошка», введите размеры и оформите заказ.
            </p>
            <p>
              Мы также изготавливаем <NuxtLink to="/antimoshka" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антимошку</NuxtLink>, <NuxtLink to="/ultravyu" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Ультравью</NuxtLink>, <NuxtLink to="/antipyl" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антипыль</NuxtLink> и <NuxtLink to="/vstavnye" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">вставные сетки VSN</NuxtLink>. Ремонт сеток — в разделе <NuxtLink to="/remont" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Ремонт</NuxtLink>. Работаем по {{ tenant.config.city || 'Чебоксарам и Новочебоксарске' }}, изготовление за 2 дня.
            </p>
            <p>
              Сетка Антикошка (Pet Screen) подходит для окон и балконных дверей в квартирах и домах {{ tenant.config.city }}, где живут кошки или птицы. Полотно из полиэстера с ПВХ-покрытием не рвётся когтями. Цена от 1300 ₽, металлический крепёж в комплекте, гарантия на изделие от {{ tenant.config.dealer_name || 'Сетки 21' }}.
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
          
          <Reviews />

          <OtherServicesLinks exclude="/antikoshka" />
      </div>
    </section>
  </div>
</template>
