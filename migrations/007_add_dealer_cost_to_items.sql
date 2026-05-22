-- migrations/007_add_dealer_cost_to_items.sql

ALTER TABLE order_items ADD COLUMN IF NOT EXISTS dealer_cost DECIMAL(12, 2) DEFAULT 0;
