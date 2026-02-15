# moskit-api/Dockerfile

FROM rust:1.75 AS builder

WORKDIR /app

# Копируем зависимости
COPY Cargo.toml Cargo.lock ./
COPY moskit-core ./moskit-core

# Создаём dummy бинарник для проверки зависимостей
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

# Копируем исходники
COPY src ./src

# Сборка
RUN cargo build --release

# Минимальный рантайм
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/release/moskit-api .

EXPOSE 8080

CMD ["./moskit-api"]
