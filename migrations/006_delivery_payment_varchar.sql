-- Если delivery_mode или payment_type на VDS были созданы как PostgreSQL ENUM,
-- приводим к VARCHAR(50), чтобы приложение могло читать/писать значения без ошибки
-- "INVALID VALUE ... FOR ENUM DELIVERYMODE". Idempotent: безопасно для колонок уже VARCHAR.

ALTER TABLE dealers
  ALTER COLUMN delivery_mode TYPE VARCHAR(50) USING delivery_mode::text,
  ALTER COLUMN payment_type TYPE VARCHAR(50) USING payment_type::text;
