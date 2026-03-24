// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  experimental: {
    extractCritical: true
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  devServer: {
    port: 3004,
    host: 'localhost'
  },
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
        { name: 'description', content: 'Производство и установка москитных сеток в Чебоксарах и Новочебоксарске. Замер за 1 день, цены от 850 ₽. Рамочные, антимошка, антикошка, антипыль, вставные VSN.' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#2A6AB2' },
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Сетки 21' },
        { property: 'og:description', content: 'Производство и установка москитных сеток в Чебоксарах и Новочебоксарске. Замер за 1 день, цены от 850 ₽.' },
        { property: 'og:image', content: 'https://www.setki21.ru/images/logo_final_v58.png' },
        { property: 'og:locale', content: 'ru_RU' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'dns-prefetch', href: 'https://mc.yandex.ru' },
        { rel: 'preconnect', href: 'https://mc.yandex.ru', crossorigin: 'anonymous' }
      ]
    }
  },
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    config: {
      safelist: [
        'admin-btn-primary',
      ],
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
      routes: ['/admin'],
      failOnError: false
    }
  },
  routeRules: {
    // Динамические роуты для SEO (server/routes)
  },
  runtimeConfig: {
    public: {
      // apiUrl: пустая строка = same-origin (/api на текущем домене).
      // apiBase: для SSR используем внутренний URL (http://api:8080/api), для клиента — /api.
      apiUrl: process.env.NUXT_PUBLIC_API_URL || '',
      apiBase: process.env.API_URL ? process.env.API_URL + '/api' : '/api'
    }
  },
  build: {
    transpile: ['vue-chartjs', 'chart.js']
  },
  vite: {
    optimizeDeps: {
      include: ['vue-chartjs', 'chart.js']
    },
    server: {
      watch: {
        ignored: ['**/.cursorrules', '**/MASTER_REFERENCE.md']
      }
    }
  }
})
