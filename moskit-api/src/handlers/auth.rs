// handlers/auth.rs - Аутентификация

use axum::{Json, response::IntoResponse, http::StatusCode, extract::State};
use crate::AppState;
use crate::handlers::{ok, bad_request, ApiResult, ApiError};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use moskit_core::repository::UserRepository;
use moskit_core::repository::postgres::user::PostgresUserRepository;
use bcrypt::verify;
use jsonwebtoken::{encode, Header, EncodingKey};

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub token: String,
    pub user_id: String,
    pub role: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    role: String,
    exp: usize,
}

pub async fn login(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<LoginRequest>
) -> ApiResult<LoginResponse> {
    let repo = PostgresUserRepository::new(state.pool.clone());
    
    let user = repo.find_by_email(&payload.email).await.map_err(|e| ApiError {
        message: e.to_string(),
        status: StatusCode::INTERNAL_SERVER_ERROR,
    })?.ok_or_else(|| bad_request("Неверный email или пароль"))?;

    // Проверка пароля (bcrypt или прямая проверка для заглушки)
    let is_valid = if user.password_hash.starts_with("$2b$") || user.password_hash.starts_with("$2a$") {
        verify(&payload.password, &user.password_hash).unwrap_or(false)
    } else {
        // Для начальных данных (seed) без хеша
        payload.password.trim() == user.password_hash.trim()
    };

    if !is_valid {
        return Err(bad_request("Неверный email или пароль"));
    }

    // Генерация JWT
    let expiration = chrono::Utc::now()
        .checked_add_signed(chrono::Duration::days(7))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims {
        sub: user.id.to_string(),
        role: format!("{:?}", user.role).to_lowercase(),
        exp: expiration,
    };

    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "secret".to_string());
    let token = encode(&Header::default(), &claims, &EncodingKey::from_secret(secret.as_ref()))
        .map_err(|_| ApiError {
            message: "Ошибка генерации токена".to_string(),
            status: StatusCode::INTERNAL_SERVER_ERROR,
        })?;

    ok(LoginResponse {
        token,
        user_id: user.id.to_string(),
        role: format!("{:?}", user.role).to_lowercase(),
    })
}

#[derive(Debug, Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub password: String,
    pub name: String,
    pub city: String,
    pub phone: String,
}

#[derive(Debug, Serialize)]
pub struct RegisterResponse {
    pub user_id: String,
    pub dealer_id: Option<String>,
}

pub async fn register(Json(_payload): Json<RegisterRequest>) -> ApiResult<RegisterResponse> {
    // TODO: Реализовать регистрацию
    // Пока заглушка
    ok(RegisterResponse {
        user_id: "new_user_id".to_string(),
        dealer_id: Some("new_dealer_id".to_string()),
    })
}
