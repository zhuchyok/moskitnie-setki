<script setup lang="ts">
/** SeoHead - Компонент для SEO-метаданных и JSON-LD
 * Переиспользуемый компонент для управления SEO
 */

interface Props {
  /** Заголовок страницы */
  title: string
  /** Описание страницы */
  description?: string
  /** Канонический URL */
  canonical?: string
  /** Изображение для соцсетей */
  ogImage?: string
  /** Тип страницы */
  ogType?: string
  /** JSON-LD данные */
  jsonLd?: Record<string, any>
  /** Дополнительные мета-теги */
  meta?: Record<string, string>[]
}

const props = withDefaults(defineProps<Props>(), {
  ogType: 'website',
  description: '',
  ogImage: '/og-default.jpg'
})

const config = useRuntimeConfig()
const route = useRoute()

const fullTitle = computed(() => props.title ? `${props.title} | Москитные сетки` : 'Москитные сетки в Чебоксарах')

const canonicalUrl = computed(() => {
  if (props.canonical) return props.canonical
  const baseUrl = 'https://www.setki21.ru'
  return `${baseUrl}${route.path}`
})

useHead({
  title: fullTitle,
  meta: [
    { name: 'description', content: props.description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: props.description },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: props.ogImage },
    { property: 'og:type', content: props.ogType },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: props.description },
    { name: 'twitter:image', content: props.ogImage },
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl }
  ]
})

if (props.jsonLd) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(props.jsonLd)
      }
    ]
  })
}
</script>

<template>
  <div />
</template>
