// entity/user.rs - Сущность пользователя

use chrono::{DateTime, Utc};
use uuid::Uuid;
use sqlx::{FromRow, Type};

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum UserRole {
    Admin,      // Производитель
    Dealer,     // Дилер
    Manager,     // Менеджер производства
    Installer,   // Монтажник
}

impl sqlx::Type<sqlx::Postgres> for UserRole {
    fn type_info() -> sqlx::postgres::PgTypeInfo {
        sqlx::postgres::PgTypeInfo::with_name("VARCHAR")
    }
}

impl<'r> sqlx::Decode<'r, sqlx::Postgres> for UserRole {
    fn decode(value: sqlx::postgres::PgValueRef<'r>) -> Result<Self, Box<dyn std::error::Error + Send + Sync>> {
        let s = <&str as sqlx::Decode<sqlx::Postgres>>::decode(value)?;
        match s {
            "admin" => Ok(UserRole::Admin),
            "dealer" => Ok(UserRole::Dealer),
            "manager" => Ok(UserRole::Manager),
            "installer" => Ok(UserRole::Installer),
            _ => Err(format!("Unknown user role: {}", s).into()),
        }
    }
}

impl<'q> sqlx::Encode<'q, sqlx::Postgres> for UserRole {
    fn encode_by_ref(&self, buf: &mut sqlx::postgres::PgArgumentBuffer) -> Result<sqlx::encode::IsNull, Box<dyn std::error::Error + Send + Sync>> {
        let s = match self {
            UserRole::Admin => "admin",
            UserRole::Dealer => "dealer",
            UserRole::Manager => "manager",
            UserRole::Installer => "installer",
        };
        <&str as sqlx::Encode<sqlx::Postgres>>::encode(s, buf)
    }
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, FromRow)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub name: String,
    pub role: UserRole,
    pub dealer_id: Option<Uuid>,  // Ссылка на дилера, если роль = Dealer
    pub phone: Option<String>,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl User {
    pub fn new(email: String, password_hash: String, name: String, role: UserRole) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4(),
            email,
            password_hash,
            name,
            role,
            dealer_id: None,
            phone: None,
            is_active: true,
            created_at: now,
            updated_at: now,
        }
    }
}
