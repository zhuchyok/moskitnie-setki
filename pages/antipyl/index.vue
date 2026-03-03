<script setup lang="ts">
const store = useOrderStore()
const tenant = useTenantStore()
onMounted(() => {
  store.updateConfig({ frameType: 'standart', type: 'antipyl', typeName: 'АНТИПЫЛЬ' })
})

const title = computed(() => `Москитная сетка Антипыль (Poll-Tex) в ${tenant.config.city || 'Чебоксарах'} — цены от 1400 руб | ${tenant.config.dealer_name || 'Сетки 21'}`)
const description = computed(() => `Сетки для аллергиков Poll-Tex в ${tenant.config.city || 'Чебоксарах'} от компании ${tenant.config.dealer_name || 'Сетки 21'}. Нейлоновое полотно притягивает пыль и пыльцу. Чистый воздух в вашем доме.`)
const keywords = computed(() => `антипыль, poll-tex, москитная сетка для аллергиков, ${tenant.config.city}, ${tenant.config.dealer_name}, чистый воздух, защита от пыльцы, нейлоновая сетка`)
const url = 'https://www.setki21.ru/antipyl/'
const image = computed(() => tenant.config.branding?.logo_url || 'https://www.setki21.ru/images/logo_new.png')

const productSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Москитная сетка Антипыль',
  description: `Специальная сетка-фильтр для защиты от пыли и пыльцы в ${tenant.config.city}`,
  image: image.value,
  brand: { '@type': 'Brand', name: tenant.config.dealer_name || 'Сетки 21' },
  offers: {
    '@type': 'Offer',
    url,
    email: tenant.config.contacts?.emails?.[0] || 'info@setki21.ru',
    priceCurrency: 'RUB',
    price: '1400',
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
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '76' }
}))

const faqSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: `Для кого подходит сетка Антипыль в ${tenant.config.city}?`, acceptedAnswer: { '@type': 'Answer', text: 'Для аллергиков, жителей домов у дорог и тех, кто хочет меньше пыли в квартире. Полотно Poll-Tex задерживает до 90% пыльцы и уличной пыли благодаря электростатическому эффекту.' } },
    { '@type': 'Question', name: 'Как часто нужно мыть сетку Антипыль?', acceptedAnswer: { '@type': 'Answer', text: 'Рекомендуем промывать под душем 1–2 раза в сезон или по мере загрязнения. Нейлоновое полотно легко очищается, подоконники остаются чище в 3 раза дольше.' } },
    { '@type': 'Question', name: 'Чем Антипыль отличается от обычной москитной сетки?', acceptedAnswer: { '@type': 'Answer', text: 'Обычная сетка задерживает насекомых и крупный мусор. Антипыль (Poll-Tex) дополнительно притягивает мелкую пыль и пыльцу за счёт электростатики — это фильтр для воздуха в окно.' } }
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
  { q: `Для кого подходит сетка Антипыль в ${tenant.config.city}?`, a: 'Для аллергиков, жителей домов у дорог и тех, кто хочет меньше пыли в квартире. Полотно Poll-Tex задерживает до 90% пыльцы и уличной пыли благодаря электростатическому эффекту.' },
  { q: 'Как часто нужно мыть сетку Антипыль?', a: 'Рекомендуем промывать под душем 1–2 раза в сезон или по мере загрязнения. Нейлоновое полотно легко очищается, подоконники остаются чище в 3 раза дольше.' },
  { q: 'Чем Антипыль отличается от обычной москитной сетки?', a: 'Обычная сетка задерживает насекомых и крупный мусор. Антипыль (Poll-Tex) дополнительно притягивает мелкую пыль и пыльцу за счёт электростатики — это фильтр для воздуха в окно.' }
])
</script>

