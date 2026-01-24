// Bitrix24 CRM Widget
export default defineNuxtPlugin(() => {
  if (process.client) {
    (function(w, d, u) {
      var s = d.createElement('script');
      s.async = true;
      s.src = u + '?' + (Date.now() / 60000 | 0);
      var h = d.getElementsByTagName('script')[0];
      if (h && h.parentNode) {
        h.parentNode.insertBefore(s, h);
      }
    })(window, document, 'https://cdn.bitrix24.ru/b6452149/crm/site_button/loader_2_pjdc06.js');
  }
})
