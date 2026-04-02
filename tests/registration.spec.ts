import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageMamager';

// 🔹 Тестовые данные для регистрации клиента
const registerCases = [
  {
    id: 'REG-01-01',
    title: 'Valid Client Registration',
    type: 'SUCCESS',
    company: 'AutoClient_' + Date.now(),
    email: `autotest_${Date.now()}@mailinator.com`,
    password: 'ValidPass123',
    confirmPassword: 'ValidPass123',
  },
  /* {
     id: 'REG-01-02',
     title: 'Invalid Client Registration - Empty Fields',
     type: 'FIELD_ERROR',
     company: '',
     email: '',
     password: '',
     confirmPassword: '',
     selector: '#email_help .ant-form-item-explain-error',
     expectedTexts: ["Please input your email!"]
   },*/
  {
    id: 'REG-01-03',
    title: 'Invalid Client Registration - Wrong Email Format',
    type: 'FIELD_ERROR',
    company: 'TestCompany_' + Date.now(),
    email: 'abc123',
    password: 'ValidPass123',
    confirmPassword: 'ValidPass123',
    selector: '#email_help .ant-form-item-explain-error',
    expectedTexts: ['Please input a valid email!']
  },
  {
    id: 'REG-01-04',
    title: 'Invalid Client Registration - Short Password',
    type: 'FIELD_ERROR',
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
    title: 'Invalid Client Registration - Passwords Do Not Match',
    type: 'FIELD_ERROR',
    company: 'TestCompany_' + Date.now(),
    email: `mismatch_${Date.now()}@mailinator.com`,
    password: 'ValidPass123',
    confirmPassword: 'WrongPass123',
    selector: '#confirmPassword_help .ant-form-item-explain-error',
    expectedTexts: ['Passwords do not match!']
  },
  {
    id: 'REG-01-08',
    title: 'Client Registration(Autorisation) - Existing Email',
    type: 'SUCCESS',
    company: 'NewCompany_' + Date.now(),
    email: 'olik255@rambler.ru', // существующий email
    password: 'ValidPass123',
    confirmPassword: 'ValidPass123',
    selector: '.ant-form-item-explain-error',
    // expectedTexts: ['User already exists. Please use the Sign In form']
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
// 🔹 Цикл по кейсам
for (const data of registerCases) {
  test(`${data.id} | ${data.title}`, async ({ page }) => {
    console.log(`▶️ ${data.id}: ${data.title}`);
    // const navigation = new NavigationPage(page);
    const pm = new PageManager(page);
    await pm.onNavigateTo().goToRerFormModal();
    // Закрытие попапа  уведомляющего о куках
    await page.waitForSelector('#cookie_apply1', { state: 'visible' });
    await page.click('#cookie_apply1');
    // 1️⃣ Клик по кнопке, чтобы открыть модалку (и iframe)
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForSelector('#auth-iframe');
    // нажать Join Us
    await page
      .frameLocator('#auth-iframe')
      .getByRole('button', { name: 'Join Us' })
      .click();

    const frame = page.frameLocator('#auth-iframe');
    const companyInput = frame.getByRole('textbox', { name: /company name/i });

    await companyInput.click();
    await companyInput.pressSequentially(data.company, { delay: 50 });
    await companyInput.blur();

    // ждём, что форма раскрылась
    await expect(frame.getByRole('checkbox')).toBeVisible({ timeout: 10000 });

    // теперь чекбокс точно есть
    await frame.getByRole('checkbox').click();

    await frame.getByRole('button', { name: 'Create account' }).click();
    await frame.getByPlaceholder('Enter email').fill(data.email);

    if (data.password !== undefined)
      await frame.getByPlaceholder('Enter password').fill(data.password);

    if (data.confirmPassword !== undefined)
      await frame.getByPlaceholder('Confirm password').fill(data.confirmPassword);

    // Активировать чек-бокс
    await frame.getByRole('checkbox', { name: 'I agree to Terms of Use and' }).check();

    // Нажать Create account
    await frame.getByRole('button', { name: 'Create account' }).click();

    if (data.type === 'SUCCESS') {
      // Проверка успешной регистрации
      try {
        // await expect(page.locator('.ant-modal-content')).toContainText('Registration Email Sent', { timeout: 10000 });
        // console.log(`✅ ${data.id}: Registration successful`);
        await expect(page).toHaveURL(/client/);
      } catch (e) {
        console.log(`⚠️ ${data.id}: Expected success message not found`);
        throw e;
      }
    } else if (data.type === 'FIELD_ERROR') {
      // Проверка ошибок валидации
      for (const text of data.expectedTexts ?? 'Incorrect email or password') {
        const errorLocator = frame.locator(data.selector ?? '#email_help .ant-form-item-explain-error').first();
        await expect(errorLocator).toContainText(text, { timeout: 5000 });
        //await expect(errorLocator).toHaveText(text); 

        console.log(`⚠️ ${data.id}: Error message displayed — "${text}"`);
      }
    }
  });
}




