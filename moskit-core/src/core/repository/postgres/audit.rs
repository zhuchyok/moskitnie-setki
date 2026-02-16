// core/repository/postgres/audit.rs

use async_trait::async_trait;
use sqlx::PgPool;
use uuid::Uuid;

use crate::core::entity::AuditLog;
use crate::core::error::{CoreError, CoreResult};
use crate::core::repository::AuditRepository;

pub struct PostgresAuditRepository {
    pool: PgPool,
}

impl PostgresAuditRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl AuditRepository for PostgresAuditRepository {
    async fn log(&self, log: AuditLog) -> CoreResult<()> {
        sqlx::query(
            r#"
            INSERT INTO audit_logs (id, user_id, dealer_id, action, entity_type, entity_id, old_data, new_data, ip_address, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            "#,
        )
        .bind(log.id)
        .bind(log.user_id)
        .bind(log.dealer_id)
        .bind(&log.action)
        .bind(&log.entity_type)
        .bind(log.entity_id)
        .bind(&log.old_data)
        .bind(&log.new_data)
        .bind(&log.ip_address)
        .bind(log.created_at)
        .execute(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(())
    }

    async fn list_by_dealer(&self, dealer_id: Uuid, limit: usize, offset: usize) -> CoreResult<Vec<AuditLog>> {
        let logs = sqlx::query_as::<_, AuditLog>(
            r#"
            SELECT id, user_id, dealer_id, action, entity_type, entity_id, old_data, new_data, ip_address, created_at
            FROM audit_logs
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

        Ok(logs)
    }
}
