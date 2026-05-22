// core/repository/postgres/settings.rs

use async_trait::async_trait;
use sqlx::PgPool;
use crate::core::error::{CoreError, CoreResult};
use crate::core::repository::SettingsRepository;

pub struct PostgresSettingsRepository {
    pool: PgPool,
}

impl PostgresSettingsRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl SettingsRepository for PostgresSettingsRepository {
    async fn get_value(&self, key: &str) -> CoreResult<Option<serde_json::Value>> {
        let row: Option<(serde_json::Value,)> = sqlx::query_as("SELECT value FROM global_settings WHERE key = $1")
            .bind(key)
            .fetch_optional(&self.pool)
            .await
            .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(row.map(|(v,)| v))
    }

    async fn set_value(&self, key: &str, value: serde_json::Value) -> CoreResult<()> {
        sqlx::query("INSERT INTO global_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()")
            .bind(key)
            .bind(value)
            .execute(&self.pool)
            .await
            .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(())
    }
}
