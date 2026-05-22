# Отчёт: SEO-аудит и внедрение трендов 2026

**Дата:** 18 февраля 2026  
**Проект:** setki-21 (ветка studio)  
**Исполнитель:** Виктория (Team Lead Atra Core)  
**Локальная модель для анализа:** `qwen2.5-coder:32b` (Ollama)

---

## 1. Исходная ситуация

Сайт уже проходил SEO-оптимизацию (см. `seo-complete-report.md`): 15 типов микроразметки, LocalBusiness, FAQ, Product на страницах. Проведён аудит по трендам 2026 и внедрены недостающие элементы.

---

## 2. Аудит трендов 2026

### 2.1 SGE (Search Generative Experience)

**Что проверено:**
- Структурированные данные (JSON-LD) для ИИ-поисковиков
- Прямые ответы на вопросы (FAQ секции)
- Блоки `data-ai-summary` для краткого извлечения сущности страницы

**Результат:**
- ✅ **Organization, LocalBusiness, WebSite, FAQ** — уже были на главной
- ✅ **Product, FAQ** — на страницах продукта (Антимошка, Антикошка, Ультравью, Антипыль, вставные, ремонт)
- ✅ **data-ai-summary** — был на Антимошка, Антикошка, Ультравью, Антипыль, вставные, ремонт
- **Добавлено:** `data-ai-summary` на главной странице
- **Добавлено:** Product schema на главной (рамочная сетка от 850 ₽)

### 2.2 Core Web Vitals

**CLS (Cumulative Layout Shift):**
- ✅ HeroImage: `width` и `height` заданы — резервирование места для изображений
- ✅ Layout: `img` в логотипе с `width="48" height="48"`
- ✅ Ленивая загрузка (`loading="lazy"`) для изображений ниже первого экрана

**INP (Interaction to Next Paint):**
- ✅ Calculator в `ClientOnly` — снижение блокировки основного потока
- ✅ FAQ-аккордеон — простые клики без тяжёлой логики
- Рекомендация: мониторить через PageSpeed Insights / Chrome DevTools после деплоя

### 2.3 Semantic HTML

**Иерархия заголовков (H1–H6):**

| Проблема | Решение |
|---------|---------|
| **Главная:** h2 «Почему наши сетки?» → h4 (Долговечность, Защита, Безопасность) | h4 заменены на **h3** |
| **Антимошка, Антикошка, Ультравью, Антипыль, вставные:** h2 → h4 | h4 заменены на **h3** |
| **Ремонт:** h2 «Как заказать?» → h4 «Привезите к нам», «Вызовите мастера» | h4 заменены на **h3** |

**Итог:** Иерархия приведена к виду H1 → H2 → H3 → H4 без пропусков.

### 2.4 Schema.org

| Тип | Главная | Продукты | Ремонт |
|-----|--------|----------|--------|
| Organization | ✅ | — | — |
| LocalBusiness | ✅ (2 адреса) | — | — |
| WebSite | ✅ | — | — |
| Product | ✅ (добавлено) | ✅ | — |
| Service | — | — | ✅ |
| FAQPage | ✅ | ✅ | ✅ |
| VideoObject | ✅ | — | — |
| BreadcrumbList | ✅ (layout) | ✅ | ✅ |

### 2.5 Alt-атрибуты

| Файл | Было | Стало |
|------|------|-------|
| `pages/admin/settings.vue` | `img` без alt | `alt="Логотип дилера"` |
| `pages/dealer/settings.vue` | `img` без alt | `alt="Логотип дилера"` |
| `pages/admin/dealers/index.vue` | `img` без alt | `alt="Логотип дилера"` |
| HeroImage, layout, HeroSection | — | Уже были |

---

## 3. robots.txt и sitemap

### 3.1 robots.txt (public/robots.txt)

**Изменения:**
- Добавлены `Allow: /images/`, `Allow: /upload/`, `Allow: /images/optimized/` — индексация изображений для поиска картинок и SGE
- Добавлена ссылка `Sitemap: https://www.setki21.ru/sitemap-images.xml`
- Удалены устаревшие `Disallow: /images/`, `Disallow: /upload/` (были в корневом robots.txt, в public — другая версия)

**Примечание:** AI-краулеры (GPTBot, ClaudeBot, PerplexityBot и др.) уже были разрешены в public/robots.txt.

### 3.2 sitemap.xml

- Файл в `public/sitemap.xml` — актуален, URL с www.
- Все основные страницы включены (главная, продукты, контакты, доставка, карта сайта, privacy).

### 3.3 sitemap-images.xml

- Создан `public/sitemap-images.xml` с актуальными изображениями:
  - Главная: logo_clean.png, hero-изображение (webp)
  - Продукты: hero-изображения для каждой страницы
- Домен: `https://www.setki21.ru`
- Пути: `/images/optimized/` — оптимизированные WebP

---

## 4. Сводка внесённых изменений

| Категория | Действие |
|-----------|----------|
| **SGE** | data-ai-summary на главной, Product schema на главной |
| **Semantic HTML** | h4 → h3 в блоках «Почему», «Плюсы», «Преимущества» на 7 страницах |
| **Alt** | Добавлены alt в 3 местах (admin/dealer настройки) |
| **Schema.org** | Product schema на главной |

| Файл | Изменения |
|------|-----------|
| `pages/index.vue` | data-ai-summary, Product schema, h4→h3 |
| `pages/antimoshka/index.vue` | h4→h3 |
| `pages/antikoshka/index.vue` | h4→h3 |
| `pages/ultravyu/index.vue` | h4→h3 |
| `pages/antipyl/index.vue` | h4→h3 |
| `pages/vstavnye/index.vue` | h4→h3 |
| `pages/remont/index.vue` | h4→h3 |
| `pages/admin/settings.vue` | alt для img |
| `pages/dealer/settings.vue` | alt для img |
| `pages/admin/dealers/index.vue` | alt для img |
| `public/robots.txt` | Allow: /images/, /upload/, /images/optimized/, sitemap-images.xml |
| `public/sitemap-images.xml` | Создан с актуальными URL |

---

## 5. Рекомендации на будущее

1. **Core Web Vitals:** Запускать Lighthouse / PageSpeed Insights после деплоя, отслеживать INP и CLS.
2. **Динамический sitemap:** С учётом Nuxt возможна генерация sitemap через `@nuxtjs/sitemap` при росте числа страниц.
3. **Review schema:** При наличии реальных отзывов — добавить `Review` / `AggregateRating` с реальными данными.
4. **Обновление lastmod:** Периодически обновлять sitemap.xml (lastmod) при изменении контента.

---

## 6. Использованная модель

- **Оllama:** `qwen2.5-coder:32b` — для анализа и формулировки трендов SEO 2026 (SGE, Core Web Vitals, Semantic HTML, Schema.org).

---

*Отчёт составлен в рамках аудита SEO-трендов 2026 для проекта setki-21.*
