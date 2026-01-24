// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
        { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' }
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
