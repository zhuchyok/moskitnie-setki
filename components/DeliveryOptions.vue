<script setup lang="ts">
/** DeliveryOptions - Компонент выбора способа получения
 * Извлечён из Calculator.vue для переиспользования
 */

import { DELIVERY_OPTIONS, URGENT_ORDER_OPTION, MEASUREMENT_OPTION } from '~/constants/pricing'

interface Props {
  /** Текущий выбранный способ доставки */
  selectedDelivery: string
  /** Выбрана ли опция "Все с монтажом" */
  allWithInstallation: boolean
  /** Смешанный заказ */
  isMixed: boolean
  /** Выбран ли замер */
  measurementSelected: boolean
  /** Выбран ли срочный заказ */
  discountType: '' | 'srochnyi'
  /** Доступна ли кнопка оформления */
  canSubmit: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:delivery': [id: string, price: number]
  'update:measurement': [selected: boolean, price: number]
  'update:discount': [type: '' | 'srochnyi']
}>()

const deliveries = DELIVERY_OPTIONS

/** Показывать ли опции доставки */
const showDelivery = computed(() => !props.allWithInstallation || props.isMixed)

/** Показывать ли срочный заказ */
const showUrgent = computed(() => props.allWithInstallation && !props.isMixed)

const selectDelivery = (id: string, price: number) => {
  emit('update:delivery', id, price)
}

const toggleMeasurement = () => {
  emit('update:measurement', !props.measurementSelected, MEASUREMENT_OPTION.price)
}

const toggleUrgent = () => {
  const newType = props.discountType === 'srochnyi' ? '' : 'srochnyi'
  emit('update:discount', newType)
}

const getDeliveryText = computed(() => {
  if (!props.selectedDelivery) return ''
  const opt = deliveries.find(d => d.id === props.selectedDelivery)
  return opt ? opt.name : ''
})
</script>

<template>
  <div class="bg-gray-50 p-5 sm:p-10 rounded-[2.5rem] space-y-8 min-w-0">
    <div class="flex items-center gap-4">
      <div class="w-10 h-10 bg-brand-dark rounded-xl flex items-center justify-center text-white font-black text-sm">
        {{ (showDelivery ? 1 : 0) + (measurementSelected ? 1 : 0) + (showUrgent && discountType ? 1 : 0) }}
      </div>
      <h4 class="text-3xl font-black text-brand-dark uppercase tracking-tighter">Опции</h4>
    </div>

    <!-- 1. Способ получения -->
    <div v-if="showDelivery" class="space-y-3">
      <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Способ получения</p>
      <div class="grid grid-cols-1 gap-4">
        <template v-if="!allWithInstallation || isMixed">
          <button v-for="d in (isMixed ? deliveries.filter(x => x.id === 'Доставка') : deliveries)"
                  :key="d.id"
                  type="button"
                  @click="selectDelivery(d.id, d.price)"
                  :class="[
                    'flex justify-between items-center gap-3 p-5 rounded-2xl border-2 transition-all text-xs font-black uppercase tracking-wider text-left min-w-0',
                    selectedDelivery === d.id
                      ? 'bg-white border-brand-blue text-brand-blue shadow-xl shadow-brand-blue/10 scale-[1.02]'
                      : 'bg-transparent border-gray-200/50 text-gray-400 hover:border-gray-200'
                  ]">
            <span class="flex items-center gap-3 min-w-0 flex-1 break-words">
              <!-- Иконка здания (самовывоз) -->
              <span v-if="d.icon === 'building'" class="flex-shrink-0 w-5 h-5 text-current opacity-70">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              <!-- Иконка грузовика (доставка) -->
              <span v-else-if="d.icon === 'truck'" class="flex-shrink-0 w-5 h-5 text-current opacity-70">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </span>
              <span class="min-w-0">{{ d.name }}</span>
            </span>
            <span class="text-brand-blue shrink-0 pl-2">{{ d.price > 0 ? `${d.price} ₽` : '0 ₽' }}</span>
          </button>
        </template>
      </div>
    </div>

    <!-- 2. Срочный заказ -->
    <div v-if="showUrgent" class="space-y-3">
      <button type="button"
              @click="toggleUrgent"
              :class="[
                'flex justify-between items-center gap-3 w-full p-5 rounded-2xl border-2 transition-all text-xs font-black uppercase tracking-wider text-left min-w-0',
                discountType === 'srochnyi'
                  ? 'bg-white border-brand-blue text-brand-blue shadow-xl shadow-brand-blue/10 scale-[1.02]'
                  : 'bg-transparent border-gray-200/50 text-gray-400 hover:border-gray-200'
              ]">
        <span class="flex items-center gap-3 min-w-0">
          <span class="flex-shrink-0 w-5 h-5 text-current opacity-70">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span class="min-w-0">{{ URGENT_ORDER_OPTION.name }}</span>
        </span>
        <span class="text-brand-blue shrink-0">{{ URGENT_ORDER_OPTION.price }} ₽</span>
      </button>
    </div>

    <!-- 3. Замер -->
    <div class="space-y-3">
      <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Дополнительно</p>
      <button type="button"
              @click="toggleMeasurement"
              :class="[
                'flex justify-between items-center gap-3 w-full p-5 rounded-2xl border-2 transition-all text-xs font-black uppercase tracking-wider text-left min-w-0',
                measurementSelected
                  ? 'bg-white border-brand-blue text-brand-blue shadow-xl shadow-brand-blue/10 scale-[1.02]'
                  : 'bg-transparent border-gray-200/50 text-gray-400 hover:border-gray-200'
              ]">
        <span class="flex items-center gap-3 min-w-0 flex-1 break-words">
          <span class="flex-shrink-0 w-5 h-5 text-current opacity-70">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </span>
          <span class="min-w-0">{{ MEASUREMENT_OPTION.name }}</span>
        </span>
        <span class="text-brand-blue shrink-0 pl-2">{{ MEASUREMENT_OPTION.price }} ₽</span>
      </button>
    </div>

    <p class="text-[10px] text-gray-400 leading-relaxed">
      {{ allWithInstallation
        ? 'При необходимости отметьте замер — его можно заказать вместе с монтажом.'
        : isMixed
          ? 'При необходимости отметьте замер — его можно заказать вместе с доставкой и монтажом.'
          : 'При необходимости отметьте замер — его можно заказать вместе с доставкой или самовывозом.' }}
    </p>
  </div>
</template>
