export default defineNuxtPlugin(() => {
  // Bitrix24 CRM Widget
  const bitrixScript = document.createElement('script')
  bitrixScript.async = true
  bitrixScript.src = 'https://cdn.bitrix24.ru/b6452149/crm/site_button/loader_2_pjdc06.js?' + (Date.now() / 60000 | 0)
  document.head.appendChild(bitrixScript)

  // Yandex.Metrika
  const ymScript = document.createElement('script')
  ymScript.async = true
  ymScript.src = 'https://mc.yandex.ru/metrika/tag.js'
  ymScript.onload = () => {
    // @ts-ignore
    window.ym = window.ym || function () {
      // @ts-ignore
      (window.ym.a = window.ym.a || []).push(arguments)
    }
    // @ts-ignore
    window.ym.l = 1 * new Date()
    // @ts-ignore
    window.ym(48599813, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true
    })
  }
  document.head.appendChild(ymScript)

  // Noscript fallback (for users without JS - add img)
  const noscript = document.createElement('noscript')
  noscript.innerHTML = '<div><img src="https://mc.yandex.ru/watch/48599813" style="position:absolute;left:-9999px;" alt=""></div>'
  document.body.appendChild(noscript)
})
