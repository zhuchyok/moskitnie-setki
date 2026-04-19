import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  
  // Проксируем запрос к Ollama напрямую с сервера (так как API Rust не имеет этого эндпоинта)
  // Используем IP шлюза Docker для обращения к хосту
  const OLLAMA_URL = 'http://172.19.0.1:11434/api/generate'
  
  try {
    // 1. Получаем данные дилера из API (Rust)
    const domain = body.domain.replace('www.', '')
    console.log('[AI_PROXY] Fetching config for domain:', domain)
    const dealerData = await $fetch(`${config.public.apiBase}/v1/tenant/config`, {
      headers: {
        'host': domain,
        'x-forwarded-host': domain
      }
    }) as any

    if (!dealerData) {
      return { content: 'Извините, не удалось загрузить данные дилера.' }
    }

    // 2. Формируем системный промпт
    const pricesInfo = dealerData.pricing?.mesh?.map((p: any) => `- ${p.name}: от ${Math.round(p.price * dealerData.markup?.client || 1)} руб.`).join('\n') || ''
    
    const systemPrompt = `
    Ты — умный ассистент компании по производству москитных сеток.
    Твоя цель: помогать клиентам, отвечать на вопросы о сетках и мягко подводить к заказу.
    
    ИНФОРМАЦИЯ О ТЕКУЩЕМ ДИЛЕРЕ:
    Название: ${dealerData.dealer_name}
    Город: ${dealerData.city}
    Телефон: ${dealerData.phone}
    Email: ${dealerData.email}
    Адрес: ${dealerData.address}
    Режим работы: ${dealerData.branding?.working_hours || 'не указан'}
    
    АКТУАЛЬНЫЕ ЦЕНЫ:
    ${pricesInfo}
    (Цены могут меняться в зависимости от размера, уточни у менеджера).
    
    СТИЛЬ ОБЩЕНИЯ:
    - Вежливый, профессиональный, лаконичный.
    - Используй только русский язык.
    - Если клиент хочет заказать, попроси его оставить телефон или воспользоваться калькулятором на сайте.
    
    ОГРАНИЧЕНИЯ:
    - Не выдумывай несуществующие услуги.
    - Если не знаешь ответа, предложи связаться по телефону ${dealerData.phone}.
    `

    // 3. Запрос к Ollama
    console.log('[AI_PROXY] System Prompt:', systemPrompt)
    const response = await $fetch(OLLAMA_URL, {
      method: 'POST',
      body: {
        model: 'qwen2.5:0.5b',
        prompt: body.message,
        system: systemPrompt,
        stream: false
      }
    }) as any

    return { content: response.response || 'Извините, я временно не могу ответить.' }
  } catch (e) {
    console.error('AI Chat Proxy Error:', e)
    return { content: 'Произошла ошибка при обращении к ИИ. Пожалуйста, попробуйте позже.' }
  }
})
