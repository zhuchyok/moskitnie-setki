// Только e2e: поднимаем сервер и дергаем API (не nuxt-окружение)
// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('POST /api/contact', async () => {
  await setup({
    setupTimeout: 60000,
    server: true,
    build: true,
  })

  it('возвращает 200 и success при валидных name и phone', async () => {
    const res = await $fetch<{ success: boolean; message: string }>('/api/contact', {
      method: 'POST',
      body: { name: 'Иван', phone: '+7 (8352) 38-14-20' },
    })
    expect(res.success).toBe(true)
    expect(res.message).toContain('успешно')
  })

  it('возвращает 200 при валидных данных с опциональным message', async () => {
    const res = await $fetch<{ success: boolean; message: string }>('/api/contact', {
      method: 'POST',
      body: { name: 'Мария', phone: '+79991234567', message: 'Нужна сетка на балкон' },
    })
    expect(res.success).toBe(true)
  })

  it('возвращает 400 при отсутствии name', async () => {
    try {
      await $fetch('/api/contact', {
        method: 'POST',
        body: { phone: '+7 (8352) 38-14-20' },
      })
      expect.fail('ожидалась ошибка 400')
    } catch (e: any) {
      expect(e?.statusCode ?? e?.status).toBe(400)
    }
  })

  it('возвращает 400 при отсутствии phone', async () => {
    try {
      await $fetch('/api/contact', {
        method: 'POST',
        body: { name: 'Иван' },
      })
      expect.fail('ожидалась ошибка 400')
    } catch (e: any) {
      expect(e?.statusCode ?? e?.status).toBe(400)
    }
  })

  it('возвращает 400 при неверном формате телефона', async () => {
    try {
      await $fetch('/api/contact', {
        method: 'POST',
        body: { name: 'Иван', phone: '123' },
      })
      expect.fail('ожидалась ошибка 400')
    } catch (e: any) {
      expect(e?.statusCode ?? e?.status).toBe(400)
    }
  })

  it('принимает телефон в формате +7XXXXXXXXXX', async () => {
    const res = await $fetch<{ success: boolean }>('/api/contact', {
      method: 'POST',
      body: { name: 'Тест', phone: '+79991234567' },
    })
    expect(res.success).toBe(true)
  })
})
