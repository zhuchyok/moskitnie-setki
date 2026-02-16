// core/repository/postgres/mod.rs - PostgreSQL реализации

use sqlx::PgPool;

pub mod dealer;
pub mod department;
pub mod order;
pub mod user;
pub mod product;
pub mod audit;

pub use dealer::PostgresDealerRepository;
pub use department::PostgresDepartmentRepository;
pub use order::PostgresOrderRepository;
pub use audit::PostgresAuditRepository;
pub use user::PostgresUserRepository;
pub use product::PostgresProductRepository;

pub struct PostgresRepository {
    pool: PgPool,
}

impl PostgresRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}
