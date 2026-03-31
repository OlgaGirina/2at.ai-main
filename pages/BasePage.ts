import { Page } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Сюда можно добавить общие хелперы, например:
    async navigateTo(url: string) {
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }
}