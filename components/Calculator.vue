<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
const store = useOrderStore()

// Состояние кнопки "Добавить в заказ"
const isAdded = ref(false)

const handleAddToOrder = () => {
  store.addToOrder()
  isAdded.value = true
  setTimeout(() => {
    isAdded.value = false
  }, 1000)
}

const types = [
  { id: 'standart', name: 'СТАНДАРТ' },
  { id: 'antimoshka', name: 'АНТИМОШКА' },
  { id: 'antikoshka', name: 'АНТИКОШКА' },
  { id: 'ultravyu', name: 'УЛЬТРАВЬЮ' },
  { id: 'antipyl', name: 'АНТИПЫЛЬ' }
]

const frameTypes = [
  { id: 'standart', name: 'РАМОЧНАЯ' },
  { id: 'vstavnaya', name: 'ВСТАВНАЯ VSN' }
]

const colors = [
  { id: 1, name: 'БЕЛАЯ' },
  { id: 2, name: 'КОРИЧНЕВАЯ' },
  { id: 3, name: 'АНТРАЦИТ' },
  { id: 4, name: 'RAL' }
]

const deliveries = [
  { id: 'Оф.Чебоксары', name: 'Самовывоз Чебоксары Гражданская 53', price: 0 },
  { id: 'Оф.Новочебоксарск', name: 'Самовывоз Новочебоксарск Винокурова 109', price: 0 },
  { id: 'Доставка', name: 'Доставка Чебоксары и Новочебоксарск', price: 400 }
]

const selectType = (id: string, name: string) => {
  store.updateConfig({ type: id, typeName: name })
}

const selectFrameType = (id: string) => {
  store.updateConfig({ frameType: id })
}

const selectColor = (id: number) => {
  store.updateConfig({ color: id })
}

// Размер ячейки сетки в зависимости от типа полотна
const meshSize = computed(() => {
  switch (store.config.type) {
    case 'antimoshka': return 4  // мелкая ячейка 0.8x0.8
    case 'ultravyu': return 4    // повышенная прозрачность, мелкая ячейка
    case 'antipyl': return 3     // мелкая ячейка
    case 'antikoshka': return 5  // крупная ячейка Pet Screen
    default: return 4            // стандартная 1.2x1.2
  }
})

// Толщина нити сетки
const meshThickness = computed(() => {
  return store.config.type === 'antikoshka' ? '2px' : '1px'
})

// Редактирование размеров вручную
const editingWidth = ref(false)
const editingHeight = ref(false)
const tempWidth = ref(350)
const tempHeight = ref(1000)

const startEditWidth = () => {
  tempWidth.value = store.config.width
  editingWidth.value = true
}

const startEditHeight = () => {
  tempHeight.value = store.config.height
  editingHeight.value = true
}

const saveWidth = () => {
  let val = parseInt(tempWidth.value) || 350
  val = Math.max(200, Math.min(9999, val))
  store.updateConfig({ width: val })
  editingWidth.value = false
}

const saveHeight = () => {
  let val = parseInt(tempHeight.value) || 1000
  val = Math.max(200, Math.min(9999, val))
  store.updateConfig({ height: val })
  editingHeight.value = false
}

const isModalOpen = ref(false)
const form = reactive({
  name: '',
  phone: '',
  address: '',
  comment: '',
  agree: false
})

