<script setup lang="ts">
const tenant = useTenantStore()
const defaultDealerName = computed(() => tenant.config.city?.includes('Чебоксары') ? 'Сетки 21' : 'Сетки Москитки')

const title = computed(() => `Контакты — ${tenant.config.dealer_name || defaultDealerName.value}, ${tenant.config.city || 'Чебоксары'}`)
const description = computed(() => `Адреса офисов, телефон, режим работы компании ${tenant.config.dealer_name || defaultDealerName.value}. Замер и установка москитных сеток в ${tenant.config.city || 'вашем городе'}.`)
const unicodeOrigin = useUnicodeOrigin()
const url = computed(() => {
  const origin = unicodeOrigin || 'https://www.setki21.ru'
  return `${origin}/contacts/`
})
const image = computed(() => tenant.config.branding?.logo_url || (unicodeOrigin ? `${unicodeOrigin}/images/logo_final_v58.png` : 'https://www.setki21.ru/images/logo_final_v58.png'))

const contactSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: `Контакты ${tenant.config.dealer_name || defaultDealerName.value}`,
  description: `Контактная информация для заказа москитных сеток в ${tenant.config.city}`,
  url: url.value,
  mainEntity: {
    '@type': 'LocalBusiness',
    name: tenant.config.dealer_name || defaultDealerName.value,
    image: image.value,
    telephone: tenant.config.phone || '+7 (8352) 38-14-20',
    email: tenant.config.email || tenant.config.contacts?.emails?.[0] || 'info@setki21.ru',
    priceRange: 'RUB',
    address: {
      '@type': 'PostalAddress',
      streetAddress: tenant.config.contacts?.address || 'ул. Гражданская, 53',
      addressLocality: tenant.config.city || 'Чебоксары',
      addressCountry: 'RU'
    },
    areaServed: [{ '@type': 'City', name: tenant.config.city || 'Чебоксары' }],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '18:00'
      }
    ]
  }
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

const mapContainer = ref<HTMLElement | null>(null)
let ymaps: any = null

const initMap = () => {
  if (!process.client || !mapContainer.value) return
  
  const city = tenant.config.city || 'Чебоксары'
  const branches = tenant.config.contacts?.branches || []
  const mainAddress = tenant.config.contacts?.address || 'ул. Гражданская, 53'
  
  // Формируем максимально точные адреса для Яндекса
  // Убираем любые лишние приписки, оставляем только Город, Улица, Дом
  const getCleanAddress = (addr: string) => {
    return addr
      .replace(/офис\s*\d+/gi, '')
      .replace(/этаж\s*\d+/gi, '')
      .replace(/тц\s+[\wа-яА-Я]+/gi, '')
      .replace(/ каб\.\s*\d+/gi, '')
      .trim()
  }

  let searchQuery = ''
  if (branches.length > 0) {
    searchQuery = branches.map(b => {
      const clean = getCleanAddress(b.address)
      // Если в адресе нет города, добавляем его
      return clean.includes(city) ? clean : `${city}, ${clean}`
    }).join(';') // Точка с запятой - стандарт для перечисления точек
  } else {
    const clean = getCleanAddress(mainAddress)
    searchQuery = clean.includes(city) ? clean : `${city}, ${clean}`
  }

  // Используем максимально простой URL без лишних параметров, чтобы Яндекс сам нашел точки
  const mapUrl = `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(searchQuery)}&z=11`
  
  const iframe = document.createElement('iframe')
  iframe.src = mapUrl
  iframe.width = '100%'
  iframe.height = '100%'
  iframe.frameBorder = '0'
  iframe.allowFullscreen = true
  
  if (mapContainer.value) {
    mapContainer.value.innerHTML = ''
    mapContainer.value.appendChild(iframe)
  }
}

// Следим за загрузкой конфига
watch(() => tenant.config.city, (newCity) => {
  if (newCity) {
    initMap()
  }
}, { immediate: true })

