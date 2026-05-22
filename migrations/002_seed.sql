-- migrations/002_seed.sql - Начальные данные

-- 1. Дилер (Производитель как основной дилер)
INSERT INTO dealers (id, name, city, phone, email, address, domain, is_active)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Москитные Сетки 21',
    'Чебоксары',
    '+7 (8352) 00-00-00',
    'info@setki-21.ru',
    'ул. Калинина, 100',
    'setki-21.ru',
    true
) ON CONFLICT (id) DO NOTHING;

-- 2. Пользователи
-- Пароль 'admin123' (хеш для примера, в реальности нужно хешировать)
INSERT INTO users (id, email, password_hash, name, role, dealer_id, is_active)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'admin@setki-21.ru',
    'admin123', -- Прямой пароль для теста, API его поймет
    'Администратор',
    'admin',
    '00000000-0000-0000-0000-000000000001',
    true
) ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- 3. Категории товаров
INSERT INTO product_categories (id, name, code, description)
VALUES (
    '00000000-0000-0000-0000-000000000003',
    'Москитные сетки',
    'moskitnye_setki',
    'Все виды москитных сеток на окна и двери'
) ON CONFLICT (id) DO NOTHING;

-- 4. Товары (Базовые конфигурации)
INSERT INTO products (id, category_id, name, params, price_config)
VALUES (
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000003',
    'Стандартная сетка',
    '{"mesh_type": "standart", "frame_type": "standart"}',
    '{"base_price": 500, "dealer_price": 700, "min_dealer_price": 600, "default_dealer_margin": 30}'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, category_id, name, params, price_config)
VALUES (
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000003',
    'Антикошка',
    '{"mesh_type": "antikoshka", "frame_type": "standart"}',
    '{"base_price": 1200, "dealer_price": 1500, "min_dealer_price": 1400, "default_dealer_margin": 30}'
) ON CONFLICT (id) DO NOTHING;