const submitOrder = async () => {
  if (!form.agree) return
  
  const orderData = {
    formName: form.name,
    formPhone: form.phone,
    formAddress: form.address,
    formComment: form.comment,
    list_order: store.items.map(i => `${i.frameTypeName ? i.frameTypeName + ': ' : ''}${i.typeName} (${i.width}x${i.height}, ${i.color}) - ${i.count}шт`).join('<br>'),
    total_price_value: store.totalPrice,
    total_order_value: store.delivery
  }
  
  try {
    const response = await $fetch('/api/orders', {
      method: 'POST',
      body: orderData
    })

    if (response.success) {
      // Track conversion in Google Analytics
      if (typeof window !== 'undefined' && (window as any).trackConversion) {
        (window as any).trackConversion('order_submitted', store.totalPrice)
      }
      
      // Track conversion in Yandex Metrika
      if (typeof window !== 'undefined' && (window as any).reachMetrikaGoal) {
        (window as any).reachMetrikaGoal('ORDER_SUBMITTED', { price: store.totalPrice })
      }

      alert('Спасибо за заказ! Мы свяжемся с вами в ближайшее время.')
      store.clearOrder()
      isModalOpen.value = false
      form.name = ''
      form.phone = ''
      form.address = ''
      form.comment = ''
      form.agree = false
    }
  } catch (e: any) {
    console.error('Ошибка отправки:', e)
    const errorMessage = e.data?.message || e.message || 'Произошла ошибка при отправке. Пожалуйста, позвоните нам по телефону.'
    alert(errorMessage)
  }
}
</script>

