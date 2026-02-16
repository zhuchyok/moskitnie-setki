// core/service/notification.rs

use async_trait::async_trait;
use crate::core::error::CoreResult;
use crate::core::entity::{Order, OrderStatus, Dealer};

#[async_trait]
pub trait NotificationService: Send + Sync {
    async fn notify_new_order(&self, order: &Order, dealer: &Dealer) -> CoreResult<()>;
    async fn notify_status_change(&self, order: &Order, old_status: OrderStatus, dealer: &Dealer) -> CoreResult<()>;
    async fn notify_balance_low(&self, dealer: &Dealer) -> CoreResult<()>;
}

pub struct TelegramNotificationService {
    bot_token: String,
}

impl TelegramNotificationService {
    pub fn new(bot_token: String) -> Self {
        Self { bot_token }
    }
}

#[async_trait]
impl NotificationService for TelegramNotificationService {
    async fn notify_new_order(&self, order: &Order, dealer: &Dealer) -> CoreResult<()> {
        let message = format!(
            "🆕 Новый заказ: {}\nКлиент: {}\nСумма: {} руб.\nДилер: {}",
            order.order_number, order.client_name, order.total_amount, dealer.name
        );
        self.send_telegram_message(dealer, &message).await
    }

    async fn notify_status_change(&self, order: &Order, _old_status: OrderStatus, dealer: &Dealer) -> CoreResult<()> {
        let message = format!(
            "🔔 Статус заказа {} изменен на: {:?}",
            order.order_number, order.status
        );
        self.send_telegram_message(dealer, &message).await
    }

    async fn notify_balance_low(&self, dealer: &Dealer) -> CoreResult<()> {
        let message = format!(
            "⚠️ Внимание! Ваш баланс ({:.2} руб.) ниже критической отметки.",
            dealer.balance
        );
        self.send_telegram_message(dealer, &message).await
    }
}

impl TelegramNotificationService {
    async fn send_telegram_message(&self, _dealer: &Dealer, _message: &str) -> CoreResult<()> {
        // В реальной реализации здесь будет HTTP вызов к Telegram API
        // Используя reqwest или аналогичную библиотеку
        tracing::info!("SENDING TELEGRAM: {}", _message);
        Ok(())
    }
}
