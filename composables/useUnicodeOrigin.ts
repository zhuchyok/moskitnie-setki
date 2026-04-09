/**
 * Возвращает origin с Unicode-хостом (кириллица вместо Punycode xn--...).
 * На сервере берёт из event.context.unicodeOrigin (заполняется server/plugins/unicode-domain.ts).
 * На клиенте — из window.location (браузер всегда показывает Unicode для IDN).
 * Использовать вместо useRequestURL().origin для canonical, og:url, схем и т.д.
 */
export function useUnicodeOrigin(): string {
  if (import.meta.server) {
    const event = useRequestEvent()
    if (event?.context?.unicodeOrigin) {
      return event.context.unicodeOrigin
    }
  }
  if (import.meta.client && typeof window !== 'undefined') {
    return window.location.origin
  }
  const requestURL = useRequestURL()
  return requestURL?.origin || 'https://www.setki21.ru'
}
