import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput;
  readonly passwordInput;
  readonly signInButton;

  constructor(page: Page) {
    super(page); // Вызывает конструктор BasePage и передает туда page
    this.emailInput = this.page.getByPlaceholder('Enter email');
    this.passwordInput = this.page.getByPlaceholder('Enter password');
    this.signInButton = this.page.getByRole('button', { name: 'Sign in' });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();

    // Ожидаем переход после логина
    await this.page.waitForURL(/(client|provider)\/[a-zA-Z0-9-]+\//, { timeout: 10000 });
  }

  async assertLoginFailed() {
    const error = this.page.locator('.ant-form-item-explain-error');
    await expect(error).toBeVisible();
  }
}