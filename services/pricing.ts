// services/pricing.ts - Сервис ценообразования
// Извлечённая бизнес-логика из stores/order.ts

import { PRICING_CONFIG } from '~/constants/pricing'
import type { ColorId, MeshType, FrameType } from '~/types/mesh'

/** Работа: база + (входная полотно ₽/м² + входная профиль ₽/м.п.) × 10%. */
function getWork(colorId: number, meshType: string, frameType: 'standart' | 'vstavnaya'): number {
  const f = PRICING_CONFIG.fixed
  const meshBase = PRICING_CONFIG.meshPerM2[meshType as keyof typeof PRICING_CONFIG.meshPerM2] ?? PRICING_CONFIG.meshPerM2.standart
  const v = PRICING_CONFIG.variable
  const profileInput = frameType === 'vstavnaya'
    ? ((v.profilePerMeterVstavnaya as Record<number, number>)[colorId] ?? 151)
    : (getProfilePerMeter(colorId))
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
export function computeCost(widthMm: number, heightMm: number, colorId: ColorId, meshType: MeshType): number {
  const w = widthMm / 1000
  const h = heightMm / 1000
  const perimeterM = 2 * (w + h)
  const areaM2 = w * h
  const areaCalc = Math.max(areaM2, PRICING_CONFIG.variable.minAreaM2)

  const v = PRICING_CONFIG.variable
  const meshBase = PRICING_CONFIG.meshPerM2[meshType] ?? PRICING_CONFIG.meshPerM2.standart
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
export function computeCostVstavnaya(widthMm: number, heightMm: number, colorId: ColorId, meshType: MeshType): number {
  const w = widthMm / 1000
  const h = heightMm / 1000
  const perimeterM = 2 * (w + h)
  const areaM2 = w * h
  const areaCalc = Math.max(areaM2, PRICING_CONFIG.variable.minAreaM2)

  const v = PRICING_CONFIG.variable
  const meshBase = PRICING_CONFIG.meshPerM2[meshType] ?? PRICING_CONFIG.meshPerM2.standart
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
export function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step
}

/** Цена для клиента: считается отдельно от себестоимости (не от дилера). */
export function costToClientPrice(cost: number): number {
  const { clientFactorFromCost, clientOffsetFromCost, clientRound } = PRICING_CONFIG.markup
  const clientPrice = cost * clientFactorFromCost + clientOffsetFromCost
  return Math.max(0, roundTo(clientPrice, clientRound))
}

/** Цена для дилера */
export function costToDealerPrice(cost: number): number {
  const { dealerFactor, dealerOffset, dealerRound } = PRICING_CONFIG.markup
  const dealerPrice = cost * dealerFactor + dealerOffset
  return Math.max(0, roundTo(dealerPrice, dealerRound))
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
export function getRalPaintingAmount(widthMm: number, heightMm: number, colorId: ColorId): number {
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

/** Размер ячейки сетки в зависимости от типа полотна */
export function getMeshSize(meshType: MeshType): number {
  switch (meshType) {
    case 'antimoshka': return 4  // мелкая ячейка 0.8x0.8
    case 'ultravyu': return 4    // повышенная прозрачность, мелкая ячейка
    case 'antipyl': return 3     // мелкая ячейка
    case 'antikoshka': return 5  // крупная ячейка Pet Screen
    default: return 4            // стандартная 1.2x1.2
  }
}

/** Толщина нити сетки */
export function getMeshThickness(meshType: MeshType): string {
  return meshType === 'antikoshka' ? '2px' : '1px'
}

/** Рассчитать полную цену для позиции */
export function calculateItemPrice(
  widthMm: number,
  heightMm: number,
  colorId: ColorId,
  meshType: MeshType,
  frameType: FrameType,
  count: number = 1,
  hasInstallation: boolean = false,
  handleType: 'pvc' | 'metal' = 'pvc'
): number {
  const cost = frameType === 'vstavnaya'
    ? computeCostVstavnaya(widthMm, heightMm, colorId, meshType)
    : computeCost(widthMm, heightMm, colorId, meshType)

  const base = costToClientPrice(cost)
  const installation = hasInstallation ? PRICING_CONFIG.extras.installation : 0
  const metal = handleType === 'metal' ? PRICING_CONFIG.extras.handleMetal : 0

  return (base + installation + metal) * count
}
