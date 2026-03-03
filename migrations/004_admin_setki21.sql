-- Приведение админа к единому логину/паролю для www.setki21.ru (как в .env.atra).
-- После деплоя moskit-api вход: admin@setki21.ru и тот же пароль, что в .env.atra.

UPDATE users
SET email = 'admin@setki21.ru',
    password_hash = 'Bik6007OS',
    name = 'Администратор'
WHERE id = '00000000-0000-0000-0000-000000000002';
