# Аудит сайта Сетки 21 (branch `studio`)

**Дата:** 18 февраля 2026  
**Проект:** `/Users/bikos/Documents/dev/setki-21`  
**Стек:** Nuxt 4, Vue 3, Pinia, Tailwind CSS, Node.js, Docker

---

## Резюме

Проведён комплексный аудит с привлечением экспертов:
- **Игорь (Backend/DevOps):** технические ошибки, производительность, Docker, API
- **Максим (ML/Data):** логика расчётов, поток данных, согласованность цен
- **Анна (QA):** UI/UX, адаптивность, кроссбраузерность, пользовательский поток

**Критические находки:** 2 (ошибка prerender, неверный canonical URL)  
**Важные:** 5  
**Рекомендации:** 12+

---

## 1. SEO

### ✅ Что сделано хорошо

| Элемент | Статус |
|---------|--------|
| Meta viewport, charset | ✅ |
| robots: index, follow | ✅ |
| theme-color | ✅ |
| og:type, og:image, og:locale | ✅ |
| twitter:card | ✅ |
| manifest.json | ✅ |
| dns-prefetch для Yandex | ✅ |
| robots.txt с Sitemap | ✅ |
| Sitemap XML | ✅ |
| JSON-LD (LocalBusiness, BreadcrumbList, FAQ) | ✅ |
| Semantic HTML (header, main, footer, nav, section) | ✅ |
| Хлебные крошки с aria-label | ✅ |
| Страничные useSeoMeta/useHead | ✅ |

### ❌ Проблемы

#### 1.1 Неверный canonical URL в SeoHead (критично)

**Файл:** `components/SeoHead.vue:36`

```javascript
const baseUrl = 'https://moskitnie-setki.ru'  // ❌ Неверный домен
```

**Фактический домен:** `https://www.setki21.ru`  
**Рекомендация:** Использовать единый источник (например `config.public.siteUrl` или константа) и заменить на `https://www.setki21.ru`.

#### 1.2 Sitemap vs prerender

- **Sitemap** содержит: `/`, `/antimoshka`, `/antikoshka`, `/antipyl`, `/ultravyu`, `/vstavnye`, `/remont`, `/privacy`, `/contacts`, `/delivery`, `/karta-sajta`
- **Prerender** в `nuxt.config.ts`: те же маршруты без `/contacts` в списке (но contacts есть в prerender по output)
- **Отсутствует в sitemap:** `/dealers`, `/admin/*` (админка не должна индексироваться)

**Рекомендация:** Добавить в sitemap `changefreq` и `priority` для ключевых страниц; исключить `/admin/` из индексации через robots.

#### 1.3 Несогласованность URL в sitemap

- Sitemap: `https://www.setki21.ru/antimoshka/` (с trailing slash)
- Nuxt по умолчанию: без trailing slash  
**Рекомендация:** Привести к единому формату (без trailing slash).

---

## 2. Технические ошибки

### 2.1 Критическая ошибка prerender (SSR 500)

**Симптом:** При `npm run build` страницы с калькулятором (`/`, `/antimoshka`, `/antikoshka`, `/antipyl`, `/ultravyu`, `/vstavnye`) падают с 500:

```
Cannot read properties of undefined (reading 'standart')
  at computeCost (order-BpUHRIPq.mjs:306:29)
  at Proxy.currentPrice
```

**Причина:** При prerender `pricingStore.pricing` ещё `null` (API вызывается в `onMounted` на клиенте). В `services/pricing.ts` при определённых условиях `meshPerM2` может быть `undefined`, и обращение к `meshPerM2.standart` вызывает ошибку.

**Файл:** `services/pricing.ts:242-243`, `computeCost` / `computeCostVstavnaya`:

```javascript
const meshPerM2 = v.meshPerM2 ?? PRICING_CONFIG.variable.meshPerM2
const meshBase = meshPerM2[meshType] ?? meshPerM2.standart  // ❌ meshPerM2 может быть undefined
```

**Рекомендация:** Добавить защиту:

```javascript
const meshPerM2 = v?.meshPerM2 ?? PRICING_CONFIG?.variable?.meshPerM2 ?? { standart: 63, antimoshka: 265, ultravyu: 295, antikoshka: 414, antipyl: 645 }
const meshBase = meshPerM2?.[meshType] ?? meshPerM2?.standart ?? 63
```

