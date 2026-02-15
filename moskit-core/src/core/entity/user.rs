// entity/user.rs - Сущность пользователя

use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum UserRole {
    Admin,      // Производитель
    Dealer,     // Дилер
    Manager,     // Менеджер производства
    Installer,   // Монтажник
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub name: String,
    pub role: UserRole,
    pub dealer_id: Option<Uuid>,  // Ссылка на дилера, если роль = Dealer
    pub phone: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl User {
    pub fn new(email: String, name: String, role: UserRole) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4(),
            email,
            name,
            role,
            dealer_id: None,
            phone: None,
            created_at: now,
            updated_at: now,
        }
    }
}
