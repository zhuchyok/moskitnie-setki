// handlers/auth.rs - Аутентификация

use serde::{Deserialize, Serialize};
use super::{ok, bad_request, ApiResult};

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

pub async fn login(Json(payload): Json<LoginRequest>) -> ApiResult<LoginResponse> {
    // TODO: Реализовать аутентификацию
    // Пока заглушка
    ok(LoginResponse {
        token: "demo_token".to_string(),
        user_id: "demo_user_id".to_string(),
        role: "dealer".to_string(),
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

pub async fn register(Json(payload): Json<RegisterRequest>) -> ApiResult<RegisterResponse> {
    // TODO: Реализовать регистрацию
    // Пока заглушка
    ok(RegisterResponse {
        user_id: "new_user_id".to_string(),
        dealer_id: Some("new_dealer_id".to_string()),
    })
}
