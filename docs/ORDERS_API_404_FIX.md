# Устранение 404 на POST /api/orders

На проде запросы с сайта идут на **atra-kernel:8081**, где нет маршрута `POST /api/orders`. Поэтому форма «Заказать» возвращает **404**.

## Решение: отдельный сервис orders-api

В репозитории добавлен **standalone-сервис** `orders-api` (приём заказа и отправка письма по SMTP). Его нужно запустить на VDS и направить на него только `POST /api/orders`.

### 1. Запуск orders-api на VDS

**Локально (проверка):**
```bash
cd setki-21/orders-api
npm install
SMTP_HOST=smtp.mail.ru SMTP_USER=... SMTP_PASS=... ORDER_EMAIL=info@setki21.ru node index.js
# Сервис слушает порт 3010
```

**На VDS (Docker):**

- Собрать образ в репозитории setki-21:
  ```bash
  cd /path/to/setki-21/orders-api
  docker build -t setki21-orders-api:latest .
  ```

- Добавить сервис в docker-compose на VDS (или запустить отдельно):
  ```yaml
  setki21-orders-api:
    image: setki21-orders-api:latest
    build: ./orders-api   # если билд на VDS из выкаченного setki-21
    ports:
      - "3010:3010"
    environment:
      SMTP_HOST: smtp.mail.ru
      SMTP_USER: "ваш_логин"
      SMTP_PASS: "ваш_пароль"
      ORDER_EMAIL: info@setki21.ru
    restart: unless-stopped
  ```

- Переменные: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `ORDER_EMAIL` (куда слать заказы).

**Почта на Timeweb** (не Mail.ru): по умолчанию в orders-api используется `smtp.timeweb.ru`, порт 465 (SSL). В `.env` укажи `SMTP_HOST=smtp.timeweb.ru`, `SMTP_PORT=465`, `SMTP_USER=info@setki21.ru`, `SMTP_PASS=пароль_от_ящика`, `ORDER_EMAIL=info@setki21.ru`. Документация Timeweb: [Настройки SMTP](https://timeweb.com/ru/docs/virtualnyj-hosting/cms/otpravka-pochty-s-sajta-cherez-smtp/).

### 2. Настройка NPM (прокси)

Чтобы `POST /api/orders` обрабатывал именно orders-api, в NPM для **www.setki21.ru** нужно добавить **Custom Location** **до** общего `/api`:

| Custom Location | Forward to           | Комментарий                    |
|-----------------|----------------------|--------------------------------|
| **/api/orders** | setki21-orders-api:3010 | Сначала — более конкретный путь |
| /api            | atra-kernel:8081     | Остальные запросы /api         |
| /health         | atra-kernel:8081     | По желанию                     |

Порядок важен: сначала правило для `/api/orders`, потом для `/api`.

### 3. Итог

- Сайт (статический) — как раньше, setki21-site:80.
- `POST https://www.setki21.ru/api/orders` → NPM → **setki21-orders-api:3010** → письмо уходит на ORDER_EMAIL.
- Остальные запросы `/api/*` по-прежнему идут на atra-kernel:8081.

После этого ошибка **404 на POST /api/orders** исчезнет, заявки начнут отправляться.
