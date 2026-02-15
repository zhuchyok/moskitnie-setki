// handlers/mod.rs - HTTP обработчики

pub mod auth;
pub mod dealer;
pub mod admin;

use axum::{
    response::Json,
    http::StatusCode,
};
use serde::{Deserialize, Serialize};

pub async fn health() -> &'static str {
    "OK"
}

// Базовые DTO
#[derive(Debug, Serialize, Deserialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T) -> Self {
        Self {
            success: true,
            data: Some(data),
            error: None,
        }
    }

    pub fn error(message: &str) -> Self {
        Self {
            success: false,
            data: None,
            error: Some(message.to_string()),
        }
    }
}

pub type ApiResult<T> = (StatusCode, Json<ApiResponse<T>>);

pub fn ok<T: Serialize>(data: T) -> ApiResult<T> {
    (StatusCode::OK, Json(ApiResponse::success(data)))
}

pub fn created<T: Serialize>(data: T) -> ApiResult<T> {
    (StatusCode::CREATED, Json(ApiResponse::success(data)))
}

pub fn bad_request<T: Serialize>(message: &str) -> ApiResult<T> {
    (StatusCode::BAD_REQUEST, Json(ApiResponse::error(message)))
}

pub fn not_found<T: Serialize>(message: &str) -> ApiResult<T> {
    (StatusCode::NOT_FOUND, Json(ApiResponse::error(message)))
}

pub fn internal_error<T: Serialize>(message: &str) -> ApiResult<T> {
    (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::error(message)))
}
