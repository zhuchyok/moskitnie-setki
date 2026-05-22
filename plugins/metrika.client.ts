// Яндекс Метрика: основной счётчик сайта + счётчик Яндекс.Бизнес
// Загрузка отложена (requestIdleCallback + 2s) для улучшения INP и LCP
import { useTenantStore } from '~/stores/tenant'

const METRIKA_IDS = [48599813, 63315469] as const;

export default defineNuxtPlugin(() => {
  if (!process.client) return
  const router = useRouter()
  const tenant = useTenantStore()

  function loadMetrika() {
    const w = window as any
    if (w.ym) return
    ;(function(m: any,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) return }
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (w, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')

    const initOptions = { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true }
    
    // Собираем все ID: основные + дилерский
    const ids = [...METRIKA_IDS]
    let dealerMetrikaId = tenant.config?.seo?.analytics_code

    // Если в поле попал полный скрипт, извлекаем только ID
    if (dealerMetrikaId && dealerMetrikaId.includes('ym(')) {
      const match = dealerMetrikaId.match(/ym\((\d+)/)
      if (match && match[1]) {
        dealerMetrikaId = match[1]
      }
    }

    if (dealerMetrikaId && !ids.includes(Number(dealerMetrikaId))) {
      ids.push(Number(dealerMetrikaId))
    }

    ids.forEach((id) => { w.ym(id, 'init', initOptions) })

    router.afterEach((to) => {
      ids.forEach((id) => { w.ym(id, 'hit', to.fullPath) })
    })

    w.reachMetrikaGoal = (goalName: string, params?: any) => {
      ids.forEach((id) => { w.ym(id, 'reachGoal', goalName, params) })
    }
  }

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => setTimeout(loadMetrika, 2000), { timeout: 4000 })
  } else {
    setTimeout(loadMetrika, 2500)
  }
})
