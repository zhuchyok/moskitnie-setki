// core/repository/postgres/department.rs

use async_trait::async_trait;
use sqlx::PgPool;
use uuid::Uuid;

use crate::core::entity::DealerDepartment;
use crate::core::error::{CoreError, CoreResult};
use crate::core::repository::DepartmentRepository;

pub struct PostgresDepartmentRepository {
    pool: PgPool,
}

impl PostgresDepartmentRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl DepartmentRepository for PostgresDepartmentRepository {
    async fn find_by_id(&self, id: Uuid) -> CoreResult<Option<DealerDepartment>> {
        let dept = sqlx::query_as::<_, DealerDepartment>(
            r#"
            SELECT id, dealer_id, name, markup_config, is_active, created_at, updated_at
            FROM dealer_departments
            WHERE id = $1
            "#,
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(dept)
    }

    async fn create(&self, dept: DealerDepartment) -> CoreResult<DealerDepartment> {
        sqlx::query(
            r#"
            INSERT INTO dealer_departments (id, dealer_id, name, markup_config, is_active, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            "#,
        )
        .bind(dept.id)
        .bind(dept.dealer_id)
        .bind(&dept.name)
        .bind(&dept.markup_config)
        .bind(dept.is_active)
        .bind(dept.created_at)
        .bind(dept.updated_at)
        .execute(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(dept)
    }

    async fn update(&self, dept: DealerDepartment) -> CoreResult<DealerDepartment> {
        sqlx::query(
            r#"
            UPDATE dealer_departments
            SET name = $2, markup_config = $3, is_active = $4, updated_at = NOW()
            WHERE id = $1
            "#,
        )
        .bind(dept.id)
        .bind(&dept.name)
        .bind(&dept.markup_config)
        .bind(dept.is_active)
        .execute(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(dept)
    }

    async fn delete(&self, id: Uuid) -> CoreResult<()> {
        sqlx::query("DELETE FROM dealer_departments WHERE id = $1")
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(|e| CoreError::DatabaseError(e.to_string()))?;
        Ok(())
    }

    async fn list_by_dealer(&self, dealer_id: Uuid) -> CoreResult<Vec<DealerDepartment>> {
        let depts = sqlx::query_as::<_, DealerDepartment>(
            r#"
            SELECT id, dealer_id, name, markup_config, is_active, created_at, updated_at
            FROM dealer_departments
            WHERE dealer_id = $1
            ORDER BY name
            "#,
        )
        .bind(dealer_id)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(depts)
    }
}
