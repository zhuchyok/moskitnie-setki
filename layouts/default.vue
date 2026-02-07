<script setup lang="ts">
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
  ])
})
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans text-brand-dark selection:bg-brand-blue selection:text-white" style="color: #333333">
    <!-- Top Header -->
    <header class="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
      <div class="container mx-auto px-4 py-3">
        <div class="flex flex-wrap justify-between items-center gap-4">
          <!-- Logo Section -->
          <NuxtLink to="/" class="logo-link flex items-center gap-3 sm:gap-4 group min-w-0 flex-shrink-0" style="color: inherit; text-decoration: none">
            <img src="/images/logo_clean.png?v=2" alt="Сетки 21" class="h-10 sm:h-12 w-10 sm:w-12 flex-shrink-0 object-contain transition-transform group-hover:scale-105" width="48" height="48" loading="eager" decoding="async" />
            <div class="min-w-0" style="color: #333333">
              <p class="text-base sm:text-lg md:text-xl font-black leading-none text-brand-blue tracking-tight uppercase m-0" style="color: #2A6AB2" aria-label="Сетки 21">СЕТКИ 21</p>
              <p class="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold mt-0.5" style="color: #9ca3af">
                <span class="sm:hidden">Производство</span>
                <span class="hidden sm:inline">Производство замер монтаж от 1 дня</span>
              </p>
            </div>
          </NuxtLink>

          <!-- Contact Section -->
          <div class="flex items-center gap-6" style="color: #333333">
            <div class="hidden lg:block text-right">
              <p class="text-[10px] font-bold uppercase mb-1" style="color: #9ca3af">Режим работы: Пн–Пт 10:00–18:00</p>
              <p class="text-sm font-bold">Чебоксары и Новочебоксарск</p>
            </div>
            <a
              href="tel:+78352381420"
              class="flex flex-col items-end group"
              style="color: inherit; text-decoration: none"
              @click="() => { try { (window as any).reachMetrikaGoal?.('CALL_CLICK') } catch (_) {} }"
            >
              <span class="text-xl font-black group-hover:text-brand-blue transition-colors leading-none" style="color: #333333">
                +7 (8352) 38-14-20
              </span>
              <span class="text-[10px] font-bold border-b border-brand-blue/30 group-hover:border-brand-blue transition-all uppercase tracking-wider" style="color: #2A6AB2; border-color: rgba(42,106,178,0.3)">Заказать обратный звонок</span>
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
                  active-class="bg-brand-blue text-white shadow-md"
                  inactive-class="text-gray-600 hover:text-brand-blue hover:bg-blue-50"
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
                active-class="bg-brand-blue text-white shadow-md transform -translate-y-0.5"
                inactive-class="text-gray-500 hover:text-brand-blue hover:bg-blue-50"
              >
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <nav v-if="breadcrumbs.length" class="container mx-auto px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500" aria-label="Хлебные крошки">
        <ol class="flex flex-wrap items-center gap-1.5">
          <li v-for="(item, i) in breadcrumbs" :key="item.path" class="flex items-center gap-1.5">
            <template v-if="i > 0"><span aria-hidden="true">/</span></template>
            <NuxtLink v-if="i < breadcrumbs.length - 1" :to="item.path" class="hover:text-brand-blue transition-colors">{{ item.name }}</NuxtLink>
            <span v-else class="text-brand-dark" aria-current="page">{{ item.name }}</span>
          </li>
        </ol>
      </nav>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-brand-dark text-white pt-16 pb-8">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center gap-4 mb-6">
              <img src="/images/logo_clean.png" alt="Сетки 21" class="h-10 brightness-0 invert" />
              <div>
                <h3 class="text-xl font-black text-white uppercase tracking-tight">СЕТКИ 21</h3>
                <p class="text-[10px] text-gray-500 uppercase tracking-widest">Производство замер монтаж от 1 дня</p>
              </div>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed max-w-md font-medium">
              Изготовим москитные сетки на окна в Чебоксарах и Новочебоксарске по индивидуальным размерам за 1 день. 
              Используем только качественные комплектующие и металлический крепеж.
            </p>
          </div>
          <div>
            <h4 class="font-bold text-lg mb-6 border-l-4 border-brand-blue pl-4 uppercase tracking-widest text-sm">Продукция</h4>
            <ul class="space-y-3 text-sm text-gray-400">
              <li v-for="link in navLinks" :key="link.path">
                <NuxtLink :to="link.path" class="footer-link hover:text-white transition-colors uppercase text-xs font-bold">{{ link.name }}</NuxtLink>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-lg mb-6 border-l-4 border-brand-blue pl-4 uppercase tracking-widest text-sm">Контакты</h4>
            <div class="space-y-4 text-sm text-gray-400 font-medium">
              <p>📍 Чебоксары, ул. Гражданская, 53, оф.1</p>
              <p>📍 Новочебоксарск, ул. Винокурова, 109</p>
              <p>🕐 Пн–Пт 10:00–18:00</p>
              <p>📞 +7 (8352) 38-14-20</p>
              <p>✉️ <a href="mailto:info@setki21.ru" class="hover:text-white transition-colors">info@setki21.ru</a></p>
              <p class="text-gray-500 text-xs">Работаем по Чебоксарам и Новочебоксарску</p>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
          <p>© {{ footerYear }} Сетки 21. Все права защищены.</p>
          <div class="flex flex-wrap justify-center gap-6">
            <NuxtLink to="/contacts" class="hover:text-white transition-colors">Контакты</NuxtLink>
            <NuxtLink to="/delivery" class="hover:text-white transition-colors">Доставка и замер</NuxtLink>
            <NuxtLink to="/privacy" class="hover:text-white transition-colors">Политика конфиденциальности</NuxtLink>
            <NuxtLink to="/karta-sajta" class="hover:text-white transition-colors">Карта сайта</NuxtLink>
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
                Подробнее см. <NuxtLink to="/privacy" class="text-brand-blue font-bold underline decoration-2 underline-offset-4 hover:text-[#1e5a9a] transition-colors">Политику обработки персональных данных</NuxtLink>.
              </p>
              
              <!-- Чекбоксы и кнопки -->
              <div class="flex flex-wrap items-center gap-6">
                <label class="flex items-center gap-2 cursor-not-allowed">
                  <input type="checkbox" checked disabled class="w-4 h-4 accent-brand-blue" />
                  <span class="text-sm font-bold text-gray-400">Необходимые</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" v-model="analyticsChecked" class="w-4 h-4 accent-brand-blue cursor-pointer" />
                  <span class="text-sm font-bold text-brand-dark group-hover:text-brand-blue transition-colors">Аналитические</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" v-model="marketingChecked" class="w-4 h-4 accent-brand-blue cursor-pointer" />
                  <span class="text-sm font-bold text-brand-dark group-hover:text-brand-blue transition-colors">Маркетинговые</span>
                </label>
                
                <div class="flex gap-3 ml-auto">
                  <button @click="saveSelectedCookies" class="bg-white border-2 border-brand-blue text-brand-blue font-black py-3 px-6 rounded-xl hover:bg-brand-blue hover:text-white transition-all text-xs uppercase tracking-wider">
                    Сохранить выбор
                  </button>
                  <button @click="acceptAllCookies" class="bg-brand-blue text-white font-black py-3 px-6 rounded-xl hover:bg-[#1e5a9a] transition-all shadow-lg shadow-brand-blue/30 text-xs uppercase tracking-wider">
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
.router-link-active {
  @apply bg-brand-blue text-white shadow-md;
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
</style>
