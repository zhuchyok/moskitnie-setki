<script setup lang="ts">
/** FaqSection - Переиспользуемый FAQ-блок
 * Может использоваться на разных страницах с разными вопросами
 */

interface FaqItem {
  question: string
  answer: string
}

interface Props {
  /** Список вопросов-ответов */
  items: FaqItem[]
  /** Заголовок секции */
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Часто задаваемые вопросы'
})

const openIndex = ref<number | null>(null)

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section class="faq-section">
    <div class="container mx-auto px-4">
      <h2 v-if="title" class="text-3xl md:text-4xl font-black text-brand-dark uppercase tracking-tighter mb-12 text-center">
        {{ title }}
      </h2>

      <div class="max-w-3xl mx-auto space-y-4">
        <div v-for="(item, index) in items"
             :key="index"
             class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <button @click="toggle(index)"
                  class="w-full px-6 py-5 text-left flex items-center justify-between gap-4 transition-colors"
                  :class="openIndex === index ? 'bg-gray-50' : 'hover:bg-gray-50/50'">
            <span class="font-black text-brand-dark text-sm uppercase tracking-wide">
              {{ item.question }}
            </span>
            <span class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform"
                  :class="openIndex === index ? 'bg-brand-blue text-white rotate-180' : 'bg-gray-100 text-gray-400'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>

          <div v-show="openIndex === index"
               class="px-6 pb-5 text-gray-500 font-medium leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
            {{ item.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
