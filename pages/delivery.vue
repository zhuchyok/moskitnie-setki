<script setup lang="ts">
const tenant = useTenantStore()
const defaultDealerName = computed(() => tenant.config.city?.includes('Чебоксары') ? 'Сетки 21' : 'Сетки Москитки')

const title = computed(() => `Доставка и замер москитных сеток — ${tenant.config.city || 'Чебоксары'}`)
const description = computed(() => `Доставка и замер москитных сеток по ${tenant.config.city || 'вашему городу'}. ${tenant.config.dealer_name || defaultDealerName.value} — изготовление за 1 день.`)
const requestURL = useRequestURL()
const url = requestURL?.origin ? `${requestURL.origin}/delivery` : 'https://www.setki21.ru/delivery'
const image = computed(() => tenant.config.branding?.logo_url || (requestURL?.origin ? `${requestURL.origin}/images/logo_final_v58.png` : 'https://www.setki21.ru/images/logo_final_v58.png'))

const serviceSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Доставка и замер москитных сеток',
  description: `Доставка москитных сеток по ${tenant.config.city || 'Чебоксарам'}. Замер на месте.`,
  provider: {
    '@type': 'LocalBusiness',
    name: tenant.config.dealer_name || defaultDealerName.value,
    image: image.value,
    telephone: tenant.config.phone || '+7 (8352) 38-14-20',
    address: {
      '@type': 'PostalAddress',
      streetAddress: tenant.config.contacts?.address || 'ул. Гражданская, 53',
      addressLocality: tenant.config.city || 'Чебоксары',
      addressCountry: 'RU'
    }
  },
  areaServed: [{ '@type': 'City', name: tenant.config.city || 'Чебоксары' }]
}))

const showCallbackModal = ref(false)
const callbackToEmail = computed(() => {
  const emails = tenant.config?.contacts?.emails
  if (Array.isArray(emails) && emails.length > 0 && emails[0]) return String(emails[0]).trim()
  const mainEmail = tenant.config?.email
  if (mainEmail) return String(mainEmail).trim()
  return undefined
})

const openCallback = () => {
  showCallbackModal.value = true
}

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ],
  script: [{ type: 'application/ld+json', children: computed(() => JSON.stringify(serviceSchema.value)) }],
})

