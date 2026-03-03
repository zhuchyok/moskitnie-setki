// entity/dealer.rs - Сущность дилера

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use sqlx::FromRow;

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

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum DeliveryMode {
    SelfPickup,      // Самовывоз
    DealerDelivery,  // Доставка дилеру
    FullService,     // Монтаж силами производителя
}

impl sqlx::Type<sqlx::Postgres> for DeliveryMode {
    fn type_info() -> sqlx::postgres::PgTypeInfo {
        sqlx::postgres::PgTypeInfo::with_name("TEXT")
    }
}

impl DeliveryMode {
    /// Каноническое значение для БД и API (всегда snake_case, как в БД).
    pub fn as_db_value(&self) -> &'static str {
        match self {
            DeliveryMode::SelfPickup => "self_pickup",
            DeliveryMode::DealerDelivery => "dealer_delivery",
            DeliveryMode::FullService => "full_service",
        }
    }
    /// Парсит значение из БД (регистронезависимо): self_pickup, SELF_PICKUP и т.д.
    pub fn from_db_value(s: &str) -> Result<Self, String> {
        match s.trim().to_lowercase().as_str() {
            "self_pickup" => Ok(DeliveryMode::SelfPickup),
            "dealer_delivery" => Ok(DeliveryMode::DealerDelivery),
            "full_service" => Ok(DeliveryMode::FullService),
            _ => Err(format!("Invalid value for DeliveryMode: {:?}", s)),
        }
    }
}

impl<'r> sqlx::Decode<'r, sqlx::Postgres> for DeliveryMode {
    fn decode(value: sqlx::postgres::PgValueRef<'r>) -> Result<Self, Box<dyn std::error::Error + Send + Sync>> {
        let s = <&str as sqlx::Decode<sqlx::Postgres>>::decode(value)?;
        Self::from_db_value(s).map_err(|e| e.into())
    }
}

impl<'q> sqlx::Encode<'q, sqlx::Postgres> for DeliveryMode {
    fn encode_by_ref(&self, buf: &mut sqlx::postgres::PgArgumentBuffer) -> Result<sqlx::encode::IsNull, Box<dyn std::error::Error + Send + Sync>> {
        <&str as sqlx::Encode<sqlx::Postgres>>::encode(self.as_db_value(), buf)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum PaymentType {
    Prepaid,  // Депозит
    Postpaid, // По факту
}

impl sqlx::Type<sqlx::Postgres> for PaymentType {
    fn type_info() -> sqlx::postgres::PgTypeInfo {
        sqlx::postgres::PgTypeInfo::with_name("TEXT")
    }
}

impl PaymentType {
    /// Каноническое значение для БД и API (всегда как в БД).
    pub fn as_db_value(&self) -> &'static str {
        match self {
            PaymentType::Prepaid => "prepaid",
            PaymentType::Postpaid => "postpaid",
        }
    }
    /// Парсит значение из БД (регистронезависимо).
    pub fn from_db_value(s: &str) -> Result<Self, String> {
        match s.trim().to_lowercase().as_str() {
            "prepaid" => Ok(PaymentType::Prepaid),
            "postpaid" => Ok(PaymentType::Postpaid),
            _ => Err(format!("Invalid value for PaymentType: {:?}", s)),
        }
    }
}

impl<'r> sqlx::Decode<'r, sqlx::Postgres> for PaymentType {
    fn decode(value: sqlx::postgres::PgValueRef<'r>) -> Result<Self, Box<dyn std::error::Error + Send + Sync>> {
        let s = <&str as sqlx::Decode<sqlx::Postgres>>::decode(value)?;
        Self::from_db_value(s).map_err(|e| e.into())
    }
}

impl<'q> sqlx::Encode<'q, sqlx::Postgres> for PaymentType {
    fn encode_by_ref(&self, buf: &mut sqlx::postgres::PgArgumentBuffer) -> Result<sqlx::encode::IsNull, Box<dyn std::error::Error + Send + Sync>> {
        <&str as sqlx::Encode<sqlx::Postgres>>::encode(self.as_db_value(), buf)
    }
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

use rust_decimal::Decimal;

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
    pub balance: Decimal,
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
            balance: Decimal::ZERO,
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

#[cfg(test)]
mod tests {
    use super::{DeliveryMode, PaymentType};

    #[test]
    fn delivery_mode_from_db_value_accepts_any_case() {
        assert_eq!(DeliveryMode::from_db_value("self_pickup").unwrap(), DeliveryMode::SelfPickup);
        assert_eq!(DeliveryMode::from_db_value("SELF_PICKUP").unwrap(), DeliveryMode::SelfPickup);
        assert_eq!(DeliveryMode::from_db_value("Self_Pickup").unwrap(), DeliveryMode::SelfPickup);
        assert_eq!(DeliveryMode::from_db_value("  dealer_delivery  ").unwrap(), DeliveryMode::DealerDelivery);
        assert_eq!(DeliveryMode::from_db_value("DEALER_DELIVERY").unwrap(), DeliveryMode::DealerDelivery);
        assert_eq!(DeliveryMode::from_db_value("FULL_SERVICE").unwrap(), DeliveryMode::FullService);
        assert!(DeliveryMode::from_db_value("unknown").is_err());
    }

    #[test]
    fn payment_type_from_db_value_accepts_any_case() {
        assert_eq!(PaymentType::from_db_value("postpaid").unwrap(), PaymentType::Postpaid);
        assert_eq!(PaymentType::from_db_value("POSTPAID").unwrap(), PaymentType::Postpaid);
        assert_eq!(PaymentType::from_db_value("prepaid").unwrap(), PaymentType::Prepaid);
        assert_eq!(PaymentType::from_db_value("PREPAID").unwrap(), PaymentType::Prepaid);
        assert!(PaymentType::from_db_value("invalid").is_err());
    }

    #[test]
    fn delivery_mode_and_payment_type_as_db_value_roundtrip() {
        for mode in &[DeliveryMode::SelfPickup, DeliveryMode::DealerDelivery, DeliveryMode::FullService] {
            let s = mode.as_db_value();
            assert_eq!(DeliveryMode::from_db_value(s).unwrap(), *mode, "roundtrip {}", s);
        }
        for pt in &[PaymentType::Prepaid, PaymentType::Postpaid] {
            let s = pt.as_db_value();
            assert_eq!(PaymentType::from_db_value(s).unwrap(), *pt, "roundtrip {}", s);
        }
    }
}
