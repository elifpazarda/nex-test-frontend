import { test, expect, toast } from './support/fixtures';
import { SEED } from './support/mock-api';
import type { Page } from '@playwright/test';

/** Istatistik kartinda etiketin hemen altindaki deger */
const statValue = (page: Page, label: string) =>
  page.getByText(label, { exact: true }).locator('xpath=following-sibling::p[1]');

test.describe('Projects', () => {
  test('TC-014 PRJ-001 Yeni proje oluşturma @smoke @critical', async ({ page, api }) => {
    api.delay('POST', '/projects', 800);
    await page.goto('/projects');
    await page.getByRole('button', { name: 'Yeni proje' }).first().click();

    const dialog = page.getByRole('dialog', { name: 'Yeni proje oluştur' });
    await dialog.locator('#project-name').fill('Trendyol Checkout');
    await dialog.locator('#project-desc').fill('Ödeme akışı testleri');
    await dialog.getByRole('button', { name: 'Oluştur' }).click();

    await expect(dialog.getByRole('button', { name: 'Oluşturuluyor...' })).toBeDisabled();
    await expect(toast(page, 'Proje oluşturuldu')).toBeVisible();

    const created = api.projects[0];
    expect(created.description).toBe('Ödeme akışı testleri');
    await expect(page).toHaveURL(`/projects/${created.id}`);

    // Seed'de ayni isimde bir proje zaten var → listede iki kart olmali
    await page.getByRole('link', { name: 'Projeler' }).first().click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole('heading', { name: 'Trendyol Checkout', exact: true })).toHaveCount(2);
  });

  test('TC-015 PRJ-002 Proje adı validasyonu (sınır değer) @boundary', async ({ page, api }) => {
    await page.goto('/projects');
    await page.getByRole('button', { name: 'Yeni proje' }).first().click();
    const dialog = page.getByRole('dialog', { name: 'Yeni proje oluştur' });
    const submit = dialog.getByRole('button', { name: 'Oluştur' });

    await submit.click();
    await expect(dialog.getByText('Proje adı en az 2 karakter olmalı')).toBeVisible();

    await dialog.locator('#project-name').fill('A');
    await submit.click();
    await expect(dialog.getByText('Proje adı en az 2 karakter olmalı')).toBeVisible();
    expect(api.callsTo('POST', '/projects')).toHaveLength(0);

    await dialog.locator('#project-name').fill('AB');
    await submit.click();
    await expect(toast(page, 'Proje oluşturuldu')).toBeVisible();
    expect(api.callsTo('POST', '/projects')[0].body).toEqual({ name: 'AB', description: '' });
  });

  test('TC-016 PRJ-003 Proje listesinde arama', async ({ page }) => {
    await page.goto('/projects');
    const search = page.getByPlaceholder('Projelerde ara...');
    const card = (name: string) => page.getByRole('heading', { name, exact: true });

    await search.fill('MOBIL');
    await expect(card('Mobil Uygulama')).toBeVisible();
    await expect(card('Trendyol Checkout')).toBeHidden();
    await expect(card('Admin Panel')).toBeHidden();

    await search.fill('ödeme');
    await expect(card('Trendyol Checkout')).toBeVisible();
    await expect(card('Mobil Uygulama')).toBeHidden();

    await search.fill('xyz123yok');
    await expect(page.getByText('“xyz123yok” ile eşleşen proje yok.')).toBeVisible();
  });

  test('TC-017 PRJ-004 Grid / Liste görünüm geçişi ve istatistik kartları', async ({ page, api }) => {
    await page.goto('/projects');
    const gridBtn = page.getByRole('button', { name: 'Grid' });
    const listBtn = page.getByRole('button', { name: 'Liste' });

    await listBtn.click();
    await expect(listBtn).toHaveAttribute('data-active', 'true');
    await expect(gridBtn).not.toHaveAttribute('data-active');
    await expect(page.getByText('Güncellendi', { exact: true })).toBeVisible(); // liste basligi

    await gridBtn.click();
    await expect(gridBtn).toHaveAttribute('data-active', 'true');
    await expect(listBtn).not.toHaveAttribute('data-active');
    await expect(page.getByText('Güncellendi', { exact: true })).toBeHidden();

    await expect(statValue(page, 'Aktif proje')).toHaveText(String(api.projects.length));
    await expect(statValue(page, 'Toplam senaryo')).toHaveText(String(api.scenarios.length));
    await expect(statValue(page, 'Senaryo grubu')).toHaveText(String(api.groups.length));

    const adminCard = page.getByRole('link', { name: /Admin Panel/ });
    await expect(adminCard).toContainText('Açıklama yok');
  });

  test('TC-018 PRJ-005 Proje düzenleme', async ({ page }) => {
    await page.goto(`/projects/${SEED.projectWithGroups}`);
    await page.getByRole('button', { name: 'Düzenle' }).click();

    const dialog = page.getByRole('dialog', { name: 'Projeyi düzenle' });
    await expect(dialog.locator('#edit-project-name')).toHaveValue('Trendyol Checkout');
    await expect(dialog.locator('#edit-project-desc')).toHaveValue('Ödeme akışı testleri');

    await dialog.locator('#edit-project-name').fill('Checkout v2');
    await dialog.getByRole('button', { name: 'Kaydet' }).click();

    await expect(toast(page, 'Proje güncellendi')).toBeVisible();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('heading', { level: 1, name: 'Checkout v2' })).toBeVisible();

    await page.goto('/projects');
    await expect(page.getByRole('heading', { name: 'Checkout v2', exact: true })).toBeVisible();
  });

  test('TC-019 PRJ-006 Proje silme ve onay diyaloğu @critical @regression', async ({ page, api }) => {
    await page.goto(`/projects/${SEED.projectWithGroups}`);
    await page.getByRole('button', { name: 'Sil', exact: true }).click();

    const dialog = page.getByRole('dialog', { name: 'Projeyi sil' });
    await expect(dialog).toContainText('"Trendyol Checkout"');
    // Not: Excel'de "İptal" yaziyor; uygulamada bu diyalogun vazgec butonu "Vazgeç".
    await dialog.getByRole('button', { name: 'Vazgeç' }).click();
    await expect(dialog).toBeHidden();
    expect(api.callsTo('DELETE', `/projects/${SEED.projectWithGroups}`)).toHaveLength(0);

    await page.getByRole('button', { name: 'Sil', exact: true }).click();
    await dialog.getByRole('button', { name: 'Sil', exact: true }).click();

    await expect(toast(page, 'Proje silindi')).toBeVisible();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole('heading', { name: 'Mobil Uygulama', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Trendyol Checkout', exact: true })).toBeHidden();
  });
});
