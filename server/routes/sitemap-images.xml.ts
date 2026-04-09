import { domainToUnicode } from 'node:url'

export default defineEventHandler((event) => {
  const rawHost = getHeader(event, 'host') || 'www.setki21.ru'
  const protocol = getHeader(event, 'x-forwarded-proto') || 'https'
  const [hostname, port] = rawHost.split(':')
  const unicodeHostname = domainToUnicode(hostname)
  const origin = port ? `${protocol}://${unicodeHostname}:${port}` : `${protocol}://${unicodeHostname}`

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    
    <url>
        <loc>${origin}/</loc>
        <image:image>
            <image:loc>${origin}/images/logo_clean.png</image:loc>
            <image:title>Москитные сетки</image:title>
            <image:caption>Производство и установка москитных сеток</image:caption>
        </image:image>
        <image:image>
            <image:loc>${origin}/images/optimized/e09/e09007396221ccbae983f19a970e4be5.webp</image:loc>
            <image:title>Рамочная москитная сетка на окне</image:title>
            <image:caption>Рамочная москитная сетка Fiberglass</image:caption>
        </image:image>
    </url>
    
    <url>
        <loc>${origin}/antikoshka/</loc>
        <image:image>
            <image:loc>${origin}/images/optimized/e09/e09007396221ccbae983f19a970e4be5.webp</image:loc>
            <image:title>Сетка Антикошка Pet Screen</image:title>
            <image:caption>Усиленная москитная сетка Антикошка для защиты от кошек</image:caption>
        </image:image>
    </url>
    
    <url>
        <loc>${origin}/antipyl/</loc>
        <image:image>
            <image:loc>${origin}/images/optimized/e09/e09007396221ccbae983f19a970e4be5.webp</image:loc>
            <image:title>Сетка Антипыль Poll-Tex</image:title>
            <image:caption>Москитная сетка Антипыль для аллергиков</image:caption>
        </image:image>
    </url>
    
    <url>
        <loc>${origin}/antimoshka/</loc>
        <image:image>
            <image:loc>${origin}/images/optimized/e09/e09007396221ccbae983f19a970e4be5.webp</image:loc>
            <image:title>Сетка Антимошка Micro Mesh</image:title>
            <image:caption>Москитная сетка Антимошка с мелкой ячейкой</image:caption>
        </image:image>
    </url>
    
    <url>
        <loc>${origin}/vstavnye/</loc>
        <image:image>
            <image:loc>${origin}/images/optimized/e09/hero-vstavnye.webp</image:loc>
            <image:title>Вставные москитные сетки VSN</image:title>
            <image:caption>Вставные сетки VSN без сверления рамы</image:caption>
        </image:image>
    </url>
    
    <url>
        <loc>${origin}/remont/</loc>
        <image:image>
            <image:loc>${origin}/images/optimized/e09/hero-remont.webp</image:loc>
            <image:title>Ремонт москитных сеток</image:title>
            <image:caption>Профессиональный ремонт москитных сеток</image:caption>
        </image:image>
    </url>
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml')
  return sitemap
})
