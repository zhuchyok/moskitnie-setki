# setki-21

Сайт и админка (Nuxt + moskit-api). Один репозиторий, прод на VDS.

## Локалка и прод — не разные проекты

- **Код один:** правишь только у себя; на VDS попадает копия после деплоя.
- **База одна:** PostgreSQL на VDS. То, что видит setki21.ru — всегда с VDS.

Подробно: [docs/KAK_USTROENO.md](docs/KAK_USTROENO.md).

## Деплой (чтобы правки появились на сайте)

Из корня репозитория:

```bash
./scripts/deploy_moskit_api_vds.sh
```

Нужен файл `.env.deploy` с `DEPLOY_HOST` и `DEPLOY_PATH` (см. [docs/DEPLOY.md](docs/DEPLOY.md)). После деплоя обнови страницу с Ctrl+Shift+R.

## Локальный запуск

**API:** при `cargo run` по умолчанию порт 8081; в Docker — 8083 (чтобы не конфликтовать с atra-web-ide на 8081).

### Вариант A: всё в Docker

```bash
docker-compose up -d
```

Сайт: http://localhost:3003, API: http://localhost:8083. База локальная.

### Вариант B: Nuxt вручную + API вручную

1. **PostgreSQL** локально, база `moskit` (миграции в `migrations/`).
2. В **moskit-api** скопируй `.env.example` в `.env`, укажи `DATABASE_URL` под свою БД. Порт по умолчанию уже 8081.
3. Запуск API: `cd moskit-api && cargo run`.
4. Запуск сайта: `npm run dev` — откроется на http://localhost:3000 и будет стучаться в http://localhost:8081.
