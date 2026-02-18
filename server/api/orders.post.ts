import nodemailer from 'nodemailer'
import { escapeHtml } from '../utils/escape-html'

/** Российские форматы: +7 (XXX) XX-XX-XX, +7 (XXXX) XX-XX-XX, +79XXXXXXXXX */
const PHONE_REGEX = /^\+7\s?\(\d{3,4}\)\s?\d{2,3}-\d{2}-\d{2}$|^\+7\d{10}$/

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
      discount_type: body.discount_type
    }

    // Валидация данных
    const requiredFields = ['formName', 'formPhone', 'list_order', 'total_price_value']
    for (const field of requiredFields) {
      if (!trimmed[field as keyof typeof trimmed]) {
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

    // Валидация телефона (российские форматы)
    const phoneNorm = trimmed.formPhone.replace(/\s/g, '')
    if (!PHONE_REGEX.test(phoneNorm)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid phone format'
      })
    }

    // Настройка SMTP
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.mail.ru',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    // Создание HTML письма (все пользовательские данные экранированы)
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
          Время создания: ${new Date().toLocaleString('ru-RU')}
        </p>
      </div>
    `

    // Отправка email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ORDER_EMAIL || 'info@setki21.ru',
      subject: `Заказ №${Date.now()} - ${escapeHtml(trimmed.formName)}`,
      html: htmlContent,
      replyTo: trimmed.formEmail || trimmed.formPhone
    })

    // Сохранение в БД через moskit-api
    try {
      const apiUrl = process.env.API_URL || 'http://moskit-api:8080'
      await $fetch(`${apiUrl}/api/dealer/orders`, {
        method: 'POST',
        body: {
          client_name: trimmed.formName,
          client_phone: trimmed.formPhone,
          client_address: trimmed.formAddress,
          items: [], // TODO: Маппинг items из list_order если нужно детально
          delivery: trimmed.total_order_value,
          measurement: trimmed.measurement
        }
      })
    } catch (dbError) {
      console.error('Failed to save order to DB:', dbError)
      // Не бросаем ошибку, так как email уже ушел
    }

    return {
      success: true,
      message: 'Заказ успешно отправлен!',
      orderId: Date.now()
    }

  } catch (error: any) {
    console.error('Order API error:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
