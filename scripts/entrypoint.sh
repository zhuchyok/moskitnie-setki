#!/bin/bash
set -e

# Ожидание доступности Postgres
until PGPASSWORD=$DB_PASSWORD psql -h "moskit-db" -U "moskit" -d "moskit" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing migrations"

# Выполнение миграций
for f in /app/migrations/*.sql; do
  >&2 echo "Running migration $f..."
  PGPASSWORD=$DB_PASSWORD psql -h "moskit-db" -U "moskit" -d "moskit" -f "$f"
done

>&2 echo "Migrations completed - starting API"

# Запуск основного процесса
echo "Starting API with DATABASE_URL=$DATABASE_URL"
exec /app/moskit-api 2>&1
