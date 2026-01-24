// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
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
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Сетки 21' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/manifest.json' },
        // Font optimization
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preload', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap', as: 'style' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap' }
      ]
    }
  },
  tailwindcss: {
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
      routes: ['/', '/antimoshka', '/antikoshka', '/antipyl', '/vstavnye', '/remont']
    }
  }
})
