import nodemailer from 'nodemailer'
import { validateCallbackBody } from '../utils/contact-validation'
import { escapeHtml } from '../utils/escape-html'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')

  if (event.method === 'OPTIONS') {
    return { status: 'ok' }
  }

  try {
    const raw = await readBody(event)
    const body = {
      name: raw?.name ? String(raw.name).trim() : '',
      phone: raw?.phone ? String(raw.phone).trim() : '',
      agreePrivacy: raw?.agreePrivacy === true,
      toEmail: raw?.toEmail ? String(raw.toEmail).trim() : '',
      city: raw?.city ? String(raw.city).trim() : '',
      domain: raw?.domain ? String(raw.domain).trim() : '',
      extra_services: raw?.extra_services ? String(raw.extra_services).trim() : ''
    }

    const validation = validateCallbackBody({
      name: body.name,
      phone: body.phone,
      agreePrivacy: body.agreePrivacy,
      toEmail: body.toEmail || undefined
    })

    if (!validation.ok) {
      throw createError({
        statusCode: validation.statusCode,
        statusMessage: validation.statusMessage
      })
    }

    const toEmail = validation.toEmail || process.env.CONTACT_EMAIL || 'info@setki21.ru'

    if (process.env.NODE_ENV === 'production' && (!process.env.SMTP_USER || !process.env.SMTP_PASS)) {
      console.error('Callback API: SMTP_USER/SMTP_PASS not set in production — emails will not be sent')
      throw createError({
        statusCode: 503,
        statusMessage: 'Сервис отправки заявок временно недоступен. Обратитесь к администратору.'
      })
    }

    const nm = nodemailer?.default ?? nodemailer
    const createTransportFn = nm?.createTransport
    const useStub = process.env.NODE_ENV === 'test' || typeof createTransportFn !== 'function'
    if (useStub) {
      console.warn('Callback API: using STUB transporter — email will NOT be sent')
    }
    // Тот же SMTP, что и для заказов сеток (orders): из env, порт 465 = secure (Timeweb и др.)
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10)
    const transporter = useStub
      ? { sendMail: async () => {} }
      : createTransportFn!.call(nm, {
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
        <h2 style="color: #2A6AB2;">Заявка на обратный звонок</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Имя:</strong> ${escapeHtml(body.name)}</p>
          <p><strong>Телефон:</strong> ${escapeHtml(body.phone)}</p>
          ${body.city ? `<p><strong>Город:</strong> ${escapeHtml(body.city)}</p>` : ''}
          ${body.domain ? `<p><strong>Сайт:</strong> ${escapeHtml(body.domain)}</p>` : ''}
          ${body.extra_services ? `<p><strong>🎁 Также интересует:</strong> ${escapeHtml(body.extra_services)}</p>` : ''}
        </div>
        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          Заявка создана через сайт. Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} (МСК)
        </p>
      </div>
    `

    const subject = `Заявка на обратный звонок — ${body.city || ''} ${body.domain || ''}`.replace(/\s+/g, ' ').trim() || `Заявка на обратный звонок — ${escapeHtml(body.name)}`

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: toEmail,
      subject: subject,
      html: htmlContent
    })

    if (!useStub) {
      console.log('Callback API: email sent to', toEmail)
    }
    return {
      success: true,
      message: 'Заявка успешно отправлена!'
    }
  } catch (error: any) {
    console.error('Callback API error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
