/**
 * Словари геоданных для российских городов.
 * Используются в LocalBusiness schema, geo meta и addressRegion.
 */

export interface CityGeo {
  lat: string
  lon: string
  region: string      // ISO 3166-2 (например RU-CU)
  regionName: string  // Читаемое название (например "Чувашская Республика")
}

const GEO_DATA: Record<string, CityGeo> = {
  'Чебоксары':        { lat: '56.1440', lon: '47.2490', region: 'RU-CU',  regionName: 'Чувашская Республика' },
  'Новочебоксарск':   { lat: '56.1106', lon: '47.4800', region: 'RU-CU',  regionName: 'Чувашская Республика' },
  'Алатырь':          { lat: '54.8485', lon: '46.5730', region: 'RU-CU',  regionName: 'Чувашская Республика' },
  'Москва':           { lat: '55.7558', lon: '37.6176', region: 'RU-MOW', regionName: 'Москва' },
  'Санкт-Петербург':  { lat: '59.9343', lon: '30.3351', region: 'RU-SPE', regionName: 'Санкт-Петербург' },
  'Новосибирск':      { lat: '54.9885', lon: '82.9207', region: 'RU-NSO', regionName: 'Новосибирская область' },
  'Екатеринбург':     { lat: '56.8389', lon: '60.6057', region: 'RU-SVE', regionName: 'Свердловская область' },
  'Казань':           { lat: '55.7964', lon: '49.1089', region: 'RU-TAT', regionName: 'Республика Татарстан' },
  'Нижний Новгород':  { lat: '56.2965', lon: '43.9361', region: 'RU-NIZ', regionName: 'Нижегородская область' },
  'Самара':           { lat: '53.1959', lon: '50.1501', region: 'RU-SAM', regionName: 'Самарская область' },
  'Уфа':              { lat: '54.7353', lon: '55.9587', region: 'RU-BA',  regionName: 'Республика Башкортостан' },
  'Ростов-на-Дону':   { lat: '47.2357', lon: '39.7015', region: 'RU-ROS', regionName: 'Ростовская область' },
  'Краснодар':        { lat: '45.0360', lon: '38.9754', region: 'RU-KDA', regionName: 'Краснодарский край' },
  'Пермь':            { lat: '58.0105', lon: '56.2502', region: 'RU-PER', regionName: 'Пермский край' },
  'Воронеж':          { lat: '51.6614', lon: '39.2003', region: 'RU-VOR', regionName: 'Воронежская область' },
  'Волгоград':        { lat: '48.7080', lon: '44.5133', region: 'RU-VGG', regionName: 'Волгоградская область' },
  'Саратов':          { lat: '51.5924', lon: '46.0340', region: 'RU-SAR', regionName: 'Саратовская область' },
  'Тюмень':           { lat: '57.1552', lon: '65.5344', region: 'RU-TYU', regionName: 'Тюменская область' },
  'Тольятти':         { lat: '53.5303', lon: '49.3461', region: 'RU-SAM', regionName: 'Самарская область' },
  'Ижевск':           { lat: '56.8527', lon: '53.2114', region: 'RU-UD',  regionName: 'Удмуртская Республика' },
  'Барнаул':          { lat: '53.3480', lon: '83.7798', region: 'RU-ALT', regionName: 'Алтайский край' },
  'Ульяновск':        { lat: '54.3282', lon: '48.3866', region: 'RU-ULY', regionName: 'Ульяновская область' },
  'Иркутск':          { lat: '52.2978', lon: '104.2964', region: 'RU-IRK', regionName: 'Иркутская область' },
  'Хабаровск':        { lat: '48.4802', lon: '135.0719', region: 'RU-KHA', regionName: 'Хабаровский край' },
  'Ярославль':        { lat: '57.6261', lon: '39.8845', region: 'RU-YAR', regionName: 'Ярославская область' },
  'Владивосток':      { lat: '43.1198', lon: '131.8869', region: 'RU-PRI', regionName: 'Приморский край' },
  'Томск':            { lat: '56.4977', lon: '84.9744', region: 'RU-TOM', regionName: 'Томская область' },
  'Оренбург':         { lat: '51.7727', lon: '55.0988', region: 'RU-ORE', regionName: 'Оренбургская область' },
  'Кемерово':         { lat: '55.3908', lon: '86.0449', region: 'RU-KEM', regionName: 'Кемеровская область' },
  'Рязань':           { lat: '54.6296', lon: '39.7417', region: 'RU-RYA', regionName: 'Рязанская область' },
  'Тула':             { lat: '54.1927', lon: '37.6174', region: 'RU-TUL', regionName: 'Тульская область' },
  'Пенза':            { lat: '53.1959', lon: '45.0186', region: 'RU-PNZ', regionName: 'Пензенская область' },
  'Липецк':           { lat: '52.6087', lon: '39.5994', region: 'RU-LIP', regionName: 'Липецкая область' },
  'Киров':            { lat: '58.6036', lon: '49.6680', region: 'RU-KIR', regionName: 'Кировская область' },
  'Курск':            { lat: '51.7373', lon: '36.1874', region: 'RU-KRS', regionName: 'Курская область' },
  'Ставрополь':       { lat: '45.0428', lon: '41.9734', region: 'RU-STA', regionName: 'Ставропольский край' },
  'Белгород':         { lat: '50.5997', lon: '36.5977', region: 'RU-BEL', regionName: 'Белгородская область' },
  'Астрахань':        { lat: '46.3480', lon: '48.0330', region: 'RU-AST', regionName: 'Астраханская область' },
  'Брянск':           { lat: '53.2521', lon: '34.3717', region: 'RU-BRY', regionName: 'Брянская область' },
  'Тверь':            { lat: '56.8587', lon: '35.9176', region: 'RU-TVE', regionName: 'Тверская область' },
  'Владимир':         { lat: '56.1290', lon: '40.4060', region: 'RU-VLA', regionName: 'Владимирская область' },
  'Архангельск':      { lat: '64.5401', lon: '40.5433', region: 'RU-ARK', regionName: 'Архангельская область' },
  'Калининград':      { lat: '54.7065', lon: '20.5110', region: 'RU-KGD', regionName: 'Калининградская область' },
  'Смоленск':         { lat: '54.7826', lon: '32.0453', region: 'RU-SMO', regionName: 'Смоленская область' },
  'Красноярск':       { lat: '56.0153', lon: '92.8932', region: 'RU-KYA', regionName: 'Красноярский край' },
  'Омск':             { lat: '54.9893', lon: '73.3682', region: 'RU-OMS', regionName: 'Омская область' },
  'Вологда':          { lat: '59.2239', lon: '39.8839', region: 'RU-VLG', regionName: 'Вологодская область' },
  'Череповец':        { lat: '59.1381', lon: '37.9015', region: 'RU-VLG', regionName: 'Вологодская область' },
  'Магнитогорск':     { lat: '53.3966', lon: '59.0390', region: 'RU-CHE', regionName: 'Челябинская область' },
  'Челябинск':        { lat: '55.1644', lon: '61.4368', region: 'RU-CHE', regionName: 'Челябинская область' },
  'Сочи':             { lat: '43.5855', lon: '39.7232', region: 'RU-KDA', regionName: 'Краснодарский край' },
  'Сургут':           { lat: '61.2540', lon: '73.3964', region: 'RU-KHM', regionName: 'Ханты-Мансийский АО' },
}

/**
 * Ищет геоданные города — сначала точное совпадение, потом частичное.
 */
export function getCityGeo(city: string | null | undefined): CityGeo | null {
  if (!city) return null
  if (GEO_DATA[city]) return GEO_DATA[city]
  // Частичный поиск (например "Нижний Новгород" → "Нижний Новгород")
  const key = Object.keys(GEO_DATA).find(k => city.includes(k) || k.includes(city))
  return key ? GEO_DATA[key] : null
}

/**
 * Composable — возвращает геоданные для текущего тенанта.
 * Безопасен: при неизвестном городе возвращает null-поля.
 */
export function useGeoData() {
  const tenant = useTenantStore()
  const geo = computed(() => getCityGeo(tenant.config.city))

  return {
    geoCoords: computed(() => geo.value ? { lat: geo.value.lat, lon: geo.value.lon } : null),
    geoRegionCode: computed(() => geo.value?.region ?? 'RU'),
    geoRegionName: computed(() => geo.value?.regionName ?? ''),
  }
}
