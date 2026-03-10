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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Валидация для POST /api/callback: имя, телефон, обязательное согласие с политикой; опционально toEmail */
export function validateCallbackBody(body: unknown): { ok: true; toEmail?: string } | { ok: false; statusCode: number; statusMessage: string } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, statusCode: 400, statusMessage: 'Name, phone and consent are required' }
  }
  const b = body as Record<string, unknown>
  const { name, phone, agreePrivacy, toEmail } = b
  if (!name || !phone) {
    return { ok: false, statusCode: 400, statusMessage: 'Name and phone are required' }
  }
  const phoneNorm = String(phone).trim().replace(/\s/g, '')
  if (!PHONE_REGEX.test(phoneNorm)) {
    return { ok: false, statusCode: 400, statusMessage: 'Invalid phone format' }
  }
  if (agreePrivacy !== true) {
    return { ok: false, statusCode: 400, statusMessage: 'Consent with privacy policy is required' }
  }
  if (toEmail !== undefined && toEmail !== null && toEmail !== '') {
    const email = String(toEmail).trim()
    if (!EMAIL_REGEX.test(email)) {
      return { ok: false, statusCode: 400, statusMessage: 'Invalid toEmail format' }
    }
    return { ok: true, toEmail: email }
  }
  return { ok: true }
}
