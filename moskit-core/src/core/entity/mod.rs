// entity/mod.rs - Модуль сущностей

pub mod user;
pub mod dealer;
pub mod product;
pub mod order;
pub mod pricing;

pub use user::*;
pub use dealer::*;
pub use product::*;
pub use order::*;
pub use pricing::*;
