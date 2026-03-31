import { BasePage } from './BasePage';

export class NavigationPage extends BasePage {
  // Нам не нужно объявлять readonly page: Page, так как это уже есть в BasePage

  constructor(page: any) {
    super(page); // Передаем page "родителю"
  }

  // --- AUTH ---
  async goToLogin() {
    await this.navigateTo('/auth/login');
  }

  // --- REG ---
  async goToRerForm() {
    await this.navigateTo('/auth/registerForm?partnership=client');
  }

  // --- CLIENT PAGES ---
  async goToClientProfile(id: string) {
    await this.navigateTo(`/client/${id}/profile`);
  }

  // --- PROVIDER PAGES ---
  async goToProviderProfile(id: string) {
    await this.navigateTo(`/provider/${id}/profile`);
  }

  async goToLoginModal() {
    await this.navigateTo('/');
  }

  // --- REG ---
  async goToRerFormModal() {
    await this.navigateTo('/');
  }

  async goToProviderCaseProfile(id: string, case_id: string) {
    await this.navigateTo(`/provider/${id}/${case_id}`);
  }
}