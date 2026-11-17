import { test, expect, toast } from './support/fixtures';
import { SEED } from './support/mock-api';

const resultsUrl = `/projects/${SEED.projectWithGroups}/results?groupId=${SEED.groupCheckout}`;
const codeUrl = `/projects/${SEED.projectWithGroups}/results/s-1/code`;

test.describe('BDD Code', () => {
  test('TC-044 BDD-001 Senaryodan BDD kodu üretme ve framework değişimi @integration', async ({ page, api }) => {
    await page.goto(resultsUrl);
    await page.locator('article').first().getByRole('link', { name: 'Kod' }).click();
    await expect(page).toHaveURL(codeUrl);

    const code = page.locator('pre code');
    const tab = (name: string) => page.getByRole('button', { name, exact: true });

    await expect(tab('cucumber')).toHaveAttribute('data-active', 'true');
    await expect(code).toContainText('Feature:');

    await tab('playwright').click();
    await expect(tab('playwright')).toHaveAttribute('data-active', 'true');
    await expect(code).toContainText("from '@playwright/test'");

    await tab('cypress').click();
    await expect(code).toContainText('cy.visit');

    const callsBefore = api.callsTo('POST', '/scenarios/convert-bdd').length;
    expect(callsBefore).toBe(3);
    expect(api.callsTo('POST', '/scenarios/convert-bdd').map((c) => c.body.framework)).toEqual([
      'cucumber',
      'playwright',
      'cypress',
    ]);

    // Cache: cucumber'a donuste yeni istek atilmaz, kod aninda gorunur
    await tab('cucumber').click();
    await expect(code).toContainText('Feature:', { timeout: 1000 });
    await expect(page.getByText('cucumber kodu üretiliyor...')).toHaveCount(0);
    expect(api.callsTo('POST', '/scenarios/convert-bdd')).toHaveLength(callsBefore);
  });

  test('TC-045 BDD-002 Üretilen kodu kopyalama', async ({ page, api, context, baseURL }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: baseURL });
    api.delay('POST', '/scenarios/convert-bdd', 1500);
    await page.goto(codeUrl);

    const copyBtn = page.getByRole('button', { name: 'Kopyala' });
    await expect(page.getByText('cucumber kodu üretiliyor...')).toBeVisible();
    await expect(copyBtn).toBeDisabled();

    const code = page.locator('pre code');
    await expect(code).toContainText('Feature:');
    await copyBtn.click();

    await expect(toast(page, 'Kod kopyalandı')).toBeVisible();
    await expect(page.getByRole('button', { name: '✓ Kopyalandı' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Kopyala' })).toBeVisible({ timeout: 4000 });

    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toBe(await code.textContent());
  });
});
