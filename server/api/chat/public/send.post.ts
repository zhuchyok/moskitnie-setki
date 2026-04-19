import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  
  // Используем IP шлюза Docker для обращения к хосту (Ollama)
  const OLLAMA_URL = 'http://172.19.0.1:11434/api/generate'
  
  try {
    const domain = body.domain.replace('www.', '')
    
    // 1. Получаем конфиг и цены дилера параллельно
    const [dealerData, pricingData] = await Promise.all([
      $fetch(`${config.public.apiBase}/v1/tenant/config`, {
        headers: { 'host': domain, 'x-forwarded-host': domain }
      }),
      $fetch(`${config.public.apiBase}/v1/pricing`, {
        headers: { 'host': domain }
      })
    ]) as [any, any]

    if (!dealerData || !pricingData) {
      return { content: 'Извините, не удалось загрузить данные дилера.' }
    }

    // 2. Логика расчета цен "ОТ" как в калькуляторе
    const clientMarkup = pricingData.markup?.client || 2.13
    const dealerMultiplier = dealerData.margin_config?.city_multiplier || 1.0
    
    const calculateMinPrice = (basePrice: number) => {
      const area = 0.7 
      // Профиль: (0.7 + 1.0) * 2 = 3.4 м.п.
      // Цена профиля ~60 руб/мп. 3.4 * 60 = 204 руб.
      // Комплектующие (уголки, ручки, шнур, крепления) ~150 руб.
      // Итого комплектующие + профиль ~350 руб.
      const componentsBase = 350
      const estimatedTotal = ((basePrice * area) + componentsBase) * clientMarkup * dealerMultiplier
      return Math.round(estimatedTotal / 50) * 50 
    }

    const pricesInfo = pricingData.mesh?.map((p: any) => {
      const minPrice = calculateMinPrice(p.price)
      return `• ${p.name}: от ${minPrice} руб.`
    }).join('\n') || ''
    
    // 3. Формируем системный промпт с динамическими данными
    const systemPrompt = `
    Ты — эмпатичный и профессиональный консультант компании "${dealerData.dealer_name || 'Сетки 21'}".
    
    ИНФОРМАЦИЯ О ТЕКУЩЕМ ДИЛЕРЕ (строго используй эти данные):
    - Название: ${dealerData.dealer_name}
    - Город: ${dealerData.city}
    - Телефон: ${dealerData.phone}
    - Адреса офисов: ${dealerData.contacts?.branches?.map((b: any) => b.address).join(', ') || dealerData.address || 'уточняйте у менеджера'}
    
    ДАННЫЕ ДЛЯ РАСЧЕТА:
    - Наценка клиента: ${clientMarkup}
    - Множитель города: ${dealerMultiplier}
    - Стоимость профиля и сборки (фикс): 400 руб.
    
    БАЗОВЫЕ ЦЕНЫ ПОЛОТНА (за 1 м2):
    ${pricingData.mesh?.map((p: any) => `• ${p.name}: ${p.price} руб.`).join('\n')}
    
    ФОРМУЛА РАСЧЕТА (КАК В КАЛЬКУЛЯТОРЕ):
    1. Перевод в метры: 700мм -> 0.7м, 1000мм -> 1.0м.
    2. Периметр профиля: (Ширина + Высота) * 2. Пример: (1.0 + 1.0) * 2 = 4.0 м.п.
    3. Стоимость материалов = (Цена_полотна * Площадь) + (Цена_профиля_60руб * Периметр) + 150руб_комплектующие.
    4. Итоговая цена = Стоимость_материалов * ${clientMarkup} * ${dealerMultiplier}.
    5. Округляй до 50 рублей.
    
    ТВОИ ПРАВИЛА:
    1. ТЫ УЖЕ ЗНАЕШЬ ГОРОД: Город — ${dealerData.city}. ЗАПРЕЩЕНО спрашивать у клиента город, ты должен сразу предлагать услуги в этом городе.
    2. ЕСЛИ КЛИЕНТ НАПИСАЛ ЦИФРЫ (например "1000 на 1000"): Это размеры! Сразу считай цену по формуле выше для Стандартной сетки. ЗАПРЕЩЕНО переспрашивать размеры или задавать лишние вопросы!
    3. МЫ ПРОИЗВОДИМ И УСТАНАВЛИВАЕМ: Мы компания полного цикла. Мы делаем замер, изготовление, доставку и установку. Никогда не говори, что мы не устанавливаем!
    4. СКРЫВАЙ ПРОЦЕСС РАСЧЕТА: ЗАПРЕЩЕНО показывать формулы. Клиент должен видеть только результат.
    5. ЕСЛИ КЛИЕНТ ХОЧЕТ ЗАМЕР или готов заказать: Сразу проси его написать номер телефона.
    6. ТЫ ДОЛЖЕН ПОМНИТЬ КОНТЕКСТ: Если клиент уже называл размеры выше, не переспрашивай их!
    7. Твоя цель — помочь выбрать и подвести к замеру/заказу.
    8. Пиши кратко, по делу. Используй переносы строк.
    `

    // 4. Запрос к Ollama
    const response = await $fetch(OLLAMA_URL, {
      method: 'POST',
      body: {
        model: 'gemma2:2b',
        prompt: body.history 
          ? body.history.map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n') + `\nUser: ${body.message}`
          : body.message,
        system: systemPrompt,
        stream: false,
        options: {
          temperature: 0.1,
          num_predict: 400,
          top_p: 0.9
        }
      }
    }) as any

    return { content: response.response || 'Извините, я временно не могу ответить.' }
  } catch (e) {
    console.error('AI Chat Proxy Error:', e)
    return { content: 'Произошла ошибка при обращении к ИИ. Пожалуйста, попробуйте позже.' }
  }
})
