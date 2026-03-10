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
   Скрипт соберёт Docker-образ, сохранит в tar, скопирует на сервер через rsync и выполнит `docker load` и перезапуск контейнера `api` (приоритетно через `docker compose`). После любых изменений в moskit-api или moskit-core запускай скрипт снова — образ пересоберётся.

   **На Mac (ARM):** локальная сборка образа под `linux/amd64` через QEMU может падать (rustc SIGSEGV). В этом случае:
   - Сначала синхронизируй код и пересобери web: `SKIP_API_BUILD=1 ./scripts/deploy_moskit_api_vds.sh`
   - Затем собери образ API **на VDS** (там amd64, без QEMU) и перезапусти api:
     ```bash
     source .env.deploy
     ssh "$DEPLOY_HOST" "cd $DEPLOY_PATH && docker compose -f docker-compose.yml -f docker-compose.vds.yml build --no-cache api && docker compose -f docker-compose.yml -f docker-compose.vds.yml up -d --no-deps api"
     ```

3. **Uploads и логотипы дилеров:** загруженные файлы хранятся вне контейнера в каталоге `SETKI21_UPLOADS_PATH` (по умолчанию `/home/atra/setki21_uploads`) и монтируются в `api` как `/app/uploads`. Иначе после `recreate` контейнера логотипы пропадут, хотя пути в БД останутся прежними. Чтобы логотипы открывались по адресу `https://www.setki21.ru/uploads/...`, в nginx (NPM proxy для www.setki21.ru) должен быть настроен `location /uploads` с проксированием на moskit-api (см. в репозитории atra-web-ide файл `scripts/npm_proxy_setki21.conf` — там уже добавлен блок для `/uploads`; при ручной правке конфига на сервере его нужно применить и выполнить `nginx -s reload` или перезагрузку через панель NPM).

4. **Сеть VDS:** продовые `api` и `web` должны быть в общей сети `SETKI21_SHARED_NETWORK` (по умолчанию `atra-network`), потому что там живут `atra-nginx-proxy`, `atra-postgres` и `atra-redis`. Для этого используется override `docker-compose.vds.yml`.

5. **Продовые env для API:** для VDS должны быть сохранены реальные `DATABASE_URL`, `REDIS_URL`, `POSTGRES_PASSWORD`, `PORT`, `RUST_LOG`. Если они не заданы локально в `.env.deploy`, deploy-скрипт пытается считать их из уже работающего контейнера `SETKI21_API_CONTAINER_NAME` и экспортировать перед `docker compose up`.

6. **Требование к серверу:** для штатного деплоя нужен рабочий `docker compose` v2. Старый standalone `docker-compose` 1.x на Ubuntu 24 может падать при `recreate` с ошибкой вида `KeyError: 'ContainerConfig'`.

7. **Без .env.deploy:** скрипт только соберёт образ и сохранит в `/tmp/moskit-api.tar`; выведет подсказку, что задать `DEPLOY_HOST` и запустить снова.

8. **Активация домена дилера (кнопка «Активировать сайт (NPM + SSL)»):** API создаёт Proxy Host в Nginx Proxy Manager по env:
   - `NPM_URL` — URL API NPM (по умолчанию `http://atra-nginx-proxy:81/api`). Контейнер api должен достучаться до NPM по сети (оба в `atra-network`).
   - `NPM_IDENTITY` и `NPM_SECRET` — логин и пароль от панели NPM (вход на порт 81).
   - `NPM_FORWARD_API_HOST` — хост для Custom Locations `/api`, `/health`, `/uploads` (по умолчанию `setki21-api-new`). Не указывать `moskit-api`, иначе логотипы и данные дилера не подгрузятся.
   Если активация не срабатывает: (1) Проверить логи api: `docker logs setki21-api-new 2>&1 | grep -i npm` — «NPM Auth failed» значит неверные identity/secret; «NPM Create Host failed» — смотреть тело ответа. (2) **Домен в кириллице (.рф и т.п.):** NPM/Certbot не принимают IDN; API автоматически переводит домен в Punycode перед отправкой в NPM (например Сеткимоскитки.рф → xn--…). Если в логах NPM было «Non-ASCII domain names not supported» — после обновления образа api с конвертацией Punycode ошибка уйдёт. (3) С контейнера api проверить доступность NPM: `docker exec setki21-api-new wget -q -O - http://atra-nginx-proxy:81/api 2>&1 | head -1`.

## Сайт (Nuxt / web)

Чтобы на VDS (45.10.43.248) отображались правки админки и фронта:

1. **Синхронизация кода на сервер** (из корня setki-21):
   ```bash
   source .env.deploy
   rsync -avz --exclude node_modules --exclude .nuxt --exclude .output --exclude .git --exclude '*/target' ./ "$DEPLOY_HOST:$DEPLOY_PATH/"
   ```
2. **На сервере пересобрать и перезапустить web** (образ собирается на VDS). Чтобы админка и калькулятор на setki21.ru загружали данные, при сборке должен быть задан **публичный URL API** (браузер пользователя ходит по нему). Скрипт деплоя подставляет `NUXT_PUBLIC_API_URL` из `.env.deploy` или по умолчанию `https://www.setki21.ru`. Для VDS используй оба compose-файла: `docker-compose.yml` + `docker-compose.vds.yml`. Вручную:
   ```bash
   export NUXT_PUBLIC_API_URL='https://www.setki21.ru'   # или http://IP:8083, если API по порту
   export SETKI21_SHARED_NETWORK='atra-network'
   ssh "$DEPLOY_HOST" "cd $DEPLOY_PATH && export NUXT_PUBLIC_API_URL='$NUXT_PUBLIC_API_URL' SETKI21_SHARED_NETWORK='$SETKI21_SHARED_NETWORK' && docker compose -f docker-compose.yml -f docker-compose.vds.yml build --no-cache web && docker compose -f docker-compose.yml -f docker-compose.vds.yml up -d --no-deps web"
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
