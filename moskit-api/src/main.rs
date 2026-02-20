// moskit-api/src/main.rs - API сервер

use std::io::Write;
use axum::{
    routing::{get, post, put},
    Router,
    extract::State,
    http::{HeaderValue, Method},
};
use tower_http::cors::CorsLayer;
use std::net::SocketAddr;
use sqlx::PgPool;
use std::sync::Arc;

mod handlers;

pub struct AppState {
    pub pool: PgPool,
}

#[tokio::main]
async fn main() {
    // Ранний flush stderr (нужен для корректного вывода в Docker до инициализации tracing)
    let _ = std::io::stderr().write_all(b"[moskit-api] starting\n");
    let _ = std::io::stderr().flush();

    // Инициализация логирования ПЕРВОЙ ОЧЕРЕДЬЮ
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .with_target(false)
        .with_ansi(false)  // Docker часто без TTY — отключаем ANSI для стабильного вывода
        .init();

    println!("Moskit API v2.1 starting...");
    eprintln!("Moskit API v2.1 starting (stderr)...");
    tracing::info!("Moskit API v2.1 starting...");

    // Загрузка .env
    match dotenvy::dotenv() {
        Ok(path) => tracing::info!("DEBUG: .env loaded from {:?}", path),
        Err(e) => tracing::warn!("DEBUG: .env not loaded: {}", e),
    }

    // Подключение к БД
    let db_url = std::env::var("DATABASE_URL").unwrap_or_else(|_| "postgres://moskit:password@moskit-db:5432/moskit".to_string());
    tracing::info!("Connecting to database...");
    
    let pool = match sqlx::postgres::PgPoolOptions::new()
        .max_connections(5)
        .acquire_timeout(std::time::Duration::from_secs(3))
        .connect(&db_url).await {
        Ok(p) => p,
        Err(e) => {
            tracing::error!("CRITICAL: Failed to connect to Postgres: {}", e);
            std::process::exit(1);
        }
    };
    tracing::info!("Connected to database");

    let state = Arc::new(AppState { pool });

    // Настройка CORS
    let cors = CorsLayer::new()
        .allow_origin(tower_http::cors::Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE, Method::OPTIONS])
        .allow_headers([axum::http::header::CONTENT_TYPE, axum::http::header::AUTHORIZATION, axum::http::header::ACCEPT]);

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
        .route("/api/v1/admin/dealers/:dealer_id/departments", post(handlers::admin::create_department))
        .route("/api/v1/admin/dealers/:dealer_id/departments", get(handlers::admin::list_departments))
        .route("/api/v1/admin/dealers/:dealer_id/stats", get(handlers::admin::get_dealer_stats))
        .route("/api/v1/admin/dealers/:dealer_id/audit", get(handlers::admin::list_audit_logs))
        .route("/api/v1/admin/upload", post(handlers::admin::upload_file))
        .route("/api/v1/admin/orders", get(handlers::admin::list_all_orders))
        .route("/api/v1/admin/orders/:id/status", put(handlers::admin::update_order_status))
        // Управление ценами
        .route("/api/v1/admin/pricing", get(handlers::pricing::get_global_pricing))
        .route("/api/v1/admin/pricing", post(handlers::pricing::update_global_pricing))
        .route("/api/v1/pricing", get(handlers::pricing::get_global_pricing))
        // Контент и мультитенантность
        .route("/api/v1/tenant/config", get(handlers::content::get_tenant_config))
        .layer(cors)
        .with_state(state);

    // Запуск сервера
    let port = std::env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let addr_str = format!("0.0.0.0:{}", port);
    tracing::info!("Attempting to bind to {}", addr_str);
    let addr: SocketAddr = addr_str.parse().expect("Failed to parse address");
    tracing::info!("Starting server on {}", addr);

    let listener = match tokio::net::TcpListener::bind(&addr).await {
        Ok(l) => l,
        Err(e) => {
            tracing::error!("CRITICAL: Failed to bind to {}: {}", addr, e);
            std::process::exit(1);
        }
    };
    tracing::info!("Server successfully bound to {}", addr);
    
    if let Err(e) = axum::serve(listener, app).await {
        tracing::error!("CRITICAL: Server error: {}", e);
    }
}
