<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  width: number
  height: number
  frameColor: string
  brandPrimary: string
  isDraggingWidth: boolean
  isDraggingHeight: boolean
  editingWidth: boolean
  editingHeight: boolean
  tempWidth: string
  tempHeight: string
  heightThumbCenter: number
  widthThumbCenter: number
  dotSize: number
  thumbSize: number
  vSliderW: number
  hSliderW: number
  meshThickness: string
  meshSize: number
  meshOpacity: number
  frameType: string
}>()

const emit = defineEmits<{
  (e: 'update:width', val: number): void
  (e: 'update:height', val: number): void
  (e: 'update:isDraggingWidth', val: boolean): void
  (e: 'update:isDraggingHeight', val: boolean): void
  (e: 'startEditWidth'): void
  (e: 'startEditHeight'): void
  (e: 'saveWidth'): void
  (e: 'saveHeight'): void
  (e: 'update:tempWidth', val: string): void
  (e: 'update:tempHeight', val: string): void
}>()

const localWidth = computed({
  get: () => props.width,
  set: (val) => emit('update:width', val)
})

const localHeight = computed({
  get: () => props.height,
  set: (val) => emit('update:height', val)
})
</script>

<template>
  <div class="flex flex-col items-center justify-center relative h-full w-full">
    <!-- Размеры над сеткой -->
    <div class="mb-5 flex gap-8 justify-center w-full text-[13px] font-black uppercase tracking-widest text-gray-500">
      <!-- Ширина -->
      <div class="flex items-center gap-2 group" :style="{ '--brand-primary': brandPrimary }">
        <span class="w-3 h-3 rounded-full flex-shrink-0 transition-transform group-hover:scale-125" :style="{ backgroundColor: brandPrimary, boxShadow: `0 4px 6px -1px ${brandPrimary}66` }"></span>
        <div class="flex items-baseline gap-1">
          <input v-if="editingWidth" 
                 type="text" 
                 :value="tempWidth" 
                 @input="(e) => emit('update:tempWidth', (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4))"
                 @blur="emit('saveWidth')" 
                 @keyup.enter="emit('saveWidth')"
                 maxlength="4"
                 class="w-16 text-base font-black text-center bg-blue-50 border-b-2 outline-none py-0.5" 
                 :style="{ color: brandPrimary, borderColor: brandPrimary }"
                 autofocus />
          <span v-else 
                @click="emit('startEditWidth')" 
                class="text-base font-black border-b border-dashed border-gray-300 transition-colors cursor-pointer"
                :style="{ color: brandPrimary }">
            {{ width }}
          </span>
          <small class="text-[10px] text-gray-400 ml-0.5 font-bold">ММ</small>
        </div>
      </div>

      <!-- Высота -->
      <div class="flex items-center gap-2 group" :style="{ '--brand-primary': brandPrimary }">
        <span class="w-3 h-3 rounded-full flex-shrink-0 transition-transform group-hover:scale-125" :style="{ backgroundColor: brandPrimary, boxShadow: `0 4px 6px -1px ${brandPrimary}66` }"></span>
        <div class="flex items-baseline gap-1">
          <input v-if="editingHeight" 
                 type="text" 
                 :value="tempHeight" 
                 @input="(e) => emit('update:tempHeight', (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4))"
                 @blur="emit('saveHeight')" 
                 @keyup.enter="emit('saveHeight')"
                 maxlength="4"
                 class="w-16 text-base font-black text-center bg-blue-50 border-b-2 outline-none py-0.5" 
                 :style="{ color: brandPrimary, borderColor: brandPrimary }"
                 autofocus />
          <span v-else 
                @click="emit('startEditHeight')" 
                class="text-base font-black border-b border-dashed border-gray-300 transition-colors cursor-pointer"
                :style="{ color: brandPrimary }">
            {{ height }}
          </span>
          <small class="text-[10px] text-gray-400 ml-0.5 font-bold">ММ</small>
        </div>
      </div>
    </div>

    <!-- Контейнер для сетки и ползунков -->
    <div class="relative flex items-center justify-center w-full h-full max-w-[320px] max-h-[450px]">
      <!-- Ползунок высоты (вертикальный справа) -->
      <div class="absolute overflow-visible flex items-center justify-center" style="right: -2.5rem; top: 12.5%; height: 75%; width: 20px;">
        <div class="relative flex-shrink-0" style="width: 280px; height: 20px; transform: rotate(-90deg); transform-origin: center center;">
          <input type="range" min="200" max="2000" step="5" 
                 :value="height"
                 @input="(e) => emit('update:height', parseInt((e.target as HTMLInputElement).value))"
                 @mousedown="emit('update:isDraggingHeight', true)"
                 @touchstart="emit('update:isDraggingHeight', true)"
                 @mouseup="emit('update:isDraggingHeight', false)"
                 @touchend="emit('update:isDraggingHeight', false)"
                 class="horizontal-range hide-thumb"
                 style="position: absolute; width: 100%; top: 50%; transform: translateY(-50%); margin: 0;"/>
          <div class="absolute flex items-center justify-center pointer-events-none"
               :style="{
                 left: heightThumbCenter + 'px',
                 top: '50%',
                 transform: isDraggingHeight ? 'translate(-50%, -50%) scale(1.1)' : 'translate(-50%, -50%)',
                 transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                 zIndex: 50
               }">
            <!-- Точка ползунка -->
            <div :style="{
              width: (isDraggingHeight ? dotSize + 4 : dotSize + 2) + 'px',
              height: (isDraggingHeight ? dotSize + 4 : dotSize + 2) + 'px',
              backgroundColor: brandPrimary,
              borderRadius: '50%',
              boxShadow: `0 2px 6px ${brandPrimary}44`,
              transition: 'all 0.2s ease'
            }"></div>
            <!-- Облачко с цифрой -->
            <div class="absolute font-black text-white px-2 py-1 rounded-lg shadow-xl flex items-center justify-center min-w-[45px] cursor-pointer pointer-events-auto"
                 @click.stop="emit('startEditHeight')"
                 @mousedown.stop
                 @touchstart.stop
                 :style="{
                   backgroundColor: brandPrimary,
                   left: '50%',
                   top: '50%',
                   transform: isDraggingHeight ? 'translate(-50%, -50%) rotate(90deg) translateY(-32px) scale(1.1)' : 'translate(-50%, -50%) rotate(90deg) translateY(-32px)',
                   fontSize: '14px',
                   boxShadow: `0 4px 12px ${brandPrimary}66`,
                   zIndex: 60
                 }">
              <input v-if="editingHeight"
                     type="text"
                     :value="tempHeight"
                     @input="(e) => emit('update:tempHeight', (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4))"
                     @blur="emit('saveHeight')"
                     @keyup.enter="emit('saveHeight')"
                     @click.stop
                     class="w-12 bg-white text-center rounded outline-none font-black"
                     :style="{ color: brandPrimary }"
                     autofocus />
              <span v-else style="display: inline-block; white-space: nowrap;">{{ height }}</span>
              <!-- Хвостик облачка -->
              <div class="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px]"
                   :style="{ borderTopColor: brandPrimary }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Основная рамка сетки -->
      <div class="relative border-[8px] bg-white shadow-2xl transition-all duration-500 ease-out flex items-center justify-center overflow-hidden"
           :style="{ 
             width: Math.min(280, Math.max(150, width / 4)) + 'px', 
             height: Math.min(350, Math.max(200, height / 4)) + 'px',
             borderColor: frameColor
           }">
        <!-- Сетка линиями -->
        <div class="absolute inset-0 transition-all duration-500 z-0"
             :style="{ 
               backgroundImage: `
                 linear-gradient(to right, #000 ${meshThickness}, transparent ${meshThickness}),
                 linear-gradient(to bottom, #000 ${meshThickness}, transparent ${meshThickness})
               `,
               backgroundSize: meshSize + 'px ' + meshSize + 'px',
               opacity: meshOpacity
             }"></div>
        
        <!-- Перегородка посередине -->
        <div class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 transition-colors duration-500 z-10 shadow-sm"
             :style="{ backgroundColor: frameColor }"></div>
        
        <!-- Ручки для вставной -->
        <template v-if="frameType === 'vstavnaya'">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-1.5 bg-brand-dark/50 rounded-full -mt-2.5 z-20"></div>
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 h-5 w-1.5 bg-brand-dark/50 rounded-full -mb-2.5 z-20"></div>
        </template>
        <!-- Ручки для остальных -->
        <template v-else>
          <div class="absolute left-0 top-[55%] w-5 h-1.5 bg-brand-dark/50 rounded-full -ml-2.5 z-20"></div>
          <div class="absolute right-0 top-[55%] w-5 h-1.5 bg-brand-dark/50 rounded-full -mr-2.5 z-20"></div>
        </template>
      </div>

      <!-- Ползунок ширины (горизонтальный снизу) -->
      <div class="absolute left-1/2 -translate-x-1/2" style="width: 210px; bottom: -38px;">
        <div class="relative w-full flex items-center" :style="{ height: thumbSize + 'px' }">
          <input type="range" min="200" max="1500" step="5" 
                 :value="width"
                 @input="(e) => emit('update:width', parseInt((e.target as HTMLInputElement).value))"
                 @mousedown="emit('update:isDraggingWidth', true)"
                 @touchstart="emit('update:isDraggingWidth', true)"
                 @mouseup="emit('update:isDraggingWidth', false)"
                 @touchend="emit('update:isDraggingWidth', false)"
                 class="horizontal-range hide-thumb w-full"/>
          <div class="absolute flex items-center justify-center pointer-events-none"
               :style="{
                 left: widthThumbCenter + 'px',
                 top: '50%',
                 transform: isDraggingWidth ? 'translateX(-50%) translateY(-50%) scale(1.1)' : 'translateX(-50%) translateY(-50%)',
                 transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                 zIndex: 50
               }">
            <!-- Точка ползунка -->
            <div :style="{
              width: (isDraggingWidth ? dotSize + 4 : dotSize + 2) + 'px',
              height: (isDraggingWidth ? dotSize + 4 : dotSize + 2) + 'px',
              backgroundColor: brandPrimary,
              borderRadius: '50%',
              boxShadow: `0 2px 6px ${brandPrimary}44`,
              transition: 'all 0.2s ease'
            }"></div>
            <!-- Облачко с цифрой -->
            <div class="absolute font-black text-white px-2 py-1 rounded-lg shadow-xl flex items-center justify-center min-w-[45px] cursor-pointer pointer-events-auto"
                 @click.stop="emit('startEditWidth')"
                 @mousedown.stop
                 @touchstart.stop
                 :style="{
                   backgroundColor: brandPrimary,
                   bottom: '22px',
                   fontSize: '14px',
                   boxShadow: `0 4px 12px ${brandPrimary}66`,
                   zIndex: 60
                 }">
              <input v-if="editingWidth"
                     type="text"
                     :value="tempWidth"
                     @input="(e) => emit('update:tempWidth', (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4))"
                     @blur="emit('saveWidth')"
                     @keyup.enter="emit('saveWidth')"
                     @click.stop
                     class="w-12 bg-white text-center rounded outline-none font-black"
                     :style="{ color: brandPrimary }"
                     autofocus />
              <template v-else>{{ width }}</template>
              <!-- Хвостик облачка -->
              <div class="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px]"
                   :style="{ borderTopColor: brandPrimary }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.horizontal-range {
  -webkit-appearance: none;
  appearance: none;
  height: 3px;
  background: #e5e7eb;
  border-radius: 9999px;
  outline: none;
  cursor: pointer;
}

.hide-thumb::-webkit-slider-thumb {
  -webkit-appearance: none;
  opacity: 0;
  width: 60px;
  height: 60px;
}
.hide-thumb::-moz-range-thumb {
  opacity: 0;
  width: 60px;
  height: 60px;
}
</style>
