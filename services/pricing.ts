// services/pricing.ts - Сервис ценообразования
// Извлечённая бизнес-логика из stores/order.ts

import { PRICING_CONFIG } from '~/constants/pricing'
import type { ColorId, MeshType, FrameType } from '~/types/mesh'

/** Работа: база + 5% от всех материалов (себестоимость без учета работы). */
export function getWork(widthMm: number, heightMm: number, colorId: ColorId, meshType: MeshType, frameType: FrameType, config: any): number {
  const f = config.fixed
  
  // Рассчитываем себестоимость материалов (без учета самой работы)
  let materialCost = 0
  
  const w = widthMm / 1000
  const h = heightMm / 1000
  const perimeterM = 2 * (w + h)
  const areaM2 = w * h
  const areaCalc = Math.max(areaM2, config.variable.minAreaM2)
  const v = config.variable
  
  // 1. Полотно
  const meshBase = config.meshPerM2[meshType] ?? config.meshPerM2.standart
  materialCost += areaCalc * meshBase * v.marginMesh
  
  // 2. Профиль
  const profileLengthM = Math.max(0, perimeterM - 0.24)
  if (frameType === 'vstavnaya') {
    materialCost += profileLengthM * getProfilePerMeterVstavnaya(colorId, config)
  } else {
    materialCost += profileLengthM * getProfilePerMeter(colorId, config) * v.marginProfile
  }
  
  // 3. Шнур
  materialCost += perimeterM * v.cordPerMeter * v.marginCord
  
  // 4. Импост
  const impostLengthM = Math.max(0, (widthMm - 48) / 1000)
  materialCost += impostLengthM * getImpostPerMeter(colorId, config) * v.marginProfile
  
  // 5. Фиксированные комплектующие (без работы)
  if (frameType === 'vstavnaya') {
    const fv = config.fixedVstavnaya
    const cornerPerPiece = (fv.cornersByColor as Record<number, number>)[colorId] ?? 14.8
    materialCost += 4 * cornerPerPiece // Уголки
    materialCost += (fv.mountCount ?? 4) * (fv.mountPerPiece ?? 30) // Крепления
    materialCost += (fv.impostMountCount ?? 2) * (fv.impostMountPrice ?? 1.8) // Крепления импоста
    materialCost += 2 * f.handlePlastic // Ручки
    materialCost += (fv.screwsHandles ?? 2) * f.screw // Саморезы ручек
    materialCost += (fv.rivetsMounts ?? 4) * f.rivet // Клепки
    materialCost += f.stretch // Стретч
  } else {
    const fr = config.fixedRamochnaya
    const cornerPerPiece = (fr.cornersByColor as Record<number, number>)[colorId] ?? 3.75
    materialCost += 4 * cornerPerPiece // Уголки
    materialCost += (fr.impostMountCount ?? 2) * (fr.impostMountPrice ?? 1.8) // Крепления импоста
    materialCost += 2 * f.handlePlastic // Ручки
    materialCost += (fr.screwsHandles ?? 2) * f.screw // Саморезы ручек
    materialCost += fr.mounts // Крепления
    materialCost += (fr.screwsMounts ?? 10) * f.screw // Саморезы креплений
    materialCost += f.stretch // Стретч
  }

  // Формула: 50 ₽ база + 5% от всех материалов
  return (f.manufacturingBase ?? 50) + materialCost * (f.manufacturingPercent ?? 0.05)
}

/** Фикса рамочной: 4×уголок + 2×ручки + 2×саморез + 4×крепление + 10×саморез + 2×крепление поперечины (1,8) + стрейч + работа. */
function getFixedTotal(widthMm: number, heightMm: number, colorId: number, meshType: string, config: any): number {
  const f = config.fixed
  const fr = config.fixedRamochnaya
  const cornerPerPiece = (fr.cornersByColor as Record<number, number>)[colorId] ?? 3.75
  const cornersTotal = 4 * cornerPerPiece
  const impostMountTotal = (fr.impostMountCount ?? 2) * (fr.impostMountPrice ?? 1.8)
  const work = getWork(widthMm, heightMm, colorId, meshType as MeshType, 'standart', config)

  // Ручки (2 шт) + саморезы для ручек (2 шт)
  const handlesCost = 2 * f.handlePlastic
  const handlesScrewsCost = (fr.screwsHandles ?? 2) * f.screw

  // Саморезы для креплений (10 шт)
  const mountsScrewsCost = (fr.screwsMounts ?? 10) * f.screw

  return cornersTotal + handlesCost + handlesScrewsCost + fr.mounts + mountsScrewsCost + impostMountTotal + f.stretch + work
}

