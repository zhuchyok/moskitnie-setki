// moskit-api/src/main.rs - API сервер

use std::io::Write;
use axum::{
    routing::{get, post, put},
    Router,
    extract::State,
    http::Method,
};
use tower_http::cors::CorsLayer;
use std::net::SocketAddr;
use sqlx::PgPool;
use std::sync::Arc;
use rust_decimal::Decimal;
use rust_decimal_macros::dec;

mod handlers;
mod npm;

use tower_http::services::ServeDir;

pub struct AppState {
    pub pool: PgPool,
    /// Порог баланса (₽), ниже которого в stats возвращается алерт «низкий баланс». Задаётся через env LOW_BALANCE_THRESHOLD (по умолчанию 5000).
    pub low_balance_threshold: Decimal,
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

    let low_balance_threshold = std::env::var("LOW_BALANCE_THRESHOLD")
        .ok()
        .and_then(|s| s.parse::<Decimal>().ok())
        .unwrap_or(dec!(5000.0));
    tracing::info!("LOW_BALANCE_THRESHOLD = {}", low_balance_threshold);

    let state = Arc::new(AppState { pool, low_balance_threshold });

    // Настройка CORS
    let cors = CorsLayer::new()
        .allow_origin(tower_http::cors::Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE, Method::OPTIONS])
        .allow_headers([axum::http::header::CONTENT_TYPE, axum::http::header::AUTHORIZATION, axum::http::header::ACCEPT]);

    // Создание приложения
    let app = Router::new()
        // Health check
        .route("/health", get(handlers::health))
        // Обратный звонок: прокси в Nuxt (web), т.к. NPM направляет /api/* в moskit-api
        .route("/api/callback", post(handlers::callback::proxy_callback))
        // Раздача статики (логотипы и т.д.)
        .nest_service("/uploads", ServeDir::new("uploads"))
        // Аутентификация
        .route("/api/v1/auth/login", post(handlers::auth::login))
        .route("/api/v1/auth/register", post(handlers::auth::register))
        // Дилер
        .route("/api/v1/dealers/:id", get(handlers::admin::get_dealer))
        .route("/api/v1/dealer/pricing", get(handlers::dealer::get_pricing))
        .route("/api/v1/dealer/calculate", post(handlers::dealer::calculate))
        .route("/api/v1/dealer/orders", post(handlers::dealer::create_order))
        .route("/api/v1/dealer/orders", get(handlers::dealer::list_orders))
        // Производитель (админ)
        .route("/api/v1/admin/dealers", post(handlers::admin::create_dealer))
        .route("/api/v1/admin/dealers", get(handlers::admin::list_dealers))
        .route("/api/v1/admin/dealers/:id", axum::routing::get(handlers::admin::get_dealer).put(handlers::admin::update_dealer))
        .route("/api/v1/admin/dealers/:id/balance", post(handlers::admin::update_dealer_balance))
        .route("/api/v1/admin/dealers/:id/transactions", get(handlers::admin::list_dealer_transactions))
        .route("/api/v1/admin/dealers/:id/users", get(handlers::admin::list_dealer_users))
        .route("/api/v1/admin/dealers/:id/stats", get(handlers::admin::get_dealer_stats))
        .route("/api/v1/admin/dealers/:id/stats/by_branch", get(handlers::admin::get_dealer_stats_by_branch))
        .route("/api/v1/admin/dealers/:id/chart", get(handlers::admin::get_dealer_chart_stats))
        .route("/api/v1/admin/dealers/:dealer_id/departments", post(handlers::admin::create_department))
        .route("/api/v1/admin/dealers/:dealer_id/departments", get(handlers::admin::list_departments))
        .route("/api/v1/admin/dealers/:dealer_id/audit", get(handlers::admin::list_audit_logs))
        .route("/api/v1/admin/upload", post(handlers::admin::upload_file))
        .route("/api/v1/admin/stats", get(handlers::admin::get_admin_stats))
        .route("/api/v1/admin/orders", get(handlers::admin::list_all_orders))
        .route("/api/v1/admin/production/orders", get(handlers::admin::get_production_orders))
        .route("/api/v1/admin/orders/:id/status", put(handlers::admin::update_order_status))
        .route("/api/v1/admin/dealers/:id/activate_domain", post(handlers::admin::activate_dealer_domain))
        // Кабинет дилера (управление сетью)
        .route("/api/v1/cabinet/:dealer_id/managers", get(handlers::cabinet::list_cabinet_users).post(handlers::cabinet::create_manager))
        .route("/api/v1/cabinet/:dealer_id/subdealers", get(handlers::cabinet::list_subdealers).post(handlers::cabinet::create_subdealer))
        .route("/api/v1/cabinet/:dealer_id/branches", get(handlers::cabinet::list_branches).post(handlers::cabinet::create_branch))
        .route("/api/v1/cabinet/:dealer_id/branches/:branch_id", put(handlers::cabinet::update_branch).delete(handlers::cabinet::delete_branch))
        // Управление ценами
        .route("/api/v1/admin/pricing", get(handlers::pricing::get_global_pricing))
        .route("/api/v1/admin/pricing", post(handlers::pricing::update_global_pricing))
        .route("/api/v1/pricing", get(handlers::pricing::get_global_pricing))
        // Фавикон дилера
        .route("/api/v1/tenant/favicon", get(handlers::content::get_tenant_favicon))
        // Контент и мультитенантность
        .route("/api/v1/tenant/config", get(handlers::content::get_tenant_config))
        .layer(cors)
        .with_state(state);

    // Запуск сервера
    let port = std::env::var("PORT").unwrap_or_else(|_| "8081".to_string());
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
