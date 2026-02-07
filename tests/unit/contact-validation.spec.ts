// @vitest-environment node
/**
 * Unit-тесты валидации /api/contact без Nuxt и esbuild (нет EAGAIN).
 */
import { describe, it, expect } from 'vitest'
import { validateContactBody } from '../../server/utils/contact-validation'

describe('validateContactBody', () => {
  it('допускает валидные name и телефон +7 (8352) 38-14-20', () => {
    expect(validateContactBody({ name: 'Иван', phone: '+7 (8352) 38-14-20' })).toEqual({ ok: true })
  })

  it('допускает телефон +79991234567', () => {
    expect(validateContactBody({ name: 'Мария', phone: '+79991234567' })).toEqual({ ok: true })
  })

  it('допускает опциональное message', () => {
    expect(
      validateContactBody({ name: 'Тест', phone: '+7 (8352) 38-14-20', message: 'Текст' })
    ).toEqual({ ok: true })
  })

  it('возвращает 400 при отсутствии name', () => {
    expect(validateContactBody({ phone: '+7 (8352) 38-14-20' })).toEqual({
      ok: false,
      statusCode: 400,
      statusMessage: 'Name and phone are required'
    })
  })

  it('возвращает 400 при отсутствии phone', () => {
    expect(validateContactBody({ name: 'Иван' })).toEqual({
      ok: false,
      statusCode: 400,
      statusMessage: 'Name and phone are required'
    })
  })

  it('возвращает 400 при неверном формате телефона', () => {
    expect(validateContactBody({ name: 'Иван', phone: '123' })).toEqual({
      ok: false,
      statusCode: 400,
      statusMessage: 'Invalid phone format'
    })
  })

  it('возвращает 400 при пустом body', () => {
    expect(validateContactBody(null)).toEqual({
      ok: false,
      statusCode: 400,
      statusMessage: 'Name and phone are required'
    })
  })
})
