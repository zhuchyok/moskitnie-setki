<script setup lang="ts">
const store = useOrderStore()
onMounted(() => {
  store.updateConfig({ type: 'vstavnye', typeName: 'ВСТАВНАЯ VSN' })
})

const title = 'Вставные москитные сетки VSN в Чебоксарах — цены от 1450 руб'
const description = 'Инновационные вставные сетки VSN в Чебоксарах. Не требуют сверления рамы, устанавливаются изнутри. Надежно, эстетично, безопасно. Закажите онлайн!'
const keywords = 'вставная сетка, vsn, москитная сетка без сверления, чебоксары, новочебоксарск, внутренняя сетка'
const url = 'https://www.setki21.ru/vstavnye/'
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
        "name": "Вставная москитная сетка VSN",
        "description": "Москитная сетка внутреннего монтажа без сверления рамы",
        "image": image,
        "brand": { "@type": "Brand", "name": "Сетки 21" },
        "offers": {
          "@type": "Offer",
          "url": url,
          "priceCurrency": "RUB",
          "price": "1450",
          "availability": "https://schema.org/InStock"
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
              Вставные сетки <span class="text-brand-blue">VSN</span> — без сверления
            </h1>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
              Самый современный вид сеток. Устанавливаются в световой проем изнутри помещения. Никаких отверстий в раме и риска выпадения сетки наружу. Идеальное прилегание и эстетичный вид.
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p class="font-black text-brand-blue text-2xl mb-1">0 отверстий</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Без сверления рамы</p>
              </div>
              <div class="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p class="font-black text-brand-blue text-2xl mb-1">Безопасно</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Монтаж изнутри</p>
              </div>
            </div>
          </div>
          <div class="lg:w-1/2 relative">
            <img src="/upload/iblock/e09/e09007396221ccbae983f19a970e4be5.png" alt="Вставная москитная сетка VSN" class="rounded-[3rem] shadow-2xl border-4 border-white" />
            <div class="absolute -top-6 -left-6 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-50 transform -rotate-3">
              <p class="text-brand-blue font-black text-xl leading-none italic uppercase">Smart Fit</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase mt-1">Премиум выбор</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-12">
      <div class="container mx-auto px-4 text-center mb-8">
        <h2 class="text-3xl font-black mb-2 uppercase tracking-tight text-brand-dark">Расчет VSN</h2>
        <p class="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Металлические крепления в комплекте!</p>
      </div>
      <Calculator />
    </section>

    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
          <div class="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div class="relative group">
              <img src="/upload/iblock/963/963b80b25938266f19cda63ac6f838b4.png" alt="Ручки для вставной сетки" class="rounded-3xl shadow-lg order-2 md:order-1 group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="order-1 md:order-2">
              <h2 class="text-3xl font-black mb-6 uppercase tracking-tight">Почему выбирают VSN?</h2>
              <p class="text-gray-600 mb-6 leading-relaxed italic border-l-4 border-brand-blue pl-6 bg-blue-50/30 py-4 rounded-r-2xl font-medium">
                "Конструкция разработана так, чтобы сетка вставлялась в проем и фиксировалась специальными зацепами. Это исключает риск падения сетки даже при сильном ветре."
              </p>
              <p class="text-gray-600 leading-relaxed font-medium">
                Вставные сетки — это выбор тех, кто ценит сохранность оконных рам и максимальную безопасность. Установка производится таким образом, чтобы затем можно было удобно снять и почистить при загрязнении.
              </p>
            </div>
          </div>

          <div class="bg-brand-dark rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div class="relative z-10">
              <h2 class="text-3xl font-black mb-12 uppercase tracking-widest text-center">Особенности VSN</h2>
              <div class="grid md:grid-cols-3 gap-12">
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">01</div>
                  <h4 class="font-bold text-lg mb-4 uppercase tracking-wider">Эстетика</h4>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium">Сетка практически незаметна на окне, так как рамка находится внутри светового проема.</p>
                </div>
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">02</div>
                  <h4 class="font-bold text-lg mb-4 uppercase tracking-wider">Надежность</h4>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium">Специальные зацепы намертво фиксируют сетку в раме без единого шурупа.</p>
                </div>
                <div class="text-center md:text-left">
                  <div class="text-brand-blue text-5xl mb-6 font-black opacity-50">03</div>
                  <h4 class="font-bold text-lg mb-4 uppercase tracking-wider">Долговечность</h4>
                  <p class="text-gray-400 text-sm leading-relaxed font-medium">Алюминиевый профиль VSN имеет повышенную жесткость и не деформируется со временем.</p>
                </div>
              </div>
            </div>
            <div class="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-blue/10 rounded-full blur-[100px] -mr-[20rem] -mt-[20rem]"></div>
          </div>
      </div>
    </section>
  </div>
</template>
