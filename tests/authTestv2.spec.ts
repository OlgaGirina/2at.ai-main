import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageMamager';
import { Page } from '@playwright/test';

// 🔹 Все тестовые данные
const loginCases_SUCCESS_CLIENT = [{
  id: 'AUTH-TC-01',
  title: 'Valid login with Client account',
  email: 'Client241020252@gmail.com',
  password: 'qwerty123',
  type: 'SUCCESS_CLIENT'
}];
const loginCases_SUCCESS_PROVIDER = [{
  id: 'AUTH-TC-02',
  title: 'Valid login with Provider account',
  email: 'Provider24102025@gmail.com',
  password: 'qwerty123',
  type: 'SUCCESS_PROVIDER'
}];
const loginCases_FIELD_ERROR = [
  {
    id: 'AUTH-TC-03',
    title: 'Login with incorrect email format',
    email: 'bbmb',
    password: 'ValidPass123',
    type: 'FIELD_ERROR',
    selector: '#email_help .ant-form-item-explain-error',
    expectedText: 'Please input a valid email!'
  },
  {
    id: 'AUTH-TC-04',
    title: 'Login with password shorter than 8 characters',
    email: 'client@example.com',
    password: 'short',
    type: 'FIELD_ERROR',
    selector: '#password_help .ant-form-item-explain-error',
    expectedText: 'Password must be at least 8 characters!'
  },
  {
    id: 'AUTH-TC-05',
    title: 'Login with unregistered email',
    email: 'notfound@example.com',
    password: 'SomePass123',
    type: 'FIELD_ERROR',
    selector: '#email_help .ant-form-item-explain-error',
    expectedText: 'Incorrect email or password'
  },
  {
    id: 'AUTH-TC-06',
    title: 'Login with incorrect password',
    email: 'client@example.com',
    password: 'WrongPass123',
    type: 'FIELD_ERROR',
    selector: '#email_help .ant-form-item-explain-error',
    expectedText: 'Incorrect email or password'
  },
  {
    id: 'AUTH-TC-07',
    title: 'Login with empty fields',
    email: '',
    password: '',
    type: 'FIELD_ERROR',
    selector: '#email_help .ant-form-item-explain-error',
    expectedText: 'Please input your email!'
  },
  {
    id: 'AUTH-TC-07b',
    title: 'Login with empty fields (password)',
    email: 'olik255@rambler.ru',
    password: '',
    type: 'FIELD_ERROR',
    selector: '#password_help .ant-form-item-explain-error',
    expectedText: 'Please input your password!'
  },
  {
    id: 'AUTH-TC-08',
    title: 'Login with spaces only',
    email: '   ',
    password: '   ',
    type: 'FIELD_ERROR',
    selector: '#email_help .ant-form-item-explain-error',
    expectedText: 'Please input a valid email!'
  },
  {
    id: 'AUTH-TC-08b',
    title: 'Login with spaces only (password)',
    email: '   ',
    password: '   ',
    type: 'FIELD_ERROR',
    selector: '#password_help .ant-form-item-explain-error',
    expectedText: 'Password must be at least 8 characters!'
  },
];

// 2️⃣ ОБЩАЯ ФУНКЦИЯ ДЛЯ ВХОДА (Чтобы не писать это 3 раза)
async function loginAction(page: Page, email: string, password: string) {
  const cookieButton = page.locator('#cookie_apply1');
  if (await cookieButton.isVisible()) await cookieButton.click();
  await page.getByRole('button', { name: 'Sign in' }).click();
  const frame = page.frameLocator('#auth-iframe');
  await frame.locator('input[placeholder="Enter email"]').fill(email);
  await frame.locator('input[placeholder="Enter password"]').fill(password);
  await frame.locator('input[type="password"]').press('Enter');

  return frame; // возвращаем фрейм, если он понадобится для проверки ошибок
}

for (const data of loginCases_FIELD_ERROR) {
  test(`${data.id} | ${data.title}`, async ({ page }) => {
    console.log(`▶️ ${data.id}: ${data.title}`);
    const pm = new PageManager(page);
    await pm.onNavigateTo().goToLoginModal();
    const frame = await loginAction(page, data.email, data.password);
    const errorLocator = frame.locator(data.selector ?? '#email_help .ant-form-item-explain-error');
    const expectedText = data.expectedText ?? 'Incorrect email or password';
    await expect(errorLocator).toContainText(expectedText);
    console.log(`⚠️ ${data.id}: Error message displayed — "${expectedText}"`);
  }
  )
}
// Группа 2: Успешный провайдер
for (const data of loginCases_SUCCESS_PROVIDER) {
  test(`${data.id} | ${data.title}`, async ({ page }) => {
    const pm = new PageManager(page);
    await pm.onNavigateTo().goToLoginModal();
    await loginAction(page, data.email, data.password);
    await expect(page.locator('.name')).toBeVisible({ timeout: 10000 });
    console.log(`✅ ${data.id}: Provider login success`);
  });
}
// Группа 1: Успешный клиент
for (const data of loginCases_SUCCESS_CLIENT) {
  test(`${data.id} | ${data.title}`, async ({ page }) => {
    const pm = new PageManager(page);
    await pm.onNavigateTo().goToLoginModal();
    await loginAction(page, data.email, data.password);
    // Прямая проверка успеха без всяких try/catch
    await expect(page.locator('.name')).toBeVisible({ timeout: 10000 });
    console.log(`✅ ${data.id}: Client login success`);
  });
}
