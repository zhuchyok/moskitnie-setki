/**
 * Standalone сервис POST /api/orders для приёма заказов с сайта Сетки 21.
 * Отправляет письмо через SMTP. По умолчанию — Timeweb (smtp.timeweb.ru).
 * Переменные: PORT=3010, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ORDER_EMAIL.
 */
import express from 'express'
import nodemailer from 'nodemailer'

const app = express()
app.use(express.json({ limit: '1mb' }))

// Простая защита от спама в памяти (без внешних зависимостей)
const ipCache = new Map()
const RATE_LIMIT_MS = 60 * 1000 // 1 минута
const MAX_REQUESTS = 3 // максимум 3 заявки в минуту с одного IP

function isSpam(ip) {
  const now = Date.now()
  const data = ipCache.get(ip) || { count: 0, firstRequest: now }
  
  if (now - data.firstRequest > RATE_LIMIT_MS) {
    data.count = 1
    data.firstRequest = now
    ipCache.set(ip, data)
    return false
  }
  
  data.count++
  ipCache.set(ip, data)
  return data.count > MAX_REQUESTS
}

// Очистка кэша каждые 10 минут
setInterval(() => {
  const now = Date.now()
  for (const [ip, data] of ipCache.entries()) {
    if (now - data.firstRequest > RATE_LIMIT_MS * 10) {
      ipCache.delete(ip)
    }
  }
}, 10 * 60 * 1000)

const PORT = Number(process.env.PORT) || 3010

function escapeHtml(str) {
  if (str == null || typeof str !== 'string') return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function normalizePhone(value) {
  const digits = String(value || '').replace(/\D/g, '')
  if (digits.length === 0) return null
  const normalized = digits.startsWith('8') ? '7' + digits.slice(1) : digits.startsWith('7') ? digits : '7' + digits
  return normalized.length === 11 ? normalized : null
}

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

app.options('/api/orders', (_req, res) => res.status(200).end())

app.post('/api/orders', async (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  if (isSpam(clientIp)) {
    console.warn(`Spam detected from IP: ${clientIp}`)
    return res.status(429).json({ 
      statusMessage: 'Слишком много запросов. Пожалуйста, подождите минуту.' 
    })
  }

  try {
    const body = req.body || {}
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
      dealer_email: body.dealer_email ? String(body.dealer_email).trim() : undefined
    }

    const required = ['formName', 'formPhone', 'list_order', 'total_price_value']
    for (const field of required) {
      if (!trimmed[field]) {
        return res.status(400).json({ statusMessage: `Missing required field: ${field}` })
      }
    }

    if (trimmed.formEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.formEmail)) {
      return res.status(400).json({ statusMessage: 'Invalid email format' })
    }

    if (trimmed.dealer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.dealer_email)) {
      console.warn(`Invalid dealer email format: ${trimmed.dealer_email}, falling back to default`)
    }

    const phoneNorm = normalizePhone(trimmed.formPhone)
    if (!phoneNorm) {
      return res.status(400).json({
        statusMessage: 'Неверный формат телефона. Введите 11 цифр, например +7 (927) 858-88-88'
      })
    }

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

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2A6AB2;">Новый заказ на москитные сетки</h2>
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
          <p style="font-size: 18px; font-weight: bold; color: #2A6AB2; margin-top: 15px;">Итого: ${escapeHtml(String(trimmed.total_price_value))} ₽</p>
        </div>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #1565c0;"><strong>Доставка:</strong> ${escapeHtml(trimmed.total_order_value || 'Не указана')}</p>
          ${trimmed.measurement ? '<p style="margin: 8px 0 0 0; color: #1565c0;"><strong>Замер:</strong> Чебоксары и Новочебоксарск</p>' : ''}
          ${trimmed.discount_type === 'srochnyi' ? '<p style="margin: 8px 0 0 0; color: #1565c0;"><strong>Приоритетный срочный заказ:</strong> 400 ₽</p>' : ''}
        </div>
        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">Заказ создан через сайт Сетки 21. Время: ${new Date().toLocaleString('ru-RU')}</p>
      </div>
    `

    const recipients = []
    if (trimmed.dealer_email) {
      recipients.push(trimmed.dealer_email)
    } else {
      // Fallback if no dealer email provided
      recipients.push(process.env.ORDER_EMAIL || 'info@setki21.ru')
    }

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: recipients.join(', '),
      subject: `Заказ №${Date.now()} - ${escapeHtml(trimmed.formName)}`,
      html: htmlContent,
      replyTo: trimmed.formEmail || trimmed.formPhone
    })

    // Сохраняем заказ в базу данных через moskit-api
    try {
      const moskitApiUrl = process.env.MOSKIT_API_URL || 'http://moskit-api:8080'
      const orderData = {
        client_name: trimmed.formName,
        client_phone: trimmed.formPhone,
        items: [
          {
            name: trimmed.list_order.replace(/<br\s*\/?>/gi, ', '),
            quantity: 1,
            price: Number(trimmed.total_price_value)
          }
        ]
      }
      
      const dbResponse = await fetch(`${moskitApiUrl}/api/v1/dealer/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      
      if (!dbResponse.ok) {
        console.error('Failed to save order to DB:', await dbResponse.text())
      } else {
        const dbResult = await dbResponse.json()
        console.log('Order saved to DB:', dbResult.order_number)
      }
    } catch (dbErr) {
      console.error('Error calling moskit-api:', dbErr)
      // Не прерываем основной поток, если база упала, так как письмо уже ушло
    }

    res.status(200).json({
      success: true,
      message: 'Заказ успешно отправлен!',
      orderId: Date.now()
    })
  } catch (err) {
    console.error('Order API error:', err)
    res.status(500).json({
      statusMessage: err.statusMessage || err.message || 'Internal server error'
    })
  }
})

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`setki21-orders-api listening on ${PORT}`)
})