const steps = [
  { title: 'Заявка', desc: 'Оставьте заявку на сайте или позвоните нам. Мы проконсультируем вас по типам сеток.', icon: '📞' },
  { title: 'Замер', desc: 'Наш мастер приедет в удобное время, сделает точный замер и покажет образцы.', icon: '📏' },
  { title: 'Производство', desc: 'Изготовим ваши сетки на собственном производстве от 1 рабочего дня.', icon: '🏭' },
  { title: 'Установка', desc: 'Доставим и установим сетки. Вы проверяете работу и оплачиваете заказ.', icon: '🛠️' }
]
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20">
    <CallbackModal v-model:open="showCallbackModal" :to-email="callbackToEmail" />
    <!-- Hero Section (Style from dealers.vue) -->
    <section class="bg-brand-dark text-white py-20 relative overflow-hidden">
      <div class="container mx-auto px-4 relative z-10 text-center">
        <h1 class="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter text-white">
          Доставка <span :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">и замер</span>
        </h1>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Профессиональный сервис от компании {{ tenant.config.dealer_name || defaultDealerName }}. 
          Мы берем на себя все хлопоты: от точного замера до быстрой доставки и качественной установки.
        </p>
      </div>
      <div class="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-blue/10 rounded-full blur-[120px] -mr-[20rem] -mt-[20rem]"></div>
    </section>

    <div class="container mx-auto px-4 -mt-10 relative z-20">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Main Content (Style from dealers.vue) -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Steps / Process (Style from dealers.vue) -->
          <div class="bg-white p-10 md:p-16 rounded-[3rem] shadow-xl border border-gray-100">
            <h2 class="text-3xl font-black text-brand-dark mb-12 uppercase tracking-tighter">Как мы работаем?</h2>
            <div class="space-y-12">
              <div v-for="(step, idx) in steps" :key="idx" class="flex gap-8 group">
                <div class="shrink-0 w-12 h-12 bg-brand-blue text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-brand-blue/30 group-hover:scale-110 transition-transform duration-300"
                     :style="{ backgroundColor: tenant.config.branding?.primary_color || '#2A6AB2', boxShadow: `0 10px 30px -5px ${(tenant.config.branding?.primary_color || '#2A6AB2')}66` }">
                  {{ idx + 1 }}
                </div>
                <div>
                  <h4 class="text-xl font-black text-brand-dark mb-2 uppercase tracking-tight group-hover:text-brand-blue transition-colors" :style="{ '--hover-color': tenant.config.branding?.primary_color || '#2A6AB2' }">
                    {{ step.title }}
                  </h4>
                  <p class="text-gray-500 font-medium text-lg leading-relaxed">{{ step.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Detailed Info Block (Style from dealers.vue) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Замер -->
            <div class="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-blue mb-6" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2', backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A' }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h3 class="text-xl font-black text-brand-dark mb-4 uppercase tracking-tight">Профессиональный замер</h3>
              <p class="text-gray-500 leading-relaxed font-medium mb-6 flex-grow">
                Наш мастер приедет с образцами всех типов полотен (Антикошка, Антипыль и др.) и сделает точный расчет стоимости на месте.
              </p>
              <a @click="openCallback"
                 class="w-full text-center py-4 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] shadow-lg hover:opacity-90 transition-all cursor-pointer"
                 :style="{ backgroundColor: tenant.config.branding?.primary_color || '#2A6AB2' }">
                Вызвать замерщика
              </a>
            </div>

            <!-- Доставка -->
            <div class="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-blue mb-6" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2', backgroundColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '1A' }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 class="text-xl font-black text-brand-dark mb-4 uppercase tracking-tight">Доставка и самовывоз</h3>
              <p class="text-gray-500 leading-relaxed font-medium mb-6 flex-grow">
                Мы бережно доставим ваши сетки на специально оборудованном транспорте по {{ tenant.config.city || 'вашему городу' }}.
              </p>
              <div class="space-y-3 mb-6">
                <template v-if="tenant.config.contacts?.branches?.length">
                  <div v-for="branch in tenant.config.contacts.branches" :key="branch.id" class="flex items-start gap-2">
                    <span class="text-lg">📍</span>
                    <span class="text-xs font-bold text-gray-500">{{ branch.address }}</span>
                  </div>
                </template>
                <div v-else class="flex items-start gap-2">
                  <span class="text-lg">📍</span>
                  <span class="text-xs font-bold text-gray-500">{{ tenant.config.contacts?.address || 'ул. Гражданская, 53, оф.1' }}</span>
                </div>
              </div>
              <NuxtLink to="/contacts" 
                 class="w-full text-center py-4 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] transition-all"
                 :style="{ borderColor: tenant.config.branding?.primary_color || '#2A6AB2', color: tenant.config.branding?.primary_color || '#2A6AB2' }">
                Пункты выдачи
              </NuxtLink>
            </div>
          </div>

          <!-- Video (Style from dealers.vue context) -->
          <div class="bg-white p-10 md:p-16 rounded-[3rem] shadow-xl border border-gray-100">
            <h2 class="text-3xl font-black text-brand-dark mb-10 uppercase tracking-tighter">Видео-инструкция</h2>
            <div class="relative group aspect-video rounded-3xl overflow-hidden border border-gray-100 shadow-2xl">
              <VideoLazy src="/zamer.mp4" :title="`Как происходит замер москитной сетки в ${tenant.config.city}`" poster="/images/zamer-poster.jpg" />
            </div>
          </div>

          <!-- Reviews (Style from dealers.vue context) -->
          <div class="bg-white p-10 md:p-16 rounded-[3rem] shadow-xl border border-gray-100">
             <Reviews />
          </div>
        </div>

        <!-- Sidebar (Style from dealers.vue) -->
        <div class="lg:col-span-1">
          <div class="sticky top-24 space-y-8">
            <div class="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
              <div class="p-8 md:p-10 text-center">
                <div class="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 class="text-2xl font-black text-brand-dark mb-4 uppercase tracking-tighter">
                  Узнайте стоимость
                </h3>
                <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-8 leading-relaxed">
                  Рассчитайте цену ваших сеток онлайн за 1 минуту
                </p>
                <NuxtLink to="/" 
                        class="w-full inline-block text-white font-black py-5 rounded-2xl transition-all shadow-xl active:scale-95 uppercase text-[10px] tracking-[0.2em] hover:opacity-90"
                        :style="{ backgroundColor: tenant.config.branding?.primary_color || '#2A6AB2', boxShadow: `0 20px 50px -10px ${(tenant.config.branding?.primary_color || '#2A6AB2')}66` }">
                  В калькулятор
                </NuxtLink>
              </div>
            </div>

            <div class="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 p-8 md:p-10">
              <h4 class="text-xl font-black text-brand-dark mb-6 uppercase tracking-tighter">Гарантии</h4>
              <div class="space-y-6">
                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p class="text-xs font-bold text-gray-500 leading-relaxed">Гарантия на монтаж 1 год</p>
                </div>
                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p class="text-xs font-bold text-gray-500 leading-relaxed">Только металлический крепеж</p>
                </div>
                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p class="text-xs font-bold text-gray-500 leading-relaxed">Изготовление от 1 рабочего дня</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
