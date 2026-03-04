<script setup lang="ts">
const store = useOrderStore()
const tenant = useTenantStore()
onMounted(() => {
  store.updateConfig({ frameType: 'standart', type: 'antimoshka', typeName: 'АНТИМОШКА' })
})

const title = computed(() => `Москитная сетка Антимошка в ${tenant.config.city || 'Чебоксарах'} — цены от 1000 руб | ${tenant.config.dealer_name || 'Сетки 21'}`)
const description = computed(() => `Сетки Антимошка с уменьшенной ячейкой 0.8х0.8 мм в ${tenant.config.city || 'Чебоксарах'} от компании ${tenant.config.dealer_name || 'Сетки 21'}. Защита от мелких насекомых и тополиного пуха.`)
const keywords = computed(() => `антимошка, микромеш, москитная сетка, ${tenant.config.city}, ${tenant.config.dealer_name}, защита от мошек, мелкая сетка, micro mesh`)
const url = 'https://www.setki21.ru/antimoshka/'
const image = computed(() => tenant.config.branding?.logo_url || 'https://www.setki21.ru/images/logo_new.png')

const productSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Москитная сетка Антимошка',
  description: `Эффективная москитная сетка для защиты от комаров и мошек в ${tenant.config.city}`,
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
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '94' }
}))

const faqSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Чем Антимошка отличается от обычной сетки?', acceptedAnswer: { '@type': 'Answer', text: 'У Антимошки ячейка 0,8×0,8 мм — в 2 раза мельче обычной (1,2×1,2 мм). Она задерживает мелких мошек, гнус и тополиный пух, которые проходят через стандартную сетку.' } },
    { '@type': 'Question', name: 'Какая ячейка у сетки Антимошка?', acceptedAnswer: { '@type': 'Answer', text: 'Полотно Micro Mesh с размером ячейки 0,8×0,8 мм. Прозрачность около 50%, воздух проходит свободно.' } },
    { '@type': 'Question', name: `Подойдёт ли Антимошка для балконной двери в ${tenant.config.city}?`, acceptedAnswer: { '@type': 'Answer', text: `Да. Изготавливаем Антимошку любых размеров под створки окон и балконных дверей в ${tenant.config.city}. Цена от 1000 ₽, металлический крепёж в комплекте.` } }
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
  { q: 'Чем Антимошка отличается от обычной сетки?', a: 'У Антимошки ячейка 0,8×0,8 мм — в 2 раза мельче обычной (1,2×1,2 мм). Она задерживает мелких мошек, гнус и тополиный пух, которые проходят через стандартную сетку.' },
  { q: 'Какая ячейка у сетки Антимошка?', a: 'Полотно Micro Mesh с размером ячейки 0,8×0,8 мм. Прозрачность около 50%, воздух проходит свободно.' },
  { q: `Подойдёт ли Антимошка для балконной двери в ${tenant.config.city}?`, a: `Да. Изготавливаем Антимошку любых размеров под створки окон и балконных дверей в ${tenant.config.city}. Цена от 1000 ₽, металлический крепёж в комплекте.` }
])
</script>