onMounted(() => {
  if (process.client) {
    initMap()
  }
})

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
  link: [
    { rel: 'canonical', href: url, key: 'canonical' }
  ],
  script: [{ type: 'application/ld+json', children: computed(() => JSON.stringify(contactSchema.value)) }],
})
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20">
    <CallbackModal v-model:open="showCallbackModal" :to-email="callbackToEmail" />
    <!-- Hero Section (Style from dealers.vue) -->
    <section class="bg-brand-dark text-white py-20 relative overflow-hidden">
      <div class="container mx-auto px-4 relative z-10 text-center">
        <h1 class="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter text-white">
          Наши <span :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">контакты</span>
        </h1>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Мы всегда на связи, чтобы помочь вам с выбором, замером и установкой идеальных москитных сеток в {{ tenant.config.city || 'вашем городе' }}.
        </p>
      </div>
      <div class="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-blue/10 rounded-full blur-[120px] -mr-[20rem] -mt-[20rem]"></div>
    </section>

    <div class="container mx-auto px-4 -mt-10 relative z-20">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Main Content (Style from dealers.vue) -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Offices Block -->
          <div class="bg-white p-10 md:p-16 rounded-[3rem] shadow-xl border border-gray-100">
            <h2 class="text-3xl font-black text-brand-dark mb-12 uppercase tracking-tighter flex items-center gap-4">
              <span class="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" :style="{ backgroundColor: tenant.config.branding?.primary_color || '#2A6AB2' }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </span>
              Пункты самовывоза
            </h2>
            
            <div class="grid md:grid-cols-1 gap-8">
              <template v-if="tenant.config.contacts?.branches?.length">
                <div v-for="branch in tenant.config.contacts.branches" :key="branch.id" 
                     class="flex gap-8 p-6 rounded-2xl border border-gray-50 bg-gray-50/30 group hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div class="shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <div>
                    <h4 class="text-xl font-black text-brand-dark mb-2 uppercase tracking-tight group-hover:text-brand-blue transition-colors" :style="{ '--hover-color': tenant.config.branding?.primary_color || '#2A6AB2' }">
                      {{ branch.name || 'Офис' }}
                    </h4>
                    <p class="text-gray-500 font-bold text-lg">{{ branch.address }}</p>
                    <div class="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <span class="w-2 h-2 rounded-full animate-pulse" :style="{ backgroundColor: tenant.config.branding?.primary_color || '#2A6AB2' }"></span>
                      Открыто для приема заказов
                    </div>
                  </div>
                </div>
              </template>
              <div v-else class="flex gap-8 p-8 rounded-3xl border border-gray-50 bg-gray-50/30">
                <div class="shrink-0 w-12 h-12 bg-white text-brand-blue rounded-2xl flex items-center justify-center font-black text-xl shadow-md" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">1</div>
                <div>
                  <h4 class="text-xl font-black text-brand-dark mb-2 uppercase tracking-tight">Основной офис: {{ tenant.config.city || 'Чебоксары' }}</h4>
                  <p class="text-gray-500 font-bold text-lg">{{ tenant.config.contacts?.address || 'ул. Гражданская, 53, оф.1' }}</p>
                  <p class="text-gray-400 text-sm mt-4 leading-relaxed font-medium">
                    Здесь вы можете посмотреть образцы всех типов полотен и забрать готовые заказы компании {{ tenant.config.dealer_name || defaultDealerName }}.
                  </p>
                </div>
              </div>
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
              <div class="p-8 md:p-10">
                <h3 class="text-2xl font-black text-brand-dark mb-10 uppercase tracking-tighter">
                  Свяжитесь с нами
                </h3>

                <div class="space-y-8">
                  <div class="group">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Телефон</p>
                    <a :href="'tel:' + (tenant.config.phone || '+78352381420').replace(/[^0-9+]/g, '')" 
                       class="text-2xl font-black hover:underline block transition-all" 
                       :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">
                      {{ tenant.config.phone || '+7 (8352) 38-14-20' }}
                    </a>
                  </div>

                  <div class="group">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email</p>
                    <a :href="'mailto:' + (tenant.config.email || tenant.config.contacts?.emails?.[0] || 'info@setki21.ru')" 
                       class="text-lg font-black hover:underline block transition-all" 
                       :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">
                      {{ tenant.config.email || tenant.config.contacts?.emails?.[0] || 'info@setki21.ru' }}
                    </a>
                  </div>

                  <div class="group">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Режим работы</p>
                    <p class="text-gray-700 font-bold text-lg leading-tight">
                      {{ tenant.config.branding?.working_hours || 'Пн–Пт 10:00–18:00' }}
                    </p>
                  </div>
                </div>

                <div class="mt-12 pt-10 border-t border-gray-100">
                  <p class="text-[10px] text-gray-400 text-center mb-8 leading-relaxed font-medium">
                    Оставьте заявку, и наш специалист свяжется с вами в течение 15 минут для консультации.
                  </p>
                  <button @click="openCallback"
                          class="w-full text-white font-black py-5 rounded-2xl transition-all shadow-xl active:scale-95 uppercase text-[10px] tracking-[0.2em] hover:opacity-90"
                          :style="{ backgroundColor: tenant.config.branding?.primary_color || '#2A6AB2', boxShadow: `0 20px 50px -10px ${(tenant.config.branding?.primary_color || '#2A6AB2')}66` }">
                    Заказать звонок
                  </button>
                </div>
              </div>
            </div>

            <!-- Secondary Info Card -->
            <div class="bg-brand-dark rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <h4 class="text-xl font-black uppercase mb-4 relative z-10">Нужен замер?</h4>
              <p class="text-gray-400 text-sm font-medium leading-relaxed mb-6 relative z-10">
                Вызовите мастера на дом. Он приедет с образцами всех типов сеток и сделает точный расчет.
              </p>
              <NuxtLink to="/delivery" class="text-[10px] font-black uppercase tracking-widest underline hover:text-white transition-colors relative z-10">
                Подробнее о замере
              </NuxtLink>
              <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
