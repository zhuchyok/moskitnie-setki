// handlers/dealer.rs - Обработчики для дилера

use serde::{Deserialize, Serialize};
use super::{ok, bad_request, ApiResult};

use moskit_core::entity::{ColorId, FrameType, MarginConfig, MeshType};
use moskit_core::service::pricing::{self, calculate_dealer_price, cost_to_client_price, compute_cost, compute_cost_vsn};

#[derive(Debug, Deserialize)]
pub struct CalculateRequest {
    pub width_mm: u32,
    pub height_mm: u32,
    pub color_id: u8,
    pub mesh_type: String,
    pub frame_type: String,
    pub handle_type: Option<String>,
    pub installation: Option<bool>,
}

#[derive(Debug, Serialize)]
pub struct CalculateResponse {
    pub dealer_cost: f64,
    pub client_price: f64,
    pub dealer_profit: f64,
    pub breakdown: PriceBreakdown,
}

#[derive(Debug, Serialize)]
pub struct PriceBreakdown {
    pub base_price: f64,
    pub installation: f64,
    pub handle_metal: f64,
    pub total: f64,
}

pub async fn calculate(Json(payload): Json<CalculateRequest>) -> ApiResult<CalculateResponse> {
    // Валидация
    if payload.width_mm < 200 || payload.width_mm > 10000 {
        return bad_request("Ширина должна быть от 200 до 10000 мм");
    }
    if payload.height_mm < 200 || payload.height_mm > 10000 {
        return bad_request("Высота должна быть от 200 до 10000 мм");
    }
    if payload.color_id < 1 || payload.color_id > 4 {
        return bad_request("Неверный цвет");
    }

    // Парсинг типов
    let mesh_type = match payload.mesh_type.as_str() {
        "standart" => MeshType::Standart,
        "antimoshka" => MeshType::Antimoshka,
        "ultravyu" => MeshType::Ultravyu,
        "antikoshka" => MeshType::Antikoshka,
        "antipyl" => MeshType::Antipyl,
        _ => return bad_request("Неверный тип сетки"),
    };

    let frame_type = match payload.frame_type.as_str() {
        "standart" => FrameType::Standart,
        "vstavnaya" => FrameType::Vstavnaya,
        _ => return bad_request("Неверный тип рамки"),
    };

    let color_id = ColorId(payload.color_id);

    // Расчёт себестоимости
    let cost = match frame_type {
        FrameType::Standart => compute_cost(payload.width_mm, payload.height_mm, color_id, &mesh_type),
        FrameType::Vstavnaya => compute_cost_vsn(payload.width_mm, payload.height_mm, color_id, &mesh_type),
    };

    // Цена для клиента
    let client_price = cost_to_client_price(cost);

    // Доп. услуги
    let installation = if payload.installation.unwrap_or(false) { 400.0 } else { 0.0 };
    let handle_metal = if payload.handle_type.as_deref() == Some("metal") { 50.0 } else { 0.0 };

    let total = (client_price + installation + handle_metal) as u32 as f64;

    // Прибыль дилера
    let margin_config = MarginConfig::default();
    let dealer_price = calculate_dealer_price(cost, &margin_config);

    ok(CalculateResponse {
        dealer_cost: cost,
        client_price: total,
        dealer_profit: dealer_price.dealer_profit,
        breakdown: PriceBreakdown {
            base_price: client_price,
            installation,
            handle_metal,
            total,
        },
    })
}

#[derive(Debug, Serialize)]
pub struct DealerPricing {
    pub dealer_factor: f64,
    pub client_factor: f64,
    pub installation_price: f64,
    pub handle_metal_price: f64,
}

pub async fn get_pricing() -> ApiResult<DealerPricing> {
    ok(DealerPricing {
        dealer_factor: 1.43,
        client_factor: 2.13,
        installation_price: 400.0,
        handle_metal_price: 50.0,
    })
}

#[derive(Debug, Deserialize)]
pub struct CreateOrderRequest {
    pub client_name: String,
    pub client_phone: String,
    pub client_address: Option<String>,
    pub items: Vec<OrderItemRequest>,
    pub delivery: Option<String>,
    pub measurement: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct OrderItemRequest {
    pub width_mm: u32,
    pub height_mm: u32,
    pub color_id: u8,
    pub mesh_type: String,
    pub frame_type: String,
    pub handle_type: Option<String>,
    pub installation: bool,
    pub quantity: u32,
}

#[derive(Debug, Serialize)]
pub struct OrderResponse {
    pub order_id: String,
    pub order_number: String,
    pub total_amount: f64,
}

pub async fn create_order(Json(payload): Json<CreateOrderRequest>) -> ApiResult<OrderResponse> {
    // TODO: Сохранить заказ в БД
    ok(OrderResponse {
        order_id: "new_order_id".to_string(),
        order_number: "MS-20260214123456".to_string(),
        total_amount: 0.0,
    })
}

pub async fn list_orders() -> ApiResult<Vec<OrderResponse>> {
    // TODO: Получить список заказов дилера
    ok(vec![])
}
