<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <section class="border-t border-gray-200 bg-gray-50/50 rounded-2xl px-6 md:px-10 py-10">
    <h2 class="text-xl md:text-2xl font-black mb-6 uppercase tracking-tight text-brand-dark">
      {{ title }}
    </h2>
    <div class="prose prose-gray max-w-none text-gray-600 text-base font-medium leading-relaxed text-justify space-y-4">
      <slot />
    </div>
  </section>
</template>
