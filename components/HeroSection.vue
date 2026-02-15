<script setup lang="ts">
/** HeroSection - Герой-секция с настраиваемым контентом
 * Переиспользуемый компонент для hero-блоков
 */

interface HeroButton {
  text: string
  href?: string
  primary?: boolean
  onClick?: () => void
}

interface Props {
  /** Заголовок */
  title: string
  /** Подзаголовок */
  subtitle?: string
  /** Описание */
  description?: string
  /** Изображение (URL или путь) */
  image?: string
  /** Альтернативный текст изображения */
  imageAlt?: string
  /** Кнопки */
  buttons?: HeroButton[]
  /** Тёмный фон */
  dark?: boolean
  /** Выравнивание контента */
  align?: 'left' | 'center' | 'right'
}

withDefaults(defineProps<Props>(), {
  dark: false,
  align: 'left'
})

const emit = defineEmits<{
  buttonClick: [index: number]
}>()

const handleButtonClick = (index: number, button: HeroButton) => {
  if (button.onClick) {
    button.onClick()
  }
  emit('buttonClick', index)
}

const containerClasses = computed(() => {
  const base = 'relative overflow-hidden'
  return props.dark ? `${base} bg-brand-dark text-white` : `${base} bg-gray-50`
})

const contentAlign = computed(() => {
  switch (props.align) {
    case 'center': return 'items-center text-center'
    case 'right': return 'items-end text-right'
    default: return 'items-start text-left'
  }
})
</script>

<template>
  <section :class="containerClasses">
    <div class="container mx-auto px-4 py-16 md:py-24">
      <div class="flex flex-col md:flex-row gap-8 md:gap-16" :class="contentAlign">
        <!-- Контент -->
        <div class="flex-1 space-y-6">
          <h1 v-if="title" class="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-tight"
              :class="dark ? 'text-white' : 'text-brand-dark'">
            {{ title }}
          </h1>
          <p v-if="subtitle" class="text-lg md:text-xl font-medium" :class="dark ? 'text-white/70' : 'text-gray-500'">
            {{ subtitle }}
          </p>
          <p v-if="description" class="text-base font-medium max-w-xl" :class="dark ? 'text-white/60' : 'text-gray-400'">
            {{ description }}
          </p>

          <!-- Кнопки -->
          <div v-if="buttons?.length" class="flex flex-wrap gap-4 pt-4" :class="align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'">
            <button v-for="(button, index) in buttons"
                    :key="index"
                    @click="handleButtonClick(index, button)"
                    :class="[
                      'font-black py-4 px-8 rounded-2xl transition-all uppercase text-xs tracking-widest shadow-lg',
                      button.primary ?? true
                        ? 'bg-brand-blue text-white hover:bg-[#1e5a9a] hover:shadow-brand-blue/40'
                        : dark
                          ? 'bg-white/10 text-white hover:bg-white/20 border-2 border-white/20'
                          : 'bg-white text-brand-dark hover:bg-gray-50 border-2 border-gray-100'
                    ]">
              {{ button.text }}
            </button>
          </div>
        </div>

        <!-- Изображение -->
        <div v-if="image" class="flex-1 flex justify-center">
          <img :src="image" :alt="imageAlt || title" class="max-w-full h-auto rounded-3xl shadow-2xl" />
        </div>
      </div>
    </div>
  </section>
</template>
