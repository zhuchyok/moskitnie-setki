# CRO Rollout Gate (Stop/Go)

Этот документ фиксирует обязательный gate перед rollout волнами экспериментов (`20% -> 50% -> 100%`).

## 1. Обязательные проверки перед волной

1. **Quality-gate smoke**
   - Команда: `npm run cro:quality-gate:ci`
   - Ожидание: `status=PASS`, `passed=total`.
   - Автоподхват доменов новых дилеров:
     - опционально `CRO_GATE_DEALERS_API_URL` (по умолчанию `https://setki21.ru/api/v1/admin/dealers`)
     - опционально `CRO_GATE_BEARER_TOKEN` (если endpoint защищен в будущем)
   - При недоступности API используется fallback-список доменов в скрипте.
2. **Build**
   - Команда: `npm run build`
   - Ожидание: успешная сборка без критичных ошибок.
3. **Контракт событий**
   - В последнем запуске присутствуют:
     - `segment`
     - `variant_id`
     - `dealer_domain`
4. **Ошибки и стабильность**
   - Нет всплеска JS/runtime ошибок после последнего деплоя.
   - Нет роста API 5xx.

## 2. Решение Stop/Go

- **GO**:
  - quality-gate PASS,
  - build PASS,
  - контракт событий валиден.
- **STOP**:
  - любой FAIL в quality-gate,
  - отсутствуют обязательные поля payload,
  - обнаружен рост ошибок после деплоя.

## 3. Откат

При `STOP`:

1. rollback текущей волны (feature-flag или предыдущий релиз),
2. фикс корневой причины,
3. повторный прогон `npm run cro:quality-gate:ci`,
4. повторное решение по gate.

## 4. Артефакты проверки

- Полный отчет (локальный запуск с сохранением):
  - `npm run cro:quality-gate`
- Файлы отчетов:
  - `docs/reports/cro-quality-gates/<timestamp>.json`
  - `docs/reports/cro-quality-gates/<timestamp>.md`

## 5. Полная автоматизация (daily)

- Настроен GitHub Actions workflow: `.github/workflows/cro-quality-gate.yml`
- Автозапуск: ежедневно `03:15 UTC` + ручной `workflow_dispatch`.
- В workflow:
  - автоподхват доменов из `https://setki21.ru/api/v1/admin/dealers`,
  - прогон `npm run cro:quality-gate`,
  - сохранение отчетов в artifacts (retention 14 дней).
