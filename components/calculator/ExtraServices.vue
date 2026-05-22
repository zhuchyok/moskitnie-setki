<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  options: Array<{
    id: string
    name: string
    icon: string
  }>
  selectedIds: string[]
  brandPrimary: string
}>()

const emit = defineEmits<{
  (e: 'toggle', id: string): void
}>()
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 p-2">
    <button v-for="service in options" :key="service.id"
            type="button"
            @click="emit('toggle', service.id)"
            :class="[
              'flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all text-[10px] font-black uppercase tracking-wider extra-service-btn',
              selectedIds.includes(service.id)
                ? 'bg-white shadow-xl scale-[1.05]'
                : 'bg-gray-50/50 border-gray-100 text-gray-400'
            ]"
            :style="selectedIds.includes(service.id) 
              ? { borderColor: brandPrimary, color: brandPrimary } 
              : { '--brand-primary': brandPrimary }">
      <span class="flex items-center justify-center" v-html="service.icon"></span>
      <span class="text-center leading-tight">{{ service.name }}</span>
    </button>
  </div>
</template>

<style scoped>
button.extra-service-btn:hover {
  border-color: var(--brand-primary, #2A6AB2) !important;
  color: var(--brand-primary, #2A6AB2) !important;
  background-color: white !important;
}
button.extra-service-btn:hover :deep(span) {
  color: var(--brand-primary, #2A6AB2) !important;
}
</style>
