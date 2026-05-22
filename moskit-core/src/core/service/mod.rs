// service/mod.rs - Модуль сервисов

pub mod pricing;
pub mod notification;
pub mod storage;

pub use pricing::*;
pub use notification::*;
pub use storage::*;