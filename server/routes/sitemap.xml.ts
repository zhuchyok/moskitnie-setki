export default defineEventHandler((event) => {
  const host = getHeader(event, 'host') || 'www.setki21.ru'
  const protocol = getHeader(event, 'x-forwarded-proto') || 'https'
  const origin = `${protocol}://${host}`

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <lastmod>2026-02-06T00:00:00+00:00</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${origin}/antimoshka/</loc>
    <lastmod>2026-02-06T00:00:00+00:00</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${origin}/antikoshka/</loc>
    <lastmod>2026-02-06T00:00:00+00:00</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${origin}/antipyl/</loc>
    <lastmod>2026-02-06T00:00:00+00:00</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${origin}/ultravyu/</loc>
    <lastmod>2026-02-07T00:00:00+00:00</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${origin}/vstavnye/</loc>
    <lastmod>2026-02-06T00:00:00+00:00</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${origin}/remont/</loc>
    <lastmod>2026-02-06T00:00:00+00:00</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${origin}/privacy</loc>
    <lastmod>2026-02-06T00:00:00+00:00</lastmod>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${origin}/contacts</loc>
    <lastmod>2026-02-06T00:00:00+00:00</lastmod>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${origin}/delivery</loc>
    <lastmod>2026-02-06T00:00:00+00:00</lastmod>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${origin}/karta-sajta</loc>
    <lastmod>2026-02-06T00:00:00+00:00</lastmod>
    <priority>0.4</priority>
  </url>
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml')
  return sitemap
})
