// entity/dealer.rs - Сущность дилера

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::pricing::MarginConfig;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Dealer {
    pub id: Uuid,
    pub name: String,
    pub city: String,
    pub phone: String,
    pub email: Option<String>,
    pub address: Option<String>,
    pub domain: Option<String>,  // Уникальный домен для мультитенантности
    pub margin_config: MarginConfig,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Dealer {
    pub fn new(name: String, city: String, phone: String) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4(),
            name,
            city,
            phone,
            email: None,
            address: None,
            domain: None,
            margin_config: MarginConfig::default(),
            is_active: true,
            created_at: now,
            updated_at: now,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DealerDomain {
    pub id: Uuid,
    pub dealer_id: Uuid,
    pub domain: String,
    pub is_primary: bool,
    pub ssl_enabled: bool,
}

impl DealerDomain {
    pub fn new(dealer_id: Uuid, domain: String, is_primary: bool) -> Self {
        Self {
            id: Uuid::new_v4(),
            dealer_id,
            domain,
            is_primary,
            ssl_enabled: false,
        }
    }
}
