# Деплой setki-21 на VDS

## Куда именно деплоится

- **Сервер:** IP или хост из `.env.deploy` (сейчас `DEPLOY_HOST=root@45.10.43.248`).
- **Путь на сервере:** из `.env.deploy` (сейчас `DEPLOY_PATH=/home/atra/app/setki21_src`). Там лежит весь проект: `docker-compose.yml`, код, образы api и web.
- **Локально:** репозиторий setki-21 (например `~/Documents/dev/setki-21`). Все правки делаются здесь; на сервер код попадает только после **rsync** и пересборки/перезапуска контейнеров.

Пока не выполнишь синхронизацию и перезапуск на VDS — на сайте (setki21.ru / 45.10.43.248) будет старая версия.

### Предупреждение «Ненадёжное подключение»

Если браузер показывает, что сайт не поддерживает HTTPS, значит на VDS трафик идёт по HTTP. Нужно включить HTTPS (Nginx + Let's Encrypt). Пошагово: **docs/HTTPS_SETUP.md**.

---

## moskit-api (бэкенд)

1. **Локально:** в корне репозитория есть `.env.deploy` (не коммитить, в .gitignore). Открой его и **замени `YOUR_VDS_IP` на реальный IP или хост твоего VDS**:
   ```
   DEPLOY_HOST=root@IP_ТВОЕГО_VDS
   DEPLOY_PATH=setki-21
   ```
   `DEPLOY_PATH` — каталог на сервере, где лежит `docker-compose.yml` с сервисом `api`. Пока в `DEPLOY_HOST` стоит плейсхолдер, скрипт только соберёт образ и подскажет, что подставить.

2. **Запуск деплоя:**
   ```bash
   ./scripts/deploy_moskit_api_vds.sh
   ```
   Скрипт соберёт Docker-образ, сохранит в tar, скопирует на сервер через rsync и выполнит `docker load` и перезапуск контейнера `api` (через `docker compose` или `docker-compose`). После любых изменений в moskit-api или moskit-core запускай скрипт снова — образ пересоберётся.

3. **Без .env.deploy:** скрипт только соберёт образ и сохранит в `/tmp/moskit-api.tar`; выведет подсказку, что задать `DEPLOY_HOST` и запустить снова.

## Сайт (Nuxt / web)

Чтобы на VDS (45.10.43.248) отображались правки админки и фронта:

1. **Синхронизация кода на сервер** (из корня setki-21):
   ```bash
   source .env.deploy
   rsync -avz --exclude node_modules --exclude .nuxt --exclude .output --exclude .git --exclude '*/target' ./ "$DEPLOY_HOST:$DEPLOY_PATH/"
   ```
2. **На сервере пересобрать и перезапустить web** (образ собирается на VDS). Чтобы админка и калькулятор на setki21.ru загружали данные, при сборке должен быть задан **публичный URL API** (браузер пользователя ходит по нему). Скрипт деплоя подставляет `NUXT_PUBLIC_API_URL` из `.env.deploy` или по умолчанию `https://www.setki21.ru`. Вручную:
   ```bash
   export NUXT_PUBLIC_API_URL='https://www.setki21.ru'   # или http://IP:8083, если API по порту
   ssh "$DEPLOY_HOST" "cd $DEPLOY_PATH && export NUXT_PUBLIC_API_URL='$NUXT_PUBLIC_API_URL' && docker-compose build --no-cache web && docker-compose stop web && docker-compose rm -f web && docker-compose up -d --no-deps web"
   ```

Скрипт `deploy_moskit_api_vds.sh` делает шаг 3c (rsync всего репо) и шаг 6 (build **--no-cache** с `NUXT_PUBLIC_API_URL` + up web). При правках только фронта можно выполнить rsync и команду выше.

### Админка на VDS — все вкладки

Все разделы панели берут данные с одного и того же API по адресу `config.public.apiUrl` (это `NUXT_PUBLIC_API_URL`, запечённый при сборке web). Эндпоинты — все на одном хосте:

| Вкладка        | Маршрут              | API (GET/POST/PUT) |
|----------------|----------------------|--------------------------------|
| Обзор         | `/admin`             | `GET /api/v1/admin/stats`, `GET /api/v1/admin/orders` или `/api/v1/dealer/orders` |
| Все заказы    | `/admin/orders`      | `GET /api/v1/admin/orders` или `/api/v1/dealer/orders`; просмотр — `/admin/orders/:id` |
| Производство  | `/admin/production`  | `GET /api/v1/admin/production/orders`, `PUT /api/v1/admin/orders/:id/status` |
| Дилеры        | `/admin/dealers`     | `GET/POST /api/v1/admin/dealers`, `PUT /api/v1/admin/dealers/:id`, `POST /api/v1/admin/upload` |
| Цены          | `/admin/pricing`     | `GET/POST /api/v1/admin/pricing` |
| Калькулятор   | `/admin/calculator`  | расчёт через API (pricing + dealer/calculate при необходимости) |
| Настройки     | `/admin/settings`    | `GET/PUT /api/v1/admin/dealers/:id`, `POST /api/v1/admin/upload` |

Если после деплоя какая-то вкладка не грузит данные или показывает ошибку сети — проверь, что при сборке web на VDS был передан правильный `NUXT_PUBLIC_API_URL` (в `.env.deploy` или по умолчанию `https://www.setki21.ru`). На сервере API должен быть доступен по этому URL (nginx проксирует `/api` на контейнер api или порт 8083 открыт и CORS разрешает запросы с setki21.ru).

### Если в админке не видно изменений

1. **Жёсткое обновление страницы:** Ctrl+Shift+R (Windows/Linux) или Cmd+Shift+R (Mac), либо открой админку в режиме инкогнито — иначе браузер может отдавать старый JS/CSS из кэша.
2. **Убедиться, что на VDS попал новый код и пересобран web:**  
   Из корня setki-21 запусти полный деплой (он теперь собирает web с `--no-cache`):
   ```bash
   ./scripts/deploy_moskit_api_vds.sh
   ```
   Дождись окончания шага 6 (пересборка и перезапуск web), затем снова обнови админку с Ctrl+Shift+R.
3. **Проверить на сервере, что в файлах есть правки:**  
   `ssh root@45.10.43.248 "grep -n measurement_profit_factor /home/atra/app/setki21_src/pages/admin/pricing/index.vue | head -3"`  
   Должны быть строки с «Коэффициент замера» и полем `measurement_profit_factor`.
