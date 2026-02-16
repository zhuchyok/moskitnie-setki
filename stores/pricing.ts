import { defineStore } from 'pinia'

export interface PricingItem {
  id: string
  name: string
  price: number
}

export interface GlobalPricing {
  mesh: PricingItem[]
  profiles: PricingItem[]
  components: PricingItem[]
  services: PricingItem[]
  markup: {
    dealer: number
    client: number
    manufacturing_base: number
    manufacturing_percent: number
    measurement_base: number
    measurement_percent: number
    measurement_profit_factor: number
    urgent_profit_factor: number
    installation_profit_factor: number
    delivery_profit_factor: number
  }
}

export const usePricingStore = defineStore('pricing', {
  state: () => ({
    pricing: null as GlobalPricing | null,
    isLoading: false
  }),
  actions: {
    async fetchPricing() {
      this.isLoading = true
      try {
        const config = useRuntimeConfig()
        const apiBase = config.public.apiUrl || 'http://localhost:8081'
        const response = await $fetch<GlobalPricing>('/api/v1/pricing', {
          baseURL: apiBase
        })
        this.pricing = response
        console.log('Global pricing loaded:', response)
      } catch (e) {
        console.error('Failed to fetch global pricing', e)
      } finally {
        this.isLoading = false
      }
    }
  }
})
