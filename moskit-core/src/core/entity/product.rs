// entity/product.rs - Сущность товара

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::pricing::PriceConfig;

/// Категория товара
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum ProductCategory {
    MoskitnyeSetki,  // Москитные сетки
    Windows,          // Окна (будущее)
    Doors,            // Двери (будущее)
}

impl ProductCategory {
    pub fn as_str(&self) -> &'static str {
        match self {
            ProductCategory::MoskitnyeSetki => "moskitnye_setki",
            ProductCategory::Windows => "windows",
            ProductCategory::Doors => "doors",
        }
    }
}

/// Тип сетки
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum MeshType {
    Standart,
    Antimoshka,
    Antikoshka,
    Ultravyu,
    Antipyl,
}

/// Тип рамки
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum FrameType {
    Standart,
    Vstavnaya,
}

/// ID цвета
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ColorId(pub u8);

/// Параметры москитной сетки
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MeshParams {
    pub mesh_type: MeshType,
    pub frame_type: FrameType,
    pub color_id: ColorId,
    pub width_mm: u32,
    pub height_mm: u32,
    pub handle_type: Option<String>,  // "pvc" или "metal"
}

/// Универсальная структура товара
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Product {
    pub id: Uuid,
    pub category: ProductCategory,
    pub name: String,
    pub description: Option<String>,
    pub params: serde_json::Value,  // Параметры (размеры, цвет, тип)
    pub price_config: PriceConfig,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Product {
    pub fn new(category: ProductCategory, name: String, params: serde_json::Value, price_config: PriceConfig) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4(),
            category,
            name,
            description: None,
            params,
            price_config,
            is_active: true,
            created_at: now,
            updated_at: now,
        }
    }
}
