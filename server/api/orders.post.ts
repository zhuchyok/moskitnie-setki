import nodemailer from 'nodemailer'
import { escapeHtml } from '../utils/escape-html'

/** Нормализация телефона: только цифры, 8 в начале заменяем на 7, ожидаем 11 цифр (РФ). */
function normalizePhone(value: string): string | null {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 0) return null
  const normalized = digits.startsWith('8') ? '7' + digits.slice(1) : digits.startsWith('7') ? digits : '7' + digits
  return normalized.length === 11 ? normalized : null
}

export default defineEventHandler(async (event) => {
  // CORS headers
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')

  if (event.method === 'OPTIONS') {
    return { status: 'ok' }
  }

  try {
    const body = await readBody(event)

    // trim всех строковых полей
    const trimmed = {
      formName: String(body.formName ?? '').trim(),
      formPhone: String(body.formPhone ?? '').trim(),
      formEmail: body.formEmail ? String(body.formEmail).trim() : undefined,
      formAddress: body.formAddress ? String(body.formAddress).trim() : undefined,
      formComment: body.formComment ? String(body.formComment).trim() : undefined,
      list_order: String(body.list_order ?? '').trim(),
      total_price_value: body.total_price_value,
      total_order_value: body.total_order_value ? String(body.total_order_value).trim() : undefined,
      measurement: body.measurement,
      discount_type: body.discount_type,
      // Валидация UUID: Rust API упадет с 400, если передать пустую строку или невалидный UUID
      dealer_id: (body.dealer_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.dealer_id)) ? body.dealer_id : undefined,
      branch_id: (body.branch_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.branch_id)) ? body.branch_id : undefined,
      items: Array.isArray(body.items) ? body.items : []
    }

    console.log('Sending order to Rust API:', JSON.stringify({
      client_name: trimmed.formName,
      dealer_id: trimmed.dealer_id,
      branch_id: trimmed.branch_id,
      items_count: trimmed.items.length
    }))

  // Валидация данных
  const requiredFields = ['formName', 'formPhone', 'list_order', 'total_price_value']
  for (const field of requiredFields) {
    if (!trimmed[field as keyof typeof trimmed] && field !== 'items' && field !== 'dealer_id') {
      throw createError({
        statusCode: 400,
        statusMessage: `Missing required field: ${field}`
      })
    }
  }

    // Валидация email формата (если есть)
    if (trimmed.formEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.formEmail)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }

    // Валидация телефона: любые скобки/дефисы/пробелы — нормализуем до 11 цифр
    const phoneNorm = normalizePhone(trimmed.formPhone)
    if (!phoneNorm) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Неверный формат телефона. Введите 11 цифр, например +7 (927) 858-88-88'
      })
    }

    // 1. Сохранение в БД через moskit-api (ПЕРВООЧЕРЕДНО)
    let orderIdFromDb = Date.now()
    let orderNumberFromDb = `WEB-${orderIdFromDb}`

    try {
      const apiUrl = process.env.API_URL || 'http://moskit-api:8080'
      const dbResponse: any = await $fetch(`${apiUrl}/api/v1/dealer/orders`, {
        method: 'POST',
        body: {
          client_name: trimmed.formName,
          client_phone: phoneNorm,
          client_address: trimmed.formAddress,
      dealer_id: trimmed.dealer_id,
      branch_id: trimmed.branch_id,
      items: trimmed.items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            params: item.params
          }))
        }
      })

      if (dbResponse && dbResponse.order_id) {
        orderIdFromDb = dbResponse.order_id
        orderNumberFromDb = dbResponse.order_number || orderNumberFromDb
      }
    } catch (dbError: any) {
      console.error('CRITICAL: Failed to save order to DB:', dbError)
      // Если БД недоступна — прерываем процесс, чтобы не вводить в заблуждение
      throw createError({
        statusCode: 503,
        statusMessage: 'Сервис временно недоступен. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.'
      })
    }

    // 2. Настройка SMTP — тот же провайдер, что и для callback/contact (Timeweb: 465, secure)
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.timeweb.ru',
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    // Создание HTML письма (все пользовательские данные экранированы)
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2A6AB2;">Новый заказ №${orderNumberFromDb}</h2>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Контактные данные:</h3>
          <p><strong>Имя:</strong> ${escapeHtml(trimmed.formName)}</p>
          <p><strong>Телефон:</strong> ${escapeHtml(trimmed.formPhone)}</p>
          ${trimmed.formEmail ? `<p><strong>Email:</strong> ${escapeHtml(trimmed.formEmail)}</p>` : ''}
          ${trimmed.formAddress ? `<p><strong>Адрес:</strong> ${escapeHtml(trimmed.formAddress)}</p>` : ''}
          ${trimmed.formComment ? `<p><strong>Комментарий:</strong> ${escapeHtml(trimmed.formComment)}</p>` : ''}
        </div>

        <div style="background: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px; margin: 20px 0;">
          <h3>Заказ:</h3>
          ${trimmed.list_order.split(/<br\s*\/?>/gi).map(s => escapeHtml(s)).join('<br/>')}
          <p style="font-size: 18px; font-weight: bold; color: #2A6AB2; margin-top: 15px;">
            Итого: ${escapeHtml(String(trimmed.total_price_value))} ₽
          </p>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #1565c0;">
            <strong>Доставка:</strong> ${escapeHtml(trimmed.total_order_value || 'Не указана')}
          </p>
          ${trimmed.measurement ? '<p style="margin: 8px 0 0 0; color: #1565c0;"><strong>Замер:</strong> Чебоксары и Новочебоксарск</p>' : ''}
          ${trimmed.discount_type === 'srochnyi' ? '<p style="margin: 8px 0 0 0; color: #1565c0;"><strong>Приоритетный срочный заказ:</strong> 400 ₽</p>' : ''}
        </div>

        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          Заказ создан автоматически через сайт Сетки 21<br>
          Номер в системе: ${orderNumberFromDb}<br>
          Время создания: ${new Date().toLocaleString('ru-RU')}
        </p>
      </div>
    `

    // Отправка email
    // Приоритет: email дилера из конфига -> основной email дилера -> email из окружения -> дефолт
    const recipientEmail = body.dealer_email || body.formDealerEmail || process.env.ORDER_EMAIL || 'info@setki21.ru'
    
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: recipientEmail,
      subject: `Заказ №${orderNumberFromDb} - ${escapeHtml(trimmed.formName)}`,
      html: htmlContent,
      replyTo: trimmed.formEmail || trimmed.formPhone
    })

    return {
      success: true,
      message: 'Заказ успешно отправлен!',
      orderId: orderIdFromDb,
      orderNumber: orderNumberFromDb
    }

  } catch (error: any) {
    console.error('Order API error:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
