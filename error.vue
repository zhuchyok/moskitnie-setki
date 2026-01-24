<script setup lang="ts">
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })

const categories = [
  { name: 'Антикошка', path: '/antikoshka' },
  { name: 'Антимошка', path: '/antimoshka' },
  { name: 'Антипыль', path: '/antipyl' },
  { name: 'Вставные VSN', path: '/vstavnye' },
  { name: 'Ремонт', path: '/remont' },
]
</script>

<template>
  <div class="min-h-screen bg-brand-white flex items-center justify-center px-6 py-24 sm:py-32 lg:px-8 font-sans">
    <div class="text-center relative">
      <!-- Декоративный элемент (сетка) -->
      <div class="absolute inset-0 -z-10 flex items-center justify-center opacity-[0.03]">
        <div class="w-96 h-96 border-[20px] border-brand-blue rounded-full"></div>
      </div>

      <p class="text-6xl font-black text-brand-blue leading-none mb-4">404</p>
      <h1 class="mt-4 text-3xl font-black tracking-tight text-brand-dark sm:text-5xl uppercase">Страница не найдена</h1>
      <p class="mt-6 text-base leading-7 text-gray-500 font-medium max-w-lg mx-auto">
        К сожалению, комар, которого мы пытались поймать, улетел вместе с этой страницей. Но наши сетки всё еще на месте!
      </p>
      
      <div class="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
        <button 
          @click="handleError"
          class="rounded-2xl bg-brand-blue px-10 py-4 text-sm font-black text-white shadow-2xl shadow-brand-blue/30 hover:bg-[#1e5a9a] transition-all active:scale-95 uppercase tracking-widest"
        >
          На главную
        </button>
        <a href="tel:+78352381420" class="text-sm font-black text-brand-dark uppercase tracking-widest hover:text-brand-blue transition-colors">
          Связаться с нами <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <!-- Полезные ссылки -->
      <div class="mt-20">
        <h2 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Популярные разделы</h2>
        <div class="flex flex-wrap justify-center gap-3">
          <NuxtLink 
            v-for="cat in categories" 
            :key="cat.path"
            :to="cat.path"
            class="px-5 py-2.5 rounded-xl border-2 border-gray-100 text-[11px] font-black text-gray-400 uppercase tracking-wider hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50 transition-all"
          >
            {{ cat.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Дополнительные стили если нужны */
</style>
