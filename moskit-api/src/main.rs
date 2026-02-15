// moskit-api/src/main.rs - API сервер

use axum::{
    routing::{get, post, put},
    Router,
};
use std::net::SocketAddr;

mod handlers;

#[tokio::main]
async fn main() {
    // Инициализация логирования
    tracing_subscriber::fmt::init();

    // Создание приложения
    let app = Router::new()
        // Health check
        .route("/health", get(handlers::health))
        // Аутентификация
        .route("/api/v1/auth/login", post(handlers::auth::login))
        .route("/api/v1/auth/register", post(handlers::auth::register))
        // Дилер
        .route("/api/v1/dealer/pricing", get(handlers::dealer::get_pricing))
        .route("/api/v1/dealer/calculate", post(handlers::dealer::calculate))
        .route("/api/v1/dealer/orders", post(handlers::dealer::create_order))
        .route("/api/v1/dealer/orders", get(handlers::dealer::list_orders))
        // Производитель (админ)
        .route("/api/v1/admin/dealers", post(handlers::admin::create_dealer))
        .route("/api/v1/admin/dealers", get(handlers::admin::list_dealers))
        .route("/api/v1/admin/dealers/:id", put(handlers::admin::update_dealer))
        .route("/api/v1/admin/orders", get(handlers::admin::list_all_orders))
        .route("/api/v1/admin/orders/:id/status", put(handlers::admin::update_order_status));

    // Запуск сервера
    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    tracing::info!("Starting server on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
