<script setup lang="ts">
// Страница-редирект для устранения 404 ошибок на /calculator
// Так как калькулятор теперь является частью главной страницы
onMounted(() => {
  navigateTo('/', { replace: true })
})

// Для SSR (чтобы роботы сразу получали 301/302)
definePageMeta({
  middleware: [
    function (to, from) {
      return navigateTo('/', { redirectCode: 301 })
    }
  ]
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="animate-pulse font-black text-gray-200 uppercase tracking-widest">
      Загрузка калькулятора...
    </div>
  </div>
</template>
