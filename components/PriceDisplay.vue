<script setup lang="ts">
/** PriceDisplay - Компонент отображения цены
 * Переиспользуемый компонент для отображения цены с форматированием
 */

interface Props {
  /** Основная цена */
  value: number
  /** Вторая цена (для сравнения/скидки) */
  oldValue?: number
  /** Валюта */
  currency?: string
  /** Размер текста */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Показывать скидку в процентах */
  showDiscount?: boolean
  /** Суффикс (напр. "₽/м²") */
  suffix?: string
}

const props = withDefaults(defineProps<Props>(), {
  currency: '₽',
  size: 'md',
  showDiscount: false
})

const sizeClasses = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-5xl',
  xl: 'text-6xl'
}

const discountPercent = computed(() => {
  if (!props.oldValue || !props.showDiscount) return 0
  return Math.round((1 - props.value / props.oldValue) * 100)
})
</script>

<template>
  <div class="price-display inline-flex items-baseline gap-1">
    <span v-if="oldValue" class="old-price text-lg text-gray-300 line-through font-medium mr-2">
      {{ oldValue.toLocaleString('ru-RU') }} {{ currency }}
    </span>
    <span :class="['font-black text-brand-blue tracking-tighter', sizeClasses[size]]">
      {{ value.toLocaleString('ru-RU') }}
    </span>
    <span v-if="suffix" class="text-lg font-black text-gray-300 ml-1">{{ suffix }}</span>
    <span v-else class="text-2xl font-black text-gray-200">{{ currency }}</span>
    <span v-if="showDiscount && discountPercent > 0"
          class="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs font-black rounded-full">
      -{{ discountPercent }}%
    </span>
  </div>
</template>
