// pages/NavigationPage.ts
import { Page } from '@playwright/test';

export class NavigationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  // --- AUTH ---
  async goToLogin() {
    await this.page.goto('https://2at.ai/auth/login', { waitUntil: 'domcontentloaded' });
  }
  // --- REG ---
  async goToRerForm() {
    await this.page.goto('https://2at.ai/auth/registerForm?partnership=client',{waitUntil: 'domcontentloaded'});
  }
  // --- CLIENT PAGES ---
async goToClientProfile(id: string) {
  await this.page.goto(`/client/${id}/profile`);
}
  // --- PROVIDER PAGES ---
  async goToProviderProfile(id: string) {
    await this.page.goto(`/provider/${id}/profile`);
  }
   async goToLoginModal() {
    await this.page.goto('https://2at.ai', { waitUntil: 'domcontentloaded' });
  }
  // --- REG ---
  async goToRerFormModal() {
    await this.page.goto('https://2at.ai',{waitUntil: 'domcontentloaded'});
  }
}
