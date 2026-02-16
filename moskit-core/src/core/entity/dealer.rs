// entity/dealer.rs - Сущность дилера

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use sqlx::{FromRow, Type};

use super::pricing::MarginConfig;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DealerNotificationSettings {
    pub id: Uuid,
    pub dealer_id: Uuid,
    pub telegram_chat_id: Option<String>,
    pub email_notifications: bool,
    pub notify_on_new_order: bool,
    pub notify_on_status_change: bool,
    pub notify_on_balance_low: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, Type, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum DeliveryMode {
    SelfPickup,      // Самовывоз
    DealerDelivery,  // Доставка дилеру
    FullService,     // Монтаж силами производителя
}

#[derive(Debug, Clone, Serialize, Deserialize, Type, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum PaymentType {
    Prepaid,  // Депозит
    Postpaid, // По факту
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct DealerBranding {
    pub logo_url: Option<String>,
    pub primary_color: Option<String>, // HEX код, например #2196F3
    pub short_description: Option<String>,
    pub full_description: Option<String>,
    pub working_hours: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct DealerContacts {
    pub phones: Vec<String>,
    pub emails: Vec<String>,
    pub additional_cities: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct DealerLegalInfo {
    pub requisites: Option<String>, // Реквизиты компании
    pub privacy_policy_url: Option<String>,
    pub privacy_policy_text: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct DealerSeoConfig {
    pub title_template: Option<String>, // Например: "Москитные сетки в {city} - {dealer_name}"
    pub description_template: Option<String>,
    pub keywords: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Dealer {
    pub id: Uuid,
    pub name: String,
    pub city: String,
    pub phone: String,
    pub email: Option<String>,
    pub address: Option<String>,
    pub domain: Option<String>,
    #[sqlx(json)]
    pub margin_config: MarginConfig,
    pub delivery_mode: DeliveryMode,
    pub payment_type: PaymentType,
    pub balance: f64,
    #[sqlx(json)]
    pub branding: DealerBranding,
    #[sqlx(json)]
    pub contacts: DealerContacts,
    #[sqlx(json)]
    pub legal_info: DealerLegalInfo,
    #[sqlx(json)]
    pub seo_config: DealerSeoConfig,
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
            delivery_mode: DeliveryMode::SelfPickup,
            payment_type: PaymentType::Postpaid,
            balance: 0.0,
            branding: DealerBranding::default(),
            contacts: DealerContacts::default(),
            legal_info: DealerLegalInfo::default(),
            seo_config: DealerSeoConfig::default(),
            is_active: true,
            created_at: now,
            updated_at: now,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct DealerDepartment {
    pub id: Uuid,
    pub dealer_id: Uuid,
    pub name: String,
    pub markup_config: serde_json::Value, // JSON с наценками на типы сеток
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl DealerDepartment {
    pub fn new(dealer_id: Uuid, name: String) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4(),
            dealer_id,
            name,
            markup_config: serde_json::json!({}),
            is_active: true,
            created_at: now,
            updated_at: now,
        }
    }
}
