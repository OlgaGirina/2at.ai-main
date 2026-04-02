import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CaseCreationPage extends BasePage {
    // Нам не нужно объявлять readonly page: Page, так как это уже есть в BasePage

    constructor(page: Page) {
        super(page); // Передаем page "родителю"
    }
    async goToProviderCaseProfile(id: string, case_id: string) {
        await this.navigateTo(`/provider/${id}/${case_id}`);
    }
}