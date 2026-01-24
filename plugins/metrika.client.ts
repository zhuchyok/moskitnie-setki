// Яндекс Метрика
export default defineNuxtPlugin(() => {
  if (process.client) {
    const METRIKA_ID = 48599813;

    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    (window as any).ym(METRIKA_ID, "init", {
         clickmap:true,
         trackLinks:true,
         accurateTrackBounce:true,
         webvisor:true
    });

    // Отслеживание переходов по страницам (SPA режим)
    const router = useRouter();
    router.afterEach((to) => {
      (window as any).ym(METRIKA_ID, 'hit', to.fullPath);
    });

    // Глобальная функция для целей
    (window as any).reachMetrikaGoal = (goalName: string, params?: any) => {
      (window as any).ym(METRIKA_ID, 'reachGoal', goalName, params);
    };
  }
})
