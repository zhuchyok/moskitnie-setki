#!/usr/bin/env node
/**
 * Сверка цен по размерам (белая, ПВХ, без монтажа).
 * Рамочная: node scripts/verify-prices.mjs [standart|antimoshka|ultravyu|antikoshka|antipyl]
 * Вставная VSN: node scripts/verify-prices.mjs vstavnaya [standart|antimoshka|...]
 */

const PRICING_CONFIG = {
  fixed: { handles: 4.4, stretch: 24, workBase: 60, workPercent: 0.1 },
  fixedRamochnaya: { cornersByColor: { 1: 3.75, 2: 6, 3: 7, 4: 7 }, mounts: 40, impostMountCount: 2, impostMountPrice: 1.8 },
  fixedVstavnaya: { cornersByColor: { 1: 14.8, 2: 4.85, 3: 7.15, 4: 7.15 }, mountPerPiece: 30, mountCount: 4, impostMountCount: 2, impostMountPrice: 1.8 },
  variable: {
    profilePerMeter: { 1: 60, 2: 64.8, 3: 70, 4: 60 },
    profilePerMeterVstavnaya: { 1: 151, 2: 153, 3: 163, 4: 251 },
    impostPerMeter: { 1: 62, 2: 67.2, 3: 75, 4: 62 },
    ralPaintingPerMeter: 100,
    cordPerMeter: 4.6,
    marginProfile: 1.15,
    marginMesh: 1.32,
    marginCord: 1,
    minAreaM2: 0.3,
  },
  meshPerM2: { standart: 63, antimoshka: 265, ultravyu: 295, antikoshka: 414, antipyl: 645 },
  markup: { clientFactorFromCost: 2.13, clientRound: 50 },
}

function getWork(colorId, meshType, frameType) {
  const f = PRICING_CONFIG.fixed
  const meshBase = PRICING_CONFIG.meshPerM2[meshType] ?? 63
  const profileInput = frameType === 'vstavnaya'
    ? (PRICING_CONFIG.variable.profilePerMeterVstavnaya[colorId] ?? 151)
    : getProfilePerMeter(colorId)
  return f.workBase + (meshBase + profileInput) * (f.workPercent ?? 0.1)
}

function getFixedTotal(colorId, meshType) {
  const f = PRICING_CONFIG.fixed
  const fr = PRICING_CONFIG.fixedRamochnaya
  const corner = fr.cornersByColor[colorId] ?? 3.75
  const work = getWork(colorId, meshType, 'ramochnaya')
  return 4 * corner + f.handles + fr.mounts + (fr.impostMountCount || 2) * (fr.impostMountPrice || 1.8) + f.stretch + work
}

function getFixedTotalVstavnaya(colorId, meshType) {
  const f = PRICING_CONFIG.fixed
  const fv = PRICING_CONFIG.fixedVstavnaya
  const cornerPerPiece = fv.cornersByColor[colorId] ?? 14.8
  const cornersTotal = 4 * cornerPerPiece
  const mountsTotal = (fv.mountCount || 4) * (fv.mountPerPiece || 30)
  const impostMountTotal = (fv.impostMountCount || 2) * (fv.impostMountPrice || 1.8)
  const work = getWork(colorId, meshType, 'vstavnaya')
  return cornersTotal + f.handles + mountsTotal + impostMountTotal + f.stretch + work
}

function getProfilePerMeterVstavnaya(colorId) {
  const pv = PRICING_CONFIG.variable.profilePerMeterVstavnaya
  const profile = pv[colorId] ?? 151
  return profile * PRICING_CONFIG.variable.marginProfile
}

function getProfilePerMeter(c) {
  const v = PRICING_CONFIG.variable
  const b = v.profilePerMeter[c] ?? 60
  return c === 4 ? b + v.ralPaintingPerMeter : b
}

function getImpostPerMeter(c) {
  const v = PRICING_CONFIG.variable
  const b = v.impostPerMeter[c] ?? 62
  return c === 4 ? b + v.ralPaintingPerMeter : b
}

