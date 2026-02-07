/**
 * Валидация тела запроса для POST /api/contact.
 * Вынесено в отдельный модуль для unit-тестов без запуска Nuxt.
 */

const PHONE_REGEX =
  /^\+7\s?\(\d{3,4}\)\s?\d{2,3}-\d{2}-\d{2}$|^\+7\d{10}$/

export function validateContactBody(body: unknown): { ok: true } | { ok: false; statusCode: number; statusMessage: string } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, statusCode: 400, statusMessage: 'Name and phone are required' }
  }
  const { name, phone } = body as Record<string, unknown>
  if (!name || !phone) {
    return { ok: false, statusCode: 400, statusMessage: 'Name and phone are required' }
  }
  const phoneNorm = String(phone).replace(/\s/g, '')
  if (!PHONE_REGEX.test(phoneNorm)) {
    return { ok: false, statusCode: 400, statusMessage: 'Invalid phone format' }
  }
  return { ok: true }
}
