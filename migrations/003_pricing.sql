-- migrations/003_pricing.sql - Таблица для хранения цен

CREATE TABLE IF NOT EXISTS global_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Начальные данные для цен (текущие значения из кода)
INSERT INTO global_settings (key, value)
VALUES ('global_pricing', '{
  "mesh": [
    {"id": "standart", "name": "Стандарт", "price": 63.0},
    {"id": "antimoshka", "name": "Антимошка", "price": 265.0},
    {"id": "ultravyu", "name": "Ультравью", "price": 295.0},
    {"id": "antikoshka", "name": "Антикошка", "price": 414.0},
    {"id": "antipyl", "name": "Антипыль", "price": 645.0}
  ],
  "profiles": [
    {"id": "white", "name": "Белый (Рамочная)", "price": 60.0},
    {"id": "brown", "name": "Коричневый (Рамочная)", "price": 64.8},
    {"id": "anthracite", "name": "Антрацит (Рамочная)", "price": 70.0},
    {"id": "ral", "name": "RAL (Рамочная)", "price": 60.0},
    {"id": "white_vsn", "name": "Белый (Вставная VSN)", "price": 151.0},
    {"id": "brown_vsn", "name": "Коричневый (Вставная VSN)", "price": 153.0},
    {"id": "anthracite_vsn", "name": "Антрацит (Вставная VSN)", "price": 163.0},
    {"id": "ral_vsn", "name": "RAL (Вставная VSN)", "price": 251.0},
    {"id": "impost_white", "name": "Поперечина (Белая)", "price": 62.0},
    {"id": "impost_brown", "name": "Поперечина (Коричневая)", "price": 67.2},
    {"id": "impost_anthracite", "name": "Поперечина (Антрацит)", "price": 75.0},
    {"id": "ral_painting", "name": "Наценка покраски RAL (мп)", "price": 100.0}
  ],
  "components": [
    {"id": "corner_white", "name": "Уголок (Белый)", "price": 3.75},
    {"id": "corner_brown", "name": "Уголок (Коричневый)", "price": 6.0},
    {"id": "corner_anthracite", "name": "Уголок (Антрацит)", "price": 7.0},
    {"id": "corner_vsn_white", "name": "Уголок VSN (Белый)", "price": 14.8},
    {"id": "corner_vsn_brown", "name": "Уголок VSN (Коричневый)", "price": 4.85},
    {"id": "corner_vsn_anthracite", "name": "Уголок VSN (Антрацит)", "price": 7.15},
    {"id": "handle_plastic", "name": "Ручка ПВХ (шт)", "price": 2.2},
    {"id": "handle_metal", "name": "Ручка металл (шт)", "price": 8.0},
    {"id": "mount_frame", "name": "Крепление рамочное (шт)", "price": 8.0},
    {"id": "mount_vsn", "name": "Крепление вставное VSN (шт)", "price": 30.0},
    {"id": "mount_impost", "name": "Крепление импоста (шт)", "price": 1.8},
    {"id": "screw", "name": "Саморез (шт)", "price": 1.0},
    {"id": "rivet", "name": "Клепка (шт)", "price": 5.0},
    {"id": "cord", "name": "Шнур (мп)", "price": 4.6},
    {"id": "stretch", "name": "Стретч-пленка (упаковка)", "price": 24.0}
  ],
  "services": [
    {"id": "measurement", "name": "Замер", "price": 500.0},
    {"id": "installation", "name": "Монтаж (рамочная)", "price": 400.0},
    {"id": "installation_vsn", "name": "Монтаж (вставная VSN)", "price": 100.0},
    {"id": "installation_plisse", "name": "Монтаж (плиссе)", "price": 500.0, "unit": "м2"},
    {"id": "delivery", "name": "Доставка", "price": 300.0},
    {"id": "delivery_mixed", "name": "Доставка (смежная)", "price": 100.0}
  ],
  "markup": {
    "dealer": 1.43,
    "client": 2.13,
    "manufacturing_base": 50.0,
    "manufacturing_percent": 5.0,
    "measurement_base": 270.0,
    "measurement_percent": 5.0,
    "measurement_profit_factor": 5.0,
    "urgent_profit_factor": 10.0,
    "installation_profit_factor": 33.0,
    "delivery_profit_factor": 33.0
  }
}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
