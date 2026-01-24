<script setup lang="ts">
const title = 'Ремонт москитных сеток в Чебоксарах — цены от 100 руб'
const description = 'Профессиональный ремонт москитных сеток в Чебоксарах и Новочебоксарске. Замена полотна, ручек, уголков. Быстро, качественно, недорого. Звоните!'
const keywords = 'ремонт сеток, замена полотна, москитная сетка ремонт, чебоксары, новочебоксарск, запчасти для сеток'
const url = 'https://www.setki21.ru/remont/'
const image = 'https://www.setki21.ru/images/logo_new.png'

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ],
  link: [{ rel: 'canonical', href: url }],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Ремонт москитных сеток",
        "description": "Замена комплектующих и полотна москитных сеток в Чебоксарах",
        "provider": {
          "@type": "LocalBusiness",
          "name": "Сетки 21"
        },
        "areaServed": {
          "@type": "City",
          "name": "Чебоксары"
        }
      })
    }
  ]
})

const services = [
  { name: 'Замена полотна', desc: 'Перетянем сетку новым полотном (Стандарт, Антикошка или Антипыль).', price: '400' },
  { name: 'Замена ручек', desc: 'Установим новые металлические или силиконовые ручки вместо сломанных.', price: '100' },
  { name: 'Замена уголков', desc: 'Заменим треснувшие пластиковые уголки на новые усиленные.', price: '150' }
]
</script>

<template>
  <div>
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-12 items-center mb-16">
          <div class="lg:w-1/2">
            <h1 class="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase tracking-tight">
              Ремонт <span class="text-brand-blue">сеток</span> — быстро и надежно
            </h1>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
              Если рамка вашей сетки цела, но полотно порвалось или сломались ручки — не обязательно покупать новую. Мы выполним качественный ремонт за 15 минут в вашем присутствии!
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p class="font-black text-brand-blue text-2xl mb-1">15 мин</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Срок ремонта</p>
              </div>
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p class="font-black text-brand-blue text-2xl mb-1">от 100 ₽</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Минимальная цена</p>
              </div>
            </div>
          </div>
          <div class="lg:w-1/2 relative">
            <img src="/upload/iblock/e09/e09007396221ccbae983f19a970e4be5.png" alt="Ремонт москитных сеток" class="rounded-[3rem] shadow-2xl border-4 border-white" />
            <div class="absolute -top-6 -left-6 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 transform -rotate-3">
              <p class="text-brand-blue font-black text-xl leading-none italic uppercase">Quick Fix</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase mt-1">Гарантия на работы</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-24">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-black mb-12 uppercase tracking-tight text-center">Наши услуги</h2>
        <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div v-for="s in services" :key="s.name" 
               class="group p-10 bg-white rounded-[3rem] hover:shadow-2xl transition-all duration-500 border border-gray-100">
            <div class="w-16 h-16 bg-brand-blue rounded-2xl flex items-center justify-center mb-8 text-white text-2xl font-black shadow-lg shadow-brand-blue/20 group-hover:scale-110 transition-transform">
              🛠️
            </div>
            <h3 class="text-xl font-black mb-4 uppercase tracking-tight">{{ s.name }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed mb-8 font-medium">{{ s.desc }}</p>
            <div class="flex items-baseline gap-2">
              <span class="text-[10px] font-black text-gray-300 uppercase tracking-widest">от</span>
              <span class="text-3xl font-black text-brand-blue">{{ s.price }}</span>
              <span class="text-lg font-black text-gray-300">₽</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-5xl mx-auto bg-brand-dark rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
          <div class="relative z-10 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 class="text-3xl font-black mb-8 uppercase tracking-widest text-center md:text-left">Как заказать?</h2>
              <div class="space-y-10">
                <div class="flex gap-6">
                  <div class="w-12 h-12 rounded-2xl bg-brand-blue flex-shrink-0 flex items-center justify-center font-black">01</div>
                  <div>
                    <h4 class="font-bold uppercase tracking-wider mb-2">Привезите к нам</h4>
                    <p class="text-gray-400 text-sm leading-relaxed font-medium">В офис в Чебоксарах или Новочебоксарске. Сделаем при вас за 15-20 минут.</p>
                  </div>
                </div>
                <div class="flex gap-6">
                  <div class="w-12 h-12 rounded-2xl bg-brand-blue flex-shrink-0 flex items-center justify-center font-black">02</div>
                  <div>
                    <h4 class="font-bold uppercase tracking-wider mb-2">Вызовите мастера</h4>
                    <p class="text-gray-400 text-sm leading-relaxed font-medium">Мастер приедет в удобное время, заберет сетки и привезет отремонтированные на следующий день.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="hidden md:block">
              <div class="aspect-square bg-white/5 rounded-[3rem] flex items-center justify-center p-12 border border-white/10">
                <div class="text-[12rem] opacity-20">🔧</div>
              </div>
            </div>
          </div>
          <div class="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-blue/10 rounded-full blur-[100px] -mr-[20rem] -mt-[20rem]"></div>
        </div>
      </div>
    </section>
  </div>
</template>
