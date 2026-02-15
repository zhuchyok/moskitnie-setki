// entity/pricing.rs - Ценообразование

use serde::{Deserialize, Serialize};

/// Конфигурация наценки дилера
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MarginConfig {
    /// Базовая наценка (напр. 30% = 1.30)
    pub base_margin_percent: f64,
    /// Коэффициент города (1.0 - столица, 0.8 - регион)
    pub city_multiplier: f64,
    /// Скидки за объём
    pub volume_discounts: Vec<VolumeDiscount>,
    /// Наценки по категориям
    pub category_margins: std::collections::HashMap<String, f64>,
}

impl Default for MarginConfig {
    fn default() -> Self {
        Self {
            base_margin_percent: 30.0,
            city_multiplier: 1.0,
            volume_discounts: Vec::new(),
            category_margins: std::collections::HashMap::new(),
        }
    }
}

/// Скидка за объём
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VolumeDiscount {
    pub min_orders_per_month: u32,
    pub discount_percent: f64,
}

/// Результат расчёта цены для дилера
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DealerPrice {
    /// Себестоимость для дилера
    pub dealer_cost: f64,
    /// Рекомендованная цена
    pub suggested_price: f64,
    /// Цена которую выставил дилер
    pub actual_price: f64,
    /// Наценка дилера (%)
    pub margin_percent: f64,
    /// Прибыль дилера
    pub dealer_profit: f64,
}

/// Конфигурация цены товара
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PriceConfig {
    /// Базовая цена (себестоимость)
    pub base_price: f64,
    /// Цена для дилера (с наценкой производителя)
    pub dealer_price: f64,
    /// Минимальная цена для дилера
    pub min_dealer_price: f64,
    /// Наценка дилера по умолчанию (%)
    pub default_dealer_margin: f64,
}
