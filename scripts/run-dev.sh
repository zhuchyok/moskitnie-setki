#!/usr/bin/env bash
# Запуск фронта с hot reload: при изменении файлов сайт обновляется на лету.
# Требует: api уже запущен (или запустит вместе с web).
# Использование: ./scripts/run-dev.sh   или   bash scripts/run-dev.sh
set -e
cd "$(dirname "$0")/.."
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build api web
