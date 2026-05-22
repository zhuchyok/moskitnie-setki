/**
 * Экранирование HTML для защиты от XSS при вставке пользовательских данных в шаблоны писем.
 * Заменяет & < > " ' на соответствующие HTML-сущности.
 */
export function escapeHtml(str: unknown): string {
  if (str == null || typeof str !== 'string') return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
