//! Прокси POST /api/callback в Nuxt (web). В проде NPM направляет /api/* в moskit-api,
//! а эндпоинт обратного звонка и отправка письма реализованы в Nuxt (server/api/callback.post.ts).

use axum::{
    body::{Body, Bytes},
    http::{StatusCode, header},
    response::{IntoResponse, Response},
};
use reqwest::Client;
use std::time::Duration;

const DEFAULT_CALLBACK_PROXY_URL: &str = "http://web:3000";

/// Проксирует POST /api/callback в Nuxt (web). Тело передаётся как есть.
pub async fn proxy_callback(body: Bytes) -> Response {
    let body_bytes = if body.is_empty() {
        return (
            StatusCode::BAD_REQUEST,
            [(header::CONTENT_TYPE, "application/json")],
            r#"{"message":"Invalid body"}"#,
        )
            .into_response();
    } else {
        body
    };

    let url = std::env::var("CALLBACK_PROXY_URL").unwrap_or_else(|_| DEFAULT_CALLBACK_PROXY_URL.to_string());
    let full_url = format!("{}/api/callback", url.trim_end_matches('/'));

    let client = match Client::builder()
        .timeout(Duration::from_secs(15))
        .build()
    {
        Ok(c) => c,
        Err(e) => {
            tracing::error!("callback proxy: client build: {}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                [(header::CONTENT_TYPE, "application/json")],
                r#"{"message":"Ошибка сервиса"}"#,
            )
                .into_response();
        }
    };

    let resp = match client
        .post(&full_url)
        .header("Content-Type", "application/json")
        .body(body_bytes.to_vec())
        .send()
        .await
    {
        Ok(r) => r,
        Err(e) => {
            tracing::error!("callback proxy: request to Nuxt failed: {}", e);
            return (
                StatusCode::BAD_GATEWAY,
                [(header::CONTENT_TYPE, "application/json")],
                format!(r#"{{"message":"Сервис временно недоступен"}}"#),
            )
                .into_response();
        }
    };

    let status = StatusCode::from_u16(resp.status().as_u16()).unwrap_or(StatusCode::INTERNAL_SERVER_ERROR);
    let body = match resp.bytes().await {
        Ok(b) => b.to_vec(),
        Err(e) => {
            tracing::warn!("callback proxy: read response body: {}", e);
            return (
                StatusCode::BAD_GATEWAY,
                [(header::CONTENT_TYPE, "application/json")],
                r#"{"message":"Ошибка ответа сервиса"}"#,
            )
                .into_response();
        }
    };

    (
        status,
        [(header::CONTENT_TYPE, "application/json")],
        Body::from(body),
    )
        .into_response()
}
