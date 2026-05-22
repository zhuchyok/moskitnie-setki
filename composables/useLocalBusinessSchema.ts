/**
 * Shared composable для LocalBusiness schema на product-страницах.
 * Добавляет LocalBusiness с динамическими данными тенанта — координаты,
 * адрес, часы работы, рейтинг и sameAs берутся из конфига.
 */
export function useLocalBusinessSchema(pageUrl: Ref<string> | ComputedRef<string>) {
  const tenant = useTenantStore()
  const { geoCoords, geoRegionName } = useGeoData()
  const image = computed(() => tenant.config.branding?.logo_url || useUnicodeOrigin() + '/images/logo_final_v58.png')

  return computed(() => {
    const rating = tenant.config.seo?.rating
    const hours = tenant.config.contacts?.hours
    const mapLinks: string[] = tenant.config.contacts?.map_links ?? []

    const lb: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: `${tenant.config.dealer_name || 'Сетки 21'} ${tenant.config.city || 'Чебоксары'}`,
      url: pageUrl.value,
      image: image.value,
      telephone: tenant.config.phone || '+7 (8352) 38-14-20',
      email: tenant.config.contacts?.emails?.[0] || 'info@setki21.ru',
      priceRange: 'RUB',
      address: {
        '@type': 'PostalAddress',
        streetAddress: tenant.config.contacts?.address || 'ул. Гражданская, 53',
        addressLocality: tenant.config.city || 'Чебоксары',
        addressRegion: geoRegionName.value || undefined,
        addressCountry: 'RU',
      },
      openingHoursSpecification: hours ?? [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '10:00',
          closes: '18:00',
        },
      ],
    }

    if (geoCoords.value) {
      lb.geo = {
        '@type': 'GeoCoordinates',
        latitude: geoCoords.value.lat,
        longitude: geoCoords.value.lon,
      }
    }

    if (rating?.ratingValue && rating?.reviewCount) {
      lb.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: String(rating.ratingValue),
        reviewCount: String(rating.reviewCount),
        bestRating: '5',
        worstRating: '1',
      }
    }

    if (mapLinks.length > 0) {
      lb.sameAs = mapLinks
    }

    return lb
  })
}
