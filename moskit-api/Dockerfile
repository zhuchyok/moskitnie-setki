# moskit-api/Dockerfile

FROM rust:1.85-slim-bookworm AS builder

# Установка необходимых инструментов для сборки
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем зависимости из корня проекта (контекст должен быть корнем)
COPY moskit-api/Cargo.toml ./
# Если Cargo.lock нет, он создастся
COPY moskit-core ./moskit-core

# Нам нужно подправить Cargo.toml чтобы путь к moskit-core был верным внутри контейнера
RUN sed -i 's|path = "../moskit-core"|path = "./moskit-core"|' Cargo.toml

# Создаём dummy бинарник для проверки зависимостей
RUN mkdir src && echo "fn main() {}" > src/main.rs

# Фикс для home v0.5.12 и других пакетов, требующих Rust 1.88+
RUN cargo fetch
RUN cargo update -p home --precise 0.5.9 || true
# RUN cargo update -p time --precise 0.3.36 || true

# Сборка зависимостей (кеширование)
ENV SQLX_OFFLINE=true
RUN cargo build --release
RUN rm -rf src

# Сборка
COPY moskit-api/src ./src
RUN cargo build --release

# Минимальный рантайм
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates postgresql-client libssl3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем бинарник
COPY --from=builder /app/target/release/moskit-api .
RUN chmod +x ./moskit-api

# Копируем миграции и скрипт запуска
COPY migrations ./migrations
COPY scripts/entrypoint.sh ./scripts/entrypoint.sh
RUN chmod +x ./scripts/entrypoint.sh

EXPOSE 8080

# Используем entrypoint для запуска миграций перед стартом API
ENTRYPOINT ["./scripts/entrypoint.sh"]
