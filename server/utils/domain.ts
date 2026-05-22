import { domainToUnicode } from 'node:url'

/**
 * Преобразует хост из Punycode (xn--...) в Unicode для отображения (например, кириллические домены .рф).
 * Используется при SSR для корректного отображения URL в политике конфиденциальности для любого дилера.
 */
export function hostToUnicode(host: string): string {
  if (!host || typeof host !== 'string') return host
  const decoded = domainToUnicode(host)
  return decoded || host
}
