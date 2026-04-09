import { domainToUnicode } from 'node:url'

export default defineEventHandler((event) => {
  const rawHost = getHeader(event, 'host') || 'www.setki21.ru'
  const protocol = getHeader(event, 'x-forwarded-proto') || 'https'
  const [hostname, port] = rawHost.split(':')
  const unicodeHostname = domainToUnicode(hostname)
  const origin = port ? `${protocol}://${unicodeHostname}:${port}` : `${protocol}://${unicodeHostname}`

  const robots = `User-agent: *
Allow: /
Allow: /images/
Allow: /upload/
Allow: /images/optimized/
Disallow: /admin/
Disallow: /api/
Disallow: /cabinet/
Disallow: /dealer/
Sitemap: ${origin}/sitemap.xml
Sitemap: ${origin}/sitemap-images.xml
Host: ${unicodeHostname}

# AI Crawler Settings
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: CCBot
Allow: /

User-agent: YouBot
Allow: /
`

  setHeader(event, 'Content-Type', 'text/plain')
  return robots
})
