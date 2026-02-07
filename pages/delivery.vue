<script setup lang="ts">
const title = 'Доставка и замер москитных сеток — Чебоксары и Новочебоксарск'
const description = 'Доставка и бесплатный замер москитных сеток по Чебоксарам и Новочебоксарску. Сетки 21 — за 1 день.'
const url = 'https://www.setki21.ru/delivery'
const image = 'https://www.setki21.ru/images/logo_final_v58.png'

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Доставка и замер москитных сеток',
  description: 'Доставка москитных сеток по Чебоксарам и Новочебоксарску. Замер на месте.',
  provider: { '@type': 'Organization', name: 'Сетки 21', url: 'https://www.setki21.ru' },
  areaServed: [{ '@type': 'City', name: 'Чебоксары' }, { '@type': 'City', name: 'Новочебоксарск' }]
}

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ],
  link: [{ rel: 'canonical', href: url }],
  script: [{ type: 'application/ld+json', children: JSON.stringify(serviceSchema) }],
})
</script>

<template>
  <div>
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="bg-gray-50 rounded-[3rem] p-8 md:p-16 shadow-sm border border-gray-100">
          <h1 class="text-2xl md:text-3xl font-black mb-12 text-brand-blue uppercase tracking-tight text-center leading-tight">
            Доставка и замер
          </h1>

          <p class="text-center text-lg text-gray-600 font-medium mb-10 max-w-2xl mx-auto">
            <strong>Доставка москитных сеток</strong> по Чебоксарам и Новочебоксарску. Замер — бесплатно при заказе. Изготовление за 1 день, самовывоз из офисов или доставка до адреса.
          </p>

          <div class="prose prose-gray max-w-2xl mx-auto space-y-6 text-gray-600 font-medium">
            <h2 class="text-xl font-black text-brand-dark uppercase tracking-wider">Доставка</h2>
            <p>
              Доставляем готовые москитные сетки по Чебоксарам и Новочебоксарску. Стоимость и сроки уточняйте при заказе по телефону <a href="tel:+78352381420" class="text-brand-blue font-bold">+7 (8352) 38-14-20</a>.
            </p>
            <h2 class="text-xl font-black text-brand-dark uppercase tracking-wider">Замер</h2>
            <p>
              Замер окна или балконной двери можно сделать самостоятельно (ширина и высота створки по внутреннему проёму) или заказать выезд специалиста. При заказе сетки замер на месте уточняется при согласовании.
            </p>
            <h2 class="text-xl font-black text-brand-dark uppercase tracking-wider">Самовывоз</h2>
            <p>
              Чебоксары: ул. Гражданская, 53, оф.1. Новочебоксарск: ул. Винокурова, 109. Режим работы: Пн–Пт 10:00–18:00.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
