import { defineEventHandler, setHeader } from 'h3'
import { domainToASCII } from 'node:url'

export default defineEventHandler(async (event) => {
  const hostHeader = event.headers.get('host') || 'www.setki21.ru'
  const [rawHost] = hostHeader.split(':')
  const host = domainToASCII(rawHost.toLowerCase()) || rawHost.toLowerCase()
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const baseUrl = `${protocol}://${host}`

  const routes = [
    { url: '/', priority: '1.0' },
    { url: '/antimoshka/', priority: '0.8' },
    { url: '/antikoshka/', priority: '0.8' },
    { url: '/antipyl/', priority: '0.8' },
    { url: '/ultravyu/', priority: '0.8' },
    { url: '/vstavnye/', priority: '0.8' },
    { url: '/remont/', priority: '0.7' },
    { url: '/privacy/', priority: '0.4' },
    { url: '/contacts/', priority: '0.6' },
    { url: '/delivery/', priority: '0.6' },
    { url: '/karta-sajta/', priority: '0.4' },
  ]

  const lastmod = new Date().toISOString().split('T')[0]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml')
  return sitemap
})
