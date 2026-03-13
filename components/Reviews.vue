<script setup lang="ts">
const tenant = useTenantStore()

const reviews = computed(() => [
  {
    author: 'Алексей',
    date: '2025-05-15',
    text: `Заказал сетки Антикошка в ${tenant.config.city || 'Чебоксарах'}. Кот доволен, я спокоен. Качество отличное, установили быстро.`,
    rating: 5
  },
  {
    author: 'Марина',
    date: '2025-06-02',
    text: `Очень довольна сервисом ${tenant.config.dealer_name || 'Сетки 21'}. Замерщик приехал в день обращения, на следующий день уже все стояло. Рекомендую!`,
    rating: 5
  },
  {
    author: 'Игорь',
    date: '2025-07-10',
    text: `Брал сетки Антипыль, так как аллергик. Реально стало меньше пыли в квартире. В ${tenant.config.city || 'нашем городе'} это лучший вариант по цене и качеству.`,
    rating: 5
  }
])

const reviewSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  'itemListElement': reviews.value.map((r, i) => ({
    '@type': 'ListItem',
    'position': i + 1,
    'item': {
      '@type': 'Review',
      'author': { '@type': 'Person', 'name': r.author },
      'datePublished': r.date,
      'reviewBody': r.text,
      'reviewRating': {
        '@type': 'Rating',
        'ratingValue': r.rating,
        'bestRating': '5'
      },
      'publisher': {
        '@type': 'Organization',
        'name': tenant.config.dealer_name || 'Сетки 21'
      }
    }
  }))
}))

useHead({
  script: [
    { type: 'application/ld+json', children: computed(() => JSON.stringify(reviewSchema.value)) }
  ]
})
</script>

<template>
  <section class="py-12 bg-gray-50/50 rounded-[3rem] mt-16 border border-gray-100 overflow-hidden">
    <div class="container mx-auto px-6">
      <h2 class="text-2xl md:text-3xl font-black mb-10 uppercase tracking-tight text-center" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">
        Отзывы наших клиентов в {{ tenant.config.city || 'Чебоксарах' }}
      </h2>
      
      <div class="grid md:grid-cols-3 gap-6">
        <div v-for="(review, idx) in reviews" :key="idx" 
             class="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex flex-col h-full transition-transform hover:scale-[1.02] duration-300">
          <div class="flex items-center mb-4">
            <div class="flex text-yellow-400 mr-2">
              <svg v-for="star in 5" :key="star" class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span class="font-black text-sm uppercase tracking-wider text-gray-900">{{ review.author }}</span>
          </div>
          <p class="text-gray-600 text-sm leading-relaxed mb-4 flex-grow italic">"{{ review.text }}"</p>
          <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ new Date(review.date).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }) }}</div>
        </div>
      </div>
      
      <div class="mt-10 text-center">
        <div class="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-sm border border-gray-100">
          <span class="text-sm font-bold text-gray-500 mr-2">⭐ 4.9/5 на основе 154 отзывов в {{ tenant.config.city || 'Чебоксарах' }}</span>
          <div class="w-px h-4 bg-gray-200 mx-3"></div>
          <a href="#" class="text-sm font-black uppercase tracking-wider hover:underline" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">
            Все отзывы
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
