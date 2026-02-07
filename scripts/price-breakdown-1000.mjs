#!/usr/bin/env node
/**
 * Подробный расчёт 1000×1000: материалы с ценами и полный расчёт.
 * Рамочная и вставная VSN, белая, стандарт, ПВХ, без монтажа.
 */

const PRICING_CONFIG = {
  fixed: { handles: 4.4, stretch: 24, workBase: 60, workPercent: 0.1 },
  fixedRamochnaya: { cornersByColor: { 1: 3.75 }, mounts: 40, impostMountCount: 2, impostMountPrice: 1.8 },
  fixedVstavnaya: { cornersByColor: { 1: 14.8 }, mountPerPiece: 30, mountCount: 4, impostMountCount: 2, impostMountPrice: 1.8 },
  variable: {
    profilePerMeter: { 1: 60 },
    profilePerMeterVstavnaya: { 1: 151 },
    impostPerMeter: { 1: 62 },
    cordPerMeter: 4.6,
    marginProfile: 1.15,
    marginMesh: 1.32,
    marginCord: 1,
    minAreaM2: 0.3,
  },
  meshPerM2: { standart: 63 },
  markup: { clientFactorFromCost: 2.13, clientRound: 50 },
}

const widthMm = 1000
const heightMm = 1000
const colorId = 1
const meshType = 'standart'

const w = widthMm / 1000
const h = heightMm / 1000
const perimeterM = 2 * (w + h)
const areaM2 = w * h
const areaCalc = Math.max(areaM2, PRICING_CONFIG.variable.minAreaM2)
const v = PRICING_CONFIG.variable

// --- РАМОЧНАЯ ---
function breakdownRamochnaya() {
  const meshBase = PRICING_CONFIG.meshPerM2[meshType]
  const profileInput = PRICING_CONFIG.variable.profilePerMeter[colorId]
  const work = PRICING_CONFIG.fixed.workBase + (meshBase + profileInput) * PRICING_CONFIG.fixed.workPercent

  const cornersTotal = 4 * PRICING_CONFIG.fixedRamochnaya.cornersByColor[colorId]
  const impostMountTotal = PRICING_CONFIG.fixedRamochnaya.impostMountCount * PRICING_CONFIG.fixedRamochnaya.impostMountPrice
  const fixedTotal = cornersTotal + PRICING_CONFIG.fixed.handles + PRICING_CONFIG.fixedRamochnaya.mounts + impostMountTotal + PRICING_CONFIG.fixed.stretch + work

  const profileLengthM = Math.max(0, perimeterM - 0.24)
  const profilePricePerM = PRICING_CONFIG.variable.profilePerMeter[colorId]
  const profileCost = profileLengthM * profilePricePerM * v.marginProfile

  const cordCost = perimeterM * v.cordPerMeter * v.marginCord

  const impostLengthM = Math.max(0, (widthMm - 48) / 1000)
  const impostPricePerM = PRICING_CONFIG.variable.impostPerMeter[colorId]
  const impostCost = impostLengthM * impostPricePerM * v.marginProfile

  const meshCost = areaCalc * meshBase * v.marginMesh

  const costTotal = fixedTotal + profileCost + cordCost + impostCost + meshCost
  const clientPrice = Math.round((costTotal * PRICING_CONFIG.markup.clientFactorFromCost) / PRICING_CONFIG.markup.clientRound) * PRICING_CONFIG.markup.clientRound

  return {
    title: 'РАМОЧНАЯ СЕТКА 1000×1000 мм, белая, стандарт, ПВХ, без монтажа',
    geometry: { widthMm, heightMm, perimeterM, areaM2, areaCalc, profileLengthM, impostLengthM },
    fixed: {
      corners: { qty: 4, pricePerPiece: PRICING_CONFIG.fixedRamochnaya.cornersByColor[colorId], total: cornersTotal },
      handles: { desc: '2 шт × 2,2 ₽', total: PRICING_CONFIG.fixed.handles },
      mounts: { desc: '4 шт × 10 ₽', total: PRICING_CONFIG.fixedRamochnaya.mounts },
      impostMount: { desc: '2 × 1,8 ₽', total: impostMountTotal },
      stretch: { total: PRICING_CONFIG.fixed.stretch },
      work: { formula: `60 + (63 + 60)×10%`, value: work },
    },
    variable: {
      profile: { lengthM: profileLengthM, pricePerM: profilePricePerM, margin: v.marginProfile, total: profileCost },
      cord: { lengthM: perimeterM, pricePerM: v.cordPerMeter, margin: v.marginCord, total: cordCost },
      impost: { lengthM: impostLengthM, pricePerM: impostPricePerM, margin: v.marginProfile, total: impostCost },
      mesh: { areaM2: areaCalc, pricePerM2: meshBase, margin: v.marginMesh, total: meshCost },
    },
    costTotal,
    clientPrice,
  }
}

