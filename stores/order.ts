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

/**
 * Входные цены и параметры расчёта (для будущей админки).
 * Меняйте здесь — пересчёт на всём сайте.
 */
export const PRICING_CONFIG = {
  /** Общие: ручки 2 шт × 2,2, стрейч, работа. Уголки/крепления — в fixedRamochnaya. Импост — переменная (ширина−48). */
  fixed: {
    handles: 4.4, /* 2 шт × 2,2 руб (ручка + саморез) */
    stretch: 24,
    /** Работа: база 60 ₽ + (полотно ₽/м² + профиль ₽/м.п.) × 10% — для всех сеток */
    workBase: 60,
    workPercent: 0.1,
  },
  /** Фикса рамочной: уголки 4×3,75, ручка 2×2,2, крепление 4×10, крепление поперечины 2×1,8 */
  fixedRamochnaya: {
    cornersByColor: { 1: 3.75, 2: 6, 3: 7, 4: 7 }, /* цена за 1 уголок; всего 4 шт */
    mounts: 40, /* 4 шт × 10 руб (крепление металл + саморезы) */
    impostMountCount: 2,
    impostMountPrice: 1.8, /* крепление поперечины, руб за 1 шт */
  },
  /** Фикса вставной VSN: уголки 14,8 ₽/шт × 4; крепление (+клепка) 30 ₽/шт × 4; крепление поперечины 2×1,8 */
  fixedVstavnaya: {
    cornersByColor: { 1: 14.8, 2: 4.85, 3: 7.15, 4: 7.15 }, /* цена за 1 уголок; всего 4 шт */
    mountPerPiece: 30,
    mountCount: 4,
    impostMountCount: 2,
    impostMountPrice: 1.8,
  },
  /** Переменные: цены за погонный метр (профиль рамный + поперечина усреднённо) и шнур */
  variable: {
    /** Цена профиля за м.п. по цветам (1=белая, 2=коричневая, 3=антрацит, 4=RAL) — рамочная */
    profilePerMeter: { 1: 60, 2: 64.8, 3: 70, 4: 60 },
    /** Профиль вставной VSN за м.п. по цветам; RAL = белая + наценка покраски 100 */
    profilePerMeterVstavnaya: { 1: 151, 2: 153, 3: 163, 4: 251 }, /* 4 = RAL: 151 + 100 */
    /** Поперечина за м.п. по цветам (для RAL к белому + наценка покраски) — общая для рамочной и вставной */
    impostPerMeter: { 1: 62, 2: 67.2, 3: 75, 4: 62 },
    /** Наценка покраски RAL: + руб за м.п. к белому профилю/поперечине (рамочные и вставные) */
    ralPaintingPerMeter: 100,
    /** Шнур фиксирующий, руб/м.п. (без запаса) */
    cordPerMeter: 4.6,
    /** Запасы: 15% профиль и поперечина, 32% полотно, шнур без запаса */
    marginProfile: 1.15,
    marginMesh: 1.32,
    marginCord: 1,
    /** Минимальная площадь для расчёта, м² */
    minAreaM2: 0.3,
  },
  /** Цена полотна за м² по типам (входные, без запаса — запас в marginMesh) */
  meshPerM2: {
    standart: 63,
    antimoshka: 265,
    ultravyu: 295,
    antikoshka: 414,
    antipyl: 645,
  },
  /** Наценка: дилер и клиент — только коэффициент от себестоимости, без вычитания. */
  markup: {
    /** Дилер: рамочная 1000×1000 белая стандарт (себ. ≈588) → 840 ₽ */
    dealerFactor: 1.43,
    dealerOffset: 0,
    dealerRound: 10,
    /** Клиент: прямо от себестоимости (≈587 → 1250 для стандарта белая 1000×1000) */
    clientFactorFromCost: 2.13,
    clientOffsetFromCost: 0,
    clientRound: 50,
  },
  /** Доп. услуги в калькуляторе (руб за 1 шт). Ручка ПВХ 2,4 в фиксе; металл +50 к базовой. */
  extras: {
    installation: 300,
    handleMetal: 50,
  },
  /** Потери при оплате (для расчёта прибыли). В админке — редактируемо. */
  fees: {
    /** Комиссия оплаты картой, доля от суммы заказа (клиент и дилер). */
    cardPercent: 0.025,
  },
}

