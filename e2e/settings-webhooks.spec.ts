import { test, expect, toast } from './support/fixtures';
import { SEED } from './support/mock-api';
import type { Locator, Page } from '@playwright/test';

/** CopyField icindeki "Kopyala" butonu (etiket <p>'sinin kardes kutusunda) */
const copyButton = (scope: Locator | Page, label: string) =>
  scope.getByText(label, { exact: true }).locator('xpath=..').getByRole('button', { name: 'Kopyala' });

test.describe('Settings / Webhooks', () => {
  test.beforeEach(async ({ context, baseURL }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: baseURL });
  });

  test('TC-048 SCM-001 Yeni webhook bağlantısı oluşturma ve secret gösterimi @critical @security', async ({ page, api }) => {
    await page.goto('/settings/webhooks');
    await expect(page.getByRole('heading', { name: 'Henüz webhook bağlantısı yok' })).toBeVisible();
    await page.getByRole('button', { name: 'Bağlantı oluştur' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Yeni webhook bağlantısı' })).toBeVisible();
    await dialog.getByPlaceholder('örn. backend-repo').fill('backend-repo');
    await dialog.getByRole('button', { name: 'Oluştur' }).click();

    await expect(dialog.getByRole('heading', { name: 'Bağlantı oluşturuldu' })).toBeVisible();
    await expect(dialog.getByText(/Bu secret yalnızca şimdi gösteriliyor/)).toBeVisible();

    const created = api.scmConnections[0];
    const secret = dialog.locator('code', { hasText: /^whsec_/ });
    const secretValue = (await secret.textContent())!.trim();
    expect(secretValue).toMatch(/^whsec_/);

    await copyButton(dialog, 'Payload URL').click();
    await expect(toast(page, 'Payload URL kopyalandı')).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(created.webhookUrl);

    await copyButton(dialog, 'Secret').click();
    await expect(toast(page, 'Secret kopyalandı')).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(secretValue);

    await dialog.getByRole('button', { name: 'Tamam' }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('heading', { name: 'backend-repo' })).toBeVisible();
    await expect(page.getByText(secretValue)).toHaveCount(0); // secret tekrar gosterilmez
    expect(api.callsTo('POST', '/v1/scm-webhooks')[0].body).toMatchObject({
      provider: 'github',
      label: 'backend-repo',
      autoGenerate: false,
    });
  });

  test('TC-049 SCM-002 Otomatik üretim için hedef grup zorunluluğu @negative', async ({ page, api }) => {
    await page.goto('/settings/webhooks');
    await page.getByRole('button', { name: 'Bağlantı oluştur' }).click();
    const dialog = page.getByRole('dialog');
    const projectSelect = dialog.locator('select').nth(0);
    const groupSelect = dialog.locator('select').nth(1);
    const autoToggle = dialog.getByRole('switch');

    // 1) Proje secilmeden hedef grup pasif
    await expect(groupSelect).toBeDisabled();
    await expect(groupSelect.locator('option').first()).toHaveText('Önce proje seçin');

    // 2) Proje secili, grup "Seçilmedi" → toggle pasif
    await projectSelect.selectOption(SEED.projectWithGroups);
    await expect(groupSelect).toBeEnabled();
    await expect(groupSelect.locator('option').first()).toHaveText('Seçilmedi');
    await expect(autoToggle).toBeDisabled();
    await expect(dialog.getByText('Önce bir hedef grup seçin')).toBeVisible();

    // 3) Hedef grup secili → toggle acilabilir
    await groupSelect.selectOption(SEED.groupCheckout);
    await expect(autoToggle).toBeEnabled();
    await autoToggle.click();
    await expect(autoToggle).toHaveAttribute('aria-checked', 'true');

    // 4) Etiket 101 karakter → validasyon hatasi, istek yok
    await dialog.getByPlaceholder('örn. backend-repo').fill('x'.repeat(101));
    await dialog.getByRole('button', { name: 'Oluştur' }).click();
    await expect(dialog.getByText('En fazla 100 karakter olabilir')).toBeVisible();
    expect(api.callsTo('POST', '/v1/scm-webhooks')).toHaveLength(0);
  });

  test('TC-050 SCM-003 Secret yenileme ve bağlantı silme @security', async ({ page, api }) => {
    api.scmConnections.push({
      id: 'scm-seed',
      provider: 'github',
      label: 'backend-repo',
      active: true,
      autoGenerate: false,
      targetGroupId: null,
      projectId: null,
      webhookUrl: 'https://api.nextest.dev/api/v1/scm-webhooks/github/scm-seed',
      createdAt: '2026-11-01T10:00:00.000Z',
    });
    await page.goto('/settings/webhooks');
    await expect(page.getByRole('heading', { name: 'backend-repo' })).toBeVisible();

    await page.getByRole('button', { name: 'Secret yenile' }).click();
    const rotate = page.getByRole('dialog');
    await expect(rotate.getByRole('heading', { name: "Secret'ı yenile" })).toBeVisible();
    await rotate.getByRole('button', { name: 'Yenile' }).click();

    await expect(rotate.getByRole('heading', { name: 'Yeni secret oluşturuldu' })).toBeVisible();
    await expect(rotate.getByText(/Eski secret artık geçersiz/)).toBeVisible();
    await expect(rotate.locator('code', { hasText: /^whsec_rotated_/ })).toBeVisible();
    expect(api.callsTo('POST', '/v1/scm-webhooks/scm-seed/rotate-secret')).toHaveLength(1);
    await rotate.getByRole('button', { name: 'Tamam' }).click();
    await expect(rotate).toBeHidden();

    await page.getByRole('button', { name: 'Sil', exact: true }).click();
    const del = page.getByRole('dialog', { name: 'Bağlantıyı sil' });
    await del.getByRole('button', { name: 'Sil', exact: true }).click();

    await expect(toast(page, 'Bağlantı silindi')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'backend-repo' })).toBeHidden();
    await expect(page.getByRole('heading', { name: 'Henüz webhook bağlantısı yok' })).toBeVisible();
  });
});
