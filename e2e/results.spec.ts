import { test, expect, toast } from './support/fixtures';
import { SEED } from './support/mock-api';

const resultsUrl = (projectId: string, groupId?: string) =>
  `/projects/${projectId}/results${groupId ? `?groupId=${groupId}` : ''}`;

test.describe('Results', () => {
  test('TC-037 RES-001 Sonuç sayfasında senaryo listesi', async ({ page, api }) => {
    await page.goto(resultsUrl(SEED.projectWithGroups, SEED.groupCheckout));
    const expected = api.scenariosOf(SEED.groupCheckout);

    await expect(page.locator('p', { hasText: 'kayıtlı senaryo var' })).toHaveText(
      `Bu grupta ${expected.length} kayıtlı senaryo var.`,
    );
    const cards = page.locator('article');
    await expect(cards).toHaveCount(expected.length);

    const priorityLabel = { critical: 'Kritik', high: 'Yüksek', medium: 'Orta', low: 'Düşük' } as const;
    for (const [i, s] of expected.entries()) {
      const card = cards.nth(i);
      await expect(card).toContainText(s.title);
      await expect(card).toContainText(priorityLabel[s.priority]);
      await expect(card).toContainText('Adımlar');
      for (const step of s.steps) await expect(card).toContainText(step);
      await expect(card).toContainText(s.expectedResult);
    }

    const breadcrumb = page.getByRole('navigation').filter({ hasText: 'Trendyol Checkout' });
    await expect(breadcrumb).toContainText('Projeler');
    await expect(breadcrumb).toContainText('Sepet · Ödeme');
  });

  test('TC-038 RES-002 groupId olmadan ve boş grupta sonuç sayfası @negative', async ({ page }) => {
    await page.goto(resultsUrl(SEED.projectWithGroups));
    await expect(page.getByRole('heading', { name: 'Senaryo grubu seçilmedi' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Projeye dön' })).toHaveAttribute(
      'href',
      `/projects/${SEED.projectWithGroups}`,
    );

    await page.goto(resultsUrl(SEED.projectMobile, SEED.groupEmpty));
    await expect(page.getByRole('heading', { name: 'Bu grupta henüz senaryo yok' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Dışa aktar' })).toBeDisabled();
  });

  test('TC-039 RES-003 Tekil senaryo silme @regression', async ({ page, api }) => {
    await page.goto(resultsUrl(SEED.projectWithGroups, SEED.groupCheckout));
    const before = api.scenariosOf(SEED.groupCheckout).length;
    const target = 'Yetersiz bakiye uyarisi gosterilir';

    await page.locator('article', { hasText: target }).getByRole('button', { name: 'Sil' }).click();
    const dialog = page.getByRole('dialog', { name: 'Senaryoyu sil' });
    await expect(dialog).toContainText(`"${target}"`);
    await dialog.getByRole('button', { name: 'Sil', exact: true }).click();

    await expect(toast(page, 'Senaryo silindi')).toBeVisible();
    await expect(page.locator('article', { hasText: target })).toHaveCount(0);
    await expect(page.locator('article')).toHaveCount(before - 1);
    await expect(page.locator('p', { hasText: 'kayıtlı senaryo var' })).toHaveText(
      `Bu grupta ${before - 1} kayıtlı senaryo var.`,
    );

    // Proje detayindaki grup sayaci (uygulama ici gezinme)
    await page.getByRole('link', { name: 'Trendyol Checkout' }).click();
    const row = page.getByRole('button', { name: /Sepet · Ödeme/ });
    await expect(row.locator(':scope > span').nth(1)).toHaveText(String(before - 1));
  });
});
