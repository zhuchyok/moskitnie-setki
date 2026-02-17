#!/bin/bash
set -e

# Извлекаем хост из DATABASE_URL (формат: postgres://user:pass@host:port/db)
DB_HOST=$(echo $DATABASE_URL | sed -e 's|.*@||' -e 's|:.*||' -e 's|/.*||')

# Ожидание доступности Postgres
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$DB_HOST" -U "moskit" -d "moskit" -c '\q'; do
  >&2 echo "Postgres ($DB_HOST) is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing migrations"

# Выполнение миграций
for f in /app/migrations/*.sql; do
  >&2 echo "Running migration $f..."
  PGPASSWORD=$POSTGRES_PASSWORD psql -h "$DB_HOST" -U "moskit" -d "moskit" -f "$f"
done

>&2 echo "Migrations completed - starting API"

# Запуск основного процесса
echo "Starting API with DATABASE_URL=$DATABASE_URL"
exec /app/moskit-api 2>&1
