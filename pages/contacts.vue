<script setup lang="ts">
const title = 'Контакты — Сетки 21, Чебоксары и Новочебоксарск'
const description = 'Адреса офисов, телефон, режим работы Сетки 21. Замер и установка москитных сеток в Чебоксарах и Новочебоксарске.'
const url = 'https://www.setki21.ru/contacts'
const image = 'https://www.setki21.ru/images/logo_final_v58.png'

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Контакты Сетки 21',
  description: 'Контактная информация для заказа москитных сеток в Чебоксарах и Новочебоксарске',
  url,
  mainEntity: {
    '@type': 'LocalBusiness',
    name: 'Сетки 21',
    telephone: '+7 (8352) 38-14-20',
    email: 'info@setki21.ru',
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'ул. Гражданская, 53, оф.1',
        addressLocality: 'Чебоксары',
        postalCode: '428000',
        addressCountry: 'RU'
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'ул. Винокурова, 109',
        addressLocality: 'Новочебоксарск',
        addressCountry: 'RU'
      }
    ],
    areaServed: [{ '@type': 'City', name: 'Чебоксары' }, { '@type': 'City', name: 'Новочебоксарск' }],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:00',
      closes: '18:00'
    }
  }
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
  script: [{ type: 'application/ld+json', children: JSON.stringify(contactSchema) }],
})
</script>

<template>
  <div>
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="bg-gray-50 rounded-[3rem] p-8 md:p-16 shadow-sm border border-gray-100">
          <h1 class="text-2xl md:text-3xl font-black mb-12 text-brand-blue uppercase tracking-tight text-center leading-tight">
            Контакты
          </h1>

          <p class="text-center text-gray-600 font-medium mb-12 max-w-2xl mx-auto">
            <strong>Сетки 21</strong> — производство и установка москитных сеток в Чебоксарах и Новочебоксарске. Звоните для замера или заказа: <a href="tel:+78352381420" class="text-brand-blue font-bold">+7 (8352) 38-14-20</a>. Режим работы: Пн–Пт 10:00–18:00.
          </p>

          <div class="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h2 class="text-xl font-black text-brand-blue uppercase tracking-wider mb-4">Чебоксары</h2>
              <p class="text-gray-600 font-medium">ул. Гражданская, 53, оф.1</p>
              <p class="text-gray-500 text-sm mt-2">Самовывоз и приём заказов</p>
            </div>
            <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h2 class="text-xl font-black text-brand-blue uppercase tracking-wider mb-4">Новочебоксарск</h2>
              <p class="text-gray-600 font-medium">ул. Винокурова, 109</p>
              <p class="text-gray-500 text-sm mt-2">Самовывоз и приём заказов</p>
            </div>
          </div>

          <div class="mt-12 text-center">
            <p class="text-gray-600 font-medium mb-2">Телефон</p>
            <a href="tel:+78352381420" class="text-2xl font-black text-brand-blue hover:underline">+7 (8352) 38-14-20</a>
            <p class="text-gray-600 font-medium mt-6 mb-2">Email</p>
            <a href="mailto:info@setki21.ru" class="text-brand-blue font-bold hover:underline">info@setki21.ru</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