/** Работа: база + (входная полотно ₽/м² + входная профиль ₽/м.п.) × 10%. */
function getWork(colorId: number, meshType: string, frameType: 'standart' | 'vstavnaya'): number {
  const f = PRICING_CONFIG.fixed
  const meshBase = PRICING_CONFIG.meshPerM2[meshType as keyof typeof PRICING_CONFIG.meshPerM2] ?? PRICING_CONFIG.meshPerM2.standart
  const v = PRICING_CONFIG.variable
  const profileInput = frameType === 'vstavnaya'
    ? ((v.profilePerMeterVstavnaya as Record<number, number>)[colorId] ?? 151)
    : (getProfilePerMeter(colorId)) // уже из конфига (входная за м.п.)
  return f.workBase + (meshBase + profileInput) * (f.workPercent ?? 0.1)
}

/** Фикса рамочной: 4×уголок + 2×ручки + 4×крепление + 2×крепление поперечины (1,8) + стрейч + работа. */
function getFixedTotal(colorId: number, meshType: string): number {
  const f = PRICING_CONFIG.fixed
  const fr = PRICING_CONFIG.fixedRamochnaya
  const cornerPerPiece = (fr.cornersByColor as Record<number, number>)[colorId] ?? 3.75
  const cornersTotal = 4 * cornerPerPiece
  const impostMountTotal = (fr.impostMountCount ?? 2) * (fr.impostMountPrice ?? 1.8)
  const work = getWork(colorId, meshType, 'standart')
  return cornersTotal + f.handles + fr.mounts + impostMountTotal + f.stretch + work
}

/** Фикса вставной VSN: 4×уголок + ручки + 4×крепление (+клепка) + 2×крепление поперечины + стрейч + работа. */
function getFixedTotalVstavnaya(colorId: number, meshType: string): number {
  const f = PRICING_CONFIG.fixed
  const fv = PRICING_CONFIG.fixedVstavnaya
  const cornerPerPiece = (fv.cornersByColor as Record<number, number>)[colorId] ?? 14.8
  const cornersTotal = 4 * cornerPerPiece
  const mountsTotal = (fv.mountCount ?? 4) * (fv.mountPerPiece ?? 30)
  const impostMountTotal = (fv.impostMountCount ?? 2) * (fv.impostMountPrice ?? 1.8)
  const work = getWork(colorId, meshType, 'vstavnaya')
  return cornersTotal + f.handles + mountsTotal + impostMountTotal + f.stretch + work
}

/** Профиль: длина = периметр − 240 мм, отходы 10%. Поперечина (импост): длина = ширина − 48 мм. Шнур: по периметру. */

/** Цена профиля за м.п. по цвету (RAL = база + наценка покраски). */
function getProfilePerMeter(colorId: number): number {
  const v = PRICING_CONFIG.variable
  const base = (v.profilePerMeter as Record<number, number>)[colorId] ?? 60
  if (colorId === 4) return base + v.ralPaintingPerMeter
  return base
}

/** Цена поперечины (импост) за м.п. по цвету (RAL = база + наценка покраски). */
function getImpostPerMeter(colorId: number): number {
  const v = PRICING_CONFIG.variable
  const base = (v.impostPerMeter as Record<number, number>)[colorId] ?? 62
  if (colorId === 4) return base + v.ralPaintingPerMeter
  return base
}

/** Профиль вставной VSN за м.п. по цвету (151/153/163/401), с запасом 10%. */
function getProfilePerMeterVstavnaya(colorId: number): number {
  const v = PRICING_CONFIG.variable
  const pv = (v.profilePerMeterVstavnaya as Record<number, number>) ?? { 1: 151, 2: 153, 3: 163, 4: 251 }
  const profile = pv[colorId] ?? pv[1]
  return profile * v.marginProfile
}

/**
 * Себестоимость S для рамочной сетки (без доп. монтажа/металл).
 * Профиль: (периметр − 240 мм) × цена/м.п. × 1,1. Шнур: периметр × 4,6 × 1,01. Импост: (ширина − 48 мм) × цена/м.п. × 1,1. Полотно: площадь × цена/м² × 1,26.
 */