<template>
  <div class="container mx-auto px-4 space-y-12">
    <!-- Калькулятор -->
    <div class="bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100 min-h-[650px]">
      <!-- Визуализация (Левая часть) -->
      <div class="lg:w-4/12 bg-gray-50/50 p-12 flex flex-col items-center justify-center relative border-r border-gray-100">
        <div class="relative border-[8px] border-brand-dark bg-white shadow-2xl transition-all duration-500 ease-out flex items-center justify-center overflow-hidden"
             :style="{ width: Math.min(280, Math.max(150, store.config.width / 4)) + 'px', height: Math.min(350, Math.max(200, store.config.height / 4)) + 'px' }">
          <!-- Сетка с разным размером ячейки -->
          <div class="absolute inset-0 opacity-20 transition-all"
               :style="{ 
                 backgroundImage: `radial-gradient(#000 ${meshThickness}, transparent ${meshThickness})`,
                 backgroundSize: meshSize + 'px ' + meshSize + 'px' 
               }"></div>
          
          <!-- Перегородка посередине -->
          <div class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 bg-brand-dark"></div>
          
          <!-- Ручки для вставной (сверху и снизу) -->
          <template v-if="store.config.frameType === 'vstavnaya'">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-1.5 bg-brand-dark/50 rounded-full -mt-2.5"></div>
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 h-5 w-1.5 bg-brand-dark/50 rounded-full -mb-2.5"></div>
          </template>
          <!-- Ручки для остальных (по бокам, чуть ниже перегородки) -->
          <template v-else>
            <div class="absolute left-0 top-[55%] w-5 h-1.5 bg-brand-dark/50 rounded-full -ml-2.5"></div>
            <div class="absolute right-0 top-[55%] w-5 h-1.5 bg-brand-dark/50 rounded-full -mr-2.5"></div>
          </template>
        </div>
        
        <!-- Размеры под рамкой -->
        <div class="mt-12 flex gap-10 text-[11px] font-black uppercase tracking-widest text-gray-400">
          <div class="flex items-center gap-3">
            <span class="w-2.5 h-2.5 rounded-full bg-brand-blue shadow-lg shadow-brand-blue/40"></span>
            {{ store.config.width }} мм
          </div>
          <div class="flex items-center gap-3">
            <span class="w-2.5 h-2.5 rounded-full bg-brand-blue shadow-lg shadow-brand-blue/40"></span>
            {{ store.config.height }} мм
          </div>
        </div>
      </div>

      <!-- Управление (Правая часть) -->
      <div class="lg:w-8/12 p-10 lg:p-20 flex flex-col justify-center min-w-0 overflow-hidden">
        <div class="flex items-center gap-5 mb-12">
          <div class="w-14 h-14 bg-brand-blue rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-brand-blue/30 transform -rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 class="text-4xl font-black text-brand-dark uppercase tracking-tighter">Расчет стоимости</h2>
        </div>
        
        <div class="space-y-10 w-full min-w-0">
          <!-- Тип -->
          <div class="w-full min-w-0">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">Тип полотна</label>
            <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
              <button v-for="t in types" :key="t.id"
                      @click="selectType(t.id, t.name)"
                      :class="[
                        'py-4 px-2 rounded-2xl text-[10px] font-black transition-all border-2 uppercase tracking-widest text-center whitespace-nowrap',
                        store.config.type === t.id 
                          ? 'bg-brand-blue text-white border-brand-blue shadow-2xl shadow-brand-blue/30 transform -translate-y-1' 
                          : 'bg-white text-gray-400 border-gray-100 hover:border-brand-blue/20 hover:text-brand-blue'
                      ]">
                {{ t.name }}
              </button>
            </div>
          </div>

          <!-- Размеры -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div class="space-y-5">
              <div class="flex justify-between items-end">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ширина</label>
                <div class="flex items-baseline gap-1">
                  <input v-if="editingWidth" 
                         type="text" 
                         v-model="tempWidth" 
                         @blur="saveWidth" 
                         @keyup.enter="saveWidth"
                         @input="tempWidth = String(tempWidth).replace(/\D/g, '').slice(0, 4)"
                         maxlength="4"
                         class="w-28 text-2xl font-black text-brand-blue text-center bg-blue-50 border-2 border-brand-blue rounded-xl px-3 py-2 focus:outline-none" 
                         autofocus />
                  <span v-else 
                        @click="startEditWidth" 
                        class="text-2xl font-black text-brand-blue cursor-pointer hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors" 
                        title="Нажмите для ввода">{{ store.config.width }}</span>
                  <small class="text-[10px] text-gray-300 ml-1">ММ</small>
                </div>
              </div>
              <input type="range" min="200" max="1500" step="5" v-model.number="store.config.width"
                     class="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-brand-blue shadow-inner" />
            </div>
            <div class="space-y-5">
              <div class="flex justify-between items-end">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Высота</label>
                <div class="flex items-baseline gap-1">
                  <input v-if="editingHeight" 
                         type="text" 
                         v-model="tempHeight" 
                         @blur="saveHeight" 
                         @keyup.enter="saveHeight"
                         @input="tempHeight = String(tempHeight).replace(/\D/g, '').slice(0, 4)"
                         maxlength="4"
                         class="w-28 text-2xl font-black text-brand-blue text-center bg-blue-50 border-2 border-brand-blue rounded-xl px-3 py-2 focus:outline-none" 
                         autofocus />
                  <span v-else 
                        @click="startEditHeight" 
                        class="text-2xl font-black text-brand-blue cursor-pointer hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors" 
                        title="Нажмите для ввода">{{ store.config.height }}</span>
                  <small class="text-[10px] text-gray-300 ml-1">ММ</small>
                </div>
              </div>
              <input type="range" min="200" max="2000" step="5" v-model.number="store.config.height"
                     class="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-brand-blue shadow-inner" />
            </div>
          </div>

          <!-- Тип рамки: рендер на клиенте, чтобы сетка сразу была по ширине блока (SSR даёт неправильный layout) -->
          <div class="w-full min-w-0">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">Тип рамки</label>
            <ClientOnly>
              <div class="grid grid-cols-2 gap-4" style="width: 100%">
                <button v-for="ft in frameTypes" :key="ft.id"
                        @click="selectFrameType(ft.id)"
                        :class="[
                          'py-4 px-2 rounded-2xl text-[10px] font-black transition-all border-2 uppercase tracking-widest text-center whitespace-nowrap w-full',
                          store.config.frameType === ft.id 
                            ? 'bg-brand-blue text-white border-brand-blue shadow-xl shadow-brand-blue/20 transform -translate-y-0.5' 
                            : 'bg-white text-gray-400 border-gray-100 hover:border-brand-blue/20'
                        ]">
                  {{ ft.name }}
                </button>
              </div>
              <template #fallback>
                <div class="grid grid-cols-2 gap-4 h-[52px]" style="width: 100%" aria-hidden="true">
                  <div class="rounded-2xl border-2 border-gray-100 bg-gray-50 animate-pulse" />
                  <div class="rounded-2xl border-2 border-gray-100 bg-gray-50 animate-pulse" />
                </div>
              </template>
            </ClientOnly>
          </div>

          <!-- Цвет: рендер на клиенте для стабильной ширины -->
          <div class="w-full min-w-0">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">Цвет рамки</label>
            <ClientOnly>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4" style="width: 100%">
                <button v-for="color in colors" :key="color.id"
                        @click="selectColor(color.id)"
                        :class="[
                          'py-4 px-2 rounded-2xl text-[10px] font-black transition-all border-2 uppercase tracking-widest whitespace-nowrap w-full',
                          store.config.color === color.id 
                            ? 'bg-brand-blue text-white border-brand-blue shadow-xl shadow-brand-blue/20 transform -translate-y-0.5' 
                            : 'bg-white text-gray-400 border-gray-100 hover:border-brand-blue/20'
                        ]">
                  {{ color.name }}
                </button>
              </div>
              <template #fallback>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 h-[52px]" style="width: 100%" aria-hidden="true">
                  <div class="rounded-2xl border-2 border-gray-100 bg-gray-50 animate-pulse" />
                  <div class="rounded-2xl border-2 border-gray-100 bg-gray-50 animate-pulse" />
                  <div class="rounded-2xl border-2 border-gray-100 bg-gray-50 animate-pulse hidden sm:block" />
                  <div class="rounded-2xl border-2 border-gray-100 bg-gray-50 animate-pulse hidden sm:block" />
                </div>
              </template>
            </ClientOnly>
          </div>

          <!-- Ручки, Монтаж, Количество: рендер на клиенте, чтобы три колонки сразу по ширине блока -->
          <div class="pt-10 border-t border-gray-100 w-full min-w-0">
            <ClientOnly>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12" style="width: 100%">
                
                <!-- Тип ручек -->
                <div class="min-w-0">
                  <p class="text-[10px] text-gray-400 uppercase font-black tracking-[0.3em] mb-5 text-center">Тип ручек</p>
                  <div class="flex items-center justify-center gap-2 sm:gap-3 min-h-[50px]">
                    <button @click="store.updateConfig({ handleType: store.config.handleType === 'pvc' ? 'metal' : 'pvc' })"
                            class="text-gray-200 hover:text-brand-blue transition-colors active:scale-90">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div class="flex items-baseline justify-center min-w-[80px]">
                      <span class="font-black text-2xl text-brand-blue leading-none transition-colors uppercase cursor-pointer select-none" @click="store.updateConfig({ handleType: store.config.handleType === 'pvc' ? 'metal' : 'pvc' })">
                        {{ store.config.handleType === 'pvc' ? 'ПВХ' : 'МЕТАЛ' }}
                      </span>
                    </div>
                    <button @click="store.updateConfig({ handleType: store.config.handleType === 'pvc' ? 'metal' : 'pvc' })"
                            class="text-gray-200 hover:text-brand-blue transition-colors active:scale-90">
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
                    <button @click="store.updateConfig({ installation: !store.config.installation })"
                            class="text-gray-200 hover:text-brand-blue transition-colors active:scale-90">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div class="flex items-baseline justify-center min-w-[60px]">
                      <span class="font-black text-2xl text-brand-blue leading-none transition-colors uppercase cursor-pointer select-none" @click="store.updateConfig({ installation: !store.config.installation })">
                        {{ store.config.installation ? 'ДА' : 'НЕТ' }}
                      </span>
                    </div>
                    <button @click="store.updateConfig({ installation: !store.config.installation })"
                            class="text-gray-200 hover:text-brand-blue transition-colors active:scale-90">
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
                    <button @click="store.updateConfig({ count: Math.max(1, store.config.count - 1) })"
                            class="text-gray-200 hover:text-brand-blue transition-colors active:scale-90">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div class="flex items-baseline justify-center min-w-[40px]">
                      <input type="text" 
                             v-model.number="store.config.count"
                             @input="store.config.count = Math.max(1, parseInt(String(store.config.count)) || 1)"
                             class="w-12 text-center bg-transparent border-none focus:outline-none font-black text-2xl text-brand-blue leading-none transition-colors" />
                    </div>
                    <button @click="store.updateConfig({ count: store.config.count + 1 })"
                            class="text-gray-200 hover:text-brand-blue transition-colors active:scale-90">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

              </div>
              <template #fallback>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12 h-[120px]" style="width: 100%" aria-hidden="true">
                  <div class="flex flex-col items-center gap-2">
                    <div class="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                    <div class="h-10 w-24 bg-gray-50 rounded-lg animate-pulse" />
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <div class="h-3 w-14 bg-gray-100 rounded animate-pulse" />
                    <div class="h-10 w-20 bg-gray-50 rounded-lg animate-pulse" />
                  </div>
                  <div class="flex flex-col items-center gap-2">
                    <div class="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                    <div class="h-10 w-16 bg-gray-50 rounded-lg animate-pulse" />
                  </div>
                </div>
              </template>
            </ClientOnly>
          </div>

          <!-- Цена и Кнопка -->
          <div class="pt-12 border-t border-gray-100 flex flex-col sm:flex-row items-end justify-between gap-6">
            <div class="text-center sm:text-left w-full sm:w-auto">
              <p class="text-[10px] text-gray-400 uppercase font-black tracking-[0.3em] mb-2">Итоговая цена</p>
              <div class="flex items-baseline gap-1 justify-center sm:justify-start">
                <span class="text-6xl font-black text-brand-blue leading-none tracking-tighter">{{ store.currentPrice * store.config.count + (store.config.installation ? store.extrasInstallation * store.config.count : 0) + (store.config.handleType === 'metal' ? store.extrasHandleMetal * store.config.count : 0) }}</span>
                <span class="text-2xl font-black text-gray-200 uppercase leading-none self-baseline ml-1" style="font-size: 1.5rem; line-height: 1;">₽</span>
              </div>
            </div>
            <button @click="handleAddToOrder()"
                    :class="[
                      'w-full sm:w-auto font-black py-5 px-14 rounded-[1.5rem] transition-all shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] active:scale-95 uppercase text-[10px] tracking-widest whitespace-nowrap',
                      isAdded 
                        ? 'bg-brand-blue text-white hover:bg-brand-blue' 
                        : 'bg-brand-dark hover:bg-black text-white hover:shadow-brand-dark/40'
                    ]">
              {{ isAdded ? 'Добавлено' : 'Добавить в заказ' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Список заказа -->
    <div v-if="store.items.length > 0" class="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden transform animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div class="p-10 md:p-16">
        <div class="flex items-center justify-between mb-12">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-brand-dark rounded-xl flex items-center justify-center text-white font-black text-sm">
              {{ store.items.length }}
            </div>
            <h3 class="text-3xl font-black text-brand-dark uppercase tracking-tighter">Ваш заказ</h3>
          </div>
          <button @click="store.clearOrder()" class="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-[0.2em] transition-colors">Очистить всё</button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                <th class="pb-8 pr-4">Тип рамки</th>
                <th class="pb-8 px-4">Тип полотна</th>
                <th class="pb-8 px-4">Габариты</th>
                <th class="pb-8 px-4">Цвет рамки</th>
                <th class="pb-8 px-4">Тип ручек</th>
                <th class="pb-8 px-4">Монтаж</th>
                <th class="pb-8 px-4">Кол-во</th>
                <th class="pb-8 px-4 text-right">Стоимость</th>
                <th class="pb-8 pl-4"></th>
              </tr>
            </thead>
            <tbody class="text-sm font-bold text-brand-dark">
              <tr v-for="item in store.items" :key="item.id" class="border-b border-gray-50 group hover:bg-gray-50/50 transition-colors">
                <td class="py-8 pr-4 uppercase text-xs font-black text-gray-600">{{ item.frameTypeName ?? '—' }}</td>
                <td class="py-8 px-4 uppercase text-xs font-black">{{ item.typeName.split(' (')[0] }}</td>
                <td class="py-8 px-4 text-gray-500 font-medium">{{ item.width }} x {{ item.height }} мм</td>
                <td class="py-8 px-4 text-gray-500 font-medium">{{ item.color }}</td>
                <td class="py-8 px-4">
                  <span class="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider bg-gray-50 text-gray-500">
                    {{ item.typeName.includes('(МЕТАЛЛ)') ? 'МЕТАЛЛ' : 'ПВХ' }}
                  </span>
                </td>
                <td class="py-8 px-4">
                  <span :class="[
                    'text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider',
                    item.typeName.includes(' + МОНТАЖ') ? 'bg-blue-50 text-brand-blue' : 'bg-gray-50 text-gray-400'
                  ]">
                    {{ item.typeName.includes(' + МОНТАЖ') ? 'ДА' : 'НЕТ' }}
                  </span>
                </td>
                <td class="py-8 px-4 font-black">{{ item.count }} шт</td>
                <td class="py-8 px-4 text-right text-brand-blue text-lg font-black">{{ item.price }} ₽</td>
                <td class="py-8 pl-4 text-right">
                  <button @click="store.removeItem(item.id)" class="text-gray-200 hover:text-red-500 transition-all transform hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v2m3 3h.01" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <!-- Доставка -->
          <div class="bg-gray-50 p-10 rounded-[2.5rem] space-y-8 border border-gray-100">
            <h4 class="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Дополнительные услуги</h4>
            <div class="grid grid-cols-1 gap-4">
              <button v-for="d in deliveries" :key="d.id"
                      @click="store.setDelivery(d.id, d.price)"
                      :class="[
                        'flex justify-between items-center p-5 rounded-2xl border-2 transition-all text-xs font-black uppercase tracking-wider',
                        store.delivery === d.id 
                          ? 'bg-white border-brand-blue text-brand-blue shadow-xl shadow-brand-blue/10 scale-[1.02]' 
                          : 'bg-transparent border-gray-200/50 text-gray-400 hover:border-gray-200'
                      ]">
                <span>{{ d.name }}</span>
                <span class="text-brand-blue">{{ d.price > 0 ? `${d.price} ₽` : '0 ₽' }}</span>
              </button>
            </div>
          </div>

          <!-- Итого -->
          <div class="bg-brand-blue p-12 rounded-[3rem] text-white shadow-[0_30px_100px_-10px_rgba(42,106,178,0.5)] relative overflow-hidden group">
            <div class="relative z-10">
              <p class="text-[10px] font-black uppercase tracking-[0.4em] opacity-50 mb-4">Итого к оплате</p>
              <div class="flex items-baseline gap-4 mb-12">
                <span class="text-7xl font-black tracking-tighter">{{ store.totalPrice }}</span>
                <span class="text-3xl font-black opacity-30">₽</span>
              </div>
              <button @click="isModalOpen = true"
                      class="w-full bg-white text-brand-blue hover:bg-blue-50 font-black py-6 rounded-[1.5rem] transition-all shadow-2xl active:scale-95 uppercase text-xs tracking-[0.3em]">
                Оформить заказ
              </button>
            </div>
            <!-- Декор -->
            <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <div class="absolute -top-20 -left-20 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно заказа -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
        <!-- Scrollable wrapper -->
        <div class="absolute inset-0 overflow-y-auto flex items-center justify-center p-4">
          <div class="bg-white rounded-[2rem] md:rounded-[4rem] shadow-2xl w-full max-w-2xl relative transform animate-in zoom-in-95 duration-500 my-auto">
            <button @click="isModalOpen = false" class="absolute top-6 right-6 md:top-10 md:right-10 text-gray-300 hover:text-brand-dark transition-all hover:rotate-90 z-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="p-8 md:p-20">
              <div class="mb-8 md:mb-12">
                <h3 class="text-3xl md:text-4xl font-black text-brand-dark mb-3 uppercase tracking-tighter">Оформление</h3>
                <p class="text-gray-400 font-medium text-sm md:text-base">Заполните данные, и мы перезвоним для уточнения деталей</p>
              </div>

              <form @submit.prevent="submitOrder" class="space-y-6 md:space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div class="space-y-2 md:space-y-3">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 md:ml-6">Ваше имя</label>
                    <input v-model="form.name" type="text" required placeholder="Иван Иванов"
                           class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-5 outline-none transition-all font-bold text-sm md:text-base shadow-inner" />
                  </div>
                  <div class="space-y-2 md:space-y-3">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 md:ml-6">Телефон</label>
                    <input v-model="form.phone" type="tel" required placeholder="+7 (___) ___-__-__"
                           class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-5 outline-none transition-all font-bold text-sm md:text-base shadow-inner" />
                  </div>
                </div>
            <div class="space-y-2 md:space-y-3">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 md:ml-6">Адрес (если доставка/монтаж)</label>
              <input v-model="form.address" type="text" placeholder="Город, улица, дом, кв"
                     class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-5 outline-none transition-all font-bold text-sm md:text-base shadow-inner" />
            </div>
                <div class="space-y-2 md:space-y-3">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 md:ml-6">Комментарий</label>
                  <textarea v-model="form.comment" rows="2" md:rows="3" placeholder="Любые пожелания"
                            class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-5 outline-none transition-all font-bold text-sm md:text-base shadow-inner resize-none"></textarea>
                </div>

                <label class="flex items-start gap-4 md:gap-5 cursor-pointer group p-1 md:p-2">
                  <div class="relative flex items-center mt-1">
                    <input type="checkbox" v-model="form.agree" required class="peer appearance-none w-6 h-6 md:w-7 md:h-7 border-2 border-gray-100 rounded-lg md:rounded-xl checked:bg-brand-blue checked:border-brand-blue transition-all shadow-sm" />
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 absolute left-1 text-white opacity-0 peer-checked:opacity-100 transition-all scale-50 peer-checked:scale-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-[9px] md:text-[10px] text-gray-400 font-black leading-relaxed uppercase tracking-widest group-hover:text-gray-600 transition-colors">
                    Я даю согласие ООО "Бикос" на обработку моих персональных данных в соответствии с <NuxtLink to="/privacy" class="text-brand-blue underline decoration-2 underline-offset-4">Политикой обработки данных</NuxtLink>
                  </span>
                </label>

                <button type="submit"
                        :disabled="!form.agree"
                        :class="[
                          'w-full font-black py-5 md:py-6 rounded-2xl md:rounded-[2rem] transition-all shadow-2xl active:scale-95 uppercase text-[10px] md:text-xs tracking-[0.3em] mt-4 md:mt-6',
                          form.agree ? 'bg-brand-blue hover:bg-[#1e5a9a] text-white shadow-brand-blue/40' : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                        ]">
                  Заказать
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-8 h-8 bg-white border-[6px] border-brand-blue rounded-full shadow-[0_10px_25px_-5px_rgba(42,106,178,0.5)] cursor-pointer transition-all active:scale-125 active:shadow-brand-blue/60;
}

/* Стили для скроллбара в корзине */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  @apply bg-gray-50 rounded-full;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-200 rounded-full hover:bg-gray-300 transition-colors;
}
</style>
