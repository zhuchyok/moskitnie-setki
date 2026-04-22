<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  types: Array<{ id: string, name: string }>
  frameTypes: Array<{ id: string, name: string }>
  colors: Array<{ id: number, name: number | string, hex: string }>
  selectedType: string
  selectedFrameType: string
  selectedColor: number
  brandPrimary: string
  isAdminOrDealer: boolean
}>()

const emit = defineEmits<{
  (e: 'selectType', id: string, name: string): void
  (e: 'selectFrameType', id: string): void
  (e: 'selectColor', id: number): void
}>()
</script>

<template>
  <div class="space-y-10">
    <!-- Тип полотна -->
    <div class="w-full min-w-0">
      <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">Тип полотна</label>
      <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
        <button v-for="t in types" :key="t.id"
                @click="emit('selectType', t.id, t.name)"
                :class="[
                  'h-10 px-2 rounded-2xl text-[10px] font-black transition-all border-2 uppercase tracking-widest text-center whitespace-nowrap flex items-center justify-center',
                  selectedType === t.id 
                    ? 'text-white border-transparent shadow-2xl transform -translate-y-1' 
                    : 'bg-white text-gray-400 border-gray-100'
                ]"
                :style="selectedType === t.id 
                  ? { backgroundColor: brandPrimary, boxShadow: `0 25px 50px -12px ${brandPrimary}4D` }
                  : { 
                    '--hover-border-color': brandPrimary + '33',
                    '--hover-text-color': brandPrimary
                  }">
          {{ t.name }}
        </button>
      </div>
    </div>

    <!-- Тип рамки (скрыт для обычных пользователей) -->
    <div v-if="isAdminOrDealer" class="w-full min-w-0">
      <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">Тип рамки</label>
      <div class="grid grid-cols-2 gap-4" style="width: 100%">
        <button v-for="ft in frameTypes" :key="ft.id"
                @click="emit('selectFrameType', ft.id)"
                :class="[
                  'h-10 px-2 rounded-2xl text-[10px] font-black transition-all border-2 uppercase tracking-widest text-center whitespace-nowrap w-full flex items-center justify-center',
                  selectedFrameType === ft.id 
                    ? 'text-white border-transparent shadow-xl transform -translate-y-0.5' 
                    : 'bg-white text-gray-400 border-gray-100'
                ]"
                :style="selectedFrameType === ft.id
                  ? { backgroundColor: brandPrimary, boxShadow: `0 20px 25px -5px ${brandPrimary}33` }
                  : { 
                    '--hover-border-color': brandPrimary + '33',
                    '--hover-text-color': brandPrimary
                  }">
          {{ ft.name }}
        </button>
      </div>
    </div>

    <!-- Цвет рамки -->
    <div class="w-full min-w-0">
      <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">Цвет рамки</label>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4" style="width: 100%">
        <button v-for="color in colors" :key="color.id"
                @click="emit('selectColor', color.id)"
                :class="[
                  'h-10 px-2 rounded-2xl text-[10px] font-black transition-all border-2 uppercase tracking-widest whitespace-nowrap w-full flex items-center justify-center',
                  selectedColor === color.id 
                    ? 'text-white border-transparent shadow-xl transform -translate-y-0.5' 
                    : 'bg-white text-gray-400 border-gray-100'
                ]"
                :style="selectedColor === color.id
                  ? { backgroundColor: brandPrimary, boxShadow: `0 20px 25px -5px ${brandPrimary}33` }
                  : { 
                    '--hover-border-color': brandPrimary + '33',
                    '--hover-text-color': brandPrimary
                  }">
          {{ color.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
button:hover:not(.text-white) {
  border-color: var(--hover-border-color) !important;
  color: var(--hover-text-color) !important;
}
</style>
