import { domainToUnicode } from 'node:url'

/**
 * Нитро-плагин: конвертирует Punycode-хост (xn--...) в Unicode (кириллицу)
 * и кладёт result в event.context.unicodeOrigin для использования в composables.
 * Нужно для корректного формирования canonical URL на IDN-доменах (напр. сеткимоскитки.рф).
 */
export default defineNitroPlugin((app) => {
  app.hooks.hook('request', (event) => {
    try {
      const host = getRequestHeader(event, 'host') || ''
      const proto = getRequestHeader(event, 'x-forwarded-proto') || 'https'
      const [hostname, port] = host.split(':')
      const unicodeHostname = domainToUnicode(hostname)
      event.context.unicodeOrigin = port
        ? `${proto}://${unicodeHostname}:${port}`
        : `${proto}://${unicodeHostname}`
    } catch {
      // fallback: не трогаем context, composable вернёт requestURL.origin
    }
  })
})
