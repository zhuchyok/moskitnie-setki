#!/usr/bin/env bash
# Извлекает кадр из public/zamer.mp4 для превью видео (1 сек).
# Нужен ffmpeg: brew install ffmpeg
# Запуск: из корня проекта ./scripts/extract-video-poster.sh

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VIDEO="${ROOT}/public/zamer.mp4"
OUT="${ROOT}/public/images/zamer-poster.jpg"

if ! command -v ffmpeg &>/dev/null; then
  echo "Установите ffmpeg: brew install ffmpeg"
  exit 1
fi
if [[ ! -f "$VIDEO" ]]; then
  echo "Видео не найдено: $VIDEO"
  exit 1
fi

mkdir -p "$(dirname "$OUT")"
ffmpeg -y -i "$VIDEO" -ss 00:00:01 -vframes 1 -q:v 2 "$OUT" 2>/dev/null
echo "Превью сохранено: $OUT"
