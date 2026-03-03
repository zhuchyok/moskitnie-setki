<script setup lang="ts">
const tenant = useTenantStore()
const title = computed(() => `Доставка и замер москитных сеток — ${tenant.config.city || 'Чебоксары и Новочебоксарск'}`)
const description = computed(() => `Доставка и замер москитных сеток по ${tenant.config.city || 'Чебоксарам и Новочебоксарску'}. ${tenant.config.dealer_name || 'Сетки 21'} — изготовление за 1 день.`)
const url = 'https://www.setki21.ru/delivery'
const image = computed(() => tenant.config.branding?.logo_url || 'https://www.setki21.ru/images/logo_final_v58.png')

const serviceSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Доставка и замер москитных сеток',
  description: `Доставка москитных сеток по ${tenant.config.city || 'Чебоксарам и Новочебоксарску'}. Замер на месте.`,
  provider: {
    '@type': 'LocalBusiness',
    name: tenant.config.dealer_name || 'Сетки 21',
    image: image.value,
    telephone: tenant.config.phone || '+7 (8352) 38-14-20',
    address: {
      '@type': 'PostalAddress',
      streetAddress: tenant.config.contacts?.address || 'ул. Гражданская, 53',
      addressLocality: tenant.config.city || 'Чебоксары',
      addressCountry: 'RU'
    }
  },
  areaServed: [{ '@type': 'City', name: tenant.config.city || 'Чебоксары' }]
}))

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
  script: [{ type: 'application/ld+json', children: computed(() => JSON.stringify(serviceSchema.value)) }],
})
</script>

<template>
  <div>
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="bg-gray-50 rounded-[3rem] p-8 md:p-16 shadow-sm border border-gray-100">
          <h1 class="text-2xl md:text-3xl font-black mb-12 uppercase tracking-tight text-center leading-tight"
              :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">
            Доставка и замер
          </h1>

          <p class="text-center text-lg text-gray-600 font-medium mb-10 max-w-2xl mx-auto">
            <strong>Доставка москитных сеток</strong> по {{ tenant.config.city || 'Чебоксарам и Новочебоксарску' }}. Замер — бесплатно при заказе. Изготовление за 1 день, самовывоз из офиса компании {{ tenant.config.dealer_name || 'Сетки 21' }} или доставка до адреса.
          </p>

          <div class="prose prose-gray max-w-2xl mx-auto space-y-6 text-gray-600 font-medium">
            <h2 class="text-xl font-black uppercase tracking-wider" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Доставка</h2>
            <p>
              Доставляем готовые москитные сетки по {{ tenant.config.city || 'Чебоксарам и Новочебоксарску' }}. Стоимость и сроки уточняйте при заказе по телефону <a :href="'tel:' + (tenant.config.phone || '+78352381420').replace(/[^0-9+]/g, '')" class="font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">{{ tenant.config.phone || '+7 (8352) 38-14-20' }}</a>.
            </p>
            <h2 class="text-xl font-black uppercase tracking-wider" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Замер</h2>
            <p>
              Замер окна или балконной двери можно сделать самостоятельно (ширина и высота створки по внутреннему проёму) или заказать выезд специалиста {{ tenant.config.dealer_name || 'Сетки 21' }}. При заказе сетки замер на месте уточняется при согласовании.
            </p>
            <h2 class="text-xl font-black uppercase tracking-wider" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">Самовывоз</h2>
            <p>
              {{ tenant.config.city || 'Чебоксары' }}: {{ tenant.config.contacts?.address || 'ул. Гражданская, 53, оф.1' }}. Режим работы: {{ tenant.config.branding?.working_hours || 'Пн–Пт 10:00–18:00' }}.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
