// core/repository/postgres/dealer.rs

use async_trait::async_trait;
use sqlx::PgPool;
use uuid::Uuid;

use crate::core::entity::{Dealer, MarginConfig};
use crate::core::error::{CoreError, CoreResult};
use crate::core::repository::DealerRepository;

pub struct PostgresDealerRepository {
    pool: PgPool,
}

impl PostgresDealerRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl DealerRepository for PostgresDealerRepository {
    async fn find_by_id(&self, id: Uuid) -> CoreResult<Option<Dealer>> {
        let dealer = sqlx::query_as::<_, Dealer>(
            r#"
            SELECT id, name, city, phone, email, address, domain, margin_config, delivery_mode, payment_type, balance, 
                   branding, contacts, legal_info, seo_config, is_active, created_at, updated_at
            FROM dealers
            WHERE id = $1
            "#,
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(dealer)
    }

    async fn find_by_domain(&self, domain: &str) -> CoreResult<Option<Dealer>> {
        let dealer = sqlx::query_as::<_, Dealer>(
            r#"
            SELECT id, name, city, phone, email, address, domain, margin_config, delivery_mode, payment_type, balance, 
                   branding, contacts, legal_info, seo_config, is_active, created_at, updated_at
            FROM dealers
            WHERE domain = $1
            "#,
        )
        .bind(domain)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(dealer)
    }

    async fn create(&self, dealer: Dealer) -> CoreResult<Dealer> {
        let margin_json = serde_json::to_value(&dealer.margin_config)
            .map_err(|e| CoreError::Internal(e.to_string()))?;
        let branding_json = serde_json::to_value(&dealer.branding)
            .map_err(|e| CoreError::Internal(e.to_string()))?;
        let contacts_json = serde_json::to_value(&dealer.contacts)
            .map_err(|e| CoreError::Internal(e.to_string()))?;
        let legal_json = serde_json::to_value(&dealer.legal_info)
            .map_err(|e| CoreError::Internal(e.to_string()))?;
        let seo_json = serde_json::to_value(&dealer.seo_config)
            .map_err(|e| CoreError::Internal(e.to_string()))?;

        sqlx::query(
            r#"
            INSERT INTO dealers (id, name, city, phone, email, address, domain, margin_config, delivery_mode, payment_type, balance, 
                               branding, contacts, legal_info, seo_config, is_active, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
            "#,
        )
        .bind(dealer.id)
        .bind(&dealer.name)
        .bind(&dealer.city)
        .bind(&dealer.phone)
        .bind(&dealer.email)
        .bind(&dealer.address)
        .bind(&dealer.domain)
        .bind(margin_json)
        .bind(&dealer.delivery_mode)
        .bind(&dealer.payment_type)
        .bind(dealer.balance)
        .bind(branding_json)
        .bind(contacts_json)
        .bind(legal_json)
        .bind(seo_json)
        .bind(dealer.is_active)
        .bind(dealer.created_at)
        .bind(dealer.updated_at)
        .execute(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(dealer)
    }

    async fn update(&self, dealer: Dealer) -> CoreResult<Dealer> {
        let margin_json = serde_json::to_value(&dealer.margin_config)
            .map_err(|e| CoreError::Internal(e.to_string()))?;
        let branding_json = serde_json::to_value(&dealer.branding)
            .map_err(|e| CoreError::Internal(e.to_string()))?;
        let contacts_json = serde_json::to_value(&dealer.contacts)
            .map_err(|e| CoreError::Internal(e.to_string()))?;
        let legal_json = serde_json::to_value(&dealer.legal_info)
            .map_err(|e| CoreError::Internal(e.to_string()))?;
        let seo_json = serde_json::to_value(&dealer.seo_config)
            .map_err(|e| CoreError::Internal(e.to_string()))?;

        sqlx::query(
            r#"
            UPDATE dealers
            SET name = $2, city = $3, phone = $4, email = $5, address = $6, domain = $7, margin_config = $8, 
                delivery_mode = $9, payment_type = $10, balance = $11, 
                branding = $12, contacts = $13, legal_info = $14, seo_config = $15,
                is_active = $16, updated_at = NOW()
            WHERE id = $1
            "#,
        )
        .bind(dealer.id)
        .bind(&dealer.name)
        .bind(&dealer.city)
        .bind(&dealer.phone)
        .bind(&dealer.email)
        .bind(&dealer.address)
        .bind(&dealer.domain)
        .bind(margin_json)
        .bind(&dealer.delivery_mode)
        .bind(&dealer.payment_type)
        .bind(dealer.balance)
        .bind(branding_json)
        .bind(contacts_json)
        .bind(legal_json)
        .bind(seo_json)
        .bind(dealer.is_active)
        .execute(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(dealer)
    }

    async fn delete(&self, id: Uuid) -> CoreResult<()> {
        sqlx::query("DELETE FROM dealers WHERE id = $1")
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(|e| CoreError::DatabaseError(e.to_string()))?;
        Ok(())
    }

    async fn list(&self, limit: usize, offset: usize) -> CoreResult<Vec<Dealer>> {
        let dealers = sqlx::query_as(
            r#"
            SELECT id, name, city, phone, email, address, domain, margin_config, delivery_mode, payment_type, balance, 
                   branding, contacts, legal_info, seo_config, is_active, created_at, updated_at
            FROM dealers
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
            "#,
        )
        .bind(limit as i64)
        .bind(offset as i64)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(dealers)
    }

    async fn list_active(&self) -> CoreResult<Vec<Dealer>> {
        let dealers = sqlx::query_as(
            r#"
            SELECT id, name, city, phone, email, address, domain, margin_config, delivery_mode, payment_type, balance, 
                   branding, contacts, legal_info, seo_config, is_active, created_at, updated_at
            FROM dealers
            WHERE is_active = true
            ORDER BY name
            "#
        )
        .fetch_all(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(dealers)
    }
}
