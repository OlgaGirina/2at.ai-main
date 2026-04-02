import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageMamager';
import { generateRandomPassword } from '../utils/randomData';

const email = process.env.PROVIDER_EMAIL!;
const password = process.env.PROVIDER_PASSWORD!;
if (!email || !password) {
    throw new Error('Missing PROVIDER_EMAIL or PROVIDER_PASSWORD in .env');
}

test.describe('PROVIDER PROFILE TESTS', () => {
    test.beforeEach(async ({ page }) => {

        const pm = new PageManager(page);
        await pm.onCaseCreationTo().goToProviderCaseProfile('5ba548b4-d64a-4ebc-a460-f63bd4649512', '086298e3-9c5c-4634-bba1-6598e39233d3');
    }
    )

    test('CASECREATION-01 | Case creation and deletion', async ({ page }) => {
        const randomMessage = `CaseTest_${generateRandomPassword(12)}`;
        const randomMessage1 = `CaseTestText_${generateRandomPassword(12)}`;
        await page.getByRole('button', { name: 'Add case' }).click();
        await page.getByPlaceholder('Enter case title').click();
        await page.getByPlaceholder('Enter case title').fill(randomMessage);
        await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
        await page.locator('.tiptap.ProseMirror').click();
        await page.keyboard.type(randomMessage1);
        await page.getByRole('button', { name: 'Save' }).click();
        const check = page.getByText(randomMessage1);
        await expect(check).toBeVisible({ timeout: 7000 });
        // Кликаем по кнопке удаления
        await page.getByRole('button', { name: 'Remove case' }).click();
        await page.getByRole('button', { name: 'Delete' }).click();
        // Проверяем, что конкретный кейс больше не отображается на странице
        await expect(page.getByText(randomMessage1)).toBeHidden();

    });
});