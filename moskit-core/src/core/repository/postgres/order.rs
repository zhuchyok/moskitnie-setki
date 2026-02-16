// core/repository/postgres/order.rs

use async_trait::async_trait;
use sqlx::PgPool;
use uuid::Uuid;
use chrono::{DateTime, Utc};

use crate::core::entity::{Order, OrderStatus};
use crate::core::error::{CoreError, CoreResult};
use crate::core::repository::OrderRepository;

pub struct PostgresOrderRepository {
    pool: PgPool,
}

impl PostgresOrderRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl OrderRepository for PostgresOrderRepository {
    async fn find_by_id(&self, id: Uuid) -> CoreResult<Option<Order>> {
        let order_row: Option<Order> = sqlx::query_as::<_, Order>(
            r#"
            SELECT id, order_number, dealer_id, client_name, client_phone, client_address, status, 
                   production_sub_status, installation_status, department_id,
                   total_amount, dealer_cost, dealer_profit, comment, created_at, updated_at
            FROM orders WHERE id = $1
            "#,
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        if let Some(mut order) = order_row {
            // Загрузка позиций
            let items = sqlx::query_as::<_, crate::core::entity::OrderItem>(
                r#"
                SELECT id, product_id, name, params, quantity, unit_price, total_price
                FROM order_items WHERE order_id = $1
                "#,
            )
            .bind(id)
            .fetch_all(&self.pool)
            .await
            .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

            order.items = items;
            return Ok(Some(order));
        }
        
        Ok(None)
    }

    async fn find_by_order_number(&self, order_number: &str) -> CoreResult<Option<Order>> {
        let order_row: Option<Order> = sqlx::query_as::<_, Order>(
            r#"
            SELECT id, order_number, dealer_id, client_name, client_phone, client_address, status, total_amount, dealer_cost, dealer_profit, comment, created_at, updated_at
            FROM orders WHERE order_number = $1
            "#,
        )
        .bind(order_number)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        if let Some(mut order) = order_row {
            let items = sqlx::query_as::<_, crate::core::entity::OrderItem>(
                r#"
                SELECT id, product_id, name, params, quantity, unit_price, total_price
                FROM order_items WHERE order_id = $1
                "#,
            )
            .bind(order.id)
            .fetch_all(&self.pool)
            .await
            .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

            order.items = items;
            return Ok(Some(order));
        }
        
        Ok(None)
    }

    async fn find_by_dealer(&self, dealer_id: Uuid) -> CoreResult<Vec<Order>> {
        let orders = sqlx::query_as::<_, Order>(
            r#"
            SELECT id, order_number, dealer_id, client_name, client_phone, client_address, status, total_amount, dealer_cost, dealer_profit, comment, created_at, updated_at
            FROM orders WHERE dealer_id = $1
            ORDER BY created_at DESC
            "#,
        )
        .bind(dealer_id)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(orders)
    }

    async fn create(&self, order: Order) -> CoreResult<Order> {
        let mut tx = self.pool.begin().await.map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        sqlx::query(
            r#"
            INSERT INTO orders (id, order_number, dealer_id, client_name, client_phone, client_address, status, 
                               production_sub_status, installation_status, department_id,
                               total_amount, dealer_cost, dealer_profit, comment, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            "#,
        )
        .bind(order.id)
        .bind(&order.order_number)
        .bind(order.dealer_id)
        .bind(&order.client_name)
        .bind(&order.client_phone)
        .bind(&order.client_address)
        .bind(order.status.as_str())
        .bind(order.production_sub_status)
        .bind(order.installation_status)
        .bind(order.department_id)
        .bind(order.total_amount)
        .bind(order.dealer_cost)
        .bind(order.dealer_profit)
        .bind(&order.comment)
        .bind(order.created_at)
        .bind(order.updated_at)
        .execute(&mut *tx)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        for item in order.items.iter() {
            sqlx::query(
                r#"
                INSERT INTO order_items (id, order_id, product_id, name, params, quantity, unit_price, total_price)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                "#,
            )
            .bind(item.id)
            .bind(order.id)
            .bind(item.product_id)
            .bind(&item.name)
            .bind(&item.params)
            .bind(item.quantity)
            .bind(item.unit_price)
            .bind(item.total_price)
            .execute(&mut *tx)
            .await
            .map_err(|e| CoreError::DatabaseError(e.to_string()))?;
        }

        tx.commit().await.map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(order)
    }

    async fn update(&self, order: Order) -> CoreResult<Order> {
        sqlx::query(
            r#"
            UPDATE orders
            SET status = $2, production_sub_status = $3, installation_status = $4, 
                client_name = $5, client_phone = $6, client_address = $7, comment = $8, updated_at = NOW()
            WHERE id = $1
            "#,
        )
        .bind(order.id)
        .bind(order.status.as_str())
        .bind(order.production_sub_status)
        .bind(order.installation_status)
        .bind(&order.client_name)
        .bind(&order.client_phone)
        .bind(&order.client_address)
        .bind(&order.comment)
        .execute(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(order)
    }

    async fn delete(&self, id: Uuid) -> CoreResult<()> {
        Ok(())
    }

    async fn list(&self, limit: usize, offset: usize) -> CoreResult<Vec<Order>> {
        let orders = sqlx::query_as::<_, Order>(
            r#"
            SELECT id, order_number, dealer_id, client_name, client_phone, client_address, status, total_amount, dealer_cost, dealer_profit, comment, created_at, updated_at
            FROM orders
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
            "#,
        )
        .bind(limit as i64)
        .bind(offset as i64)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(orders)
    }

    async fn list_by_status(&self, status: OrderStatus) -> CoreResult<Vec<Order>> {
        let orders = sqlx::query_as::<_, Order>(
            r#"
            SELECT id, order_number, dealer_id, client_name, client_phone, client_address, status, 
                   production_sub_status, installation_status, department_id,
                   total_amount, dealer_cost, dealer_profit, comment, created_at, updated_at
            FROM orders
            WHERE status = $1
            ORDER BY created_at DESC
            "#,
        )
        .bind(status.as_str())
        .fetch_all(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        Ok(orders)
    }

    async fn get_stats(&self, dealer_id: Option<Uuid>, start_date: DateTime<Utc>, end_date: DateTime<Utc>) -> CoreResult<serde_json::Value> {
        let row = sqlx::query(
            r#"
            SELECT 
                COUNT(*) as total_count,
                COALESCE(SUM(total_amount), 0)::FLOAT as total_amount,
                COALESCE(SUM(dealer_profit), 0)::FLOAT as total_profit
            FROM orders
            WHERE (dealer_id = $1 OR $1 IS NULL)
              AND created_at >= $2 AND created_at <= $3
            "#
        )
        .bind(dealer_id)
        .bind(start_date)
        .bind(end_date)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| CoreError::DatabaseError(e.to_string()))?;

        use sqlx::Row;
        let count: i64 = row.get("total_count");
        let amount: f64 = row.get("total_amount");
        let profit: f64 = row.get("total_profit");

        Ok(serde_json::json!({
            "count": count,
            "amount": amount,
            "profit": profit
        }))
    }
}
