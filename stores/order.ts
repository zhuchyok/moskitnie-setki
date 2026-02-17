import { defineStore } from 'pinia'
import { type ColorId, type MeshType, type FrameType, type HandleType, COLOR_NAMES, FRAME_TYPE_NAMES, MESH_TYPE_NAMES } from '~/types/mesh'
import { PRICING_CONFIG, DELIVERY_OPTIONS, URGENT_ORDER_OPTION, MEASUREMENT_OPTION } from '~/constants/pricing'
import { computeCost, computeCostVstavnaya, costToClientPrice, getWork, getRalPaintingAmount, getNetRevenueAfterCard, roundTo } from '~/services/pricing'
import { usePricingStore } from '~/stores/pricing'

export interface OrderItem {
  id: number
  type: MeshType
  typeName: string
  frameTypeName: string
  color: string
  width: number
  height: number
  count: number
  price: number
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    /** Legacy: таблица VSN не используется — вставная считается по формуле (профиль 151/153/163, тип полотна учитывается). */
    prices: {
      vstavnye: [
        1450, 1600, 1800, 1950, 2100, 2250, 2400, 2550, 2700, 2900, 3050, 3200, 3350, 3500, 3650, 3800,
        1550, 1750, 1900, 2050, 2200, 2400, 2550, 2700, 2850, 3050, 3200, 3350, 3500, 3650, 3850, 4000,
        1650, 1800, 2000, 2150, 2300, 2450, 2650, 2800, 2950, 3150, 3300, 3450, 3600, 3800, 3950, 4100,
        1850, 2000, 2200, 2350, 2500, 2650, 2850, 3000, 3150, 3350, 3500, 3650, 3800, 4000, 4150, 4300,
      ],
    },
    items: [] as OrderItem[],
    config: {
      type: 'standart' as MeshType,
      typeName: 'СТАНДАРТ',
      frameType: 'standart' as FrameType,
      width: 350,
      height: 1000,
      color: 1 as ColorId,
      count: 1,
      installation: false,
      handleType: 'pvc' as HandleType,
    },
    /** Способ получения: по умолчанию доставка (Чебоксары и Новочебоксарск) */
    delivery: 'Доставка',
    deliveryPrice: 400,
    /** Замер Чебоксары и Новочебоксарск (вторая услуга, можно выбрать вместе с доставкой/скидкой) */
    measurementSelected: false,
    measurementPrice: 0,
    /** Приоритетный срочный заказ +400 ₽ (только при заказе с монтажом) */
    discountType: '' as '' | 'srochnyi',
  }),
  getters: {
    /** В корзине все позиции без монтажа */
    allItemsWithoutInstallation(state): boolean {
      if (state.items.length === 0) return false
      return state.items.every((item) => !item.typeName.includes(' + МОНТАЖ'))
    },
    /** В корзине все позиции с монтажом */
    allItemsWithInstallation(state): boolean {
      if (state.items.length === 0) return false
      return state.items.every((item) => item.typeName.includes(' + МОНТАЖ'))
    },
    /** В корзине есть хотя бы одна позиция без монтажа */
    hasItemsWithoutInstallation(state): boolean {
      return state.items.some((item) => !item.typeName.includes(' + МОНТАЖ'))
    },
    /** В корзине есть хотя бы одна позиция с монтажом */
    hasItemsWithInstallation(state): boolean {
      return state.items.some((item) => item.typeName.includes(' + МОНТАЖ'))
    },
    /** Смешанный заказ: и сетки с монтажом, и без — тогда только доставка */
    isMixedOrder(state): boolean {
      if (state.items.length === 0) return false
      const hasWithout = state.items.some((item) => !item.typeName.includes(' + МОНТАЖ'))
      const hasWith = state.items.some((item) => item.typeName.includes(' + МОНТАЖ'))
      return hasWithout && hasWith
    },
    /** Расчитанная цена доставки для клиента */
    deliveryPriceCalculated(state): number {
      const pricingStore = usePricingStore()
      const p = pricingStore.pricing
      if (!p) return 400

      // Если заказ смешанный (есть и с монтажом, и без), используем себестоимость смежной доставки
      const baseDelivery = state.isMixedOrder 
        ? (p.services.find((s: any) => s.id === 'delivery_mixed')?.price ?? 100)
        : (p.services.find((s: any) => s.id === 'delivery')?.price ?? 300)
        
      const profitFactor = (p.markup.delivery_profit_factor ?? 33) / 100
      const finalPrice = Math.round((baseDelivery + (baseDelivery * profitFactor)) / 50) * 50
      // Смешанная доставка — свой минимум (150), обычная — 400
      const minDelivery = state.isMixedOrder ? 150 : 400
      return Math.max(finalPrice, minDelivery)
    },
    /** Расчитанная цена замера для отображения в UI */
    measurementPriceCalculated(state): number {
      const pricingStore = usePricingStore()
      const p = pricingStore.pricing
      if (!p) return 400
      
      if (state.items.length === 0) return p.markup.measurement_base || 400
      
      const totalMaterialCost = state.items.reduce((sum, item) => {
        const colorId: ColorId = item.color === 'КОРИЧНЕВАЯ' ? 2 : (item.color === 'АНТРАЦИТ' ? 3 : (item.color === 'RAL' ? 4 : 1))
        const cost = item.frameTypeName.includes('ВСТАВНАЯ')
          ? computeCostVstavnaya(item.width, item.height, colorId, item.type, p)
          : computeCost(item.width, item.height, colorId, item.type, p)
        const work = getWork(item.width, item.height, colorId, item.type, item.frameTypeName.includes('ВСТАВНАЯ') ? 'vstavnaya' : 'standart', p)
        return sum + (cost - work) * item.count
      }, 0)

      const base = p.markup.measurement_base ?? 270
      const bonus = totalMaterialCost * (p.markup.measurement_percent / 100)
      const profit = totalMaterialCost * (p.markup.measurement_profit_factor / 100)
      
      const finalPrice = Math.round((base + (bonus || 0) + (profit || 0)) / 50) * 50
      return Math.max(finalPrice, 400)
    },
    currentPrice(state): number {
      const pricingStore = usePricingStore()
      const isMetal = state.config.handleType === 'metal'
      if (state.config.frameType === 'vstavnaya') {
        const cost = computeCostVstavnaya(
          state.config.width,
          state.config.height,
          state.config.color,
          state.config.type,
          pricingStore.pricing ?? undefined
        )
        const base = costToClientPrice(cost, pricingStore.pricing ?? undefined)
        return isMetal ? (base - costToClientPrice(PRICING_CONFIG.fixed.handles, pricingStore.pricing ?? undefined)) : base
      }
      const cost = computeCost(
        state.config.width,
        state.config.height,
        state.config.color,
        state.config.type,
        pricingStore.pricing ?? undefined
      )
      const base = costToClientPrice(cost, pricingStore.pricing ?? undefined)
      return isMetal ? (base - costToClientPrice(PRICING_CONFIG.fixed.handles, pricingStore.pricing ?? undefined)) : base
    },
    totalPrice(state): number {
      const pricingStore = usePricingStore()
      const itemsTotal = state.items.reduce((sum, item) => sum + item.price, 0)
      
      const measurementAdd = state.measurementSelected ? this.measurementPriceCalculated : 0
      
      // Доставка в итог только если в заказе есть сетки без монтажа (когда способ получения показывается)
      const needsDelivery = state.items.some((item) => !item.typeName.includes(' + МОНТАЖ'))
      const deliveryAdd = (needsDelivery && state.delivery === 'Доставка') ? this.deliveryPriceCalculated : 0
      
      // Базовая сумма заказа (сетки + доставка + замер)
      const baseTotal = itemsTotal + deliveryAdd + measurementAdd

      // Срочность считается от итоговой суммы (сетки + доставка + замер)
      const urgentAdd = state.discountType === 'srochnyi' 
        ? Math.max(Math.round((baseTotal * ((pricingStore.pricing?.markup.urgent_profit_factor ?? 10) / 100)) / 50) * 50, 400)
        : 0
      
      const total = baseTotal + (urgentAdd || 0)
      return isNaN(total) ? 0 : total
    },
    /** Доплата за монтаж за 1 шт: база из админки × (1 + коэффициент монтажа), округление до 50. Без принудительного минимума. */
    extrasInstallation(state): number {
      const pricingStore = usePricingStore()
      if (!pricingStore.pricing) return PRICING_CONFIG.extras.installation

      const isVstavnaya = state.config.frameType === 'vstavnaya'
      const basePrice = isVstavnaya 
        ? (pricingStore.pricing.services.find((s: any) => s.id === 'installation_vsn')?.price ?? 100)
        : (pricingStore.pricing.services.find((s: any) => s.id === 'installation')?.price ?? 400)
      const factor = (pricingStore.pricing.markup.installation_profit_factor ?? 33) / 100
      return roundTo(basePrice + basePrice * factor, 50)
    },
    /** Доплата за металл. ручки (8₽×2 шт из админки). В калькуляторе для клиента округление 50, для дилера 10. */
    extrasHandleMetal(): number {
      const pricingStore = usePricingStore()
      const p = pricingStore.pricing
      const cost = p ? ((p.components.find((c: any) => c.id === 'handle_metal')?.price ?? 8) * 2) : 16
      return costToClientPrice(cost, p ?? undefined)
    },
    /** Покраска по RAL (100 ₽/м.п.) для текущей позиции — выводить отдельно и вычитать из прибыли. 0, если цвет не RAL. */
    currentRalPaintingAmount(state): number {
      const pricingStore = usePricingStore()
      return getRalPaintingAmount(state.config.width, state.config.height, state.config.color, pricingStore.pricing ?? undefined)
    },
    /** Сумма покраски RAL по всем позициям в корзине (позиции с цветом RAL). */
    totalRalPaintingAmount(state): number {
      const pricingStore = usePricingStore()
      return state.items
        .filter((item) => item.color === 'RAL')
        .reduce((sum, item) => sum + getRalPaintingAmount(item.width, item.height, 4, pricingStore.pricing ?? undefined), 0)
    },
  },
  actions: {
    addToOrder() {
      const base = this.currentPrice
      const installation = this.config.installation ? this.extrasInstallation : 0
      const metal = this.config.handleType === 'metal' ? this.extrasHandleMetal : 0
      const price = (base + installation + metal) * this.config.count

      const colorName = COLOR_NAMES[this.config.color]
      const handleName = this.config.handleType === 'metal' ? 'МЕТАЛЛ' : 'ПВХ'
      const frameName = FRAME_TYPE_NAMES[this.config.frameType]

      this.items.push({
        id: Date.now(),
        type: this.config.type,
        typeName: `${MESH_TYPE_NAMES[this.config.type]} (${handleName})${this.config.installation ? ' + МОНТАЖ' : ''}`,
        frameTypeName: frameName,
        color: colorName,
        width: this.config.width,
        height: this.config.height,
        count: this.config.count,
        price,
      })
    },
    removeItem(id: number) {
      this.items = this.items.filter((item) => item.id !== id)
    },
    clearOrder() {
      this.items = []
      this.delivery = ''
      this.deliveryPrice = 0
      this.measurementSelected = false
      this.measurementPrice = 0
      this.discountType = ''
    },
    updateConfig(newConfig: Partial<typeof this.config>) {
      this.config = { ...this.config, ...newConfig }
    },
    setDelivery(value: string, price: number) {
      this.delivery = value
      this.deliveryPrice = price
    },
    setMeasurement(selected: boolean, price: number = 0) {
      this.measurementSelected = selected
      this.measurementPrice = price
    },
    setDiscount(type: '' | 'srochnyi') {
      this.discountType = type
    },
  },
})