function computeCost(wMm, hMm, colorId, meshType) {
  const w = wMm / 1000
  const h = hMm / 1000
  const perimeterM = 2 * (w + h)
  const areaCalc = Math.max(w * h, PRICING_CONFIG.variable.minAreaM2)
  const v = PRICING_CONFIG.variable
  const meshBase = PRICING_CONFIG.meshPerM2[meshType] ?? 63
  const meshCost = areaCalc * meshBase * v.marginMesh
  const fixedTotal = getFixedTotal(colorId, meshType)
  const profileLengthM = Math.max(0, perimeterM - 0.24)
  const profileCost = profileLengthM * getProfilePerMeter(colorId) * v.marginProfile
  const cordCost = perimeterM * v.cordPerMeter * v.marginCord
  const impostLengthM = Math.max(0, (wMm - 48) / 1000)
  const impostCost = impostLengthM * getImpostPerMeter(colorId) * v.marginProfile
  return fixedTotal + profileCost + cordCost + impostCost + meshCost
}

function computeCostVstavnaya(wMm, hMm, colorId, meshType) {
  const w = wMm / 1000
  const h = hMm / 1000
  const perimeterM = 2 * (w + h)
  const areaCalc = Math.max(w * h, PRICING_CONFIG.variable.minAreaM2)
  const v = PRICING_CONFIG.variable
  const meshBase = PRICING_CONFIG.meshPerM2[meshType] ?? 63
  const meshCost = areaCalc * meshBase * v.marginMesh
  const fixedTotal = getFixedTotalVstavnaya(colorId, meshType)
  const profileLengthM = Math.max(0, perimeterM - 0.24)
  const profileCost = profileLengthM * getProfilePerMeterVstavnaya(colorId)
  const cordCost = perimeterM * v.cordPerMeter * v.marginCord
  const impostLengthM = Math.max(0, (wMm - 48) / 1000)
  const impostCost = impostLengthM * getImpostPerMeter(colorId) * v.marginProfile
  return fixedTotal + profileCost + cordCost + impostCost + meshCost
}

function costToClientPrice(cost) {
  const r = PRICING_CONFIG.markup.clientRound
  return Math.max(0, Math.round((cost * PRICING_CONFIG.markup.clientFactorFromCost) / r) * r)
}

const sizes = [
  [300, 300],
  [400, 400],
  [500, 500],
  [600, 600],
  [700, 700],
  [800, 800],
  [900, 900],
  [1000, 1000],
  [1100, 1100],
  [1200, 1200],
  [1400, 1400],
  [400, 600],
  [500, 800],
  [600, 1000],
  [600, 1200],
  [600, 1400],
  [800, 1000],
  [800, 1200],
  [800, 1400],
  [1000, 1200],
  [1000, 1400],
  [1000, 2000],
  [1200, 1400],
]

const colorId = 1 // белая
const arg1 = (process.argv[2] || 'standart').toLowerCase()
const arg2 = (process.argv[3] || '').toLowerCase()
const isVstavnaya = arg1 === 'vstavnaya'
const meshType = isVstavnaya ? (arg2 || 'standart') : arg1
const typeLabels = { standart: 'СТАНДАРТ', antimoshka: 'АНТИМОШКА', ultravyu: 'УЛЬТРАВЬЮ', antikoshka: 'АНТИКОШКА', antipyl: 'АНТИПЫЛЬ' }
const typeLabel = typeLabels[meshType] || meshType
const frameLabel = isVstavnaya ? 'Вставная VSN' : 'Рамочная'

console.log(`## ${frameLabel}, ${typeLabel}, БЕЛАЯ, ПВХ, без монтажа\n`)
console.log('| Ширина×Высота, мм | Периметр, м | Площадь, м² | Себестоимость, руб | Цена клиента, ₽ |')
console.log('|------------------|-------------|-------------|--------------------|-----------------|')

const compute = isVstavnaya ? computeCostVstavnaya : computeCost
for (const [width, height] of sizes) {
  const cost = compute(width, height, colorId, meshType)
  const price = costToClientPrice(cost)
  const w = width / 1000
  const h = height / 1000
  const perimeterM = (2 * (w + h)).toFixed(2)
  const areaM2 = (w * h).toFixed(2)
  console.log(`| ${width}×${height} | ${perimeterM} | ${areaM2} | ${Math.round(cost)} | ${price} |`)
}

console.log('\n*Округление цены клиента до 50 ₽.*')
