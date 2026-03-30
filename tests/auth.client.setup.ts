import { test as setup, expect } from '@playwright/test';
import { TIMEOUT } from 'dns';

setup('Authenticate and save state', async ({ page }) => {
  // 1️⃣ Открываем страницу логина
  await page.goto('/auth/', { timeout: 10000 });
  // 2️⃣ Вводим данные из .env
  await page.getByPlaceholder('Enter email')
    .fill(process.env.CLIENT_EMAIL!);

  await page.getByPlaceholder('Enter password')
    .fill(process.env.CLIENT_PASSWORD!);

  await page.getByRole('button', { name: 'Sign in' }).click();
  console.log("REAL URL:", page.url());
  // 3️⃣ Проверяем, что логин успешен
  await expect(page).toHaveURL(/client/);

  // 4️⃣ Сохраняем storageState в корень проекта
  await page.context().storageState({ path: 'authClient.json' });

  console.log('✅ Auth state saved to authClient.json');
});

