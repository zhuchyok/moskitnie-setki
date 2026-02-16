// handlers/dealer.rs - Обработчики для дилера 

use axum::{Json, extract::State};
use crate::handlers::{ok, ApiResult, bad_request};
use crate::AppState;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use uuid::Uuid;

#[derive(Debug, Deserialize)]
pub struct CalculateRequest {
    pub width: i32,
    pub height: i32,
    pub mesh_type: String,
    pub frame_type: String,
    pub color_id: i32,
    pub handle_type: String,
    pub installation: bool,
}

#[derive(Debug, Serialize)]
pub struct CalculateResponse {
    pub dealer_cost: f64,
    pub client_price: f64,
    pub profit: f64,
}

pub async fn get_pricing() -> ApiResult<serde_json::Value> {
    ok(serde_json::json!({ "status": "ok" }))
}

pub async fn calculate(Json(_payload): Json<CalculateRequest>) -> ApiResult<CalculateResponse> {
    ok(CalculateResponse {
        dealer_cost: 500.0,
        client_price: 1200.0,
        profit: 700.0,
    })
}

#[derive(Debug, Deserialize)]
pub struct CreateOrderRequest {
    pub client_name: String,
    pub client_phone: String,
    pub items: Vec<OrderItemRequest>,
}

#[derive(Debug, Deserialize)]
pub struct OrderItemRequest {
    pub name: String,
    pub quantity: i32,
    pub price: f64,
}

pub async fn create_order(Json(_payload): Json<CreateOrderRequest>) -> ApiResult<serde_json::Value> {
    ok(serde_json::json!({ "status": "created" }))
}

pub async fn list_orders(
    State(state): State<Arc<AppState>>,
) -> ApiResult<Vec<crate::handlers::admin::OrderListItem>> {
    use moskit_core::repository::OrderRepository;
    
    let order_repo = moskit_core::repository::PostgresOrderRepository::new(state.pool.clone());
    
    let orders = order_repo.list(100, 0).await.map_err(|e| bad_request(&e.to_string()))?;
    
    let response = orders.into_iter().map(|o| crate::handlers::admin::OrderListItem {
        id: o.id.to_string(),
        order_number: o.order_number,
        dealer_name: None,
        client_name: o.client_name,
        client_phone: o.client_phone,
        status: o.status.as_str().to_string(),
        total_amount: o.total_amount,
        created_at: o.created_at.to_rfc3339(),
    }).collect();

    ok(response)
}
