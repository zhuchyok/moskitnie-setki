<script setup lang="ts">
import { useTenantStore } from '~/stores/tenant'

const tenant = useTenantStore()

const navLinks = [
  { name: 'МОСКИТНАЯ', path: '/' },
  { name: 'АНТИМОШКА', path: '/antimoshka' },
  { name: 'АНТИКОШКА', path: '/antikoshka' },
  { name: 'УЛЬТРАВЬЮ', path: '/ultravyu' },
  { name: 'АНТИПЫЛЬ', path: '/antipyl' },
  { name: 'ВСТАВНАЯ VSN', path: '/vstavnye' },
  { name: 'РЕМОНТ', path: '/remont' },
]

// Cookie Banner Logic
const showCookieBanner = ref(false)
const cookieAccepted = useCookie('cookie_accepted', { maxAge: 60 * 60 * 24 * 365 })
const cookieAnalytics = useCookie('cookie_analytics', { maxAge: 60 * 60 * 24 * 365 })
const cookieMarketing = useCookie('cookie_marketing', { maxAge: 60 * 60 * 24 * 365 })

const analyticsChecked = ref(false)
const marketingChecked = ref(false)

onMounted(() => {
  if (!cookieAccepted.value) {
    setTimeout(() => {
      showCookieBanner.value = true
    }, 1000)
  }
})

const saveSelectedCookies = () => {
  cookieAnalytics.value = analyticsChecked.value ? 'yes' : 'no'
  cookieMarketing.value = marketingChecked.value ? 'yes' : 'no'
  cookieAccepted.value = 'yes'
  showCookieBanner.value = false
}

const acceptAllCookies = () => {
  analyticsChecked.value = true
  marketingChecked.value = true
  cookieAnalytics.value = 'yes'
  cookieMarketing.value = 'yes'
  cookieAccepted.value = 'yes'
  showCookieBanner.value = false
}

// Footer year — единое значение для сервера и клиента, чтобы не было рассинхрона при гидрации
const footerYear = useState('footerYear', () => new Date().getFullYear())

