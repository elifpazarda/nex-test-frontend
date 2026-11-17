import { test, expect, toast } from './support/fixtures';
import { SEED } from './support/mock-api';

test.describe('Settings / Jira', () => {
  test('TC-046 JIRA-001 Jira OAuth bağlantısı ve callback sayfası @integration', async ({ page, api, context }) => {
    // Atlassian yetkilendirme ekrani — dis siteye cikmamak icin stub
    await context.route('https://auth.atlassian.com/**', (route) =>
      route.fulfill({ contentType: 'text/html; charset=utf-8', body: '<h1>Atlassian izin ekranı</h1>' }),
    );
    api.delay('GET', '/jira/auth-url', 800);

    await page.goto('/settings/jira');
    await page.getByRole('button', { name: "Jira'ya bağlan" }).click();
    await expect(page.getByRole('button', { name: 'Yönlendiriliyor...' })).toBeDisabled();
    await expect(page).toHaveURL(/^https:\/\/auth\.atlassian\.com\/authorize/);
    await expect(page.getByRole('heading', { name: 'Atlassian izin ekranı' })).toBeVisible();

    // Izin sonrasi backend kullaniciyi callback'e success=true ile dondurur
    await page.goto('/jira/callback?success=true');
    await expect(page.getByRole('heading', { name: 'Jira başarıyla bağlandı' })).toBeVisible();

    await page.goto('/jira/callback?error=access_denied');
    await expect(page.getByRole('heading', { name: 'Bağlantı başarısız' })).toBeVisible();
    await expect(page.getByText('access_denied')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ayarlara dön' })).toHaveAttribute('href', '/settings/jira');
  });

  test('TC-047 JIRA-002 Jira bağlantısını kesme', async ({ page, api }) => {
    api.jiraConnection = {
      siteUrl: 'https://trendyol.atlassian.net',
      siteName: 'Trendyol Jira',
      connectedAt: '2026-10-01T10:00:00.000Z',
      updatedAt: '2026-11-01T10:00:00.000Z',
    };
    await page.goto('/settings/jira');
    await expect(page.getByRole('heading', { name: 'Trendyol Jira' })).toBeVisible();

    await page.getByRole('button', { name: 'Bağlantıyı kes' }).click();
    const dialog = page.getByRole('dialog', { name: 'Jira bağlantısını kes' });
    await dialog.getByRole('button', { name: 'Bağlantıyı kes' }).click();

    await expect(toast(page, 'Jira bağlantısı kaldırıldı')).toBeVisible();
    await expect(page.getByRole('button', { name: "Jira'ya bağlan" })).toBeVisible();
    expect(api.callsTo('DELETE', '/jira/connection')).toHaveLength(1);

    await page.goto(`/projects/${SEED.projectWithGroups}/generate/jira`);
    await expect(page.getByText('Jira bağlantısı yok')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Senaryo üret' })).toBeDisabled();
  });
});
