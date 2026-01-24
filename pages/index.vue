<script setup lang="ts">
const store = useOrderStore()
onMounted(() => {
  store.updateConfig({ type: 'standart', typeName: 'СТАНДАРТ' })
})

const title = 'Москитные сетки на окна в Чебоксарах и Новочебоксарске — цены от 850 руб'
const description = 'Производство и установка москитных сеток в Чебоксарах и Новочебоксарске по низким ценам. Замер за 1 день, металлические крепления в комплекте. Закажите онлайн!'
const keywords = 'москитные сетки, москитная сетка, окна, чебоксары, новочебоксарск, заказать, купить, цена, установка, замер, производство'
const url = 'https://www.setki21.ru/'
const image = 'https://www.setki21.ru/images/logo_final_v58.png'

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
        "@type": "LocalBusiness",
        "name": "Сетки 21",
        "image": image,
        "@id": "https://www.setki21.ru",
        "url": url,
        "telephone": "+7 (8352) 38-14-20",
        "priceRange": "RUB",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "ул. Гражданская, 53, оф.1",
          "addressLocality": "Чебоксары",
          "postalCode": "428000",
          "addressCountry": "RU"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 56.137451,
          "longitude": 47.244032
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "10:00",
          "closes": "18:00"
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
              Рамочная <span class="text-brand-blue">москитная сетка</span> — за 1 день
            </h1>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
              Изготовим москитные сетки на окна в Чебоксарах и Новочебоксарске по индивидуальным размерам. Наши сетки устанавливаются на любые пластиковые и деревянные окна с помощью прочных металлических крепежей.
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p class="font-black text-brand-blue text-2xl mb-1">Fiberglass</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Полотно 1.2х1.2 мм</p>
              </div>
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p class="font-black text-brand-blue text-2xl mb-1">Z-крепеж</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Металл в комплекте</p>
              </div>
            </div>
          </div>
          <div class="lg:w-1/2 relative">
            <img src="/upload/iblock/e09/e09007396221ccbae983f19a970e4be5.png" alt="Рамочная москитная сетка" class="rounded-[3rem] shadow-2xl border-4 border-white" />
            <div class="hidden lg:block absolute -top-6 -left-6 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 transform -rotate-3">
              <p class="text-brand-blue font-black text-xl leading-none italic uppercase">Best Seller</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase mt-1">Срок 1 день</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-12">
      <div class="container mx-auto px-4 text-center mb-8">
        <h2 class="text-3xl font-black mb-2 uppercase tracking-tight text-brand-dark">Расчет стоимости</h2>
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
              <h2 class="text-3xl font-black mb-6 uppercase tracking-tight">Как замерить?</h2>
              <p class="text-gray-600 mb-6 leading-relaxed italic border-l-4 border-brand-blue pl-6 bg-blue-50/30 py-4 rounded-r-2xl font-medium">
                "Нужно лишь измерить ширину и высоту створки, для которой нужна москитная сетка. Этот способ замера предназначен для предварительного расчета стоимости."
              </p>
              <p class="text-gray-600 leading-relaxed font-medium">
                Полотно москитной сетки из стекловолокна Fiberglass с размером ячейки 1,2×1,2 мм обеспечивает отличную защиту от комаров, мух, ос, пчел и тополиного пуха, сохраняя при этом максимальную вентиляцию.
              </p>
            </div>
          </div>

          <div class="bg-brand-dark rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div class="relative z-10">
              <h2 class="text-3xl font-black mb-12 uppercase tracking-widest text-center">Почему наши сетки?</h2>
              <div class="grid md:grid-cols-3 gap-12">
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">01</div>
                  <h4 class="font-bold text-lg mb-4 uppercase tracking-wider">Долговечность</h4>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium">Прочная алюминиевая рамка окрашена порошковой краской. Не выгорает и не ржавеет.</p>
                </div>
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">02</div>
                  <h4 class="font-bold text-lg mb-4 uppercase tracking-wider">Защита</h4>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium">Помогает задержать тополиный пух, уличную пыль и пыльцу растений, что важно для аллергиков.</p>
                </div>
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">03</div>
                  <h4 class="font-bold text-lg mb-4 uppercase tracking-wider">Безопасность</h4>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium">Москитные сетки могут служить защитой от случайного выпадения из окон предметов домашнего обихода.</p>
                </div>
              </div>
            </div>
            <div class="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-blue/10 rounded-full blur-[100px] -mr-[20rem] -mt-[20rem]"></div>
          </div>
      </div>
    </section>
  </div>
</template>

