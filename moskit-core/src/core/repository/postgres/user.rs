// core/repository/postgres/user.rs

use async_trait::async_trait;
use sqlx::PgPool;
use uuid::Uuid;

use crate::core::entity::User;
use crate::core::error::CoreResult;
use crate::core::repository::UserRepository;

pub struct PostgresUserRepository {
    pool: PgPool,
}

impl PostgresUserRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl UserRepository for PostgresUserRepository {
    async fn find_by_id(&self, id: Uuid) -> CoreResult<Option<User>> {
        let user = sqlx::query_as::<_, User>(
            r#"
            SELECT id, email, password_hash, name, role, dealer_id, phone, is_active, created_at, updated_at
            FROM users WHERE id = $1
            "#
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| crate::core::error::CoreError::DatabaseError(e.to_string()))?;
        Ok(user)
    }

    async fn find_by_email(&self, email: &str) -> CoreResult<Option<User>> {
        let user = sqlx::query_as::<_, User>(
            r#"
            SELECT id, email, password_hash, name, role, dealer_id, phone, is_active, created_at, updated_at
            FROM users WHERE email = $1
            "#
        )
        .bind(email)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| crate::core::error::CoreError::DatabaseError(e.to_string()))?;
        Ok(user)
    }

    async fn create(&self, user: User) -> CoreResult<User> {
        sqlx::query(
            r#"
            INSERT INTO users (id, email, password_hash, name, role, dealer_id, phone, is_active, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            "#
        )
        .bind(user.id)
        .bind(&user.email)
        .bind(&user.password_hash)
        .bind(&user.name)
        .bind(&user.role)
        .bind(user.dealer_id)
        .bind(user.phone.as_ref())
        .bind(user.is_active)
        .bind(user.created_at)
        .bind(user.updated_at)
        .execute(&self.pool)
        .await
        .map_err(|e| crate::core::error::CoreError::DatabaseError(e.to_string()))?;
        Ok(user)
    }

    async fn update(&self, user: User) -> CoreResult<User> {
        sqlx::query(
            r#"
            UPDATE users
            SET email = $2, password_hash = $3, name = $4, role = $5, dealer_id = $6, phone = $7, is_active = $8, updated_at = $9
            WHERE id = $1
            "#
        )
        .bind(user.id)
        .bind(&user.email)
        .bind(&user.password_hash)
        .bind(&user.name)
        .bind(&user.role)
        .bind(user.dealer_id)
        .bind(user.phone.as_ref())
        .bind(user.is_active)
        .bind(chrono::Utc::now())
        .execute(&self.pool)
        .await
        .map_err(|e| crate::core::error::CoreError::DatabaseError(e.to_string()))?;
        Ok(user)
    }

    async fn delete(&self, id: Uuid) -> CoreResult<()> {
        sqlx::query("DELETE FROM users WHERE id = $1")
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(|e| crate::core::error::CoreError::DatabaseError(e.to_string()))?;
        Ok(())
    }

    async fn list_by_dealer(&self, dealer_id: Uuid) -> CoreResult<Vec<User>> {
        let users = sqlx::query_as::<_, User>(
            r#"
            SELECT id, email, password_hash, name, role, dealer_id, phone, is_active, created_at, updated_at
            FROM users WHERE dealer_id = $1
            "#
        )
        .bind(dealer_id)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| crate::core::error::CoreError::DatabaseError(e.to_string()))?;
        Ok(users)
    }
}
