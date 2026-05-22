# moskit-api/Dockerfile
# BUILDPLATFORM по умолчанию linux/amd64 (для VDS/legacy builder, где не задаётся)
ARG BUILDPLATFORM=linux/amd64
FROM --platform=$BUILDPLATFORM rust:1.88-bookworm AS builder

# Установка необходимых инструментов для сборки и добавление таргета
RUN dpkg --add-architecture amd64 && \
    apt-get update && apt-get install -y pkg-config libssl-dev gcc-x86-64-linux-gnu libssl-dev:amd64 && \
    rustup target add x86_64-unknown-linux-gnu && \
    rm -rf /var/lib/apt/lists/*

# Указываем линкер и настройки для OpenSSL при кросс-компиляции
ENV CARGO_TARGET_X86_64_UNKNOWN_LINUX_GNU_LINKER=x86_64-linux-gnu-gcc \
    CC_x86_64_unknown_linux_gnu=x86_64-linux-gnu-gcc \
    PKG_CONFIG_ALLOW_CROSS=1 \
    PKG_CONFIG_PATH_x86_64_unknown_linux_gnu=/usr/lib/x86_64-linux-gnu/pkgconfig

WORKDIR /app

# Копируем зависимости из корня проекта (контекст должен быть корнем)
COPY moskit-api/Cargo.toml ./
# Если Cargo.lock нет, он создастся
COPY moskit-core ./moskit-core

# Нам нужно подправить Cargo.toml чтобы путь к moskit-core был верным внутри контейнера
RUN sed -i 's|path = "../moskit-core"|path = "./moskit-core"|' Cargo.toml

# Создаём dummy бинарник для проверки зависимостей
RUN mkdir src && echo "fn main() {}" > src/main.rs

# Сборка зависимостей (кеширование)
ENV SQLX_OFFLINE=true
ENV RUST_MIN_STACK=16777216
# Добавляем флаги для обхода проблем с QEMU при кросс-сборке
ENV CARGO_NET_GIT_FETCH_WITH_CLI=true
# Используем --target x86_64-unknown-linux-gnu явно
RUN cargo build --release --target x86_64-unknown-linux-gnu
RUN rm -rf src

# Сборка (ARG CACHEBUST при деплое — чтобы не подхватить слой с заглушкой main)
ARG CACHEBUST
RUN echo "Cache bust: ${CACHEBUST:-none}"
COPY moskit-api/src ./src
# Удалить артефакт от заглушки
RUN rm -f /app/target/x86_64-unknown-linux-gnu/release/moskit-api /app/target/x86_64-unknown-linux-gnu/release/deps/moskit_api* /app/target/x86_64-unknown-linux-gnu/release/.fingerprint/moskit-api-* 2>/dev/null; true
# Добавляем флаги для обхода проблем с QEMU при кросс-сборке
ENV CARGO_NET_GIT_FETCH_WITH_CLI=true
RUN cargo build --release --target x86_64-unknown-linux-gnu
# Файл для инвалидации кэша финальной стадии
RUN echo "${CACHEBUST:-none}" > /app/target/x86_64-unknown-linux-gnu/release/build_id.txt

# Минимальный рантайм
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates postgresql-client libssl3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Сначала build_id
ARG CACHEBUST
COPY --from=builder /app/target/x86_64-unknown-linux-gnu/release/build_id.txt ./
COPY --from=builder /app/target/x86_64-unknown-linux-gnu/release/moskit-api .
RUN chmod +x ./moskit-api

# Копируем миграции и скрипт запуска
COPY migrations ./migrations
COPY scripts/entrypoint.sh ./scripts/entrypoint.sh
RUN chmod +x ./scripts/entrypoint.sh

EXPOSE 8080

# Используем entrypoint для запуска миграций перед стартом API
ENTRYPOINT ["./scripts/entrypoint.sh"]
