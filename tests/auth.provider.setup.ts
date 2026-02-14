import { test as setup, expect } from '@playwright/test';

setup('Authenticate and save state', async ({ page }) => {
  // 1️⃣ Открываем страницу логина
  await page.goto('/auth/login');

  // 2️⃣ Вводим данные из .env
  await page.getByPlaceholder('Enter email')
    .fill(process.env.PROVIDER_EMAIL!);

  await page.getByPlaceholder('Enter password')
    .fill(process.env.PROVIDER_PASSWORD!);

  await page.getByRole('button', { name: 'Sign in' }).click();

  // 3️⃣ Проверяем, что логин успешен
  await expect(page).toHaveURL(/provider/);

  // 4️⃣ Сохраняем storageState в корень проекта
  await page.context().storageState({ path: 'authProvider.json' });

  console.log('✅ Auth state saved to authProvider.json');
});