// Mobile Menu
const mobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// Хлебные крошки из текущего маршрута
const BASE_URL = 'https://www.setki21.ru'
const pathNames: Record<string, string> = {
  '/': 'Главная',
  '/antimoshka': 'Антимошка',
  '/ultravyu': 'Ультравью',
  '/antikoshka': 'Антикошка',
  '/antipyl': 'Антипыль',
  '/vstavnye': 'Вставная VSN',
  '/remont': 'Ремонт',
  '/contacts': 'Контакты',
  '/delivery': 'Доставка и замер',
  '/privacy': 'Политика конфиденциальности',
  '/karta-sajta': 'Карта сайта'
}
const route = useRoute()
const breadcrumbs = computed(() => {
  const path = route.path.replace(/\/$/, '') || '/'
  const items: { path: string; name: string }[] = []
  if (path === '/') {
    items.push({ path: '/', name: pathNames['/'] })
  } else {
    items.push({ path: '/', name: pathNames['/'] })
    const name = pathNames[path] || path.slice(1)
    items.push({ path, name })
  }
  return items
})
const breadcrumbSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.value.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${BASE_URL}${item.path === '/' ? '' : item.path}`
  }))
}))
useHead({
  script: computed(() => [
    { type: 'application/ld+json', children: JSON.stringify(breadcrumbSchema.value) }
  ]),
  link: computed(() => {
    const logoUrl = tenant.config.branding?.logo_url || '/favicon.ico'
    const isPng = logoUrl.toLowerCase().endsWith('.png')
    // Используем dealer_id для стабильного кэширования фавикона, 
    // чтобы при смене дилера он обновлялся, но не мерцал при каждом рендере
    const v = tenant.config.dealer_id || 'default'
    const href = logoUrl.includes('?') ? `${logoUrl}&v=${v}` : `${logoUrl}?v=${v}`
    
    return [
      { key: 'favicon', rel: 'icon', type: isPng ? 'image/png' : 'image/x-icon', href },
      { key: 'shortcut', rel: 'shortcut icon', href },
      { key: 'apple', rel: 'apple-touch-icon', href }
    ]
  })
})
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans text-brand-dark selection:bg-brand-blue selection:text-white" style="color: #333333" :style="{ '--brand-primary': tenant.config.branding?.primary_color || '#2A6AB2' }">
    <!-- Top Header -->
    <header class="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
      <div class="container mx-auto px-4 py-3">
        <div class="flex flex-wrap justify-between items-center gap-4">
            <!-- Logo Section -->
          <NuxtLink to="/" class="logo-link flex items-center gap-3 sm:gap-4 group min-w-0 flex-shrink-0" style="color: inherit; text-decoration: none">
            <img :src="tenant.config.branding?.logo_url || '/images/logo_clean.png?v=2'" :alt="tenant.config.dealer_name || 'Сетки 21'" class="h-10 sm:h-12 w-10 sm:w-12 flex-shrink-0 object-contain transition-transform group-hover:scale-105" width="48" height="48" loading="eager" decoding="async" />
            <div class="min-w-0" style="color: #333333">
              <p class="text-base sm:text-lg md:text-xl font-black leading-none text-brand-blue tracking-tight uppercase m-0" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }" :aria-label="tenant.config.dealer_name || 'Сетки 21'">{{ tenant.config.dealer_name || 'СЕТКИ 21' }}</p>
              <p class="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold mt-0.5" style="color: #9ca3af">
                <span class="sm:hidden">Производство</span>
                <span class="hidden sm:inline">{{ tenant.config.branding?.short_description || 'Производство замер монтаж от 1 дня' }}</span>
              </p>
            </div>
          </NuxtLink>

          <!-- Contact Section -->
          <div class="flex items-center gap-6" style="color: #333333">
            <div class="hidden lg:block text-right">
              <p class="text-[10px] font-bold uppercase mb-1" style="color: #9ca3af">Режим работы: {{ tenant.config.branding?.working_hours || 'Пн–Пт 10:00–18:00' }}</p>
              <p class="text-sm font-bold">{{ tenant.config.city || 'Чебоксары и Новочебоксарск' }}</p>
            </div>
            <a
              :href="'tel:' + (tenant.config.phone || '+78352381420').replace(/[^0-9+]/g, '')"
              class="flex flex-col items-end group phone-link"
              style="color: inherit; text-decoration: none"
              :style="{ '--brand-primary': tenant.config.branding?.primary_color || '#2A6AB2' }"
              @click="() => { try { (window as any).reachMetrikaGoal?.('CALL_CLICK') } catch (_) {} }"
            >
              <span class="text-xl font-black transition-colors leading-none phone-number" style="color: #333333">
                {{ tenant.config.phone || '+7 (8352) 38-14-20' }}
              </span>
              <span class="text-[10px] font-bold border-b transition-all uppercase tracking-wider" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2', borderColor: (tenant.config.branding?.primary_color || '#2A6AB2') + '4D' }">Заказать обратный звонок</span>
            </a>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="flex md:hidden items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Меню</span>
          <button @click="toggleMobileMenu" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Mobile Menu Dropdown -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <nav v-if="mobileMenuOpen" class="md:hidden mt-3 pb-3">
            <ul class="flex flex-col gap-1">
              <li v-for="link in navLinks" :key="link.path">
                <NuxtLink 
                  :to="link.path" 
                  @click="closeMobileMenu"
                  class="block px-4 py-3 rounded-xl text-sm font-black transition-all uppercase tracking-wider"
                  active-class="nav-link-active text-white shadow-md"
                  inactive-class="text-gray-600 hover-brand-text hover-brand-bg"
                >
                  {{ link.name }}
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </Transition>

        <!-- Desktop Navigation Menu -->
        <nav class="hidden md:block mt-4 border-t border-gray-50 pt-3">
          <ul class="flex flex-wrap justify-center gap-1 sm:gap-4">
            <li v-for="link in navLinks" :key="link.path">
              <NuxtLink 
                :to="link.path" 
                class="px-3 py-2 rounded-lg text-[11px] sm:text-xs font-black transition-all uppercase tracking-wider"
                active-class="nav-link-active text-white shadow-md transform -translate-y-0.5"
                inactive-class="text-gray-500 hover-brand-text hover-brand-bg"
              >
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow relative">
      <div v-if="breadcrumbs.length > 1 && route.path !== '/'" class="absolute top-0 left-0 right-0 z-20">
        <nav class="container mx-auto px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500" aria-label="Хлебные крошки">
          <ol class="flex flex-wrap items-center gap-1.5">
            <li v-for="(item, i) in breadcrumbs" :key="item.path" class="flex items-center gap-1.5">
              <template v-if="i > 0"><span aria-hidden="true">/</span></template>
              <NuxtLink v-if="i < breadcrumbs.length - 1" :to="item.path" class="hover-brand-text transition-colors">{{ item.name }}</NuxtLink>
              <span v-else class="text-brand-dark" aria-current="page">{{ item.name }}</span>
            </li>
          </ol>
        </nav>
      </div>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-brand-dark text-white pt-16 pb-8">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center gap-4 mb-6">
              <img :src="tenant.config.branding?.logo_url || '/images/logo_clean.png'" 
                   :alt="tenant.config.dealer_name || 'Сетки 21'" 
                   class="h-14 sm:h-16 w-auto object-contain bg-white/10 rounded-xl p-2" 
                   @error="(e: any) => e.target.src = '/images/logo_clean.png'" />
              <div>
                <h3 class="text-xl md:text-2xl font-black text-white uppercase tracking-tight">{{ tenant.config.dealer_name || 'СЕТКИ 21' }}</h3>
                <p class="text-[10px] text-white uppercase tracking-widest opacity-60">{{ tenant.config.branding?.short_description || 'Производство замер монтаж от 1 дня' }}</p>
              </div>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed max-w-md font-medium">
              {{ tenant.config.seo?.description || 'Изготовим москитные сетки на окна по индивидуальным размерам за 1 день. Используем только качественные комплектующие и металлический крепеж.' }}
            </p>
          </div>
          <div>
            <h4 class="font-bold text-lg mb-6 border-l-4 border-brand-blue pl-4 uppercase tracking-widest text-sm" :style="{ borderColor: tenant.config.branding?.primary_color || '#2A6AB2' }">Продукция</h4>
            <ul class="space-y-3 text-sm text-gray-400">
              <li v-for="link in navLinks" :key="link.path">
                <NuxtLink :to="link.path" class="footer-link hover:text-white transition-colors uppercase text-xs font-bold">{{ link.name }}</NuxtLink>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-lg mb-6 border-l-4 border-brand-blue pl-4 uppercase tracking-widest text-sm" :style="{ borderColor: tenant.config.branding?.primary_color || '#2A6AB2' }">Контакты</h4>
            <div class="space-y-4 text-sm text-gray-400 font-medium">
              <p v-if="tenant.config.city">📍 {{ tenant.config.city }}</p>
              <p v-else>📍 Чебоксары, ул. Гражданская, 53, оф.1</p>
              <p v-if="tenant.config.branding?.working_hours">🕐 {{ tenant.config.branding.working_hours }}</p>
              <p v-else>🕐 Пн–Пт 10:00–18:00</p>
              <p v-if="tenant.config.phone">📞 {{ tenant.config.phone }}</p>
              <p v-else>📞 +7 (8352) 38-14-20</p>
              <p v-if="tenant.config.contacts?.emails?.length">✉️ <a :href="'mailto:' + tenant.config.contacts.emails[0]" class="hover:text-white transition-colors">{{ tenant.config.contacts.emails[0] }}</a></p>
              <p v-else>✉️ <a href="mailto:info@setki21.ru" class="hover:text-white transition-colors">info@setki21.ru</a></p>
              <p class="text-gray-500 text-xs">Работаем по {{ tenant.config.city || 'Чебоксарам и Новочебоксарску' }}</p>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
          <p>© {{ footerYear }} {{ tenant.config.dealer_name || 'Сетки 21' }}. Все права защищены.</p>
          <div class="flex flex-wrap justify-center gap-6">
            <NuxtLink to="/contacts" class="hover:text-white transition-colors">Контакты</NuxtLink>
            <NuxtLink to="/delivery" class="hover:text-white transition-colors">Доставка и замер</NuxtLink>
            <NuxtLink to="/privacy" class="hover:text-white transition-colors">Политика конфиденциальности</NuxtLink>
            <NuxtLink to="/karta-sajta" class="hover:text-white transition-colors">Карта сайта</NuxtLink>
            <NuxtLink to="/admin/dealers" class="hover:text-white transition-colors">Дилерам</NuxtLink>
          </div>
        </div>
      </div>
    </footer>

    <!-- Cookie Banner -->
    <Transition
      enter-active-class="transition duration-700 ease-out"
      enter-from-class="transform translate-y-full opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-500 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform translate-y-full opacity-0 scale-95"
    >
      <div v-if="showCookieBanner" class="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-8">
        <div class="container mx-auto max-w-5xl">
          <div class="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.4)] border border-white/20 p-8 md:p-10 relative overflow-hidden">
            <!-- Декор -->
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-brand-blue/5 rounded-full blur-3xl"></div>
            
            <div class="relative z-10">
              <!-- Заголовок -->
              <div class="flex items-center gap-3 mb-4">
                <h4 class="text-sm font-black uppercase tracking-[0.2em] text-brand-dark">Конфиденциальность</h4>
              </div>
              
              <!-- Текст -->
              <p class="text-sm text-gray-600 leading-relaxed mb-6">
                Мы используем файлы cookie: 
                <b class="text-brand-dark">необходимые</b> (для работы сайта), 
                <b class="text-brand-dark">аналитические</b> (для сбора статистики), 
                <b class="text-brand-dark">маркетинговые</b> (для персонализации рекламы). 
                Подробнее см. <NuxtLink to="/privacy" class="text-brand-blue font-bold underline decoration-2 underline-offset-4 hover-brand-text transition-colors" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Политику обработки персональных данных</NuxtLink>.
              </p>
              
              <!-- Чекбоксы и кнопки -->
              <div class="flex flex-wrap items-center gap-6">
                <label class="flex items-center gap-2 cursor-not-allowed">
                  <input type="checkbox" checked disabled class="w-4 h-4" :style="{ accentColor: tenant.config.branding?.primary_color || '#2A6AB2' }" />
                  <span class="text-sm font-bold text-gray-400">Необходимые</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" v-model="analyticsChecked" class="w-4 h-4 cursor-pointer" :style="{ accentColor: tenant.config.branding?.primary_color || '#2A6AB2' }" />
                  <span class="text-sm font-bold text-brand-dark group-hover:text-brand-blue transition-colors" :style="{ '--hover-color': tenant.config.branding?.primary_color || '#2A6AB2' }">Аналитические</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" v-model="marketingChecked" class="w-4 h-4 cursor-pointer" :style="{ accentColor: tenant.config.branding?.primary_color || '#2A6AB2' }" />
                  <span class="text-sm font-bold text-brand-dark group-hover:text-brand-blue transition-colors" :style="{ '--hover-color': tenant.config.branding?.primary_color || '#2A6AB2' }">Маркетинговые</span>
                </label>
                
                <div class="flex gap-3 ml-auto">
                  <button 
                    @click="saveSelectedCookies" 
                    class="btn-outline-dynamic bg-white border-2 font-black py-3 px-6 rounded-xl transition-all text-xs uppercase tracking-wider" 
                    :style="{ 
                      borderColor: tenant.config.branding?.primary_color || '#2A6AB2', 
                      color: tenant.config.branding?.primary_color || '#2A6AB2',
                      '--dynamic-brand-color': tenant.config.branding?.primary_color || '#2A6AB2'
                    }"
                  >
                    Сохранить выбор
                  </button>
                  <button 
                    @click="acceptAllCookies" 
                    class="bg-brand-blue text-white font-black py-3 px-6 rounded-xl hover:opacity-90 transition-all shadow-lg text-xs uppercase tracking-wider" 
                    :style="{ backgroundColor: tenant.config.branding?.primary_color || '#2A6AB2' }"
                  >
                    Принять все
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
/* Цвет дилера при hover (--brand-primary задаётся на корне layout) */
.hover-brand-text:hover {
  color: var(--brand-primary, #2A6AB2) !important;
}
.hover-brand-bg:hover {
  background-color: color-mix(in srgb, var(--brand-primary, #2A6AB2) 12%, white) !important;
}
.nav-link-active {
  background-color: var(--brand-primary, #2A6AB2) !important;
  color: white !important;
}
.router-link-active {
  @apply shadow-md;
}

/* Fix for hover on outline buttons with dynamic colors */
.btn-outline-dynamic:hover {
  background-color: var(--dynamic-brand-color, #2A6AB2) !important;
  color: white !important;
  border-color: var(--dynamic-brand-color, #2A6AB2) !important;
}

/* Logo link should never have active background */
.logo-link.router-link-active {
  background-color: transparent !important;
  color: inherit !important;
  box-shadow: none !important;
}

/* Footer links should not have active styling */
.footer-link.router-link-active {
  background-color: transparent !important;
  color: #9ca3af !important;
  box-shadow: none !important;
}
.footer-link.router-link-active:hover {
  color: #ffffff !important;
}

/* Cookie banner hover colors */
.group:hover .group-hover\:text-brand-blue {
  color: var(--hover-color, #2A6AB2) !important;
}

/* Phone number hover color */
.phone-link:hover .phone-number {
  color: var(--brand-primary, #2A6AB2) !important;
}
</style>
