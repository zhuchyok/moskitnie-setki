import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  
  // Используем IP шлюза Docker для обращения к хосту (Ollama)
  const OLLAMA_URL = 'http://172.19.0.1:11434/api/generate'
  
  try {
    const domain = body.domain.replace('www.', '')
    
    // 1. Получаем конфиг и цены параллельно
    const [dealerData, pricingData] = await Promise.all([
      $fetch(`${config.public.apiBase}/v1/tenant/config`, {
        headers: { 'host': domain, 'x-forwarded-host': domain }
      }),
      $fetch(`${config.public.apiBase}/v1/pricing`, {
        headers: { 'host': domain }
      })
    ]) as [any, any]

    if (!dealerData) {
      return { content: 'Извините, не удалось загрузить данные дилера.' }
    }

    // 2. Формируем список цен
    const markup = pricingData.markup?.client || 2.13
    const pricesInfo = pricingData.mesh?.map((p: any) => 
      `- ${p.name}: от ${Math.round(p.price * markup)} руб.`
    ).join('\n') || ''
    
    // 3. Формируем системный промпт
    const systemPrompt = `
    Ты — профессиональный консультант компании по производству москитных сеток.
    Твоя задача: помогать клиентам выбрать подходящую сетку и отвечать на вопросы о ценах.
    
    ИНФОРМАЦИЯ О ТЕКУЩЕМ ДИЛЕРЕ:
    Название: ${dealerData.dealer_name || 'Сетки 21'}
    Город: ${dealerData.city}
    Телефон: ${dealerData.phone}
    Email: ${dealerData.email}
    Адрес: ${dealerData.address || 'указан на странице контактов'}
    Режим работы: ${dealerData.branding?.working_hours || 'не указан'}
    
    АКТУАЛЬНЫЕ ЦЕНЫ (за 1 кв.м. изделия):
    ${pricesInfo}
    
    ВАЖНЫЕ ПРАВИЛА:
    - Отвечай вежливо и только на русском языке.
    - Если клиент спрашивает цену, называй цену из списка выше.
    - Всегда уточняй, что окончательная стоимость зависит от точных размеров и типа крепления.
    - Предлагай вызвать замерщика или воспользоваться калькулятором на сайте для точного расчета.
    - Если клиент хочет заказать, попроси его оставить контактный телефон.
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
          temperature: 0.7,
          num_predict: 200
        }
      }
    }) as any

    return { content: response.response || 'Извините, я временно не могу ответить.' }
  } catch (e) {
    console.error('AI Chat Proxy Error:', e)
    return { content: 'Произошла ошибка при обращении к ИИ. Пожалуйста, попробуйте позже.' }
  }
})
