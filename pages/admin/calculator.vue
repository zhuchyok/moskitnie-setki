<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const title = 'Калькулятор — Сетки 21'
useHead({ title })
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20">
    <AdminHeader />

    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-black text-brand-dark uppercase tracking-tighter">Расчет стоимости</h2>
      </div>

      <div class="animate-in fade-in slide-in-from-top-4 duration-500">
        <Calculator />
      </div>
    </div>
  </div>
</template>
