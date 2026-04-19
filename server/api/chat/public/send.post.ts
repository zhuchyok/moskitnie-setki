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
      return `• ${p.name}: от ${minPrice} руб.`
    }).join('\n') || ''
    
    // 3. Формируем системный промпт с динамическими данными
    const systemPrompt = `
    Ты — эмпатичный и профессиональный консультант компании "${dealerData.dealer_name || 'Сетки 21'}".
    
    ИНФОРМАЦИЯ О ТЕКУЩЕМ ДИЛЕРЕ:
    - Город: ${dealerData.city}
    - Телефон: ${dealerData.phone}
    - Режим работы: ${dealerData.branding?.working_hours || 'не указан'}
    
    АКТУАЛЬНЫЕ ЦЕНЫ (строго отсюда):
    ${pricesInfo}
    
    ВИДЫ СЕТОК:
    • Стандартная: базовая защита от насекомых.
    • Антикошка: сверхпрочное полотно (Pet Screen), выдерживает когти животных.
    • Антипыль: микроячейки, задерживают пыльцу и мелкую пыль.
    • Ультравью: прозрачное полотно, не портит вид из окна.
    • Вставная VSN: монтаж изнутри за 1 минуту без сверления.
    
    ТВОИ ПРАВИЛА:
    1. Будь тактичным. Никогда не упоминай смерть, болезни или негативные сценарии.
    2. Если домашних животных нет, просто скажи: "Для защиты от насекомых отлично подойдет Стандартная сетка".
    3. Цены называй только "ОТ ... рублей".
    4. ТЫ МОЖЕШЬ СЧИТАТЬ: если клиент спрашивает стоимость нескольких сеток, умножай цену "ОТ" на количество и называй итоговую сумму (например: "Три стандартные сетки будут стоить от 1500 рублей").
    5. Твоя цель — помочь выбрать и предложить консультацию/замер.
    6. Пиши кратко, по делу, без лишних вступлений. Используй переносы строк для списков.
    `

    // 4. Запрос к Ollama
    const response = await $fetch(OLLAMA_URL, {
      method: 'POST',
      body: {
        model: 'gemma2:2b',
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
