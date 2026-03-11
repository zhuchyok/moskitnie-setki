// handlers/dealer.rs - Обработчики для дилера 

use axum::{Json, extract::State};
use crate::handlers::{ok, ApiResult, bad_request};
use crate::AppState;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use uuid::Uuid;

use rust_decimal::Decimal;
use rust_decimal_macros::dec;
use moskit_core::entity::{ColorId, FrameType, MarginConfig, MeshType};
use moskit_core::service::pricing::PricingService;
use moskit_core::repository::{PostgresSettingsRepository, PostgresDealerRepository, DealerRepository};
use crate::handlers::pricing::get_global_pricing_internal;

#[derive(Debug, Deserialize)]
pub struct CalculateRequest {
    pub width: i32,
    pub height: i32,
    pub mesh_type: String,
    pub frame_type: String,
    pub color_id: i32,
    pub handle_type: String,
    pub installation: bool,
    pub dealer_id: Option<Uuid>,
}

#[derive(Debug, Serialize)]
pub struct CalculateResponse {
    pub dealer_cost: Decimal,
    pub client_price: Decimal,
    pub profit: Decimal,
}

pub async fn get_pricing() -> ApiResult<serde_json::Value> {
    ok(serde_json::json!({ "status": "ok" }))
}

pub async fn calculate(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CalculateRequest>
) -> ApiResult<CalculateResponse> {
    let settings_repo = PostgresSettingsRepository::new(state.pool.clone());
    let global_pricing = get_global_pricing_internal(&settings_repo).await.map_err(|e| bad_request(&e))?;

    let margin_config = if let Some(dealer_id) = payload.dealer_id {
        let dealer_repo = PostgresDealerRepository::new(state.pool.clone());
        dealer_repo.find_by_id(dealer_id).await
            .map_err(|e| bad_request(&e.to_string()))?
            .map(|d| d.margin_config)
            .unwrap_or_default()
    } else {
        MarginConfig::default()
    };

    let pricing_service = PricingService::new(global_pricing, margin_config);

    let mesh_type = match payload.mesh_type.as_str() {
        "antimoshka" => MeshType::Antimoshka,
        "antikoshka" => MeshType::Antikoshka,
        "ultravyu" => MeshType::Ultravyu,
        "antipyl" => MeshType::Antipyl,
        _ => MeshType::Standart,
    };

    let frame_type = match payload.frame_type.as_str() {
        "vstavnaya" => FrameType::Vstavnaya,
        _ => FrameType::Standart,
    };

    let base_cost = pricing_service.compute_cost(
        payload.width as u32,
        payload.height as u32,
        ColorId(payload.color_id as u8),
        &mesh_type,
        &frame_type,
    );

    let dealer_price = pricing_service.calculate_dealer_price(base_cost);

    ok(CalculateResponse {
        dealer_cost: dealer_price.dealer_cost,
        client_price: dealer_price.actual_price,
        profit: dealer_price.dealer_profit,
    })
}

#[derive(Debug, Deserialize)]
pub struct CreateOrderRequest {
    pub client_name: String,
    pub client_phone: String,
    pub dealer_id: Option<Uuid>,
    pub branch_id: Option<Uuid>, // Филиал (сайт), с которого пришел заказ
    pub items: Vec<OrderItemRequest>,
}

#[derive(Debug, Deserialize)]
pub struct OrderItemRequest {
    pub name: String,
    pub quantity: i32,
    pub price: Decimal,
    pub params: Option<serde_json::Value>,
}

