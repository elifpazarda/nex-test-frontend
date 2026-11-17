import { test, expect, toast } from './support/fixtures';
import { SEED } from './support/mock-api';
import type { Page } from '@playwright/test';

const groupRow = (page: Page, name: string | RegExp) => page.getByRole('button', { name });

async function openGroupMenu(page: Page, groupName: string) {
  await groupRow(page, groupName).getByRole('button', { name: 'Grup aksiyonları' }).click();
}

const statValue = (page: Page, label: string) =>
  page.getByText(label, { exact: true }).locator('xpath=following-sibling::p[1]');

test.describe('Scenario Groups', () => {
  test('TC-020 GRP-001 Proje detayında senaryo grubu listesi ve boş durum', async ({ page }) => {
    await page.goto(`/projects/${SEED.projectEmpty}`);
    await expect(page.getByRole('heading', { name: 'Henüz senaryo grubu yok' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Senaryo üret' })).toHaveCount(2); // hero + bos durum

    await page.goto(`/projects/${SEED.projectWithGroups}`);
    await expect(groupRow(page, /Sepet · Ödeme/)).toBeVisible();
    await expect(groupRow(page, /Smoke Paketi/)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Henüz senaryo grubu yok' })).toBeHidden();

    await groupRow(page, /Sepet · Ödeme/).click();
    await expect(page).toHaveURL(`/projects/${SEED.projectWithGroups}/results?groupId=${SEED.groupCheckout}`);
  });

  test('TC-021 GRP-002 Senaryo grubu düzenleme', async ({ page, api }) => {
    await page.goto(`/projects/${SEED.projectWithGroups}`);
    await openGroupMenu(page, 'Sepet · Ödeme');
    await page.getByRole('menuitem', { name: 'Düzenle' }).click();

    const dialog = page.getByRole('dialog', { name: 'Grubu düzenle' });
    await expect(dialog.locator('#edit-group-name')).toHaveValue('Sepet · Ödeme');
    await dialog.locator('#edit-group-name').fill('Sepet · Ödeme v2');
    await dialog.locator('#edit-group-type').selectOption('REGRESSION');
    await dialog.getByRole('button', { name: 'Kaydet' }).click();

    await expect(toast(page, 'Grup güncellendi')).toBeVisible();
    await expect(dialog).toBeHidden();
    const row = groupRow(page, /Sepet · Ödeme v2/);
    await expect(row).toBeVisible();
    await expect(row).toContainText('REGRESSION');
    expect(api.callsTo('PATCH', `/scenario-groups/${SEED.groupCheckout}`)[0].body).toEqual({
      name: 'Sepet · Ödeme v2',
      type: 'REGRESSION',
    });
  });

  test('TC-022 GRP-003 Grup adı validasyonu (2-100 karakter) @boundary', async ({ page, api }) => {
    await page.goto(`/projects/${SEED.projectWithGroups}`);
    await openGroupMenu(page, 'Smoke Paketi');
    await page.getByRole('menuitem', { name: 'Düzenle' }).click();

    const dialog = page.getByRole('dialog', { name: 'Grubu düzenle' });
    const name = dialog.locator('#edit-group-name');
    const save = dialog.getByRole('button', { name: 'Kaydet' });

    await name.fill('A');
    await save.click();
    await expect(dialog.getByText('Grup adı en az 2 karakter olmalı')).toBeVisible();

    await name.fill('x'.repeat(101));
    await save.click();
    await expect(dialog.getByText('Grup adı en fazla 100 karakter olmalı')).toBeVisible();
    expect(api.callsTo('PATCH', `/scenario-groups/${SEED.groupSmoke}`)).toHaveLength(0);

    await name.fill('y'.repeat(100));
    await save.click();
    await expect(toast(page, 'Grup güncellendi')).toBeVisible();
    expect(api.callsTo('PATCH', `/scenario-groups/${SEED.groupSmoke}`)[0].body.name).toHaveLength(100);
  });

  test('TC-023 GRP-004 Senaryo grubu silme', async ({ page, api }) => {
    await page.goto('/projects');
    const groupsBefore = api.groups.length;
    const scenariosBefore = api.scenarios.length;
    const removedScenarios = api.scenariosOf(SEED.groupCheckout).length;
    await expect(statValue(page, 'Senaryo grubu')).toHaveText(String(groupsBefore));

    // Gercek kullanici akisi: uygulama ici gezinme (React Query cache'i korunur)
    await page.getByRole('link', { name: /Trendyol Checkout/ }).click();
    await expect(page).toHaveURL(`/projects/${SEED.projectWithGroups}`);
    await openGroupMenu(page, 'Sepet · Ödeme');
    await page.getByRole('menuitem', { name: 'Sil' }).click();

    const dialog = page.getByRole('dialog', { name: 'Grubu sil' });
    await expect(dialog).toContainText('"Sepet · Ödeme"');
    await dialog.getByRole('button', { name: 'Sil', exact: true }).click();

    await expect(toast(page, 'Grup silindi')).toBeVisible();
    await expect(groupRow(page, /Sepet · Ödeme/)).toBeHidden();

    await page.getByRole('link', { name: 'Projeler' }).first().click();
    await expect(statValue(page, 'Senaryo grubu')).toHaveText(String(groupsBefore - 1));
    await expect(statValue(page, 'Toplam senaryo')).toHaveText(String(scenariosBefore - removedScenarios));
  });
});
