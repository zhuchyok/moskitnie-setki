import nodemailer from 'nodemailer'

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

    // Валидация данных
    const requiredFields = ['formName', 'formPhone', 'list_order', 'total_price_value']
    for (const field of requiredFields) {
      if (!body[field]) {
        throw createError({
          statusCode: 400,
          statusMessage: `Missing required field: ${field}`
        })
      }
    }

    // Валидация email формата (если есть)
    if (body.formEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.formEmail)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }

    // Валидация телефона
    if (!/^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$|^\+7\d{10}$/.test(body.formPhone.replace(/\s/g, ''))) {
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

    // Создание HTML письма
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2A6AB2;">Новый заказ на москитные сетки</h2>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Контактные данные:</h3>
          <p><strong>Имя:</strong> ${body.formName}</p>
          <p><strong>Телефон:</strong> ${body.formPhone}</p>
          ${body.formEmail ? `<p><strong>Email:</strong> ${body.formEmail}</p>` : ''}
          ${body.formAddress ? `<p><strong>Адрес:</strong> ${body.formAddress}</p>` : ''}
          ${body.formComment ? `<p><strong>Комментарий:</strong> ${body.formComment}</p>` : ''}
        </div>

        <div style="background: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px; margin: 20px 0;">
          <h3>Заказ:</h3>
          ${body.list_order.replace('<br>', '<br/>')}
          <p style="font-size: 18px; font-weight: bold; color: #2A6AB2; margin-top: 15px;">
            Итого: ${body.total_price_value} ₽
          </p>
        </div>

        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #1565c0;">
            <strong>Доставка:</strong> ${body.total_order_value || 'Не указана'}
          </p>
          ${body.measurement ? '<p style="margin: 8px 0 0 0; color: #1565c0;"><strong>Замер:</strong> Чебоксары и Новочебоксарск</p>' : ''}
          ${body.discount_type === 'srochnyi' ? '<p style="margin: 8px 0 0 0; color: #1565c0;"><strong>Приоритетный срочный заказ:</strong> 400 ₽</p>' : ''}
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
      subject: `Заказ №${Date.now()} - ${body.formName}`,
      html: htmlContent,
      replyTo: body.formEmail || body.formPhone
    })

    // Сохранение в БД через moskit-api
    try {
      const apiUrl = process.env.API_URL || 'http://moskit-api:8080'
      await $fetch(`${apiUrl}/api/dealer/orders`, {
        method: 'POST',
        body: {
          client_name: body.formName,
          client_phone: body.formPhone,
          client_address: body.formAddress,
          items: [], // TODO: Маппинг items из list_order если нужно детально
          delivery: body.total_order_value,
          measurement: body.measurement
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