/** Фикса вставной VSN: 4×уголок + 2×ручки + 2×саморез + 4×крепление + 4×клепка + 2×крепление поперечины + стрейч + работа. */
function getFixedTotalVstavnaya(widthMm: number, heightMm: number, colorId: number, meshType: string, config: any): number {
  const f = config.fixed
  const fv = config.fixedVstavnaya
  const cornerPerPiece = (fv.cornersByColor as Record<number, number>)[colorId] ?? 14.8
  const cornersTotal = 4 * cornerPerPiece
  const mountsTotal = (fv.mountCount ?? 4) * (fv.mountPerPiece ?? 30)
  const impostMountTotal = (fv.impostMountCount ?? 2) * (fv.impostMountPrice ?? 1.8)
  const work = getWork(widthMm, heightMm, colorId, meshType as MeshType, 'vstavnaya', config)

  // Ручки (2 шт) + саморезы для ручек (2 шт)
  const handlesCost = 2 * f.handlePlastic
  const handlesScrewsCost = (fv.screwsHandles ?? 2) * f.screw

  // Клепки для креплений (4 шт)
  const mountsRivetsCost = (fv.rivetsMounts ?? 4) * f.rivet

  return cornersTotal + handlesCost + handlesScrewsCost + mountsTotal + mountsRivetsCost + impostMountTotal + f.stretch + work
}

/** Цена профиля за м.п. по цвету (RAL = база + наценка покраски). */
function getProfilePerMeter(colorId: number, config: any): number {
  const v = config.variable
  const base = (v.profilePerMeter as Record<number, number>)[colorId] ?? 60
  if (colorId === 4) return base + v.ralPaintingPerMeter
  return base
}

/** Цена поперечины (импост) за м.п. по цвету (RAL = база + наценка покраски). */
function getImpostPerMeter(colorId: number, config: any): number {
  const v = config.variable
  const base = (v.impostPerMeter as Record<number, number>)[colorId] ?? 62
  if (colorId === 4) return base + v.ralPaintingPerMeter
  return base
}

/** Профиль вставной VSN за м.п. по цвету (151/153/163/401), с запасом 10%. */
function getProfilePerMeterVstavnaya(colorId: number, config: any): number {
  const v = config.variable
  const pv = (v.profilePerMeterVstavnaya as Record<number, number>) ?? { 1: 151, 2: 153, 3: 163, 4: 251 }
  const profile = pv[colorId] ?? pv[1]
  return profile * v.marginProfile
}

/**
 * Себестоимость S для рамочной сетки (без доп. монтажа/металл).
 * Профиль: (периметр − 240 мм) × цена/м.п. × 1,1. Шнур: периметр × 4,6 × 1,01. Импост: (ширина − 48 мм) × цена/м.п. × 1,1. Полотно: площадь × цена/м² × 1,26.
 */
export function computeCost(widthMm: number, heightMm: number, colorId: ColorId, meshType: MeshType, config: any): number {
  const w = widthMm / 1000
  const h = heightMm / 1000
  const perimeterM = 2 * (w + h)
  const areaM2 = w * h
  const areaCalc = Math.max(areaM2, config.variable.minAreaM2)

  const v = config.variable
  const meshBase = config.meshPerM2[meshType] ?? config.meshPerM2.standart
  const meshCost = areaCalc * meshBase * v.marginMesh

  const fixedTotal = getFixedTotal(widthMm, heightMm, colorId, meshType, config)
  const profileLengthM = Math.max(0, perimeterM - 0.24)
  const profileCost = profileLengthM * getProfilePerMeter(colorId, config) * v.marginProfile
  const cordCost = perimeterM * v.cordPerMeter * v.marginCord
  const impostLengthM = Math.max(0, (widthMm - 48) / 1000)
  const impostCost = impostLengthM * getImpostPerMeter(colorId, config) * v.marginProfile

  return fixedTotal + profileCost + cordCost + impostCost + meshCost
}

