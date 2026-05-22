import { domainToASCII } from 'node:url'

export default defineEventHandler((event) => {
  const rawHost = getHeader(event, 'host') || 'www.setki21.ru'
  const protocol = getHeader(event, 'x-forwarded-proto') || 'https'
  const [hostname, port] = rawHost.split(':')
  const asciiHostname = domainToASCII(hostname.toLowerCase()) || hostname.toLowerCase()
  const origin = port ? `${protocol}://${asciiHostname}:${port}` : `${protocol}://${asciiHostname}`

  const today = new Date().toISOString().split('T')[0]

  const pages = [
    { url: '/',           priority: '1.0', changefreq: 'weekly'  },
    { url: '/antimoshka/', priority: '0.8', changefreq: 'monthly' },
    { url: '/antikoshka/', priority: '0.8', changefreq: 'monthly' },
    { url: '/antipyl/',    priority: '0.8', changefreq: 'monthly' },
    { url: '/ultravyu/',   priority: '0.8', changefreq: 'monthly' },
    { url: '/vstavnye/',   priority: '0.8', changefreq: 'monthly' },
    { url: '/remont/',     priority: '0.7', changefreq: 'monthly' },
    { url: '/privacy/',    priority: '0.4', changefreq: 'yearly'  },
    { url: '/contacts/',   priority: '0.6', changefreq: 'monthly' },
    { url: '/delivery/',   priority: '0.6', changefreq: 'monthly' },
    { url: '/karta-sajta/', priority: '0.4', changefreq: 'yearly' },
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${origin}${p.url}</loc>
    <lastmod>${today}T00:00:00+00:00</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return sitemap
})
