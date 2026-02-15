import { defineStore } from 'pinia'
import { type ColorId, type MeshType, type FrameType, type HandleType, COLOR_NAMES, FRAME_TYPE_NAMES, MESH_TYPE_NAMES } from '~/types/mesh'
import { PRICING_CONFIG, DELIVERY_OPTIONS, URGENT_ORDER_OPTION, MEASUREMENT_OPTION } from '~/constants/pricing'
import { computeCost, computeCostVstavnaya, costToClientPrice, getRalPaintingAmount, getNetRevenueAfterCard } from '~/services/pricing'

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
    currentPrice(state): number {
      if (state.config.frameType === 'vstavnaya') {
        const cost = computeCostVstavnaya(
          state.config.width,
          state.config.height,
          state.config.color,
          state.config.type
        )
        return costToClientPrice(cost)
      }
      const cost = computeCost(
        state.config.width,
        state.config.height,
        state.config.color,
        state.config.type
      )
      return costToClientPrice(cost)
    },
    totalPrice(state): number {
      const itemsTotal = state.items.reduce((sum, item) => sum + item.price, 0)
      const measurementAdd = state.measurementSelected ? state.measurementPrice : 0
      const urgentAdd = state.discountType === 'srochnyi' ? 400 : 0
      // Доставка в итог только если в заказе есть сетки без монтажа (когда способ получения показывается)
      const needsDelivery = state.items.some((item) => !item.typeName.includes(' + МОНТАЖ'))
      const deliveryAdd = needsDelivery ? state.deliveryPrice : 0
      return itemsTotal + deliveryAdd + measurementAdd + urgentAdd
    },
    /** Доплата за монтаж за 1 шт (для отображения в калькуляторе) */
    extrasInstallation(): number {
      return PRICING_CONFIG.extras.installation
    },
    /** Доплата за металл. ручки за 1 шт */
    extrasHandleMetal(): number {
      return PRICING_CONFIG.extras.handleMetal
    },
    /** Покраска по RAL (100 ₽/м.п.) для текущей позиции — выводить отдельно и вычитать из прибыли. 0, если цвет не RAL. */
    currentRalPaintingAmount(state): number {
      return getRalPaintingAmount(state.config.width, state.config.height, state.config.color)
    },
    /** Сумма покраски RAL по всем позициям в корзине (позиции с цветом RAL). */
    totalRalPaintingAmount(state): number {
      return state.items
        .filter((item) => item.color === 'RAL')
        .reduce((sum, item) => sum + getRalPaintingAmount(item.width, item.height, 4), 0)
    },
  },
  actions: {
    addToOrder() {
      const base = this.currentPrice
      const installation = this.config.installation ? PRICING_CONFIG.extras.installation : 0
      const metal = this.config.handleType === 'metal' ? PRICING_CONFIG.extras.handleMetal : 0
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