/**
 * Себестоимость S для вставной VSN: та же схема — профиль (периметр−240), шнур, импост (ширина−48), полотно (площадь×1,26).
 */
export function computeCostVstavnaya(widthMm: number, heightMm: number, colorId: ColorId, meshType: MeshType, config: any): number {
  const w = widthMm / 1000
  const h = heightMm / 1000
  const perimeterM = 2 * (w + h)
  const areaM2 = w * h
  const areaCalc = Math.max(areaM2, config.variable.minAreaM2)

  const v = config.variable
  const meshBase = config.meshPerM2[meshType] ?? config.meshPerM2.standart
  const meshCost = areaCalc * meshBase * v.marginMesh

  const fixedTotal = getFixedTotalVstavnaya(widthMm, heightMm, colorId, meshType, config)
  const profileLengthM = Math.max(0, perimeterM - 0.24)
  const profileCost = profileLengthM * getProfilePerMeterVstavnaya(colorId, config)
  const cordCost = perimeterM * v.cordPerMeter * v.marginCord
  const impostLengthM = Math.max(0, (widthMm - 48) / 1000)
  const impostCost = impostLengthM * getImpostPerMeter(colorId, config) * v.marginProfile

  return fixedTotal + profileCost + cordCost + impostCost + meshCost
}

/** Округление до шага (50 или 10) */
export function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step
}

/** Цена для клиента: считается отдельно от себестоимости (не от дилера). */
export function costToClientPrice(cost: number, config: any): number {
  const { clientFactorFromCost, clientOffsetFromCost, clientRound } = config.markup
  const clientPrice = cost * clientFactorFromCost + clientOffsetFromCost
  return Math.max(0, roundTo(clientPrice, clientRound))
}

/** Цена для дилера */
export function costToDealerPrice(cost: number, config: any): number {
  const { dealerFactor, dealerOffset, dealerRound } = config.markup
  const dealerPrice = cost * dealerFactor + dealerOffset
  return Math.max(0, roundTo(dealerPrice, dealerRound))
}

/** Потеря на оплату картой от суммы заказа (руб). */
export function getCardFee(revenue: number, config: any): number {
  const p = config.fees?.cardPercent ?? 0.025
  return revenue * p
}

/** Выручка после вычета комиссии карты (руб). */
export function getNetRevenueAfterCard(revenue: number, config: any): number {
  const p = config.fees?.cardPercent ?? 0.025
  return revenue * (1 - p)
}

/** Сумма покраски по RAL (100 ₽/м.п.): профиль + импост. Только для colorId === 4 (RAL). Выводится отдельно и вычитается из прибыли. */
export function getRalPaintingAmount(widthMm: number, heightMm: number, colorId: ColorId, config: any): number {
  if (colorId !== 4) return 0
  const perimeterM = 2 * (widthMm / 1000 + heightMm / 1000)
  const profileLengthM = Math.max(0, perimeterM - 0.24)
  const impostLengthM = Math.max(0, (widthMm - 48) / 1000)
  const ralPerMeter = config.variable.ralPaintingPerMeter ?? 100
  return (profileLengthM + impostLengthM) * ralPerMeter
}

/** Прибыль от заказа: выручка после карты − себестоимость − покраска RAL (если есть). */
export function getOrderProfit(revenue: number, cost: number, config: any, ralAmount: number = 0): number {
  return getNetRevenueAfterCard(revenue, config) - cost - ralAmount
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
  config: any,
  count: number = 1,
  hasInstallation: boolean = false,
  handleType: 'pvc' | 'metal' = 'pvc'
): number {
  const cost = frameType === 'vstavnaya'
    ? computeCostVstavnaya(widthMm, heightMm, colorId, meshType, config)
    : computeCost(widthMm, heightMm, colorId, meshType, config)

  const base = costToClientPrice(cost, config)
  const installation = hasInstallation ? config.extras.installation : 0
  const metal = handleType === 'metal' ? config.extras.handleMetal : 0

  return (base + installation + metal) * count
}
