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
UPLOADS_PATH="${SETKI21_UPLOADS_PATH:-/home/atra/setki21_uploads}"
API_CONTAINER_NAME="${SETKI21_API_CONTAINER_NAME:-setki21-api-new}"
WEB_CONTAINER_NAME="${SETKI21_WEB_CONTAINER_NAME:-setki21-web-new}"
SHARED_NETWORK="${SETKI21_SHARED_NETWORK:-atra-network}"

cd "$REPO_ROOT"

# SKIP_API_BUILD=1 — не собирать образ локально (удобно на Mac ARM, где amd64-сборка через QEMU падает с rustc SIGSEGV). На VDS будет использован уже загруженный образ.
SKIP_API_BUILD="${SKIP_API_BUILD:-0}"
if [ "$SKIP_API_BUILD" != "1" ]; then
  echo "=== 1. Сборка Docker-образа (x86_64 для VDS) ==="
  docker buildx build --platform linux/amd64 --provenance=false --load -f moskit-api/Dockerfile --build-arg CACHEBUST=$(date +%s) -t "$IMAGE_NAME" .
  echo "=== 2. Сохранение образа в tar ==="
  docker save "$IMAGE_NAME" -o /tmp/moskit-api.tar
else
  echo "=== 1–2. Пропуск сборки образа (SKIP_API_BUILD=1) ==="
fi

# Плейсхолдер или пустой хост — не деплоим, только подсказка
if [ -z "$DEPLOY_HOST" ] || [ "$DEPLOY_HOST" = "root@YOUR_VDS_IP" ] || [[ "$DEPLOY_HOST" == *"YOUR_VDS_IP"* ]]; then
  [ "$SKIP_API_BUILD" = "1" ] || echo "Образ собран и сохранён в /tmp/moskit-api.tar"
  echo ""
  echo "Для выката на VDS отредактируй .env.deploy: укажи реальный IP вместо YOUR_VDS_IP, затем запусти снова:"
  echo "  $0"
  exit 0
fi

if [ "$SKIP_API_BUILD" != "1" ]; then
  echo "=== 3. Копирование образа на сервер ==="
  rsync -avz --progress /tmp/moskit-api.tar "$DEPLOY_HOST:/tmp/"
fi

echo "=== 3b. Синхронизация исходников и docker-compose на сервер ==="
rsync -avz "$REPO_ROOT/docker-compose.yml" "$DEPLOY_HOST:$DEPLOY_PATH/"
rsync -avz "$REPO_ROOT/docker-compose.vds.yml" "$DEPLOY_HOST:$DEPLOY_PATH/"
rsync -avz --delete "$REPO_ROOT/moskit-core/" "$DEPLOY_HOST:$DEPLOY_PATH/moskit-core/"
rsync -avz --delete "$REPO_ROOT/moskit-api/" "$DEPLOY_HOST:$DEPLOY_PATH/moskit-api/"
rsync -avz "$REPO_ROOT/migrations/" "$DEPLOY_HOST:$DEPLOY_PATH/migrations/"
rsync -avz "$REPO_ROOT/scripts/entrypoint.sh" "$DEPLOY_HOST:$DEPLOY_PATH/scripts/"

echo "=== 3c. Синхронизация фронта (Nuxt) для пересборки web ==="
rsync -avz --exclude 'node_modules' --exclude '.nuxt' --exclude '.output' --exclude '.git' --exclude 'moskit-core/target' --exclude 'moskit-api/target' \
  "$REPO_ROOT/" "$DEPLOY_HOST:$DEPLOY_PATH/"

echo "=== 4. Загрузка образа (если не SKIP_API_BUILD) и перезапуск API ==="
LOAD_CMD=""
if [ "$SKIP_API_BUILD" != "1" ]; then
  LOAD_CMD="docker load -i /tmp/moskit-api.tar && rm -f /tmp/moskit-api.tar &&"
fi
if ! ssh "$DEPLOY_HOST" "export SETKI21_UPLOADS_PATH='$UPLOADS_PATH' SETKI21_API_CONTAINER_NAME='$API_CONTAINER_NAME' SETKI21_WEB_CONTAINER_NAME='$WEB_CONTAINER_NAME' SETKI21_SHARED_NETWORK='$SHARED_NETWORK' && mkdir -p '$UPLOADS_PATH' && docker network inspect '$SHARED_NETWORK' >/dev/null 2>&1 || docker network create '$SHARED_NETWORK' >/dev/null 2>&1 && $LOAD_CMD cd $DEPLOY_PATH && REMOTE_COMPOSE='docker compose -f docker-compose.yml -f docker-compose.vds.yml' && eval \"\$(python3 - <<'PY'
import json, shlex, subprocess