// --- ВСТАВНАЯ VSN ---
function breakdownVstavnaya() {
  const meshBase = PRICING_CONFIG.meshPerM2[meshType]
  const profileInput = PRICING_CONFIG.variable.profilePerMeterVstavnaya[colorId]
  const work = PRICING_CONFIG.fixed.workBase + (meshBase + profileInput) * PRICING_CONFIG.fixed.workPercent

  const cornerPerPiece = PRICING_CONFIG.fixedVstavnaya.cornersByColor[colorId]
  const cornersTotal = 4 * cornerPerPiece
  const mountsTotal = PRICING_CONFIG.fixedVstavnaya.mountCount * PRICING_CONFIG.fixedVstavnaya.mountPerPiece
  const impostMountTotal = PRICING_CONFIG.fixedVstavnaya.impostMountCount * PRICING_CONFIG.fixedVstavnaya.impostMountPrice
  const fixedTotal = cornersTotal + PRICING_CONFIG.fixed.handles + mountsTotal + impostMountTotal + PRICING_CONFIG.fixed.stretch + work

  const profileLengthM = Math.max(0, perimeterM - 0.24)
  const profilePricePerMWithMargin = PRICING_CONFIG.variable.profilePerMeterVstavnaya[colorId] * v.marginProfile
  const profileCost = profileLengthM * profilePricePerMWithMargin

  const cordCost = perimeterM * v.cordPerMeter * v.marginCord

  const impostLengthM = Math.max(0, (widthMm - 48) / 1000)
  const impostPricePerM = PRICING_CONFIG.variable.impostPerMeter[colorId]
  const impostCost = impostLengthM * impostPricePerM * v.marginProfile

  const meshCost = areaCalc * meshBase * v.marginMesh

  const costTotal = fixedTotal + profileCost + cordCost + impostCost + meshCost
  const clientPrice = Math.round((costTotal * PRICING_CONFIG.markup.clientFactorFromCost) / PRICING_CONFIG.markup.clientRound) * PRICING_CONFIG.markup.clientRound

  return {
    title: 'ВСТАВНАЯ VSN 1000×1000 мм, белая, стандарт, ПВХ, без монтажа',
    geometry: { widthMm, heightMm, perimeterM, areaM2, areaCalc, profileLengthM, impostLengthM },
    fixed: {
      corners: { total: cornersTotal },
      handles: { desc: '2 шт × 2,2 ₽', total: PRICING_CONFIG.fixed.handles },
      mounts: { total: mountsTotal },
      impostMount: { desc: '2 × 1,8 ₽', total: impostMountTotal },
      stretch: { total: PRICING_CONFIG.fixed.stretch },
      work: { formula: `60 + (63 + 151)×10%`, value: work },
    },
    variable: {
      profile: { lengthM: profileLengthM, pricePerMInput: 151, margin: v.marginProfile, pricePerM: profilePricePerMWithMargin, total: profileCost },
      cord: { lengthM: perimeterM, pricePerM: v.cordPerMeter, margin: v.marginCord, total: cordCost },
      impost: { lengthM: impostLengthM, pricePerM: impostPricePerM, margin: v.marginProfile, total: impostCost },
      mesh: { areaM2: areaCalc, pricePerM2: meshBase, margin: v.marginMesh, total: meshCost },
    },
    costTotal,
    clientPrice,
  }
}

function printRamochnaya(r) {
  console.log('\n' + '='.repeat(70))
  console.log(r.title)
  console.log('='.repeat(70))
  console.log('\nГеометрия:')
  console.log(`  Ширина × Высота: ${r.geometry.widthMm} × ${r.geometry.heightMm} мм`)
  console.log(`  Периметр: ${r.geometry.perimeterM} м`)
  console.log(`  Площадь: ${r.geometry.areaM2} м² (для расчёта: ${r.geometry.areaCalc} м²)`)
  console.log(`  Длина профиля (периметр − 0,24 м): ${r.geometry.profileLengthM.toFixed(3)} м`)
  console.log(`  Длина импоста (ширина − 48 мм): ${r.geometry.impostLengthM.toFixed(3)} м`)

  console.log('\n--- ФИКСИРОВАННЫЕ МАТЕРИАЛЫ (рамочная) ---')
  console.log(`  Уголки: 4 × ${r.fixed.corners.pricePerPiece} ₽ = ${r.fixed.corners.total} ₽`)
  console.log(`  Ручки ПВХ: ${r.fixed.handles.desc} = ${r.fixed.handles.total} ₽`)
  console.log(`  Крепление: ${r.fixed.mounts.desc} = ${r.fixed.mounts.total} ₽`)
  console.log(`  Крепление поперечины: ${r.fixed.impostMount.desc} = ${r.fixed.impostMount.total} ₽`)
  console.log(`  Стрейч: ${r.fixed.stretch.total} ₽`)
  console.log(`  Работа: ${r.fixed.work.formula} = ${r.fixed.work.value.toFixed(2)} ₽`)
  const fixedSum = r.fixed.corners.total + r.fixed.handles.total + r.fixed.mounts.total + r.fixed.impostMount.total + r.fixed.stretch.total + r.fixed.work.value
  console.log(`  ИТОГО фикс: ${fixedSum.toFixed(2)} ₽`)

  console.log('\n--- ПЕРЕМЕННЫЕ МАТЕРИАЛЫ ---')
  console.log(`  Профиль: ${r.variable.profile.lengthM.toFixed(3)} м × ${r.variable.profile.pricePerM} ₽/м.п. × ${r.variable.profile.margin} = ${r.variable.profile.total.toFixed(2)} ₽`)
  console.log(`  Шнур: ${r.variable.cord.lengthM} м × ${r.variable.cord.pricePerM} ₽/м × ${r.variable.cord.margin} = ${r.variable.cord.total.toFixed(2)} ₽`)
  console.log(`  Импост: ${r.variable.impost.lengthM.toFixed(3)} м × ${r.variable.impost.pricePerM} ₽/м.п. × ${r.variable.impost.margin} = ${r.variable.impost.total.toFixed(2)} ₽`)
  console.log(`  Полотно: ${r.variable.mesh.areaM2} м² × ${r.variable.mesh.pricePerM2} ₽/м² × ${r.variable.mesh.margin} = ${r.variable.mesh.total.toFixed(2)} ₽`)

  console.log('\n--- ИТОГО ---')
  console.log(`  Себестоимость: ${r.costTotal.toFixed(2)} ₽`)
  console.log(`  Цена клиента (× ${PRICING_CONFIG.markup.clientFactorFromCost}, округление до ${PRICING_CONFIG.markup.clientRound} ₽): ${r.clientPrice} ₽`)
}