<template>
  <div>
    <section class="pt-10 pb-4 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-12 items-stretch mb-8 min-h-[440px]">
          <div class="lg:w-1/2 flex flex-col justify-center min-h-[440px]">
            <h1 class="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase tracking-tight">
              Сетка <span class="text-brand-blue" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антимошка</span> — Micro Mesh
            </h1>
            <div style="display:none" data-ai-summary>
              {{ tenant.config.dealer_name || 'Сетки 21' }}: Москитные сетки Антимошка (Micro Mesh) в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }}. 
              Ячейка: 0.8х0.8 мм (в 2 раза меньше стандартной). Защита от мелкого гнуса и тополиного пуха. 
              Срок изготовления: 2 дня. Цена: от 1000 руб.
            </div>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed font-medium text-justify">
              {{ tenant.config.seo?.content?.antimoshka || `Сетка Антимошка в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'} от 1000 ₽, за 2 дня. Мелкая ячейка 0,8×0,8 мм защищает от насекомых, тополиного пуха и мошек — уникальная москитная сетка для дверей и окон от компании ${tenant.config.dealer_name || 'Сетки 21'}.` }}
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-6 rounded-2xl border transition-colors"
                   :style="{
                     backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '0D',
                     borderColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A'
                   }">
                <p class="font-black text-2xl mb-1" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Micro Mesh</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Ячейка 0.8х0.8 мм</p>
              </div>
              <div class="p-6 rounded-2xl border transition-colors"
                   :style="{
                     backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '0D',
                     borderColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A'
                   }">
                <p class="font-black text-2xl mb-1" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">50%</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Прозрачность</p>
              </div>
            </div>
          </div>
          <div class="lg:w-1/2 relative flex items-center justify-end">
            <div class="relative w-full max-w-[640px]">
              <HeroImage
                src="/images/hero-zamer-common.png"
                :alt="`Как замерить москитную сетку Антимошка на пластиковом окне в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'}`"
                class="rounded-[3rem] shadow-2xl border-4 border-white w-full h-auto"
                :width="640"
                :height="400"
                loading="lazy"
              />
              
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
                      <span>Р</span><span>А</span><span>З</span><span>М</span><span>Е</span><span>Р</span><span>Ы</span><span>&nbsp;</span><span>С</span><span>Т</span><span>В</span><span>О</span><span>Р</span><span>К</span><span>И</span>
                    </p>
                  </div>
                </div>
              </div>

              <div class="hidden lg:block absolute -top-6 -left-6 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 transform -rotate-3">
                <p class="font-black text-xl leading-none italic uppercase" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Extra Protection</p>
                <p class="text-[10px] font-bold text-gray-400 uppercase mt-1">От мелкого гнуса</p>
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
              <VideoLazy src="/zamer.mp4" title="Как замерить окно для москитной сетки Антимошка" poster="/images/zamer-poster.jpg" />
            </div>
            <div class="order-1 md:order-2">
              <h2 class="text-3xl font-black mb-6 uppercase tracking-tight">Технология Micro Mesh</h2>
              <p class="text-gray-600 mb-6 leading-relaxed italic border-l-4 pl-6 py-4 rounded-r-2xl font-medium text-justify"
                 :style="{ borderColor: tenant.config.branding?.primary_color || '#2A6AB2', backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '0D' }">
                "Полотна Micro Mesh изготавливают из нейлона и стекловолокна. Конструкция выходит прочной, надежной и не мешает воздухообмену."
              </p>
              <p class="text-gray-600 leading-relaxed font-medium text-justify">
                Прозрачность данного полотна ровна 50%, а прочность 70 %. Полотно «Антимошка» от {{ tenant.config.dealer_name || 'Сетки 21' }} отлично подойдет для загородных домов, коттеджей, городских квартир в {{ tenant.config.city }}. При нагревании не выделяет токсины.
              </p>
            </div>
          </div>

          <div class="bg-brand-dark rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div class="relative z-10">
              <h2 class="text-3xl font-black mb-12 uppercase tracking-widest text-center text-white">Плюсы Антимошки</h2>
              <div class="grid md:grid-cols-2 gap-12">
                <div class="flex gap-6 group">
                  <div class="text-6xl font-black opacity-20 group-hover:opacity-100 transition-opacity duration-500" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }" aria-hidden="true">01</div>
                  <div>
                    <h3 class="font-black text-xl mb-2 uppercase tracking-tighter text-white">Защита</h3>
                    <p class="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-white/80 transition-colors">Предотвращает проникновение мошек, жуков, защищает от листьев и грязи с дорог.</p>
                  </div>
                </div>
                <div class="flex gap-6 group">
                  <div class="text-6xl font-black opacity-20 group-hover:opacity-100 transition-opacity duration-500" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }" aria-hidden="true">02</div>
                  <div>
                    <h3 class="font-black text-xl mb-2 uppercase tracking-tighter text-white">Комфорт</h3>
                    <p class="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-white/80 transition-colors">Легко очищается, сдерживает солнечные лучи, обеспечивая фильтрацию света.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full blur-[120px] -mr-[20rem] -mt-[20rem]" :style="{ backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A' }" style="will-change: filter; transform: translateZ(0);"></div>
          </div>
          <SeoTextBlock :title="`Сетка Антимошка в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'}`" class="mt-20">
            <p>
              Заказать москитную сетку <strong>Антимошка</strong> в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }} можно на нашем сайте: укажите размеры створки в <NuxtLink to="/" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">калькуляторе</NuxtLink> и получите расчёт за минуту. Мы изготавливаем сетки с полотном Micro Mesh (ячейка 0,8×0,8 мм) для окон и балконных дверей — защита от комаров, мошек и тополиного пуха при сохранении вентиляции.
            </p>
            <p>
              Помимо Антимошки, в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }} доступны <NuxtLink to="/ultravyu" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Ультравью</NuxtLink> (прозрачность и защита), <NuxtLink to="/antikoshka" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">сетки Антикошка</NuxtLink> (для питомцев), <NuxtLink to="/antipyl" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антипыль</NuxtLink> (для аллергиков) и <NuxtLink to="/vstavnye" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">вставные сетки VSN</NuxtLink> без сверления. Замер, производство и установка — за 2 дня от {{ tenant.config.dealer_name || 'Сетки 21' }}.
            </p>
            <p>
              Для кого подходит Антимошка: дачи и квартиры у парков (защита от тополиного пуха и гнуса), балконы и лоджии в {{ tenant.config.city }}. Полотно Micro Mesh не выгорает на солнце, легко моется. Заказать москитную сетку Антимошка в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }} можно с доставкой или самовывоз из офисов.
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

          <OtherServicesLinks exclude="/antimoshka" />
      </div>
    </section>
  </div>
</template>
