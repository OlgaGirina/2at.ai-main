import { test, expect, Page } from '@playwright/test';
import { PageManager } from '../pages/PageManager';

// 1. Данные для успешной регистрации
const registerCases_success = [
  {
    id: 'REG-01-01',
    title: 'Valid Client Registration',
    company: 'AutoClient_' + Date.now(),
    email: `autotest_${Date.now()}@mailinator.com`,
    password: 'ValidPass123',
    confirmPassword: 'ValidPass123',
  },
  {
    id: 'REG-01-08',
    title: 'Client Registration - Existing Email',
    company: 'NewCompany_' + Date.now(),
    email: 'olik255@rambler.ru',
    password: 'ValidPass123',
    confirmPassword: 'ValidPass123',
  }
];

// 2. Данные для ошибок валидации
const registerCases_fieldError = [
  {
    id: 'REG-01-03',
    title: 'Wrong Email Format',
    company: 'TestCompany_' + Date.now(),
    email: 'abc123',
    password: 'ValidPass123',
    confirmPassword: 'ValidPass123',
    selector: '#email_help .ant-form-item-explain-error',
    expectedTexts: ['Please input a valid email!']
  },
  {
    id: 'REG-01-04',
    title: 'Short Password',
    company: 'TestCompany_' + Date.now(),
    email: `shortpass_${Date.now()}@mailinator.com`,
    password: 'short7',
    confirmPassword: 'short7',
    selector: '#password_help .ant-form-item-explain-error',
    expectedTexts: ['Password must be at least 8 characters!']
  },
  {
    id: 'REG-01-05',
    title: 'Invalid Client Registration - Long Password',
    type: 'FIELD_ERROR',
    company: 'TestCompany_' + Date.now(),
    email: `longpass_${Date.now()}@mailinator.com`,
    password: 'A'.repeat(26),
    confirmPassword: 'A'.repeat(26),
    selector: '#password_help .ant-form-item-explain-error',
    expectedTexts: ['Password must be no more than 25 characters!']
  },
  {
    id: 'REG-01-06',
    title: 'Invalid Client Registration - Not Unique Company Name',
    type: 'FIELD_ERROR',
    company: 'comp',
    email: `uniquecheck_${Date.now()}@mailinator.com`,
    password: 'ValidPass123',
    confirmPassword: 'ValidPass123',
    selector: '#name_help .ant-form-item-explain-error',
    expectedTexts: ['This company name is already registered']
  },
  {
    id: 'REG-01-07',
    title: 'Passwords Do Not Match',
    company: 'TestCompany_' + Date.now(),
    email: `mismatch_${Date.now()}@mailinator.com`,
    password: 'ValidPass123',
    confirmPassword: 'WrongPass123',
    selector: '#confirmPassword_help .ant-form-item-explain-error',
    expectedTexts: ['Passwords do not match!']
  },
  {
    id: 'REG-01-09',
    title: 'Invalid Client Registration - Ivalid email',
    type: 'FIELD_ERROR',
    company: 'NewCompany_' + Date.now(),
    email: '#@.', // невалидный эмейл
    password: 'ValidPass123',
    confirmPassword: 'ValidPass123',
    selector: '#email_help .ant-form-item-explain-error',
    expectedTexts: ['Please input a valid email!']
  }
];

interface RegistrationData {
  company: string;
  email: string;
  password: string;         // знак вопроса значит, что поле необязательное
  confirmPassword: string;
  selector?: string;
  expectedTexts?: string[];
}

// Общая функция для заполнения формы (выносим повторения)
async function fillRegistrationForm(page: Page, data: RegistrationData) {
  const frame = page.frameLocator('#auth-iframe');
  await page.locator('#cookie_apply1').click();
  await page.getByRole('button', { name: 'Sign in' }).click();
  await frame.getByRole('button', { name: 'Join Us' }).click();

  const companyInput = frame.getByRole('textbox', { name: /company name/i });
  await companyInput.click();
  await companyInput.pressSequentially(data.company, { delay: 50 });
  await companyInput.blur();
  await frame.getByRole('checkbox').click();
  await frame.getByRole('button', { name: 'Create account' }).click();
  await frame.getByPlaceholder('Enter email').fill(data.email);
  await frame.getByPlaceholder('Enter password').fill(data.password);
  await frame.getByPlaceholder('Confirm password').fill(data.confirmPassword);
  await frame.getByRole('checkbox', { name: /I agree to Terms/ }).check();
  await frame.getByRole('button', { name: 'Create account' }).click();
  return frame; // возвращаем фрейм, чтобы проверять в нем ошибки
}

// 🔹 ГРУППА ТЕСТОВ: УСПЕХ
for (const data of registerCases_success) {
  test(`${data.id} | Success: ${data.title}`, async ({ page }) => {
    const pm = new PageManager(page);
    await pm.onNavigateTo().goToRerFormModal();
    await fillRegistrationForm(page, data);

    // Прямая проверка без условий
    await expect(page).toHaveURL(/client/);
    console.log(`✅ ${data.id}: Success URL reached`);
  });
}

// 🔹 ГРУППА ТЕСТОВ: ОШИБКИ ПОЛЕЙ
for (const data of registerCases_fieldError) {
  test(`${data.id} | Error: ${data.title}`, async ({ page }) => {
    const pm = new PageManager(page);
    await pm.onNavigateTo().goToRerFormModal();
    const frame = await fillRegistrationForm(page, data);

    // Прямая проверка ошибок
    const errorSelector = data.selector || '#email_help .ant-form-item-explain-error';
    const texts = data.expectedTexts || ['Incorrect email or password'];
    for (const text of texts) {
      await expect(frame.locator(errorSelector).first()).toContainText(text);
      console.log(`⚠️ ${data.id}: Expected error found — "${text}"`);
    }
  });
}