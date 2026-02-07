import { defineConfig } from 'vitest/config'

// Один проект (node), без nuxt — иначе unit-тесты дважды и nuxt падает на #build/route-rules.mjs
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.spec.ts'],
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
  },
})