Либо обернуть `Calculator` в `<ClientOnly>` на страницах с калькулятором, чтобы не рендерить его при SSR.

### 2.2 Валидация телефона в orders API

**Файл:** `server/api/orders.post.ts:36`

```javascript
if (!/^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$|^\+7\d{10}$/.test(body.formPhone.replace(/\s/g, ''))) {
```

Проблемы:
- `replace(/\s/g, '')` удаляет пробелы, но первый формат `+7 (XXX) XXX-XX-XX` после замены станет `+7(XXX)XXX-XX-XX` — regex может не совпадать с ожидаемым
- Формат `8 9XX XXX XX XX` (типичный для России) не поддерживается

**Рекомендация:** Нормализовать `8` → `+7`, убрать пробелы/скобки/тире и проверять `^\+7\d{10}$`. Или использовать общую валидацию из `server/utils/contact-validation.ts`.

### 2.3 CORS и безопасность

**Файл:** `server/api/orders.post.ts:5`

```javascript
setHeader(event, 'Access-Control-Allow-Origin', '*')
```

**Рекомендация:** В production ограничить `Access-Control-Allow-Origin` конкретным доменом (например `https://www.setki21.ru`).

### 2.4 Docker

```yaml
# docker-compose.yml
web:
  environment:
    - API_URL=http://api:8080
    - NUXT_PUBLIC_API_URL=http://localhost:8083
```

- `API_URL` — для SSR (серверные запросы к moskit-api)
- `NUXT_PUBLIC_API_URL` — для клиентских запросов (браузер)
- При `localhost:8083` в браузере — порт должен быть доступен снаружи (проксируется nginx)

**Потенциальная проблема:** В `docker-compose.dev.yml` `NUXT_PUBLIC_API_URL=http://localhost:8083` — при локальной разработке API должен быть на 8083.

**Рекомендация:** Добавить в README инструкции по запуску dev/prod сценариев.

### 2.5 API proxy в nginx

```nginx
location /api/ {
    proxy_pass http://moskit-api;
}
```

Все `/api/*` идут в moskit-api. Nuxt server routes (`/api/orders`, `/api/contact`, `/api/web-vitals`) — в том же Nuxt-процессе. Нужно разделить: либо Nuxt API проксирует на moskit-api, либо nginx проксирует только `/api/v1/*` на moskit-api, а `/api/orders` и т.п. — на web.

**Рекомендация:** Проверить nginx-маршрутизацию: `/api/orders`, `/api/contact`, `/api/web-vitals` должны обрабатываться Nuxt, а не moskit-api.

---

## 3. UI/UX

### 3.1 Дизайн

- **Шрифты:** Inter (cyrillic 400, 500, 700, 900) — единообразно
- **Цвета:** `brand-blue: #2A6AB2`, `brand-dark: #333333` — консистентны
- **Типографика:** `font-black`, `uppercase`, `tracking-widest` — единый стиль

### 3.2 Адаптивность

- **Tailwind breakpoints:** `sm`, `md`, `lg`, `xl` используются
- **Grid:** `grid-cols-2 sm:grid-cols-4` для кнопок
- **Мобильное меню:** есть, с transition
- **Таблица заказа:** `overflow-x-auto` — горизонтальный скролл на мобильных

**Рекомендация:** На мобильных рассмотреть карточный вид вместо таблицы для списка заказа.

### 3.3 Формы

- **Поле телефона:** `type="tel"`, placeholder `+7 (___) ___-__-__`, но без маски ввода
- **Чекбокс согласия:** `required`, custom styling
- **Валидация:** `required` на HTML, но нет клиентской проверки формата телефона до отправки

**Рекомендация:** Добавить маску телефона (например, `imask` или `vue-input-facade`) и клиентскую валидацию перед submit.

### 3.4 Уведомления

- **Успешный заказ:** `alert('Спасибо за заказ!')` — устаревший UX
- **Ошибка:** `alert(errorMessage)` — то же

**Рекомендация:** Заменить на toast/модальное окно с более понятным сообщением.

---

## 4. Корректность логики и расчётов

