<script setup lang="ts">
const props = defineProps<{
  handleType: 'pvc' | 'metal'
  installation: boolean
  count: number
  brandPrimary: string
}>()

const emit = defineEmits<{
  (e: 'update:handleType', val: 'pvc' | 'metal'): void
  (e: 'update:installation', val: boolean): void
  (e: 'update:count', val: number): void
}>()

const toggleHandle = () => {
  const current = props.handleType === 'metal' ? 'metal' : 'pvc'
  emit('update:handleType', current === 'pvc' ? 'metal' : 'pvc')
}

const toggleInstallation = () => {
  emit('update:installation', !props.installation)
}

const updateCount = (val: number) => {
  emit('update:count', Math.max(1, val))
}

const onCountInput = (e: Event) => {
  const val = parseInt((e.target as HTMLInputElement).value) || 1
  updateCount(val)
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12" style="width: 100%">
    <!-- Тип ручек -->
    <div class="min-w-0">
      <p class="text-[10px] text-gray-400 uppercase font-black tracking-[0.3em] mb-5 text-center">Тип ручек</p>
      <div class="flex items-center justify-center gap-2 sm:gap-3 min-h-[50px]">
        <button @click="toggleHandle"
                class="transition-colors active:scale-90 option-arrow" :style="{ '--brand-primary': brandPrimary, '--hover-text-color': brandPrimary }">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="flex items-baseline justify-center min-w-[80px]">
          <span class="font-black text-2xl leading-none transition-colors uppercase cursor-pointer select-none option-value" :style="{ color: brandPrimary }" @click="toggleHandle">
            {{ handleType === 'pvc' ? 'ПВХ' : 'МЕТАЛЛ' }}
          </span>
        </div>
        <button @click="toggleHandle"
                class="transition-colors active:scale-90 option-arrow" :style="{ '--brand-primary': brandPrimary, '--hover-text-color': brandPrimary }">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Монтаж -->
    <div class="min-w-0">
      <p class="text-[10px] text-gray-400 uppercase font-black tracking-[0.3em] mb-5 text-center">Монтаж</p>
      <div class="flex items-center justify-center gap-3 min-h-[50px]">
        <button @click="toggleInstallation"
                class="transition-colors active:scale-90 option-arrow" :style="{ '--brand-primary': brandPrimary, '--hover-text-color': brandPrimary }">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="flex items-baseline justify-center min-w-[60px]">
          <span class="font-black text-2xl leading-none transition-colors uppercase cursor-pointer select-none option-value" :style="{ color: brandPrimary }" @click="toggleInstallation">
            {{ installation ? 'ДА' : 'НЕТ' }}
          </span>
        </div>
        <button @click="toggleInstallation"
                class="transition-colors active:scale-90 option-arrow" :style="{ '--brand-primary': brandPrimary, '--hover-text-color': brandPrimary }">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Количество -->
    <div class="min-w-0">
      <p class="text-[10px] text-gray-400 uppercase font-black tracking-[0.3em] mb-5 text-center">Количество</p>
      <div class="flex items-center justify-center gap-3 min-h-[50px]">
        <button @click="updateCount(count - 1)"
                class="transition-colors active:scale-90 option-arrow" :style="{ '--brand-primary': brandPrimary, '--hover-text-color': brandPrimary }">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="flex items-baseline justify-center min-w-[40px]">
          <input type="text" 
                 :value="count"
                 @input="onCountInput"
                 class="w-12 text-center bg-transparent border-none focus:outline-none font-black text-2xl leading-none transition-colors option-value"
                 :style="{ color: brandPrimary }" />
        </div>
        <button @click="updateCount(count + 1)"
                class="transition-colors active:scale-90 option-arrow" :style="{ '--brand-primary': brandPrimary, '--hover-text-color': brandPrimary }">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.option-arrow {
  color: #e5e7eb !important;
  transition: all 0.3s ease;
}
.option-arrow:hover {
  color: var(--brand-primary, #2A6AB2) !important;
  opacity: 1;
}
</style>
