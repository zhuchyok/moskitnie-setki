<script setup lang="ts">
const store = useOrderStore()
onMounted(() => {
  store.updateConfig({ type: 'antikoshka', typeName: 'АНТИКОШКА' })
})

const title = 'Москитная сетка Антикошка в Чебоксарах — цены от 1300 руб'
const description = 'Усиленные москитные сетки Антикошка (Pet Screen) в Чебоксарах и Новочебоксарске. Выдерживают когти кошек, прочное полотно, металлический крепеж. Закажите расчет!'
const keywords = 'антикошка, москитная сетка антикошка, чебоксары, новочебоксарск, pet screen, защита животных, цена, купить'
const url = 'https://www.setki21.ru/antikoshka/'
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
        "@type": "Product",
        "name": "Москитная сетка Антикошка",
        "description": "Усиленная москитная сетка для защиты от кошек в Чебоксарах и Новочебоксарске",
        "image": image,
        "brand": { "@type": "Brand", "name": "Сетки 21" },
        "offers": {
          "@type": "Offer",
          "url": url,
          "priceCurrency": "RUB",
          "price": "1300",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "89"
        }
      })
    }
  ]
})
</script>

<template>
  <div>
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-12 items-center mb-16">
          <div class="lg:w-1/2">
            <h1 class="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase tracking-tight">
              Сетка <span class="text-brand-blue">Антикошка</span> — защита ваших питомцев
            </h1>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed font-medium text-justify">
              Изготовим москитные сетки Антикошка в Чебоксарах и Новочебоксарске по индивидуальным размерам. Полотно Pet Screen из прочной полиэстеровой нити толщиной 0,6 мм, покрытой ПВХ, выдерживает когти кошек и птиц.
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p class="font-black text-brand-blue text-2xl mb-1">Pet Screen</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Усиленное полотно</p>
              </div>
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p class="font-black text-brand-blue text-2xl mb-1">Z-крепеж</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Металлический зажим</p>
              </div>
            </div>
          </div>
          <div class="lg:w-1/2 relative">
            <img src="/upload/iblock/e09/e09007396221ccbae983f19a970e4be5.png" alt="Усиленная москитная сетка Антикошка на окне" class="rounded-[3rem] shadow-2xl border-4 border-white" />
            <div class="hidden lg:block absolute -top-6 -left-6 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 transform -rotate-3">
              <p class="text-brand-blue font-black text-xl leading-none italic uppercase">Safety First</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase mt-1">Гарантия 1 год</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-12">
      <div class="container mx-auto px-4 text-center mb-8">
        <h2 class="text-3xl font-black mb-2 uppercase tracking-tight text-brand-dark">Расчет Антикошки</h2>
        <p class="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Металлические крепления в комплекте!</p>
      </div>
      <Calculator />
    </section>

    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
          <div class="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div class="relative group">
              <video controls muted playsinline class="rounded-3xl shadow-lg w-full">
                <source src="/zamer.mp4" type="video/mp4">
                Ваш браузер не поддерживает видео.
              </video>
            </div>
            <div class="order-1 md:order-2">
              <h2 class="text-3xl font-black mb-6 uppercase tracking-tight">Особенности системы</h2>
              <p class="text-gray-600 mb-6 leading-relaxed italic border-l-4 border-brand-blue pl-6 bg-blue-50/30 py-4 rounded-r-2xl font-medium text-justify">
                "Обычная москитная сетка не способна выдержать вес домашнего животного. Для того, чтобы полотно было устойчивым к действиям кошек, его изготавливают из особых высокопрочных нитей."
              </p>
              <p class="text-gray-600 leading-relaxed font-medium text-justify">
                Сетку натягивают на алюминиевый профиль с повышенными прочностными характеристиками. Конструкция полностью устойчива к любым действиям домашних питомцев – сетку невозможно разорвать когтями или клювом.
              </p>
            </div>
          </div>

          <div class="bg-brand-dark rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div class="relative z-10">
              <h2 class="text-3xl font-black mb-12 uppercase tracking-widest text-center">Преимущества Антикошки</h2>
              <div class="grid md:grid-cols-3 gap-12">
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">01</div>
                  <h4 class="font-bold text-lg mb-4 uppercase tracking-wider">Универсальность</h4>
                  <p class="text-gray-400 text-sm leading-relaxed">Устанавливаются в любые проемы: на балконах, лоджиях, в оконных рамах и входных группах.</p>
                </div>
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">02</div>
                  <h4 class="font-bold text-lg mb-4 uppercase tracking-wider">Надежность</h4>
                  <p class="text-gray-400 text-sm leading-relaxed">Домашний питомец не сможет ее открыть, разорвать или прогнуть под собственным весом при прыжке.</p>
                </div>
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">03</div>
                  <h4 class="font-bold text-lg mb-4 uppercase tracking-wider">Долговечность</h4>
                  <p class="text-gray-400 text-sm leading-relaxed">Металлические крепления устойчивы к ультрафиолету и служат долгие годы без потери прочности.</p>
                </div>
              </div>
            </div>
            <div class="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-blue/10 rounded-full blur-[100px] -mr-[20rem] -mt-[20rem]"></div>
          </div>
      </div>
    </section>
  </div>
</template>