<template>
  <div>
    <section class="py-10 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-12 items-center mb-10">
          <div class="lg:w-1/2">
            <h1 class="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase tracking-tight">
              Сетка <span class="text-brand-blue" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антипыль</span> — Poll-Tex
            </h1>
            <div style="display:none" data-ai-summary>
              {{ tenant.config.dealer_name || 'Сетки 21' }}: Москитные сетки Антипыль (Poll-Tex) для аллергиков в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }}. 
              Материал: нейлон с электростатическим эффектом. Задерживает до 90% пыльцы. 
              Срок изготовления: 3 дня. Цена: от 1400 руб.
            </div>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed font-medium text-justify">
              {{ tenant.config.seo?.content?.antipyl || `Сетка Антипыль в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'} от 1400 ₽, за 3 дня. Идеально для аллергиков и жителей домов у дорог — полотно Poll-Tex от компании ${tenant.config.dealer_name || 'Сетки 21'} задерживает пыль, копоть и пыльцу.` }}
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-6 rounded-2xl border transition-colors"
                   :style="{
                     backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '0D',
                     borderColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A'
                   }">
                <p class="font-black text-2xl mb-1" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Poll-Tex</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Нейлоновое полотно</p>
              </div>
              <div class="p-6 rounded-2xl border transition-colors"
                   :style="{
                     backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '0D',
                     borderColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A'
                   }">
                <p class="font-black text-2xl mb-1" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">90%</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Защита от пыльцы</p>
              </div>
            </div>
          </div>
          <div class="lg:w-1/2 relative">
            <HeroImage src="/upload/iblock/e09/e09007396221ccbae983f19a970e4be5.png" webp-src="/images/optimized/e09/e09007396221ccbae983f19a970e4be5.webp" alt="Москитная сетка Антипыль Poll-Tex для аллергиков в Чебоксарах" class="rounded-[3rem] shadow-2xl border-4 border-white" :width="600" :height="400" loading="lazy" />
            <div class="hidden lg:block absolute -top-6 -left-6 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 transform -rotate-3">
              <p class="font-black text-xl leading-none italic uppercase" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Pure Air</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase mt-1">Фильтрация 24/7</p>
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
              <VideoLazy src="/zamer.mp4" title="Как замерить окно для москитной сетки Антипыль" poster="/images/zamer-poster.jpg" />
            </div>
            <div class="order-1 md:order-2">
              <h2 class="text-3xl font-black mb-6 uppercase tracking-tight">Как это работает?</h2>
              <p class="text-gray-600 mb-6 leading-relaxed italic border-l-4 pl-6 py-4 rounded-r-2xl font-medium text-justify"
                 :style="{ borderColor: tenant.config.branding?.primary_color || '#2A6AB2', backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '0D' }">
                "Нейлоновые нити полотна обладают электростатическим эффектом, буквально притягивая к себе частицы пыли и не давая им попасть в комнату."
              </p>
              <p class="text-gray-600 leading-relaxed font-medium text-justify">
                Сетка Антипыль (Poll-Tex) — это самый оптимальный способ обезопасить себя и своих близких от уличной пыли и пыльцы растений в {{ tenant.config.city }}. Специалисты {{ tenant.config.dealer_name || 'Сетки 21' }} рекомендуют её аллергикам. Подоконники остаются чистыми в 3 раза дольше.
              </p>
            </div>
          </div>

          <div class="bg-brand-dark rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div class="relative z-10">
              <h2 class="text-3xl font-black mb-12 uppercase tracking-widest text-center text-white">Преимущества Poll-Tex</h2>
              <div class="grid md:grid-cols-3 gap-12">
                <div class="text-center md:text-left group">
                  <div class="text-6xl mb-6 font-black opacity-20 group-hover:opacity-100 transition-opacity duration-500" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }" aria-hidden="true">01</div>
                  <h3 class="font-black text-xl mb-4 uppercase tracking-tighter text-white">Чистота</h3>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-white/80 transition-colors">Блокирует до 90% пыльцы березы, злаковых и других аллергенов.</p>
                </div>
                <div class="text-center md:text-left group">
                  <div class="text-6xl mb-6 font-black opacity-20 group-hover:opacity-100 transition-opacity duration-500" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }" aria-hidden="true">02</div>
                  <h3 class="font-black text-xl mb-4 uppercase tracking-tighter text-white">Легкий уход</h3>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-white/80 transition-colors">Достаточно просто промыть сетку под душем, чтобы смыть накопившуюся пыль.</p>
                </div>
                <div class="text-center md:text-left group">
                  <div class="text-6xl mb-6 font-black opacity-20 group-hover:opacity-100 transition-opacity duration-500" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }" aria-hidden="true">03</div>
                  <h3 class="font-black text-xl mb-4 uppercase tracking-tighter text-white">Защита</h3>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium group-hover:text-white/80 transition-colors">Помогает задержать тополиный пух и уличную копоть от дорог в {{ tenant.config.city }}.</p>
                </div>
              </div>
            </div>
            <div class="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full blur-[120px] -mr-[20rem] -mt-[20rem]" :style="{ backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A' }" style="will-change: filter; transform: translateZ(0);"></div>
          </div>
          <SeoTextBlock :title="`Сетка Антипыль в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'}`" class="mt-20">
            <p>
              Сетка <strong>Антипыль</strong> (Poll-Tex) в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }} подойдёт аллергикам и жителям домов у дорог: нейлоновое полотно задерживает пыльцу и уличную пыль. Заказать расчёт можно на <NuxtLink to="/" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">главной странице</NuxtLink> — укажите размеры и выберите тип «Антипыль». Цена от 1400 ₽, металлический крепёж в комплекте, изготовление за 3 дня от {{ tenant.config.dealer_name || 'Сетки 21' }}.
            </p>
            <p>
              В каталоге {{ tenant.config.dealer_name || 'Сетки 21' }}: <NuxtLink to="/antimoshka" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антимошка</NuxtLink>, <NuxtLink to="/ultravyu" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Ультравью</NuxtLink>, <NuxtLink to="/antikoshka" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Антикошка</NuxtLink>, <NuxtLink to="/vstavnye" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">вставные VSN</NuxtLink> и <NuxtLink to="/remont" class="underline font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">ремонт сеток</NuxtLink>. Доставка и самовывоз по {{ tenant.config.city || 'Чебоксарам и Новочебоксарске' }}.
            </p>
            <p>
              Сетка Антипыль (Poll-Tex) снижает количество пыли и пыльцы в помещении за счёт электростатического эффекта нейлонового полотна. Рекомендуем аллергикам и жителям домов у дорог в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }}. Промывка 1–2 раза в сезон — полотно легко чистится под душем.
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

          <OtherServicesLinks exclude="/antipyl" />
      </div>
    </section>
  </div>
</template>
