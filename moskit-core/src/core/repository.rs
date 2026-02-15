// repository.rs - Трейты для работы с данными

use async_trait::async_trait;
use uuid::Uuid;

use crate::core::error::CoreResult;
use crate::core::entity::*;

/// Трейт для работы с пользователями
#[async_trait]
pub trait UserRepository: Send + Sync {
    async fn find_by_id(&self, id: Uuid) -> CoreResult<Option<User>>;
    async fn find_by_email(&self, email: &str) -> CoreResult<Option<User>>;
    async fn create(&self, user: User) -> CoreResult<User>;
    async fn update(&self, user: User) -> CoreResult<User>;
    async fn delete(&self, id: Uuid) -> CoreResult<()>;
    async fn list_by_dealer(&self, dealer_id: Uuid) -> CoreResult<Vec<User>>;
}

/// Трейт для работы с дилерами
#[async_trait]
pub trait DealerRepository: Send + Sync {
    async fn find_by_id(&self, id: Uuid) -> CoreResult<Option<Dealer>>;
    async fn find_by_domain(&self, domain: &str) -> CoreResult<Option<Dealer>>;
    async fn create(&self, dealer: Dealer) -> CoreResult<Dealer>;
    async fn update(&self, dealer: Dealer) -> CoreResult<Dealer>;
    async fn delete(&self, id: Uuid) -> CoreResult<()>;
    async fn list(&self, limit: usize, offset: usize) -> CoreResult<Vec<Dealer>>;
    async fn list_active(&self) -> CoreResult<Vec<Dealer>>;
}

/// Трейт для работы с товарами
#[async_trait]
pub trait ProductRepository: Send + Sync {
    async fn find_by_id(&self, id: Uuid) -> CoreResult<Option<Product>>;
    async fn find_by_category(&self, category: ProductCategory) -> CoreResult<Vec<Product>>;
    async fn create(&self, product: Product) -> CoreResult<Product>;
    async fn update(&self, product: Product) -> CoreResult<Product>;
    async fn delete(&self, id: Uuid) -> CoreResult<()>;
    async fn list(&self, limit: usize, offset: usize) -> CoreResult<Vec<Product>>;
}

/// Трейт для работы с заказами
#[async_trait]
pub trait OrderRepository: Send + Sync {
    async fn find_by_id(&self, id: Uuid) -> CoreResult<Option<Order>>;
    async fn find_by_order_number(&self, order_number: &str) -> CoreResult<Option<Order>>;
    async fn find_by_dealer(&self, dealer_id: Uuid) -> CoreResult<Vec<Order>>;
    async fn create(&self, order: Order) -> CoreResult<Order>;
    async fn update(&self, order: Order) -> CoreResult<Order>;
    async fn delete(&self, id: Uuid) -> CoreResult<()>;
    async fn list(&self, limit: usize, offset: usize) -> CoreResult<Vec<Order>>;
    async fn list_by_status(&self, status: OrderStatus) -> CoreResult<Vec<Order>>;
}
