// pages/NavigationPage.ts
import { Page } from '@playwright/test';

export class NavigationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  // --- AUTH ---
  async goToLogin() {
    await this.page.goto('/auth/login', { waitUntil: 'domcontentloaded' });
  }
  // --- REG ---
  async goToRerForm() {
    await this.page.goto('/auth/registerForm?partnership=client', { waitUntil: 'domcontentloaded' });
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
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }
  // --- REG ---
  async goToRerFormModal() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }
  async goToProviderCaseProfile(id: string, case_id: string) {
    await this.page.goto(`/provider/${id}/${case_id}`);
  }
}
