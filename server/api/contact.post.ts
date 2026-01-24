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

    // Валидация данных для контактной формы
    if (!body.name || !body.phone) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and phone are required'
      })
    }

    // Валидация телефона
    if (!/^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$|^\+7\d{10}$/.test(body.phone.replace(/\s/g, ''))) {
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

    // Создание HTML письма для контактов
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2A6AB2;">Заявка на обратный звонок</h2>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Контактные данные:</h3>
          <p><strong>Имя:</strong> ${body.name}</p>
          <p><strong>Телефон:</strong> ${body.phone}</p>
          ${body.message ? `<p><strong>Сообщение:</strong> ${body.message}</p>` : ''}
        </div>

        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          Заявка создана автоматически через сайт Сетки 21<br>
          Время создания: ${new Date().toLocaleString('ru-RU')}
        </p>
      </div>
    `

    // Отправка email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || 'info@setki21.ru',
      subject: `Заявка на звонок - ${body.name}`,
      html: htmlContent,
      replyTo: body.phone
    })

    return {
      success: true,
      message: 'Заявка успешно отправлена!'
    }

  } catch (error: any) {
    console.error('Contact API error:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
