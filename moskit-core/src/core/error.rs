// core/error.rs - Обработка ошибок ядра

use thiserror::Error;

#[derive(Error, Debug)]
pub enum CoreError {
    #[error("Сущность не найдена: {0}")]
    NotFound(String),

    #[error("Ошибка валидации: {0}")]
    ValidationError(String),

    #[error("Ошибка базы данных: {0}")]
    DatabaseError(String),

    #[error("Ошибка ценообразования: {0}")]
    PricingError(String),

    #[error("Не авторизован")]
    Unauthorized,

    #[error("Доступ запрещён: {0}")]
    Forbidden(String),

    #[error("Внутренняя ошибка: {0}")]
    Internal(String),
}

pub type CoreResult<T> = Result<T, CoreError>;
