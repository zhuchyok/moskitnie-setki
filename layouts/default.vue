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

onMounted(() => {
  if (!cookieAccepted.value) {
    setTimeout(() => {
      showCookieBanner.value = true
    }, 1000)
  }
})

const acceptCookies = () => {
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
          <NuxtLink to="/" class="flex items-center gap-4 group">
            <img src="/images/logo_clean.png" alt="Сетки 21" class="h-12 transition-transform group-hover:scale-105" />
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
            <img src="/images/logo_clean.png" alt="Сетки 21" class="h-10 mb-6 brightness-0 invert" />
            <p class="text-gray-400 text-sm leading-relaxed max-w-md font-medium">
              Изготовим москитные сетки на окна в Чебоксарах и Новочебоксарске по индивидуальным размерам за 1 день. 
              Используем только качественные комплектующие и металлический крепеж.
            </p>
          </div>
          <div>
            <h4 class="font-bold text-lg mb-6 border-l-4 border-brand-blue pl-4 uppercase tracking-widest text-sm">Продукция</h4>
            <ul class="space-y-3 text-sm text-gray-400">
              <li v-for="link in navLinks" :key="link.path">
                <NuxtLink :to="link.path" class="hover:text-white transition-colors uppercase text-xs font-bold">{{ link.name }}</NuxtLink>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-lg mb-6 border-l-4 border-brand-blue pl-4 uppercase tracking-widest text-sm">Контакты</h4>
            <div class="space-y-4 text-sm text-gray-400 font-medium">
              <p>📍 Чебоксары, ул. Гражданская, 53, оф.1</p>
              <p>📍 Новочебоксарск, ул. Винокурова, 109</p>
              <p>📞 +7 (8352) 38-14-20</p>
              <p>✉️ sloboda@100kna.ru</p>
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
          <div class="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.4)] border border-white/20 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <!-- Декор -->
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-brand-blue/5 rounded-full blur-3xl"></div>
            
            <div class="flex-grow text-center md:text-left relative z-10">
              <div class="flex items-center justify-center md:justify-start gap-3 mb-3">
                <span class="text-2xl">🍪</span>
                <h4 class="text-sm font-black uppercase tracking-[0.2em] text-brand-dark">Конфиденциальность</h4>
              </div>
              <p class="text-xs text-gray-500 leading-relaxed max-w-2xl font-medium">
                Мы заботимся о ваших данных. Продолжая работу с сайтом, вы соглашаетесь на использование файлов cookie и принимаете нашу 
                <NuxtLink to="/privacy" class="text-brand-blue font-black underline decoration-2 underline-offset-4 hover:text-blue-700 transition-colors">Политику конфиденциальности</NuxtLink> в соответствии с ФЗ-152 «О персональных данных».
              </p>
            </div>
            <div class="flex flex-col sm:flex-row gap-4 relative z-10">
              <button @click="acceptCookies" class="whitespace-nowrap bg-brand-blue hover:bg-blue-700 text-white font-black py-5 px-12 rounded-[1.5rem] transition-all shadow-2xl shadow-brand-blue/30 active:scale-95 uppercase text-[10px] tracking-[0.2em]">
                Принимаю
              </button>
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
</style>
