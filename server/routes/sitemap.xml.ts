export default defineEventHandler((event) => {
  const host = getHeader(event, 'host') || 'www.setki21.ru'
  const protocol = getHeader(event, 'x-forwarded-proto') || 'https'
  
  // Для кириллических доменов Punycode не нужен в <loc>, браузеры и ПС понимают UTF-8 в XML, 
  // но для надежности используем то, что пришло в Host.
  const origin = `${protocol}://${host}`

  // Список страниц (всегда со слэшем в конце для соответствия canonical)
  const pages = [
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

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${origin}${p.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}T00:00:00+00:00</lastmod>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return sitemap
})
