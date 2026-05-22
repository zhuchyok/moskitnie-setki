-- 008_dealer_hierarchy_and_ledger.sql
-- Внедрение иерархии дилеров, филиалов и системы финансовых транзакций

-- 1. Расширение таблицы дилеров
ALTER TABLE dealers ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES dealers(id);
ALTER TABLE dealers ADD COLUMN IF NOT EXISTS credit_limit DECIMAL(12, 2) DEFAULT 0;
ALTER TABLE dealers ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'dealer'; -- owner, director, manager, subdealer

-- 2. Таблица филиалов (сайтов) дилера
CREATE TABLE IF NOT EXISTS dealer_branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- Название (например, "Нижний Новгород")
    domain VARCHAR(255) UNIQUE, -- Привязанный домен
    city VARCHAR(100),
    margin_config JSONB NOT NULL DEFAULT '{}', -- Индивидуальные наценки для этого филиала
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Таблица транзакций (Ledger)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id UUID NOT NULL REFERENCES dealers(id),
    amount DECIMAL(12, 2) NOT NULL, -- Положительное (депозит) или отрицательное (списание)
    balance_after DECIMAL(12, 2) NOT NULL, -- Остаток после транзакции
    type VARCHAR(50) NOT NULL, -- deposit, withdrawal, order_payment, refund
    order_id UUID REFERENCES orders(id),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Расширение таблицы заказов для аналитики и "заморозки" цен
ALTER TABLE orders ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES dealer_branches(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS dealer_price_total DECIMAL(12, 2) DEFAULT 0; -- Ваша цена дилеру в момент заказа
ALTER TABLE orders ADD COLUMN IF NOT EXISTS selling_price_total DECIMAL(12, 2) DEFAULT 0; -- Цена дилера клиенту в момент заказа
ALTER TABLE orders ADD COLUMN IF NOT EXISTS potential_profit DECIMAL(12, 2) DEFAULT 0; -- (Selling - Dealer - Service)

-- 5. Индексы для быстрой аналитики
CREATE INDEX IF NOT EXISTS idx_orders_dealer_id_created_at ON orders(dealer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_branch_id ON orders(branch_id);
CREATE INDEX IF NOT EXISTS idx_transactions_dealer_id ON transactions(dealer_id);

-- Обновляем триггер для updated_at в dealer_branches
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_dealer_branches') THEN
        CREATE TRIGGER set_updated_at_dealer_branches
        BEFORE UPDATE ON dealer_branches
        FOR EACH ROW
        EXECUTE PROCEDURE update_updated_at_column();
    END IF;
END $$;
