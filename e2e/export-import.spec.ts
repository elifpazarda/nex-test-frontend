import { readFile } from 'node:fs/promises';
import { test, expect, toast, fakeFile } from './support/fixtures';
import { SEED } from './support/mock-api';
import type { Page } from '@playwright/test';

const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const smokeResults = `/projects/${SEED.projectWithGroups}/results?groupId=${SEED.groupSmoke}`;

/** Sayfa basligindaki "Dışa aktar" (kartlardaki menu butonlari da ayni isimde) */
async function openExportDialog(page: Page) {
  await page.getByRole('button', { name: 'Dışa aktar' }).first().click();
  const dialog = page.getByRole('dialog', { name: 'Senaryoları dışa aktar' });
  await expect(dialog).toBeVisible();
  return dialog;
}

test.describe('Export & Import', () => {
  test('TC-040 EXP-001 Grubu Excel (Xray) formatında dışa aktarma @integration', async ({ page, api }) => {
    await page.goto(smokeResults);
    const dialog = await openExportDialog(page);

    await dialog.getByRole('button', { name: /Bu grup/ }).click();
    await dialog.locator('#export-format').selectOption('excel');
    await dialog.getByRole('checkbox').check();

    api.delay('GET', `/scenarios/export/group/${SEED.groupSmoke}`, 800);
    const downloadPromise = page.waitForEvent('download');
    await dialog.getByRole('button', { name: 'İndir' }).click();
    await expect(dialog.getByRole('button', { name: 'Aktarılıyor...' })).toBeDisabled();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('smoke-paketi.xlsx');
    await expect(toast(page, 'Senaryolar dışa aktarıldı')).toBeVisible();
    await expect(dialog).toBeHidden();

    const call = api.callsTo('GET', `/scenarios/export/group/${SEED.groupSmoke}`)[0];
    expect(call.query.get('format')).toBe('excel');
    expect(call.query.get('xrayFormat')).toBe('true');
  });

  test('TC-041 EXP-002 Tüm projeyi farklı formatlarda dışa aktarma', async ({ page, api }) => {
    await page.goto(smokeResults);

    for (const [format, label, ext] of [
      ['pdf', 'PDF (.pdf)', 'pdf'],
      ['json', 'JSON (.json)', 'json'],
      ['feature', 'Gherkin (.feature)', 'feature'],
    ] as const) {
      const dialog = await openExportDialog(page);
      await dialog.getByRole('button', { name: /Tüm proje/ }).click();
      await expect(dialog.getByRole('button', { name: /Tüm proje/ })).toHaveAttribute('data-active', 'true');

      // Xray secenegi yalnizca Excel seciliyken gorunur
      await dialog.locator('#export-format').selectOption('excel');
      await expect(dialog.getByText('Xray formatı')).toBeVisible();
      await dialog.locator('#export-format').selectOption({ label });
      await expect(dialog.getByText('Xray formatı')).toBeHidden();

      const downloadPromise = page.waitForEvent('download');
      await dialog.getByRole('button', { name: 'İndir' }).click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe(`trendyol-checkout.${ext}`);

      const call = api.callsTo('GET', `/scenarios/export/all/${SEED.projectWithGroups}`).at(-1)!;
      expect(call.query.get('format')).toBe(format);
      expect(call.query.get('xrayFormat')).toBeNull();

      // Mock dosya icerigi: projedeki tum senaryolar
      const content = JSON.parse(await readFile((await download.path())!, 'utf8'));
      expect(content).toHaveLength(api.scenarios.filter((s) => s.projectId === SEED.projectWithGroups).length);
      await expect(dialog).toBeHidden();
    }
  });

  test('TC-042 EXP-003 Tekil senaryoyu dışa aktarma', async ({ page, api }) => {
    await page.goto(smokeResults);
    const card = page.locator('article', { hasText: 'Ana sayfa acilir' });
    await card.getByRole('button', { name: 'Dışa aktar' }).click();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('menuitem', { name: 'JSON (.json)' }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('ana-sayfa-acilir.json');
    await expect(toast(page, 'Senaryo dışa aktarıldı')).toBeVisible();

    const call = api.callsTo('GET', '/scenarios/export/s-4')[0];
    expect(call.query.get('format')).toBe('json');
    const content = JSON.parse(await readFile((await download.path())!, 'utf8'));
    expect(content.map((s: { id: string }) => s.id)).toEqual(['s-4']);
  });

  test("TC-043 EXP-004 Excel'den senaryo içeri aktarma (önizleme ve kaydetme) @integration", async ({ page, api }) => {
    await page.goto(smokeResults);
    const before = api.scenariosOf(SEED.groupSmoke).length;
    const validRows = api.importRows.filter((r) => !('error' in r)).length;

    await page.getByRole('button', { name: "Excel'den aktar" }).click();
    let dialog = page.getByRole('dialog', { name: "Excel'den içeri aktar" });
    const importBtn = dialog.getByRole('button', { name: 'İçeri aktar' });
    await expect(importBtn).toBeDisabled();

    // Onizleme: "Sonuçları kaydet" isaretsiz
    await dialog.locator('input[type="file"]').setInputFiles(fakeFile('import.xlsx', 4096, XLSX));
    await dialog.getByRole('checkbox').uncheck();
    await importBtn.click();

    await expect(dialog.getByText('Önizleme modu: satırlar kaydedilmedi.')).toBeVisible();
    await expect(dialog).toContainText('#2Gecerli satir 1');
    await expect(dialog).toContainText('#4Hatali satir');
    await expect(dialog).toContainText('BDD kolonu bos');
    await expect(page.locator('article')).toHaveCount(before);
    expect(api.callsTo('POST', '/scenarios/import-excel')[0].raw).toContain('name="saveResults"\r\n\r\nfalse');

    await dialog.getByRole('button', { name: 'Kapat' }).first().click();
    await expect(dialog).toBeHidden();

    // Kaydetme: "Sonuçları kaydet" varsayilan olarak isaretli
    await page.getByRole('button', { name: "Excel'den aktar" }).click();
    dialog = page.getByRole('dialog', { name: "Excel'den içeri aktar" });
    await dialog.locator('input[type="file"]').setInputFiles(fakeFile('import.xlsx', 4096, XLSX));
    await expect(dialog.getByRole('checkbox')).toBeChecked();
    await dialog.getByRole('button', { name: 'İçeri aktar' }).click();

    await expect(toast(page, `${validRows} senaryo içeri aktarıldı`)).toBeVisible();
    await dialog.getByRole('button', { name: 'Kapat' }).first().click();
    await expect(page.locator('article')).toHaveCount(before + validRows);
  });
});
