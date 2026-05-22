// core/repository/postgres/product.rs

use async_trait::async_trait;
use sqlx::PgPool;
use uuid::Uuid;

use crate::core::entity::{Product, ProductCategory};
use crate::core::error::CoreResult;
use crate::core::repository::ProductRepository;

pub struct PostgresProductRepository {
    pool: PgPool,
}

impl PostgresProductRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl ProductRepository for PostgresProductRepository {
    async fn find_by_id(&self, id: Uuid) -> CoreResult<Option<Product>> { Ok(None) }
    async fn find_by_category(&self, category: ProductCategory) -> CoreResult<Vec<Product>> { Ok(vec![]) }
    async fn create(&self, product: Product) -> CoreResult<Product> { Ok(product) }
    async fn update(&self, product: Product) -> CoreResult<Product> { Ok(product) }
    async fn delete(&self, id: Uuid) -> CoreResult<()> { Ok(()) }
    async fn list(&self, limit: usize, offset: usize) -> CoreResult<Vec<Product>> { Ok(vec![]) }
}