function printVstavnaya(r) {
  console.log('\n' + '='.repeat(70))
  console.log(r.title)
  console.log('='.repeat(70))
  console.log('\nГеометрия:')
  console.log(`  Ширина × Высота: ${r.geometry.widthMm} × ${r.geometry.heightMm} мм`)
  console.log(`  Периметр: ${r.geometry.perimeterM} м`)
  console.log(`  Площадь: ${r.geometry.areaM2} м²`)
  console.log(`  Длина профиля (периметр − 0,24 м): ${r.geometry.profileLengthM.toFixed(3)} м`)
  console.log(`  Длина импоста: ${r.geometry.impostLengthM.toFixed(3)} м`)

  console.log('\n--- ФИКСИРОВАННЫЕ МАТЕРИАЛЫ (вставная VSN) ---')
  console.log(`  Уголки: 14,8 ₽/шт × 4 = ${r.fixed.corners.total} ₽`)
  console.log(`  Ручки ПВХ: ${r.fixed.handles.desc} = ${r.fixed.handles.total} ₽`)
  console.log(`  Крепление (+клепка): 30 ₽/шт × 4 = ${r.fixed.mounts.total} ₽`)
  console.log(`  Крепление поперечины: ${r.fixed.impostMount.desc} = ${r.fixed.impostMount.total} ₽`)
  console.log(`  Стрейч: ${r.fixed.stretch.total} ₽`)
  console.log(`  Работа: ${r.fixed.work.formula} = ${r.fixed.work.value.toFixed(2)} ₽`)
  const fixedSum = r.fixed.corners.total + r.fixed.handles.total + r.fixed.mounts.total + r.fixed.impostMount.total + r.fixed.stretch.total + r.fixed.work.value
  console.log(`  ИТОГО фикс: ${fixedSum.toFixed(2)} ₽`)

  console.log('\n--- ПЕРЕМЕННЫЕ МАТЕРИАЛЫ ---')
  console.log(`  Профиль VSN: ${r.variable.profile.lengthM.toFixed(3)} м × (${r.variable.profile.pricePerMInput} ₽/м.п. × ${r.variable.profile.margin}) = ${r.variable.profile.lengthM.toFixed(3)} × ${r.variable.profile.pricePerM.toFixed(2)} = ${r.variable.profile.total.toFixed(2)} ₽`)
  console.log(`  Шнур: ${r.variable.cord.lengthM} м × ${r.variable.cord.pricePerM} ₽/м = ${r.variable.cord.total.toFixed(2)} ₽`)
  console.log(`  Импост: ${r.variable.impost.lengthM.toFixed(3)} м × ${r.variable.impost.pricePerM} ₽/м.п. × ${r.variable.impost.margin} = ${r.variable.impost.total.toFixed(2)} ₽`)
  console.log(`  Полотно: ${r.variable.mesh.areaM2} м² × ${r.variable.mesh.pricePerM2} ₽/м² × ${r.variable.mesh.margin} = ${r.variable.mesh.total.toFixed(2)} ₽`)

  console.log('\n--- ИТОГО ---')
  console.log(`  Себестоимость: ${r.costTotal.toFixed(2)} ₽`)
  console.log(`  Цена клиента (× ${PRICING_CONFIG.markup.clientFactorFromCost}, округление до ${PRICING_CONFIG.markup.clientRound} ₽): ${r.clientPrice} ₽`)
}

printRamochnaya(breakdownRamochnaya())
printVstavnaya(breakdownVstavnaya())
console.log('\n')
