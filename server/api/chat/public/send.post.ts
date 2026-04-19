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
      const area = 0.75 
      const estimatedTotal = (basePrice * area * clientMarkup * dealerMultiplier) + 400 
      return Math.round(estimatedTotal / 50) * 50 
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
    
    ДАННЫЕ ДЛЯ РАСЧЕТА (используй их для точного расчета):
    - Наценка клиента: ${clientMarkup}
    - Множитель города: ${dealerMultiplier}
    - Стоимость профиля и сборки (фикс): 400 руб.
    
    БАЗОВЫЕ ЦЕНЫ ПОЛОТНА (за 1 м2):
    ${pricingData.mesh?.map((p: any) => `• ${p.name}: ${p.price} руб.`).join('\n')}
    
    ФОРМУЛА РАСЧЕТА (КАК В КАЛЬКУЛЯТОРЕ):
    1. Если клиент пишет размеры в мм (например, 700 на 1000), переведи их в метры (0.7м и 1.0м).
    2. Цена = (Базовая_цена_полотно * Ширина_м * Высота_м * ${clientMarkup} * ${dealerMultiplier}) + 400
    3. Округляй результат до ближайших 50 рублей.
    
    ВАЖНО: Сетка 700х1000 мм — это 0.7м х 1.0м. Не считай в километрах!
    Результат должен быть в районе 1000-3000 рублей, а не миллионы.
    
    ВИДЫ СЕТОК:
    • Стандартная: базовая защита от насекомых.
    • Антикошка: сверхпрочное полотно (Pet Screen), выдерживает когти животных.
    • Антипыль: микроячейки, задерживают пыльцу и мелкую пыль.
    • Ультравью: прозрачное полотно, не портит вид из окна.
    • Вставная VSN: монтаж изнутри за 1 минуту без сверления.
    
    ТВОИ ПРАВИЛА:
    1. Будь тактичным. Никогда не упоминай смерть, болезни или негативные сценарии.
    2. МЫ ПРОИЗВОДИМ И УСТАНАВЛИВАЕМ: Мы компания полного цикла. Мы делаем замер, изготовление, доставку и установку. Никогда не говори, что мы не устанавливаем!
    3. ЦЕНА ВКЛЮЧАЕТ: В цену "от ... руб" уже заложена стоимость самой сетки. Замер и установка могут оплачиваться отдельно (уточняй у менеджера), но мы их ОБЯЗАТЕЛЬНО делаем.
    4. ЕСЛИ КЛИЕНТ ХОЧЕТ ЗАМЕР или готов заказать: Сразу проси его написать номер телефона. Скажи: "Для оформления заявки на замер, пожалуйста, оставьте ваш номер телефона, и наш менеджер свяжется с вами в ближайшее время".
    5. ТЫ ДОЛЖЕН ПОМНИТЬ КОНТЕКСТ: Если клиент уже называл размеры выше, не переспрашивай их! Используй информацию из истории диалога.
    6. Если клиент называет размеры, ТЫ ОБЯЗАН ПОСЧИТАТЬ точную цену по формуле выше.
    7. СКРЫВАЙ ПРОЦЕСС РАСЧЕТА: Не показывай формулу и промежуточные вычисления клиенту. Называй только итоговую сумму.
    8. Твоя цель — помочь выбрать и подвести к замеру/заказу.
    9. Пиши кратко, по делу. Используй переносы строк.
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
