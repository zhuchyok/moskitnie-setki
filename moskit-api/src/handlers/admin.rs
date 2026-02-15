// handlers/admin.rs - Обработчики для админки производителя

use serde::{Deserialize, Serialize};
use super::{ok, bad_request, ApiResult};

#[derive(Debug, Deserialize)]
pub struct CreateDealerRequest {
    pub name: String,
    pub city: String,
    pub phone: String,
    pub email: Option<String>,
    pub domain: Option<String>,
    pub margin_percent: Option<f64>,
}

#[derive(Debug, Serialize)]
pub struct DealerResponse {
    pub id: String,
    pub name: String,
    pub city: String,
    pub phone: String,
    pub domain: Option<String>,
    pub is_active: bool,
}

pub async fn create_dealer(Json(payload): Json<CreateDealerRequest>) -> ApiResult<DealerResponse> {
    // TODO: Создать дилера в БД
    ok(DealerResponse {
        id: "new_dealer_id".to_string(),
        name: payload.name,
        city: payload.city,
        phone: payload.phone,
        domain: payload.domain,
        is_active: true,
    })
}

pub async fn list_dealers() -> ApiResult<Vec<DealerResponse>> {
    // TODO: Получить список дилеров
    ok(vec![])
}

#[derive(Debug, Deserialize)]
pub struct UpdateDealerRequest {
    pub name: Option<String>,
    pub city: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub domain: Option<String>,
    pub margin_percent: Option<f64>,
    pub is_active: Option<bool>,
}

pub async fn update_dealer(
    axum::extract::Path(id): axum::extract::Path<String>,
    Json(payload): Json<UpdateDealerRequest>,
) -> ApiResult<DealerResponse> {
    // TODO: Обновить дилера
    ok(DealerResponse {
        id,
        name: payload.name.unwrap_or_default(),
        city: payload.city.unwrap_or_default(),
        phone: payload.phone.unwrap_or_default(),
        domain: payload.domain,
        is_active: payload.is_active.unwrap_or(true),
    })
}

#[derive(Debug, Serialize)]
pub struct OrderListItem {
    pub id: String,
    pub order_number: String,
    pub dealer_name: Option<String>,
    pub client_name: String,
    pub client_phone: String,
    pub status: String,
    pub total_amount: f64,
    pub created_at: String,
}

pub async fn list_all_orders() -> ApiResult<Vec<OrderListItem>> {
    // TODO: Получить все заказы
    ok(vec![])
}

#[derive(Debug, Deserialize)]
pub struct UpdateStatusRequest {
    pub status: String,
    pub comment: Option<String>,
}

pub async fn update_order_status(
    axum::extract::Path(id): axum::extract::Path<String>,
    Json(payload): Json<UpdateStatusRequest>,
) -> ApiResult<OrderListItem> {
    // TODO: Обновить статус заказа
    ok(OrderListItem {
        id,
        order_number: "MS-20260214123456".to_string(),
        dealer_name: None,
        client_name: "Иван".to_string(),
        client_phone: "+7xxx".to_string(),
        status: payload.status,
        total_amount: 1000.0,
        created_at: "2026-02-14T12:00:00Z".to_string(),
    })
}
