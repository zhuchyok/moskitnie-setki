// core/repository/postgres/dealer.rs

use async_trait::async_trait;
use sqlx::PgPool;
use uuid::Uuid;
use rust_decimal::Decimal;

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
            SELECT id, parent_id, role, name, city, phone, email, address, domain, margin_config,
                   delivery_mode::text as delivery_mode, payment_type::text as payment_type,
                   balance, credit_limit, branding, contacts, legal_info, seo_config, is_active, created_at, updated_at
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
            SELECT id, parent_id, role, name, city, phone, email, address, domain, margin_config,
                   delivery_mode::text as delivery_mode, payment_type::text as payment_type,
                   balance, credit_limit, branding, contacts, legal_info, seo_config, is_active, created_at, updated_at
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
            INSERT INTO dealers (id, parent_id, role, name, city, phone, email, address, domain, margin_config, delivery_mode, payment_type, balance, credit_limit,
                               branding, contacts, legal_info, seo_config, is_active, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
            "#,
        )
        .bind(dealer.id)
        .bind(dealer.parent_id)
        .bind(&dealer.role)
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
        .bind(dealer.credit_limit)
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
            SET parent_id = $2, role = $3, name = $4, city = $5, phone = $6, email = $7, address = $8, domain = $9, margin_config = $10, 
                delivery_mode = $11, payment_type = $12, balance = $13, credit_limit = $14,
                branding = $15, contacts = $16, legal_info = $17, seo_config = $18,
                is_active = $19, updated_at = NOW()
            WHERE id = $1
            "#,
        )
        .bind(dealer.id)
        .bind(dealer.parent_id)
        .bind(&dealer.role)
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
        .bind(dealer.credit_limit)
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
            SELECT id, parent_id, role, name, city, phone, email, address, domain, margin_config,
                   delivery_mode::text as delivery_mode, payment_type::text as payment_type,
                   balance, credit_limit, branding, contacts, legal_info, seo_config, is_active, created_at, updated_at
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
            SELECT id, parent_id, role, name, city, phone, email, address, domain, margin_config,
                   delivery_mode::text as delivery_mode, payment_type::text as payment_type,
                   balance, credit_limit, branding, contacts, legal_info, seo_config, is_active, created_at, updated_at
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

    async fn find_branches_by_dealer(&self, dealer_id: Uuid) -> CoreResult<Vec<crate::core::entity::DealerBranch>> {
        let branches = sqlx::query_as::<_, crate::core::entity::DealerBranch>(
            r#"
            SELECT id, dealer_id, name, domain, city, margin_config, is_active, created_at, updated_at
            FROM dealer_branches
            WHERE dealer_id = $1
            ORDER BY created_at DESC
            "#,
        )
        .bind(dealer_id)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(branches)
    }

    async fn create_branch(&self, branch: crate::core::entity::DealerBranch) -> CoreResult<crate::core::entity::DealerBranch> {
        sqlx::query(
            r#"
            INSERT INTO dealer_branches (id, dealer_id, name, domain, city, margin_config, is_active, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            "#,
        )
        .bind(branch.id)
        .bind(branch.dealer_id)
        .bind(&branch.name)
        .bind(&branch.domain)
        .bind(&branch.city)
        .bind(&branch.margin_config)
        .bind(branch.is_active)
        .bind(branch.created_at)
        .bind(branch.updated_at)
        .execute(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(branch)
    }

    async fn update_branch(&self, branch: crate::core::entity::DealerBranch) -> CoreResult<crate::core::entity::DealerBranch> {
        sqlx::query(
            r#"
            UPDATE dealer_branches
            SET name = $2, domain = $3, city = $4, margin_config = $5, is_active = $6, updated_at = NOW()
            WHERE id = $1
            "#,
        )
        .bind(branch.id)
        .bind(&branch.name)
        .bind(&branch.domain)
        .bind(&branch.city)
        .bind(&branch.margin_config)
        .bind(branch.is_active)
        .execute(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(branch)
    }

    async fn delete_branch(&self, id: Uuid) -> CoreResult<()> {
        sqlx::query("DELETE FROM dealer_branches WHERE id = $1")
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(|e| CoreError::DatabaseError(e.to_string()))?;
        Ok(())
    }

    async fn find_transactions_by_dealer(&self, dealer_id: Uuid, limit: usize, offset: usize) -> CoreResult<Vec<crate::core::entity::Transaction>> {
        let transactions = sqlx::query_as::<_, crate::core::entity::Transaction>(
            r#"
            SELECT id, dealer_id, amount, balance_after, type as transaction_type, order_id, description, created_at
            FROM transactions
            WHERE dealer_id = $1
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3
            "#,
        )
        .bind(dealer_id)
        .bind(limit as i64)
        .bind(offset as i64)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(transactions)
    }

    async fn create_transaction(&self, transaction: crate::core::entity::Transaction) -> CoreResult<crate::core::entity::Transaction> {
        sqlx::query(
            r#"
            INSERT INTO transactions (id, dealer_id, amount, balance_after, type, order_id, description, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            "#,
        )
        .bind(transaction.id)
        .bind(transaction.dealer_id)
        .bind(transaction.amount)
        .bind(transaction.balance_after)
        .bind(&transaction.transaction_type)
        .bind(transaction.order_id)
        .bind(&transaction.description)
        .bind(transaction.created_at)
        .execute(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(transaction)
    }

    async fn update_balance(&self, dealer_id: Uuid, amount: Decimal, transaction_type: String, description: Option<String>, order_id: Option<Uuid>) -> CoreResult<Decimal> {
        let mut tx = self.pool.begin().await.map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        // 1. Обновляем баланс и получаем новый остаток
        let row = sqlx::query(
            r#"
            UPDATE dealers 
            SET balance = balance + $1, updated_at = NOW() 
            WHERE id = $2 
            RETURNING balance
            "#
        )
        .bind(amount)
        .bind(dealer_id)
        .fetch_one(&mut *tx)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        use sqlx::Row;
        let new_balance: Decimal = row.get("balance");

        // 2. Создаем запись в транзакциях
        sqlx::query(
            r#"
            INSERT INTO transactions (id, dealer_id, amount, balance_after, type, order_id, description, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            "#,
        )
        .bind(Uuid::new_v4())
        .bind(dealer_id)
        .bind(amount)
        .bind(new_balance)
        .bind(transaction_type)
        .bind(order_id)
        .bind(description)
        .execute(&mut *tx)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        tx.commit().await.map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(new_balance)
    }
}
