import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  
  // Используем IP шлюза Docker для обращения к хосту (Ollama)
  const OLLAMA_URL = 'http://172.19.0.1:11434/api/generate'
  
  try {
    const domain = body.domain.replace('www.', '')
    
    // 1. Получаем конфиг и цены дилера параллельно
    // Это гарантирует, что мы берем цены именно того дилера, на чьем сайте находится клиент
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
    // Берем базовую стоимость полотна, добавляем наценку дилера и умножаем на клиентский коэффициент
    const clientMarkup = pricingData.markup?.client || 2.13
    const dealerMultiplier = dealerData.margin_config?.city_multiplier || 1.0
    
    const calculateMinPrice = (basePrice: number) => {
      // Примерный расчет минимальной цены за стандартное окно (~0.75 кв.м.)
      // Включая профиль и комплектующие, как это делает калькулятор
      const area = 0.75 
      const estimatedTotal = (basePrice * area * clientMarkup * dealerMultiplier) + 400 // +400 за профиль/сборку
      return Math.round(estimatedTotal / 50) * 50 // Округляем до 50 руб для красоты
    }

    const pricesInfo = pricingData.mesh?.map((p: any) => {
      const minPrice = calculateMinPrice(p.price)
      return `- ${p.name}: от ${minPrice} руб.`
    }).join('\n') || ''
    
    // 3. Формируем системный промпт с динамическими данными
    const systemPrompt = `
    Ты — профессиональный консультант компании "${dealerData.dealer_name || 'Сетки 21'}".
    
    ИНФОРМАЦИЯ О ТЕКУЩЕМ ДИЛЕРЕ (строго используй эти данные):
    - Город: ${dealerData.city}
    - Телефон: ${dealerData.phone}
    - Режим работы: ${dealerData.branding?.working_hours || 'не указан'}
    
    АКТУАЛЬНЫЕ ЦЕНЫ ДЛЯ ЭТОГО ГОРОДА (рассчитаны на основе калькулятора):
    ${pricesInfo}
    
    ВИДЫ СЕТОК:
    - Стандартная: защита от насекомых, самый бюджетный вариант.
    - Антикошка: усиленное полотно, которое не порвет кошка когтями.
    - Антипыль: очень мелкая сетка, задерживает пыльцу (важно для аллергиков).
    - Ультравью: сетка с тонкими нитями, ее почти не видно на окне.
    - Вставная VSN: ставится изнутри, не нужно сверлить раму.
    
    ТВОИ ПРАВИЛА:
    1. Ты представляешь именно "${dealerData.dealer_name}".
    2. Цены называй только если спросят, и всегда говори "ОТ ... рублей", так как точная цена зависит от размера.
    3. Если клиент не знает что выбрать, спроси: есть ли дома животные или аллергики?
    4. Предлагай вызвать замерщика или оставить телефон для консультации.
    5. НЕ придумывай цены сам, бери только из списка выше.
    `

    // 4. Запрос к Ollama
    const response = await $fetch(OLLAMA_URL, {
      method: 'POST',
      body: {
        model: 'qwen2.5:0.5b',
        prompt: body.message,
        system: systemPrompt,
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 300
        }
      }
    }) as any

    return { content: response.response || 'Извините, я временно не могу ответить.' }
  } catch (e) {
    console.error('AI Chat Proxy Error:', e)
    return { content: 'Произошла ошибка при обращении к ИИ. Пожалуйста, попробуйте позже.' }
  }
})
