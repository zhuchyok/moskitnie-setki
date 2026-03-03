<script setup lang="ts">
const tenant = useTenantStore()
const title = computed(() => `Контакты — ${tenant.config.dealer_name || 'Сетки 21'}, ${tenant.config.city || 'Чебоксары и Новочебоксарск'}`)
const description = computed(() => `Адреса офисов, телефон, режим работы компании ${tenant.config.dealer_name || 'Сетки 21'}. Замер и установка москитных сеток в ${tenant.config.city || 'Чебоксарах и Новочебоксарске'}.`)
const url = 'https://www.setki21.ru/contacts'
const image = computed(() => tenant.config.branding?.logo_url || 'https://www.setki21.ru/images/logo_final_v58.png')

const contactSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: `Контакты ${tenant.config.dealer_name || 'Сетки 21'}`,
  description: `Контактная информация для заказа москитных сеток в ${tenant.config.city}`,
  url,
    mainEntity: {
      '@type': 'LocalBusiness',
      name: tenant.config.dealer_name || 'Сетки 21',
      image: image.value,
      telephone: tenant.config.phone || '+7 (8352) 38-14-20',
      email: tenant.config.contacts?.emails?.[0] || 'info@setki21.ru',
      priceRange: 'RUB',
      address: {
        '@type': 'PostalAddress',
        streetAddress: tenant.config.contacts?.address || 'ул. Гражданская, 53',
        addressLocality: tenant.config.city || 'Чебоксары',
        addressCountry: 'RU'
      },
      areaServed: [{ '@type': 'City', name: tenant.config.city || 'Чебоксары' }],
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '10:00',
          closes: '18:00'
        }
      ]
    }
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
  script: [{ type: 'application/ld+json', children: computed(() => JSON.stringify(contactSchema.value)) }],
})
</script>

<template>
  <div>
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="bg-gray-50 rounded-[3rem] p-8 md:p-16 shadow-sm border border-gray-100">
          <h1 class="text-2xl md:text-3xl font-black mb-12 uppercase tracking-tight text-center leading-tight"
              :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">
            Контакты
          </h1>

          <p class="text-center text-gray-600 font-medium mb-12 max-w-2xl mx-auto">
            <strong>{{ tenant.config.dealer_name || 'Сетки 21' }}</strong> — производство и установка москитных сеток в {{ tenant.config.city || 'Чебоксарах и Новочебоксарске' }}. Звоните для замера или заказа: <a :href="'tel:' + (tenant.config.phone || '+78352381420').replace(/[^0-9+]/g, '')" class="font-bold" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">{{ tenant.config.phone || '+7 (8352) 38-14-20' }}</a>. Режим работы: {{ tenant.config.branding?.working_hours || 'Пн–Пт 10:00–18:00' }}.
          </p>

          <div class="grid md:grid-cols-1 gap-12 max-w-2xl mx-auto">
            <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
              <h2 class="text-xl font-black uppercase tracking-wider mb-4" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">{{ tenant.config.city || 'Чебоксары' }}</h2>
              <p class="text-gray-600 font-medium">{{ tenant.config.contacts?.address || 'ул. Гражданская, 53' }}</p>
              <p class="text-gray-500 text-sm mt-2">Самовывоз и приём заказов компании {{ tenant.config.dealer_name || 'Сетки 21' }}</p>
            </div>
          </div>

          <div class="mt-12 text-center">
            <p class="text-gray-600 font-medium mb-2">Телефон</p>
            <a :href="'tel:' + (tenant.config.phone || '+78352381420').replace(/[^0-9+]/g, '')" class="text-2xl font-black hover:underline" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">{{ tenant.config.phone || '+7 (8352) 38-14-20' }}</a>
            <p v-if="tenant.config.contacts?.emails?.length" class="text-gray-600 font-medium mt-6 mb-2">Email</p>
            <a v-if="tenant.config.contacts?.emails?.length" :href="'mailto:' + tenant.config.contacts.emails[0]" class="font-bold hover:underline" :style="{ color: tenant.config.branding?.primary_color || '#2A6AB2' }">{{ tenant.config.contacts.emails[0] }}</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