container_name = '${API_CONTAINER_NAME}'
keys = ['DATABASE_URL', 'POSTGRES_PASSWORD', 'REDIS_URL', 'PORT', 'RUST_LOG']

try:
    raw = subprocess.check_output(
        ['docker', 'inspect', container_name, '--format', '{{json .Config.Env}}'],
        text=True,
    ).strip()
    envs = json.loads(raw)
except Exception:
    envs = []

values = {}
for item in envs:
    if '=' not in item:
        continue
    key, value = item.split('=', 1)
    if key in keys and value:
        values[key] = value

for key in keys:
    value = values.get(key)
    if value:
        print(f'export {key}={shlex.quote(value)}')
PY
)\" && if docker inspect '$API_CONTAINER_NAME' --format '{{json .Config.Labels}}' 2>/dev/null | python3 - <<'PY'
import json, sys
raw = sys.stdin.read().strip() or '{}'
labels = json.loads(raw)
sys.exit(0 if labels.get('com.docker.compose.project') else 1)
PY
then :; else docker rm -f '$API_CONTAINER_NAME' >/dev/null 2>&1 || true; fi && eval \"\$REMOTE_COMPOSE up -d --no-build --no-deps api\""; then
  echo ""
  echo "Ошибка при перезапуске api на сервере. Проверь: ssh $DEPLOY_HOST \"cd $DEPLOY_PATH && docker compose ps\""
  exit 1
fi

echo "=== 5. Проверка образа на VDS ==="
if [ "$SKIP_API_BUILD" = "1" ]; then
  echo "Пропуск (SKIP_API_BUILD=1). Проверь вручную: ssh $DEPLOY_HOST \"docker images $IMAGE_NAME\""
else
  LOCAL_ID=$(docker image inspect "$IMAGE_NAME" --format '{{.Id}}')
  REMOTE_ID=$(ssh "$DEPLOY_HOST" "docker image inspect $IMAGE_NAME --format '{{.Id}}' 2>/dev/null || echo 'none'")
  if [ "$REMOTE_ID" = "none" ] || [ -z "$REMOTE_ID" ]; then
    echo "Предупреждение: образ $IMAGE_NAME на VDS не найден."
  elif [ "$LOCAL_ID" = "$REMOTE_ID" ]; then
    echo "OK: образ на VDS совпадает с локальным ($LOCAL_ID)"
  else
    echo "Внимание: образ на VDS отличается от локального. Локально: $LOCAL_ID  VDS: $REMOTE_ID"
  fi
fi

echo "=== 6. Пересборка и перезапуск фронта (web) ==="
# На VDS админка должна ходить за данными по публичному URL (браузер пользователя). Задаётся в .env.deploy как NUXT_PUBLIC_API_URL.
# Пример: https://www.setki21.ru (если nginx проксирует /api на api:8080) или http://45.10.43.248:8083
BUILD_API_URL="${NUXT_PUBLIC_API_URL:-https://www.setki21.ru}"
echo "  Сборка web с NUXT_PUBLIC_API_URL=$BUILD_API_URL (задай в .env.deploy при необходимости)"
if ! ssh "$DEPLOY_HOST" "cd $DEPLOY_PATH && export NUXT_PUBLIC_API_URL='$BUILD_API_URL' SETKI21_API_CONTAINER_NAME='$API_CONTAINER_NAME' SETKI21_WEB_CONTAINER_NAME='$WEB_CONTAINER_NAME' SETKI21_SHARED_NETWORK='$SHARED_NETWORK' && docker compose -f docker-compose.yml -f docker-compose.vds.yml build --no-cache web && docker compose -f docker-compose.yml -f docker-compose.vds.yml up -d --no-deps web"; then
  echo "Предупреждение: не удалось пересобрать/запустить web. Проверь вручную: ssh $DEPLOY_HOST \"cd $DEPLOY_PATH && docker-compose ps\""
fi

echo ""
echo "=== Готово ==="
echo "Если на VDS ошибка DECODING COLUMN delivery_mode — проверь БД (тип колонки и значения):"
echo "  ssh $DEPLOY_HOST \"cd $DEPLOY_PATH && docker compose exec postgres psql -U moskit -d moskit -c \\\"SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_name='dealers' AND column_name IN ('delivery_mode','payment_type');\\\"\""
echo "  ssh $DEPLOY_HOST \"cd $DEPLOY_PATH && docker compose exec postgres psql -U moskit -d moskit -c \\\"SELECT id, delivery_mode, payment_type FROM dealers LIMIT 3;\\\"\""