### 4.1 Ценообразование

**Источники цен:**
- `constants/pricing.ts` — fallback при отсутствии API
- `stores/pricing.ts` — загрузка из `/api/v1/pricing`
- `services/pricing.ts` — расчёт себестоимости и цены

**Поток:** `getConfig(pricing)` при `pricing === null` возвращает `PRICING_CONFIG`. При ошибке API или отсутствии данных используется fallback — логика корректна.

### 4.2 Доставка

- **constants/pricing.ts:** `DELIVERY_OPTIONS` с `price: 400` для «Доставка»
- **Calculator.vue:** `deliveries` берёт `price: store.deliveryPriceCalculated` — динамическая цена из API
- **order store:** `deliveryPriceCalculated` — база из API + `delivery_profit_factor`, минимум 400 (обычная) или 150 (смешанная)

**Согласованность:** Константа 400 используется для fallback; при наличии API — динамическая цена. Ок.

### 4.3 Замер

- **constants:** `MEASUREMENT_OPTION.price: 400`
- **order store:** `measurementPriceCalculated` — динамическая цена (база + % от материалов + profit)
- **Calculator:** `measurementOption.price = store.measurementPriceCalculated`

**Согласованность:** Ок.

### 4.4 Монтаж

- **installation:** `installation` / `installation_vsn` из API, `installation_profit_factor`
- **extrasInstallation** в order store — расчёт корректен

### 4.5 Смешанный заказ

- При смешанном заказе (с монтажом и без) — только доставка, `delivery_mixed`
- **Согласованность:** Ок.

### 4.6 Потенциальная проблема: colorId

**Файл:** `stores/order.ts:109`

```javascript
const colorId: ColorId = item.color === 'КОРИЧНЕВАЯ' ? 2 : (item.color === 'АНТРАЦИТ' ? 3 : (item.color === 'RAL' ? 4 : 1))
```

`item.color` — строка из `COLOR_NAMES`. Если `COLOR_NAMES` изменится или появится новый цвет, маппинг может сломаться.

**Рекомендация:** Хранить `colorId` в `OrderItem` и не выводить его из строки `color`.

### 4.7 Отправка заказа в БД

**Файл:** `server/api/orders.post.ts:104-117`

```javascript
await $fetch(`${apiUrl}/api/dealer/orders`, {
  body: {
    client_name: body.formName,
    client_phone: body.formPhone,
    items: [],  // TODO: Маппинг items из list_order
    ...
  }
})
```

**Проблема:** `items` всегда пустой — `list_order` передаётся как HTML-строка в письме, но не парсится в структурированные items для БД.

**Рекомендация:** Реализовать парсинг `list_order` или передавать `items` из фронта в структурированном виде (JSON).

---

## 5. Сводка рекомендаций

### Критичные (исправить в первую очередь)

1. Исправить prerender: защита или `ClientOnly` для Calculator
2. Заменить canonical URL в SeoHead на `https://www.setki21.ru`

### Важные

3. Уточнить валидацию телефона и нормализацию `8` → `+7`
4. Разделить маршрутизацию API в nginx (Nuxt vs moskit-api)
5. Заменить `alert()` на toast/модальное окно
6. Убрать `Access-Control-Allow-Origin: *` в production

### Желательные

7. Добавить маску телефона в форме заказа
8. Хранить `colorId` в OrderItem и не выводить из строки
9. Реализовать маппинг `list_order` → `items` для сохранения в БД
10. Обновить sitemap (URL, changefreq, исключить admin)
11. Добавить `noindex` для `/admin/` в robots
12. Документировать Docker dev/prod сценарии

---

## 6. Чек-лист для проверки

- [ ] `npm run build` проходит без 500 при prerender
- [ ] Canonical URL на всех страницах — `https://www.setki21.ru`
- [ ] Заказ с телефоном `8 835 238 12 34` проходит валидацию
- [ ] Заказ успешно отправляется (email + БД)
- [ ] Форма заказа на мобильном удобна
- [ ] Нет ошибок в консоли браузера
- [ ] Docker Compose поднимает все сервисы без ошибок

---

*Отчёт подготовлен с учётом ролей: Игорь (Backend/DevOps), Максим (ML/Data), Анна (QA).*