function computeCost(widthMm: number, heightMm: number, colorId: number, meshType: string): number {
  const w = widthMm / 1000
  const h = heightMm / 1000
  const perimeterM = 2 * (w + h)
  const areaM2 = w * h
  const areaCalc = Math.max(areaM2, PRICING_CONFIG.variable.minAreaM2)

  const v = PRICING_CONFIG.variable
  const meshBase = PRICING_CONFIG.meshPerM2[meshType as keyof typeof PRICING_CONFIG.meshPerM2] ?? PRICING_CONFIG.meshPerM2.standart
  const meshCost = areaCalc * meshBase * v.marginMesh

  const fixedTotal = getFixedTotal(colorId, meshType)
  const profileLengthM = Math.max(0, perimeterM - 0.24)
  const profileCost = profileLengthM * getProfilePerMeter(colorId) * v.marginProfile
  const cordCost = perimeterM * v.cordPerMeter * v.marginCord
  const impostLengthM = Math.max(0, (widthMm - 48) / 1000)
  const impostCost = impostLengthM * getImpostPerMeter(colorId) * v.marginProfile

  return fixedTotal + profileCost + cordCost + impostCost + meshCost
}

/**
 * Себестоимость S для вставной VSN: та же схема — профиль (периметр−240), шнур, импост (ширина−48), полотно (площадь×1,26).
 */
function computeCostVstavnaya(widthMm: number, heightMm: number, colorId: number, meshType: string): number {
  const w = widthMm / 1000
  const h = heightMm / 1000
  const perimeterM = 2 * (w + h)
  const areaM2 = w * h
  const areaCalc = Math.max(areaM2, PRICING_CONFIG.variable.minAreaM2)

  const v = PRICING_CONFIG.variable
  const meshBase = PRICING_CONFIG.meshPerM2[meshType as keyof typeof PRICING_CONFIG.meshPerM2] ?? PRICING_CONFIG.meshPerM2.standart
  const meshCost = areaCalc * meshBase * v.marginMesh

  const fixedTotal = getFixedTotalVstavnaya(colorId, meshType)
  const profileLengthM = Math.max(0, perimeterM - 0.24)
  const profileCost = profileLengthM * getProfilePerMeterVstavnaya(colorId)
  const cordCost = perimeterM * v.cordPerMeter * v.marginCord
  const impostLengthM = Math.max(0, (widthMm - 48) / 1000)
  const impostCost = impostLengthM * getImpostPerMeter(colorId) * v.marginProfile

  return fixedTotal + profileCost + cordCost + impostCost + meshCost
}

/** Округление до шага (50 или 10) */
function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step
}

/** Цена для клиента: считается отдельно от себестоимости (не от дилера). */
function costToClientPrice(cost: number): number {
  const { clientFactorFromCost, clientOffsetFromCost, clientRound } = PRICING_CONFIG.markup
  const clientPrice = cost * clientFactorFromCost + clientOffsetFromCost
  return Math.max(0, roundTo(clientPrice, clientRound))
}

/** Потеря на оплату картой от суммы заказа (руб). */
export function getCardFee(revenue: number): number {
  const p = PRICING_CONFIG.fees?.cardPercent ?? 0.025
  return revenue * p
}

/** Выручка после вычета комиссии карты (руб). */
export function getNetRevenueAfterCard(revenue: number): number {
  const p = PRICING_CONFIG.fees?.cardPercent ?? 0.025
  return revenue * (1 - p)
}

/** Сумма покраски по RAL (100 ₽/м.п.): профиль + импост. Только для colorId === 4 (RAL). Выводится отдельно и вычитается из прибыли. */
export function getRalPaintingAmount(widthMm: number, heightMm: number, colorId: number): number {
  if (colorId !== 4) return 0
  const perimeterM = 2 * (widthMm / 1000 + heightMm / 1000)
  const profileLengthM = Math.max(0, perimeterM - 0.24)
  const impostLengthM = Math.max(0, (widthMm - 48) / 1000)
  const ralPerMeter = PRICING_CONFIG.variable.ralPaintingPerMeter ?? 100
  return (profileLengthM + impostLengthM) * ralPerMeter
}

/** Прибыль от заказа: выручка после карты − себестоимость − покраска RAL (если есть). */
export function getOrderProfit(revenue: number, cost: number, ralAmount: number = 0): number {
  return getNetRevenueAfterCard(revenue) - cost - ralAmount
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
      type: 'standart',
      typeName: 'СТАНДАРТ',
      frameType: 'standart',
      width: 350,
      height: 1000,
      color: 1,
      count: 1,
      installation: false,
      handleType: 'pvc',
    },
    delivery: 'Оф.Чебоксары',
    deliveryPrice: 0,
  }),
  getters: {
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
      return itemsTotal + state.deliveryPrice
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
        price,
      })
    },
    removeItem(id: number) {
      this.items = this.items.filter((item) => item.id !== id)
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
    },
  },
})
