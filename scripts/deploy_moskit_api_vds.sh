#!/usr/bin/env bash
# Деплой moskit-api на VDS: сборка образа, сохранение в tar, копирование на сервер, загрузка и перезапуск.
# Использование:
#   export DEPLOY_HOST=root@IP_ИЛИ_ХОСТ
#   export DEPLOY_PATH=/path/on/server  # каталог с docker-compose.yml (по умолчанию ~/setki-21)
#   ./scripts/deploy_moskit_api_vds.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
# Опционально: переменные из .env.deploy (не коммитить, только DEPLOY_HOST и DEPLOY_PATH)
if [ -f "$REPO_ROOT/.env.deploy" ]; then set -a; source "$REPO_ROOT/.env.deploy"; set +a; fi
DEPLOY_PATH="${DEPLOY_PATH:-setki-21}"
IMAGE_NAME="moskit-api:latest"

cd "$REPO_ROOT"

echo "=== 1. Сборка Docker-образа ==="
docker build -f moskit-api/Dockerfile --build-arg CACHEBUST=$(date +%s) -t "$IMAGE_NAME" .

echo "=== 2. Сохранение образа в tar ==="
docker save "$IMAGE_NAME" -o /tmp/moskit-api.tar

# Плейсхолдер или пустой хост — не деплоим, только подсказка
if [ -z "$DEPLOY_HOST" ] || [ "$DEPLOY_HOST" = "root@YOUR_VDS_IP" ] || [[ "$DEPLOY_HOST" == *"YOUR_VDS_IP"* ]]; then
  echo "Образ собран и сохранён в /tmp/moskit-api.tar"
  echo ""
  echo "Для выката на VDS отредактируй .env.deploy: укажи реальный IP вместо YOUR_VDS_IP, затем запусти снова:"
  echo "  $0"
  exit 0
fi

echo "=== 3. Копирование образа на сервер ==="
rsync -avz --progress /tmp/moskit-api.tar "$DEPLOY_HOST:/tmp/"

echo "=== 3b. Синхронизация исходников и docker-compose на сервер ==="
rsync -avz "$REPO_ROOT/docker-compose.yml" "$DEPLOY_HOST:$DEPLOY_PATH/"
rsync -avz --delete "$REPO_ROOT/moskit-core/" "$DEPLOY_HOST:$DEPLOY_PATH/moskit-core/"
rsync -avz --delete "$REPO_ROOT/moskit-api/" "$DEPLOY_HOST:$DEPLOY_PATH/moskit-api/"
rsync -avz "$REPO_ROOT/migrations/" "$DEPLOY_HOST:$DEPLOY_PATH/migrations/"
rsync -avz "$REPO_ROOT/scripts/entrypoint.sh" "$DEPLOY_HOST:$DEPLOY_PATH/scripts/"

echo "=== 3c. Синхронизация фронта (Nuxt) для пересборки web ==="
rsync -avz --exclude 'node_modules' --exclude '.nuxt' --exclude '.output' --exclude '.git' --exclude 'moskit-core/target' --exclude 'moskit-api/target' \
  "$REPO_ROOT/" "$DEPLOY_HOST:$DEPLOY_PATH/"

echo "=== 4. Загрузка образа и перезапуск API (без пересборки на сервере) ==="
if ! ssh "$DEPLOY_HOST" "docker load -i /tmp/moskit-api.tar && rm -f /tmp/moskit-api.tar && cd $DEPLOY_PATH && (docker compose rm -sf api 2>/dev/null || true) && (docker-compose rm -sf api 2>/dev/null || true) && (docker compose up -d --no-build api 2>/dev/null || docker-compose up -d --no-build api)"; then
  echo ""
  echo "Ошибка при перезапуске api на сервере. Проверь: ssh $DEPLOY_HOST \"cd $DEPLOY_PATH && docker compose ps\""
  exit 1
fi

echo "=== 5. Проверка: на VDS запущен тот же образ, что собран локально ==="
LOCAL_ID=$(docker image inspect "$IMAGE_NAME" --format '{{.Id}}')
REMOTE_ID=$(ssh "$DEPLOY_HOST" "docker image inspect $IMAGE_NAME --format '{{.Id}}' 2>/dev/null || echo 'none'")
if [ "$REMOTE_ID" = "none" ] || [ -z "$REMOTE_ID" ]; then
  echo "Предупреждение: образ $IMAGE_NAME на VDS не найден."
else
  if [ "$LOCAL_ID" = "$REMOTE_ID" ]; then
    echo "OK: образ на VDS совпадает с локальным ($LOCAL_ID)"
  else
    echo "Внимание: образ на VDS отличается от локального."
    echo "  Локально: $LOCAL_ID"
    echo "  VDS:      $REMOTE_ID"
    echo "Перезапуск api на VDS использует загруженный образ; если контейнер уже был up, проверь: ssh $DEPLOY_HOST \"cd $DEPLOY_PATH && docker compose ps && docker inspect api --format '{{.Image}}'\""
  fi
fi

echo "=== 6. Пересборка и перезапуск фронта (web) ==="
# На VDS админка должна ходить за данными по публичному URL (браузер пользователя). Задаётся в .env.deploy как NUXT_PUBLIC_API_URL.
# Пример: https://www.setki21.ru (если nginx проксирует /api на api:8080) или http://45.10.43.248:8083
BUILD_API_URL="${NUXT_PUBLIC_API_URL:-https://www.setki21.ru}"
echo "  Сборка web с NUXT_PUBLIC_API_URL=$BUILD_API_URL (задай в .env.deploy при необходимости)"
if ! ssh "$DEPLOY_HOST" "cd $DEPLOY_PATH && export NUXT_PUBLIC_API_URL='$BUILD_API_URL' && (docker-compose build --no-cache web 2>/dev/null || docker compose build --no-cache web) && (docker-compose stop web 2>/dev/null; docker-compose rm -f web 2>/dev/null; true) && (docker-compose up -d --no-deps web 2>/dev/null || docker compose up -d --no-deps web)"; then
  echo "Предупреждение: не удалось пересобрать/запустить web. Проверь вручную: ssh $DEPLOY_HOST \"cd $DEPLOY_PATH && docker-compose ps\""
fi

echo ""
echo "=== Готово ==="
echo "Если на VDS ошибка DECODING COLUMN delivery_mode — проверь БД (тип колонки и значения):"
echo "  ssh $DEPLOY_HOST \"cd $DEPLOY_PATH && docker compose exec postgres psql -U moskit -d moskit -c \\\"SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_name='dealers' AND column_name IN ('delivery_mode','payment_type');\\\"\""
echo "  ssh $DEPLOY_HOST \"cd $DEPLOY_PATH && docker compose exec postgres psql -U moskit -d moskit -c \\\"SELECT id, delivery_mode, payment_type FROM dealers LIMIT 3;\\\"\""
