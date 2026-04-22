import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { NavigationPage } from './NavigationPage';
import { CaseCreationPage } from './CaseCreationPage';

export class PageManager {
    private readonly page: Page;
    // Объявляем свойства для каждой страницы
    readonly loginPage: LoginPage;
    readonly navigationPage: NavigationPage;
    readonly caseCreationPage: CaseCreationPage;

    constructor(page: Page) {
        this.page = page;
        // Инициализируем их один раз здесь
        this.loginPage = new LoginPage(this.page);
        this.navigationPage = new NavigationPage(this.page);
        this.caseCreationPage = new CaseCreationPage(this.page);
    }
    onNavigateTo() {
        return this.navigationPage;

    }
    onLoginTo() {
        return this.loginPage;
    }
    onCaseCreationTo() {
        return this.caseCreationPage;
    }

}