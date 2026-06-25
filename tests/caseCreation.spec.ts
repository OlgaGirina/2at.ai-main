import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';
import { generateRandomPassword } from '../utils/randomData';
import textData from '../utils/textForCaseCreation.json';
const process = (globalThis as any).process;
const email = process.env.PROVIDER_EMAIL!;
const password = process.env.PROVIDER_PASSWORD!;
const providerProfileId = process.env.PROVIDER_PROFILE_ID!;
const caseProviderId = process.env.CASE_PROVIDER_ID!;
const caseStudyText = textData.caseCreationText;

if (!email || !password) {
    throw new Error('Missing PROVIDER_EMAIL or PROVIDER_PASSWORD in .env');
}

test.describe('PROVIDER PROFILE TESTS', () => {
    test.beforeEach(async ({ page }) => {

        const pm = new PageManager(page);
        await pm.onCaseCreationTo().goToProviderCaseProfile(providerProfileId, caseProviderId);
    }
    )
    
    test('CASECREATION-01 | Case creation and deletion', async ({ page }) => {
        const caseStudyText = textData.caseCreationText;
        const randomMessage = `CaseTest_${generateRandomPassword(12)}`;
        const randomMessage1 = `CaseTestText_${generateRandomPassword(12)}`;

        await page.getByRole('button', { name: 'Add case' }).click();
        await page.getByPlaceholder('Enter case title').fill(randomMessage);
        await page.locator('.tiptap.ProseMirror').click();
        await page.locator('.tiptap.ProseMirror').fill(caseStudyText);
        await page.getByRole('button', { name: 'Save' }).click();
        await page.getByRole('button', { name: 'Publish' }).click();

        // const createdCase = page.locator(`text='Success'`);
        // await expect(createdCase).toBeVisible({ timeout: 7000 });
        await expect(page.locator(`text=${randomMessage}`)).toBeVisible({ timeout: 7000 });
        //    await expect(page.getByRole('alert', { name: 'Success' })).toBeVisible({ timeout: 7000 });
        // Ищем элемент с ролью alert, внутри которого есть текст "Success"
        const successAlert = page.getByRole('alert').filter({ hasText: 'Success' });

        // Проверяем, что он виден на экране
        await expect(successAlert).toBeVisible();
        await page.locator(`.ant-notification-notice-close`).click();
        await page.getByRole('button', { name: 'Remove case' }).click();
        await page.getByRole('button', { name: 'Delete' }).click();
        await expect(page.locator(`text=${randomMessage1}`)).toHaveCount(0);
    });
});