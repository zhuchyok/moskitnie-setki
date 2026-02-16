<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

const title = 'Дилерам — выгодное сотрудничество с Сетки 21'
const description = 'Приглашаем дилеров, оконные компании и частных мастеров к сотрудничеству. Собственное производство москитных сеток в Чебоксарах, низкие цены, изготовление за 1 день.'

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
  ]
})

// Если пользователь уже авторизован, перенаправляем в админку
onMounted(() => {
  if (auth.isAuthenticated) {
    navigateTo('/admin')
  }
})

const advantages = [
  // ... (advantages array remains same)
]

const isLoginMode = ref(true)
const form = reactive({
  email: '',
  password: '',
  name: '',
  city: '',
  phone: ''
})

const isLoading = ref(false)
const error = ref('')

const handleAuth = async () => {
  error.value = ''
  isLoading.value = true
  
  try {
    if (isLoginMode.value) {
      const config = useRuntimeConfig()
      const apiBase = config.public.apiUrl || 'http://localhost:8081'
      
      console.log('Attempting login to:', `${apiBase}/api/v1/auth/login`)
      
      const response = await $fetch('/api/v1/auth/login', {
        method: 'POST',
        body: {
          email: form.email.trim(),
          password: form.password.trim()
        },
        baseURL: apiBase,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }) as any
      
      console.log('Login success:', response)
      
      // Используем auth store для сохранения данных
      auth.setToken(response.token)
      auth.setUser({
        id: response.user_id,
        email: form.email.trim(),
        role: response.role,
        name: response.name || (response.role === 'admin' ? 'Администратор' : 'Дилер')
      })
      
      // Сохраняем роль отдельно для совместимости
      const userRole = useCookie('user_role', { maxAge: 60 * 60 * 24 * 7 })
      userRole.value = response.role

      // Перенаправляем в админку
      window.location.href = '/admin'
    } else {
      // Регистрация (пока просто уведомление или заглушка)
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Заявка на регистрацию отправлена. Мы свяжемся с вами для подтверждения данных.')
    }
  } catch (e: any) {
    console.error('Auth error full:', e)
    if (e.response) {
      console.error('Auth error response data:', e.response._data)
      error.value = e.response._data?.message || 'Ошибка сервера'
    } else {
      error.value = 'Не удалось связаться с сервером'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20">
    <!-- Hero Section -->
    <section class="bg-brand-dark text-white py-20 relative overflow-hidden">
      <div class="container mx-auto px-4 relative z-10 text-center">
        <h1 class="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter text-white">
          Партнерство на <span class="text-brand-blue">успех</span>
        </h1>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Приглашаем оконные компании, строительные бригады и частных мастеров стать нашими дилерами в Чебоксарах и Новочебоксарске.
        </p>
      </div>
      <div class="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-blue/10 rounded-full blur-[120px] -mr-[20rem] -mt-[20rem]"></div>
    </section>

    <div class="container mx-auto px-4 -mt-10 relative z-20">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Advantages Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="adv in advantages" :key="adv.title" class="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:transform hover:-translate-y-1 transition-all duration-300">
              <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-blue mb-6">
                <svg v-if="adv.icon === 'factory'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <svg v-else-if="adv.icon === 'clock'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else-if="adv.icon === 'tag'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-black text-brand-dark mb-4 uppercase tracking-tight">{{ adv.title }}</h3>
              <p class="text-gray-500 leading-relaxed font-medium">{{ adv.text }}</p>
            </div>
          </div>

          <!-- Cooperation Steps -->
          <div class="bg-white p-10 md:p-16 rounded-[3rem] shadow-xl border border-gray-100">
            <h2 class="text-3xl font-black text-brand-dark mb-12 uppercase tracking-tighter">Как начать работать?</h2>
            <div class="space-y-12">
              <div class="flex gap-8">
                <div class="shrink-0 w-12 h-12 bg-brand-blue text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-brand-blue/30">1</div>
                <div>
                  <h4 class="text-xl font-black text-brand-dark mb-2 uppercase tracking-tight">Заявка</h4>
                  <p class="text-gray-500 font-medium">Заполните форму регистрации или позвоните нам. Мы обсудим ваши потребности и объемы.</p>
                </div>
              </div>
              <div class="flex gap-8">
                <div class="shrink-0 w-12 h-12 bg-brand-blue text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-brand-blue/30">2</div>
                <div>
                  <h4 class="text-xl font-black text-brand-dark mb-2 uppercase tracking-tight">Доступ в кабинет</h4>
                  <p class="text-gray-500 font-medium">Вы получите доступ в личный кабинет с дилерскими ценами и возможностью онлайн-заказа.</p>
                </div>
              </div>
              <div class="flex gap-8">
                <div class="shrink-0 w-12 h-12 bg-brand-blue text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-brand-blue/30">3</div>
                <div>
                  <h4 class="text-xl font-black text-brand-dark mb-2 uppercase tracking-tight">Первый заказ</h4>
                  <p class="text-gray-500 font-medium">Оформляйте заказы 24/7, отслеживайте статусы производства и забирайте готовую продукцию.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Auth Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-24">
            <div class="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
              <div class="p-8 md:p-10">
                <div class="flex gap-4 mb-10 bg-gray-50 p-2 rounded-2xl">
                  <button @click="isLoginMode = true" 
                          :class="[
                            'flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
                            isLoginMode ? 'bg-white text-brand-blue shadow-md' : 'text-gray-400 hover:text-brand-dark'
                          ]">
                    Вход
                  </button>
                  <button @click="isLoginMode = false" 
                          :class="[
                            'flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
                            !isLoginMode ? 'bg-white text-brand-blue shadow-md' : 'text-gray-400 hover:text-brand-dark'
                          ]">
                    Регистрация
                  </button>
                </div>

                <h3 class="text-2xl font-black text-brand-dark mb-8 uppercase tracking-tighter">
                  {{ isLoginMode ? 'Личный кабинет' : 'Стать дилером' }}
                </h3>

                <form @submit.prevent="handleAuth" class="space-y-5">
                  <div v-if="!isLoginMode" class="space-y-2">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Имя / Компания</label>
                    <input v-model="form.name" type="text" required placeholder="ООО Окна"
                           class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-sm shadow-inner" />
                  </div>
                  
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email</label>
                    <input v-model="form.email" type="email" required placeholder="info@example.ru"
                           class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-sm shadow-inner" />
                  </div>

                  <div v-if="!isLoginMode" class="space-y-2">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Телефон</label>
                    <input v-model="form.phone" type="tel" required placeholder="+7 (___) ___-__-__"
                           class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-sm shadow-inner" />
                  </div>

                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Пароль</label>
                    <input v-model="form.password" type="password" required placeholder="••••••••"
                           class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-sm shadow-inner" />
                  </div>

                  <div v-if="error" class="text-red-500 text-[10px] font-bold uppercase text-center bg-red-50 p-3 rounded-xl">
                    {{ error }}
                  </div>

                  <button type="submit" 
                          :disabled="isLoading"
                          class="w-full bg-brand-blue text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-brand-blue/30 active:scale-95 uppercase text-[10px] tracking-[0.2em] mt-4 disabled:opacity-50">
                    {{ isLoading ? 'Загрузка...' : (isLoginMode ? 'Войти в кабинет' : 'Отправить заявку') }}
                  </button>
                </form>

                <p class="text-[10px] text-gray-400 text-center mt-8 leading-relaxed px-4">
                  При возникновении проблем с доступом, пожалуйста, свяжитесь с вашим персональным менеджером.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
