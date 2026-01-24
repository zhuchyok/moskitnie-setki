<script setup lang="ts">
const navLinks = [
  { name: 'МОСКИТНАЯ', path: '/' },
  { name: 'АНТИМОШКА', path: '/antimoshka' },
  { name: 'АНТИКОШКА', path: '/antikoshka' },
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
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans text-brand-dark selection:bg-brand-blue selection:text-white">
    <!-- Top Header -->
    <header class="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
      <div class="container mx-auto px-4 py-3">
        <div class="flex flex-wrap justify-between items-center gap-4">
          <!-- Logo Section -->
          <NuxtLink to="/" class="logo-link flex items-center gap-4 group">
            <img src="/images/logo_clean.png?v=2" alt="Сетки 21" class="h-12 transition-transform group-hover:scale-105" />
            <div class="hidden sm:block">
              <h1 class="text-xl font-black leading-none text-brand-blue tracking-tight uppercase">СЕТКИ 21</h1>
              <p class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Производство в Чебоксарах</p>
            </div>
          </NuxtLink>

          <!-- Contact Section -->
          <div class="flex items-center gap-6">
            <div class="hidden lg:block text-right">
              <p class="text-[10px] text-gray-400 font-bold uppercase mb-1">Режим работы: 10:00 - 18:00</p>
              <p class="text-sm font-bold">Чебоксары и Новочебоксарск</p>
            </div>
            <a href="tel:+78352381420" class="flex flex-col items-end group">
              <span class="text-xl font-black group-hover:text-brand-blue transition-colors leading-none">
                +7 (8352) 38-14-20
              </span>
              <span class="text-[10px] text-brand-blue font-bold border-b border-brand-blue/30 group-hover:border-brand-blue transition-all uppercase tracking-wider">Заказать обратный звонок</span>
            </a>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="mt-4 border-t border-gray-50 pt-3">
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
                <p class="text-[10px] text-gray-500 uppercase tracking-widest">Производство в Чебоксарах</p>
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
              <p>📞 +7 (8352) 38-14-20</p>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
          <p>© {{ new Date().getFullYear() }} Сетки 21. Все права защищены.</p>
          <div class="flex gap-6">
            <NuxtLink to="/privacy" class="hover:text-white transition-colors">Политика конфиденциальности</NuxtLink>
            <a href="#" class="hover:text-white transition-colors">Карта сайта</a>
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
