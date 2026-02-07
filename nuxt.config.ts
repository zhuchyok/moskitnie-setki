// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  css: [
    '@fontsource/inter/cyrillic-400.css',
    '@fontsource/inter/cyrillic-500.css',
    '@fontsource/inter/cyrillic-700.css',
    '@fontsource/inter/cyrillic-900.css',
  ],
  app: {
    head: {
      htmlAttrs: {
        lang: 'ru'
      },
      title: 'Москитные сетки в Чебоксарах и Новочебоксарске — Сетки 21',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#2A6AB2' },
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Сетки 21' },
        { property: 'og:image', content: 'https://www.setki21.ru/images/logo_final_v58.png' },
        { property: 'og:locale', content: 'ru_RU' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'dns-prefetch', href: 'https://mc.yandex.ru' }
      ]
    }
  },
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    config: {
      theme: {
        extend: {
          colors: {
            'brand-blue': '#2A6AB2',
            'brand-dark': '#333333',
          }
        }
      }
    }
  },
  nitro: {
    prerender: {
      routes: ['/', '/antimoshka', '/ultravyu', '/antikoshka', '/antipyl', '/vstavnye', '/remont', '/contacts', '/delivery', '/privacy', '/karta-sajta']
    }
  }
})
