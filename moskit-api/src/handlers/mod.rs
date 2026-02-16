// handlers/mod.rs

use axum::{Json, response::IntoResponse, http::StatusCode};
use serde::Serialize;

pub mod auth;
pub mod dealer;
pub mod admin;
pub mod pricing;
pub mod content;

pub type ApiResult<T> = Result<Json<T>, ApiError>;

#[derive(Debug, Serialize)]
pub struct ApiError {
    pub message: String,
    #[serde(skip)]
    pub status: StatusCode,
}

impl IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        (self.status, Json(self)).into_response()
    }
}

pub fn ok<T>(data: T) -> ApiResult<T> {
    Ok(Json(data))
}

pub fn bad_request(message: &str) -> ApiError {
    ApiError {
        message: message.to_string(),
        status: StatusCode::BAD_REQUEST,
    }
}

pub async fn health() -> impl IntoResponse {
    StatusCode::OK
}
