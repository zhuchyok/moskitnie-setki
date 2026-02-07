import { defineStore } from 'pinia'

export interface OrderItem {
  id: number
  type: string
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
    prices: {
      // Рамочная Стандарт: белая (0-15), коричневая (16-31), антрацит (32-47), RAL (48-63)
      standart: [
        850, 900, 950, 1000, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1600, 1650, 1700,
        950, 1000, 1050, 1100, 1200, 1250, 1300, 1350, 1450, 1500, 1550, 1600, 1650, 1750, 1800, 1850,
        1000, 1100, 1150, 1200, 1250, 1350, 1400, 1450, 1500, 1600, 1650, 1700, 1800, 1850, 1900, 1950,
        1200, 1300, 1350, 1400, 1450, 1550, 1600, 1650, 1700, 1800, 1850, 1900, 2000, 2050, 2100, 2150
      ],
      // Рамочная Антимошка: белая (0-15), коричневая (16-31), антрацит (32-47), RAL (48-63)
      antimoshka: [
        1000, 1100, 1200, 1300, 1350, 1450, 1550, 1650, 1750, 1800, 1900, 2000, 2100, 2150, 2250, 2350,
        1150, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 1950, 2050, 2150, 2250, 2350, 2450, 2550,
        1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 1950, 2050, 2150, 2250, 2350, 2450, 2550, 2650,
        1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2150, 2250, 2350, 2450, 2550, 2650, 2750, 2850
      ],
      // Рамочная Антикошка: белая (0-15), коричневая (16-31), антрацит (32-47), RAL (48-63)
      antikoshka: [
        1300, 1450, 1600, 1750, 1900, 2000, 2150, 2300, 2450, 2600, 2700, 2850, 3000, 3150, 3300, 3400,
        1450, 1550, 1700, 1850, 2000, 2150, 2300, 2450, 2600, 2750, 2900, 3000, 3150, 3300, 3450, 3600,
        1500, 1650, 1800, 1950, 2100, 2250, 2400, 2550, 2700, 2850, 3000, 3100, 3250, 3400, 3550, 3700,
        1700, 1850, 2000, 2150, 2300, 2450, 2600, 2750, 2900, 3050, 3200, 3300, 3450, 3600, 3750, 3900
      ],
      // Рамочная Антипыль: белая (0-15), коричневая (16-31), антрацит (32-47), RAL (48-63)
      antipyl: [
        1400, 1550, 1750, 1900, 2050, 2200, 2350, 2500, 2650, 2850, 3000, 3150, 3300, 3450, 3600, 3750,
        1500, 1700, 1850, 2000, 2150, 2350, 2500, 2650, 2800, 3000, 3150, 3300, 3450, 3600, 3800, 3950,
        1600, 1750, 1950, 2100, 2250, 2400, 2600, 2750, 2900, 3100, 3250, 3400, 3550, 3750, 3900, 4050,
        1800, 1950, 2150, 2300, 2450, 2600, 2800, 2950, 3100, 3300, 3450, 3600, 3750, 3950, 4100, 4250
      ],
      // Рамочная Ультравью: белая (0-15), коричневая (16-31), антрацит (32-47), RAL (48-63) — цены как Антимошка
      ultravyu: [
        1000, 1100, 1200, 1300, 1350, 1450, 1550, 1650, 1750, 1800, 1900, 2000, 2100, 2150, 2250, 2350,
        1150, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 1950, 2050, 2150, 2250, 2350, 2450, 2550,
        1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 1950, 2050, 2150, 2250, 2350, 2450, 2550, 2650,
        1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2150, 2250, 2350, 2450, 2550, 2650, 2750, 2850
      ],
      // Вставные VSN Стандарт: белая (0-15), коричневая (16-31), антрацит (32-47), RAL (48-63)
      vstavnye: [
        1450, 1600, 1800, 1950, 2100, 2250, 2400, 2550, 2700, 2900, 3050, 3200, 3350, 3500, 3650, 3800,
        1550, 1750, 1900, 2050, 2200, 2400, 2550, 2700, 2850, 3050, 3200, 3350, 3500, 3650, 3850, 4000,
        1650, 1800, 2000, 2150, 2300, 2450, 2650, 2800, 2950, 3150, 3300, 3450, 3600, 3800, 3950, 4100,
        1850, 2000, 2200, 2350, 2500, 2650, 2850, 3000, 3150, 3350, 3500, 3650, 3800, 4000, 4150, 4300
      ]
    },
    items: [] as OrderItem[],
    config: {
      type: 'standart',
      typeName: 'СТАНДАРТ',
      frameType: 'standart', // 'standart' or 'vstavnaya'
      width: 350,
      height: 1000,
      color: 1,
      count: 1,
      installation: false,
      handleType: 'pvc', // 'pvc' or 'metal'
    },
    delivery: 'Оф.Чебоксары',
    deliveryPrice: 0
  }),
  getters: {
    currentPrice: (state) => {
      const area = state.config.width * state.config.height
      let index = 0
      if (area < 400000) index = 0
      else if (area < 500000) index = 1
      else if (area < 600000) index = 2
      else if (area < 700000) index = 3
      else if (area < 800000) index = 4
      else if (area < 900000) index = 5
      else if (area < 1000000) index = 6
      else if (area < 1100000) index = 7
      else if (area < 1200000) index = 8
      else if (area < 1300000) index = 9
      else if (area < 1400000) index = 10
      else if (area < 1500000) index = 11
      else if (area < 1600000) index = 12
      else if (area < 1700000) index = 13
      else if (area < 1800000) index = 14
      else index = 15

      const offset = (state.config.color - 1) * 16
      
      // Если выбрана вставная рамка, используем цены vstavnye (базовая цена VSN)
      // Если выбрана рамочная, используем цены выбранного полотна
      const priceType = state.config.frameType === 'vstavnaya' ? 'vstavnye' : state.config.type
      const selectedPrices = state.prices[priceType as keyof typeof state.prices] || state.prices.standart
      
      let basePrice = selectedPrices[offset + index] || 0
      
      // Если это VSN и выбрано не стандартное полотно, можно добавить наценку или оставить как есть.
      // Пока оставляем логику: VSN имеет свою фиксированную сетку цен.
      
      return basePrice
    },
    totalPrice: (state) => {
      const itemsTotal = state.items.reduce((sum, item) => sum + item.price, 0)
      return itemsTotal + state.deliveryPrice
    }
  },
  actions: {
    addToOrder() {
      const price = (this.currentPrice + (this.config.installation ? 300 : 0) + (this.config.handleType === 'metal' ? 100 : 0)) * this.config.count
      const colorName = ['БЕЛАЯ', 'КОРИЧНЕВАЯ', 'АНТРАЦИТ', 'RAL'][this.config.color - 1]
      const handleName = this.config.handleType === 'metal' ? 'МЕТАЛЛ' : 'ПВХ'
      const frameName = this.config.frameType === 'vstavnaya' ? 'ВСТАВНАЯ VSN' : 'РАМОЧНАЯ'
      
      this.items.push({
        id: Date.now(),
        type: this.config.type,
        typeName: `${this.config.typeName} (${handleName})${this.config.installation ? ' + МОНТАЖ' : ''}`,
        frameTypeName: frameName,
        color: colorName,
        width: this.config.width,
        height: this.config.height,
        count: this.config.count,
        price: price
      })
    },
    removeItem(id: number) {
      this.items = this.items.filter(item => item.id !== id)
    },
    clearOrder() {
      this.items = []
    },
    updateConfig(newConfig: Partial<typeof this.config>) {
      this.config = { ...this.config, ...newConfig }
    },
    setDelivery(value: string, price: number) {
      this.delivery = value
      this.deliveryPrice = price
    }
  }
})
