type TrafficSegment = 'paid' | 'organic'
type ExperimentVariant = 'A' | 'B'

const PAID_UTM_MEDIUMS = new Set([
  'cpc',
  'ppc',
  'paid',
  'display',
  'cpm',
  'cpv',
  'banner',
  'rsya',
  'search',
])

function getQueryValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return String(value[0] || '').trim().toLowerCase()
  return String(value || '').trim().toLowerCase()
}

function hasPaidQueryMarkers(query: Record<string, unknown>): boolean {
  const clickIdKeys = ['yclid', 'gclid', 'fbclid', 'msclkid']
  const hasClickId = clickIdKeys.some((key) => {
    const raw = query[key] as string | string[] | undefined
    return Boolean(getQueryValue(raw))
  })
  if (hasClickId) return true

  const utmMedium = getQueryValue(query.utm_medium as string | string[] | undefined)
  const utmSource = getQueryValue(query.utm_source as string | string[] | undefined)

  if (PAID_UTM_MEDIUMS.has(utmMedium)) return true
  if (utmSource && PAID_UTM_MEDIUMS.has(utmSource)) return true
  return false
}

export function useTrafficExperiment() {
  const route = useRoute()
  const paidTrafficCookie = useCookie<'yes' | undefined>('paid_traffic', {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  })

  const paidVariantCookie = useCookie<ExperimentVariant | undefined>('exp_paid_variant_s0', {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  })
  const organicVariantCookie = useCookie<ExperimentVariant | undefined>('exp_organic_variant_s0', {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  })

  const hasPaidMarkers = computed(() => hasPaidQueryMarkers(route.query as Record<string, unknown>))

  if (hasPaidMarkers.value) {
    paidTrafficCookie.value = 'yes'
  }

  const isPaidTraffic = computed(() => paidTrafficCookie.value === 'yes' || hasPaidMarkers.value)
  const segment = computed<TrafficSegment>(() => (isPaidTraffic.value ? 'paid' : 'organic'))

  const ensureVariant = (key: TrafficSegment): ExperimentVariant => {
    const target = key === 'paid' ? paidVariantCookie : organicVariantCookie
    if (!target.value) {
      target.value = Math.random() < 0.3 ? 'B' : 'A'
    }
    return target.value
  }

  if (import.meta.client) {
    ensureVariant('paid')
    ensureVariant('organic')
  }

  watch(
    () => route.query,
    (query) => {
      if (hasPaidQueryMarkers(query as Record<string, unknown>)) {
        paidTrafficCookie.value = 'yes'
      }
    },
    { deep: true },
  )

  const paidVariant = computed<ExperimentVariant>(() => paidVariantCookie.value || 'A')
  const organicVariant = computed<ExperimentVariant>(() => organicVariantCookie.value || 'A')
  const variant = computed<ExperimentVariant>(() => (isPaidTraffic.value ? paidVariant.value : organicVariant.value))

  return {
    isPaidTraffic,
    segment,
    variant,
    paidVariant,
    organicVariant,
  }
}
