import { test as setup, expect } from '@playwright/test';

setup('Authenticate and save state', async ({ page }) => {

  await page.goto('/auth/');
  await page.getByPlaceholder('Enter email')
    .fill(process.env.PROVIDER_EMAIL!);
  await page.getByPlaceholder('Enter password')
    .fill(process.env.PROVIDER_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();
  // Ждем пока появится настоящий provider URL
  await page.waitForURL(
    /\/provider\/[0-9a-f-]{36}\/[0-9a-f-]{36}/,
    { timeout: 10000 }
  );
  await page.context().storageState({
    path: 'authProvider.json'
  });
  console.log('✅ Provider auth saved');
});