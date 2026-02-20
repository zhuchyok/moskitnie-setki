// handlers/pricing.rs - Управление ценами

use axum::{Json, extract::State};
use crate::handlers::{ok, ApiResult, bad_request};
use crate::AppState;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PricingItem {
    pub id: String,
    pub name: String,
    pub price: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GlobalPricing {
    pub mesh: Vec<PricingItem>,
    pub profiles: Vec<PricingItem>,
    pub components: Vec<PricingItem>,
    pub services: Vec<PricingItem>,
    pub markup: MarkupConfig,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MarkupConfig {
    pub dealer: f64,
    pub client: f64,
    pub manufacturing_base: f64,
    pub manufacturing_percent: f64,
    pub measurement_base: f64,
    pub measurement_percent: f64,
    pub measurement_profit_factor: f64,
    pub urgent_profit_factor: f64,
    pub installation_profit_factor: f64,
    pub delivery_profit_factor: f64,
}

pub async fn get_global_pricing(State(state): State<Arc<AppState>>) -> ApiResult<GlobalPricing> {
    tracing::info!("GET /api/v1/admin/pricing called");
    
    let row: Option<(serde_json::Value,)> = sqlx::query_as("SELECT value FROM global_settings WHERE key = 'global_pricing'")
        .fetch_optional(&state.pool)
        .await
        .map_err(|e| bad_request(&e.to_string()))?;

    if let Some((value,)) = row {
        let pricing: GlobalPricing = serde_json::from_value(value).map_err(|e| bad_request(&e.to_string()))?;
        return ok(pricing);
    }

    // Fallback на дефолты если в БД пусто
    let mesh = vec![
        PricingItem { id: "standart".to_string(), name: "Стандарт".to_string(), price: 63.0 },
        PricingItem { id: "antimoshka".to_string(), name: "Антимошка".to_string(), price: 265.0 },
        PricingItem { id: "ultravyu".to_string(), name: "Ультравью".to_string(), price: 295.0 },
        PricingItem { id: "antikoshka".to_string(), name: "Антикошка".to_string(), price: 414.0 },
        PricingItem { id: "antipyl".to_string(), name: "Антипыль".to_string(), price: 645.0 },
    ];
    let profiles = vec![
        PricingItem { id: "white".to_string(), name: "Белый (Рамочная)".to_string(), price: 60.0 },
        PricingItem { id: "brown".to_string(), name: "Коричневый (Рамочная)".to_string(), price: 64.8 },
        PricingItem { id: "anthracite".to_string(), name: "Антрацит (Рамочная)".to_string(), price: 70.0 },
        PricingItem { id: "ral".to_string(), name: "RAL (Рамочная)".to_string(), price: 60.0 },
        PricingItem { id: "white_vsn".to_string(), name: "Белый (Вставная VSN)".to_string(), price: 151.0 },
        PricingItem { id: "brown_vsn".to_string(), name: "Коричневый (Вставная VSN)".to_string(), price: 153.0 },
        PricingItem { id: "anthracite_vsn".to_string(), name: "Антрацит (Вставная VSN)".to_string(), price: 163.0 },
        PricingItem { id: "ral_vsn".to_string(), name: "RAL (Вставная VSN)".to_string(), price: 251.0 },
        PricingItem { id: "impost_white".to_string(), name: "Поперечина (Белая)".to_string(), price: 62.0 },
        PricingItem { id: "impost_brown".to_string(), name: "Поперечина (Коричневая)".to_string(), price: 67.2 },
        PricingItem { id: "impost_anthracite".to_string(), name: "Поперечина (Антрацит)".to_string(), price: 75.0 },
        PricingItem { id: "ral_painting".to_string(), name: "Наценка покраски RAL (мп)".to_string(), price: 100.0 },
    ];
        let markup = MarkupConfig {
            dealer: 1.43,
            client: 2.13,
            manufacturing_base: 50.0,
            manufacturing_percent: 5.0,
            measurement_base: 270.0,
            measurement_percent: 5.0,
            measurement_profit_factor: 5.0,
            urgent_profit_factor: 10.0,
            installation_profit_factor: 33.0,
            delivery_profit_factor: 33.0,
        };

    let components = vec![
        PricingItem { id: "corner_white".to_string(), name: "Уголок (Белый)".to_string(), price: 3.75 },
        PricingItem { id: "corner_brown".to_string(), name: "Уголок (Коричневый)".to_string(), price: 6.0 },
        PricingItem { id: "corner_anthracite".to_string(), name: "Уголок (Антрацит)".to_string(), price: 7.0 },
        PricingItem { id: "corner_vsn_white".to_string(), name: "Уголок VSN (Белый)".to_string(), price: 14.8 },
        PricingItem { id: "corner_vsn_brown".to_string(), name: "Уголок VSN (Коричневый)".to_string(), price: 4.85 },
        PricingItem { id: "corner_vsn_anthracite".to_string(), name: "Уголок VSN (Антрацит)".to_string(), price: 7.15 },
        PricingItem { id: "handle_plastic".to_string(), name: "Ручка пластик (шт)".to_string(), price: 2.2 },
        PricingItem { id: "handle_metal".to_string(), name: "Ручка металл (шт)".to_string(), price: 8.0 },
        PricingItem { id: "mount_plastic".to_string(), name: "Крепления пластик (шт)".to_string(), price: 40.0 },
        PricingItem { id: "mount_metal".to_string(), name: "Крепления металл (шт)".to_string(), price: 40.0 },
        PricingItem { id: "mount_vsn".to_string(), name: "Крепление VSN (шт)".to_string(), price: 30.0 },
        PricingItem { id: "mount_impost".to_string(), name: "Крепление импоста (шт)".to_string(), price: 1.8 },
        PricingItem { id: "screw".to_string(), name: "Саморез (шт)".to_string(), price: 1.0 },
        PricingItem { id: "rivet".to_string(), name: "Клепка (шт)".to_string(), price: 5.0 },
        PricingItem { id: "washer".to_string(), name: "Шайба (шт)".to_string(), price: 2.0 },
        PricingItem { id: "cord".to_string(), name: "Шнур (мп)".to_string(), price: 4.6 },
        PricingItem { id: "stretch".to_string(), name: "Стретч-пленка (упаковка)".to_string(), price: 24.0 },
    ];

        let services = vec![
            PricingItem { id: "installation".to_string(), name: "Монтаж (рамочная)".to_string(), price: 300.0 },
            PricingItem { id: "installation_vsn".to_string(), name: "Монтаж (вставная VSN)".to_string(), price: 100.0 },
            PricingItem { id: "installation_plisse".to_string(), name: "Монтаж (плиссе)".to_string(), price: 500.0 },
            PricingItem { id: "delivery".to_string(), name: "Доставка".to_string(), price: 300.0 },
            PricingItem { id: "delivery_mixed".to_string(), name: "Доставка (смежная)".to_string(), price: 100.0 },
        ];

    ok(GlobalPricing {
        mesh,
        profiles,
        components,
        services,
        markup,
    })
}

pub async fn update_global_pricing(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<GlobalPricing>,
) -> ApiResult<GlobalPricing> {
    tracing::info!("Updating global pricing: {:?}", payload);
    
    let value = serde_json::to_value(&payload).map_err(|e| bad_request(&e.to_string()))?;
    
    sqlx::query("INSERT INTO global_settings (key, value) VALUES ('global_pricing', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()")
        .bind(value)
        .execute(&state.pool)
        .await
        .map_err(|e| bad_request(&e.to_string()))?;
        
    ok(payload)
}
