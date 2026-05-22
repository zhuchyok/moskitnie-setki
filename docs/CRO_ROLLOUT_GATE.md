# CRO Rollout Gate (Stop/Go)

Этот документ фиксирует обязательный gate перед rollout волнами экспериментов (`20% -> 50% -> 100%`).

## 1. Обязательные проверки перед волной

1. **Quality-gate smoke**
   - Команда: `npm run cro:quality-gate:ci`
   - Ожидание: `status=PASS`, `passed=16/16`.
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