pub async fn create_order(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateOrderRequest>
) -> ApiResult<serde_json::Value> {
    use moskit_core::entity::{Order, OrderItem, PaymentType, Transaction};
    use moskit_core::repository::{OrderRepository, PostgresOrderRepository, DealerRepository, PostgresDealerRepository};
    use chrono::Utc;

    let settings_repo = PostgresSettingsRepository::new(state.pool.clone());
    let global_pricing = get_global_pricing_internal(&settings_repo).await.map_err(|e| bad_request(&e))?;

    let dealer_repo = PostgresDealerRepository::new(state.pool.clone());
    let dealer = if let Some(dealer_id) = payload.dealer_id {
        dealer_repo.find_by_id(dealer_id).await
            .map_err(|e| bad_request(&e.to_string()))?
    } else {
        None
    };

    let branch = if let Some(branch_id) = payload.branch_id {
        // Находим филиал, чтобы применить его множитель
        sqlx::query_as::<_, moskit_core::entity::DealerBranch>(
            "SELECT * FROM dealer_branches WHERE id = $1"
        )
        .bind(branch_id)
        .fetch_optional(&state.pool)
        .await
        .map_err(|e| bad_request(&e.to_string()))?
    } else {
        None
    };

    let mut margin_config = dealer.as_ref()
        .map(|d| d.margin_config.clone())
        .unwrap_or_default();

    // Если заказ пришел с филиала, применяем его множитель
    if let Some(ref b) = branch {
        if let Some(m) = b.margin_config.get("branch_multiplier").and_then(|v| v.as_f64()) {
            margin_config.branch_multiplier = m;
        }
    }

    let pricing_service = PricingService::new(global_pricing, margin_config);

    let mut items = Vec::new();
    let mut total_dealer_cost = Decimal::ZERO;
    let mut total_selling_price = Decimal::ZERO;

    for item_req in payload.items {
        let params = item_req.params.clone().unwrap_or_else(|| serde_json::json!({}));
        
        let (dealer_cost, unit_price) = if let (Some(w), Some(h), Some(m), Some(f), Some(c)) = (
            params.get("width").and_then(|v| v.as_u64()),
            params.get("height").and_then(|v| v.as_u64()),
            params.get("mesh_type").and_then(|v| v.as_str()),
            params.get("frame_type").and_then(|v| v.as_str()),
            params.get("color_id").and_then(|v| v.as_u64()),
        ) {
            let mesh_type = match m {
                "antimoshka" => MeshType::Antimoshka,
                "antikoshka" => MeshType::Antikoshka,
                "ultravyu" => MeshType::Ultravyu,
                "antipyl" => MeshType::Antipyl,
                _ => MeshType::Standart,
            };
            let frame_type = match f {
                "vstavnaya" => FrameType::Vstavnaya,
                _ => FrameType::Standart,
            };

            let base_cost = pricing_service.compute_cost(w as u32, h as u32, ColorId(c as u8), &mesh_type, &frame_type);
            let dp = pricing_service.calculate_dealer_price(base_cost);
            (dp.dealer_cost, dp.actual_price)
        } else {
            (item_req.price * dec!(0.7), item_req.price)
        };

        let quantity = Decimal::from(item_req.quantity);
        total_dealer_cost += dealer_cost * quantity;
        total_selling_price += unit_price * quantity;

        items.push(OrderItem {
            id: Uuid::new_v4(),
            product_id: Uuid::nil(),
            name: item_req.name,
            params,
            quantity: item_req.quantity,
            unit_price,
            total_price: unit_price * quantity,
            dealer_cost,
        });
    }

    // --- ПРОВЕРКА БАЛАНСА (ОТКЛЮЧЕНА ДЛЯ ЗАЯВОК) ---
    /*
    if let Some(ref d) = dealer {
        if d.payment_type == PaymentType::Prepaid {
            if d.balance < total_dealer_cost {
                return Err(bad_request("Недостаточно средств на балансе. Пожалуйста, пополните счет."));
            }
        } else if d.payment_type == PaymentType::Postpaid {
             if d.balance + d.credit_limit < total_dealer_cost {
                return Err(bad_request("Превышен кредитный лимит. Пожалуйста, оплатите задолженность."));
            }
        }
    }
    */

    let mut order = Order::new(
        payload.dealer_id,
        payload.client_name,
        payload.client_phone,
        items,
    );

    order.branch_id = payload.branch_id;
    order.dealer_cost = total_dealer_cost;
    order.dealer_profit = total_selling_price - total_dealer_cost;
    order.dealer_price_total = total_dealer_cost;
    order.selling_price_total = total_selling_price;
    order.potential_profit = total_selling_price - total_dealer_cost;

    // Также подменяем город, если он указан в филиале
    if let Some(ref b) = branch {
        if let Some(city) = b.city.clone() {
            let current_address = order.client_address.clone().unwrap_or_default();
            order.client_address = Some(format!("{}, {}", city, current_address));
        }
    }

    let order_repo = PostgresOrderRepository::new(state.pool.clone());
    let created = order_repo.create(order).await.map_err(|e| bad_request(&e.to_string()))?;

    // --- ОБНОВЛЕНИЕ БАЛАНСА ПРИ СОЗДАНИИ ОТКЛЮЧЕНО (ПЕРЕНЕСЕНО В СТАТУС CONFIRMED) ---
    /*
    if let Some(mut d) = dealer {
        let old_balance = d.balance;
        d.balance -= total_dealer_cost;
        dealer_repo.update(d.clone()).await.map_err(|e| bad_request(&e.to_string()))?;

        let transaction = Transaction {
            id: Uuid::new_v4(),
            dealer_id: d.id,
            amount: -total_dealer_cost,
            balance_after: d.balance,
            transaction_type: "order_payment".to_string(),
            order_id: Some(created.id),
            description: Some(format!("Оплата заказа №{}", created.order_number)),
            created_at: Utc::now(),
        };
        dealer_repo.create_transaction(transaction).await.map_err(|e| bad_request(&e.to_string()))?;
    }
    */

    ok(serde_json::json!({ 
        "status": "created",
        "order_id": created.id,
        "order_number": created.order_number
    }))
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
