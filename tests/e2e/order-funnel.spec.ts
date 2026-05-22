import { test, expect } from '@playwright/test';

test.describe('Order Funnel', () => {
  test('should complete the full order funnel successfully', async ({ page }) => {
    // 1. Выбор сетки (переход на страницу Антикошка)
    await page.goto('/antikoshka');
    
    // Ждем загрузки страницы
    await expect(page.locator('h1')).toContainText('Антикошка');

    // 2. Калькулятор - Шаг 1: Конфигурация
    const nextButton = page.locator('.next-step-button');
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    // 3. Калькулятор - Шаг 2: Размеры
    await expect(page.getByText('Ширина')).toBeVisible();
    await nextButton.click();

    // 4. Калькулятор - Шаг 3: Метод замера
    await expect(page.getByText('Как вы измеряли?')).toBeVisible();
    // Выбираем метод замера (например, "По проему")
    await page.getByRole('button', { name: 'По проему' }).click();
    await nextButton.click();

    // 5. Калькулятор - Шаг 4: Опции
    await expect(page.getByText('Тип ручек')).toBeVisible();
    await nextButton.click();

    // 6. Калькулятор - Шаг 5: Просмотр и добавление в заказ
    await expect(page.getByText('Проверьте параметры')).toBeVisible();
    const addToOrderButton = page.locator('.add-to-order-button');
    await addToOrderButton.click();
    
    // Ждем появления блока "Ваш заказ"
    await expect(page.getByText('Ваш заказ')).toBeVisible();

    // 7. Оформление заказа
    const checkoutButton = page.locator('.checkout-button');
    await checkoutButton.click();

    // Заполнение формы (используем более специфичные селекторы для нашей формы)
    const formContainer = page.locator('.form-brand');
    await formContainer.locator('input[placeholder="Иван Иванов"]').fill('Тестовый Пользователь');
    await formContainer.locator('input[type="tel"]').fill('+7 (999) 999-99-99');
    
    // Если поле адреса появилось (зависит от способа получения)
    const addressInput = formContainer.locator('input[placeholder="Город, улица, дом, кв"]');
    if (await addressInput.isVisible()) {
      await addressInput.fill('г. Чебоксары, ул. Тестовая, д. 1');
    }

    // Согласие (используем принудительный клик, так как чекбокс может быть скрыт стилями)
    const checkbox = formContainer.locator('input[type="checkbox"]');
    await checkbox.check({ force: true });

    // Отправка
    // Перехватываем запрос к API чтобы не слать реальные письма в тестах
    await page.route('**/api/orders', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Используем более точный селектор для кнопки "Заказать" внутри формы
    await formContainer.getByRole('button', { name: 'Заказать', exact: true }).click();

    // Проверка успешного уведомления
    await expect(page.getByText('Спасибо за заказ!')).toBeVisible();
  });
});
