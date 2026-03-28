export default defineEventHandler(async (event) => {
  const host = getHeader(event, 'host') || 'www.setki21.ru'
  const protocol = getHeader(event, 'x-forwarded-proto') || 'https'
  const origin = `${protocol}://${host}`

  // Получаем конфиг дилера из API
  let name = 'Москитные сетки'
  let shortName = 'Сетки'
  let description = 'Производство и установка москитных сеток'
  let themeColor = '#2A6AB2'
  let faviconUrl = `${origin}/api/v1/tenant/favicon`

  try {
    const apiUrl = process.env.API_URL || process.env.NUXT_API_URL || 'http://localhost:8080'
    const data = await $fetch<any>(`${apiUrl}/api/v1/tenant/config`, {
      headers: { host, 'x-forwarded-host': host, 'x-real-ip': '127.0.0.1' },
      timeout: 3000,
    }).catch(() => $fetch<any>(`${apiUrl}/api/v1/tenant/config`, {
      headers: { 'x-forwarded-host': host, 'x-original-url': `https://${host}/` },
      timeout: 2000,
    }))
    if (data) {
      name = data.dealer_name || name
      shortName = (data.dealer_name || '').split(' ').slice(0, 2).join(' ') || shortName
      description = data.seo?.description || description
      themeColor = data.branding?.primary_color || themeColor
      if (data.branding?.favicon_url) {
        faviconUrl = data.branding.favicon_url.startsWith('http')
          ? data.branding.favicon_url
          : `${origin}${data.branding.favicon_url}`
      }
    }
  } catch {}

  setHeader(event, 'Content-Type', 'application/manifest+json')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  return {
    name,
    short_name: shortName,
    description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: themeColor,
    icons: [
      {
        src: faviconUrl,
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: faviconUrl,
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
})
