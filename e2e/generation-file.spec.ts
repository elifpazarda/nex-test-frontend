import { test, expect, toast, fakeFile, MB } from './support/fixtures';
import { SEED, DEFAULT_GENERATED } from './support/mock-api';

const base = `/projects/${SEED.projectWithGroups}/generate`;
const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

test.describe('Scenario Generation / File', () => {
  test('TC-032 GFL-001 Excel dosyasından senaryo üretme @integration', async ({ page, api }) => {
    await page.goto(`${base}/excel`);
    const submit = page.getByRole('button', { name: 'Senaryo üret' });
    await expect(submit).toBeDisabled();

    await page.locator('input[type="file"]').setInputFiles(fakeFile('gereksinimler.xlsx', 3 * 1024, XLSX));
    await expect(page.getByText('gereksinimler.xlsx')).toBeVisible();
    await expect(page.getByText('3.0 KB')).toBeVisible();
    await expect(submit).toBeEnabled();

    await page.locator('#group-name').fill('Excel · Regression');
    await submit.click();
    await expect(page.getByRole('heading', { name: `${DEFAULT_GENERATED.length} senaryo üretildi` })).toBeVisible();

    const call = api.callsTo('POST', '/scenarios/generate/excel')[0];
    expect(call.headers['content-type']).toContain('multipart/form-data');
    expect(call.raw).toContain(`name="projectId"\r\n\r\n${SEED.projectWithGroups}`);
    expect(call.raw).toContain('filename="gereksinimler.xlsx"');
  });

  test('TC-033 GFL-002 Excel yüklemede dosya tipi ve boyut kontrolü @negative', async ({ page }) => {
    await page.goto(`${base}/excel`);
    const input = page.locator('input[type="file"]');

    await input.setInputFiles(fakeFile('veriler.csv', 1024, 'text/csv'));
    await expect(toast(page, 'Yalnızca .xlsx dosyaları kabul edilir.')).toContainText('Geçersiz dosya');
    await expect(page.getByText('Excel dosyası yükle')).toBeVisible();

    await input.setInputFiles(fakeFile('buyuk.xlsx', 5 * MB + 1, XLSX));
    await expect(toast(page, 'Excel dosyası en fazla 5MB olabilir.')).toContainText('Dosya çok büyük');
    await expect(page.getByText('Excel dosyası yükle')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Senaryo üret' })).toBeDisabled();
  });

  test('TC-034 GFL-003 PDF dosyasından senaryo üretme @integration', async ({ page, api }) => {
    await page.goto(`${base}/pdf`);
    await page.locator('input[type="file"]').setInputFiles(fakeFile('prd-checkout.pdf', 8 * 1024, 'application/pdf'));
    await expect(page.getByText('prd-checkout.pdf')).toBeVisible();
    await expect(page.getByText('8.0 KB')).toBeVisible();

    await page.locator('#group-name').fill('PRD · Checkout');
    await page.getByRole('button', { name: 'Senaryo üret' }).click();
    await expect(page.getByRole('heading', { name: `${DEFAULT_GENERATED.length} senaryo üretildi` })).toBeVisible();

    await page.getByRole('button', { name: 'Grup olarak kaydet' }).click();
    await expect(toast(page, 'Senaryo grubu kaydedildi')).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/projects/${SEED.projectWithGroups}/results\\?groupId=${api.groups[0].id}$`));
    expect(api.callsTo('POST', '/scenarios')[0].body).toMatchObject({
      sourceType: 'pdf',
      sourceRef: 'prd-checkout.pdf',
    });
  });

  test('TC-035 GFL-004 PDF yüklemede tip ve boyut sınırı (10MB) @boundary', async ({ page }) => {
    await page.goto(`${base}/pdf`);
    const input = page.locator('input[type="file"]');
    const submit = page.getByRole('button', { name: 'Senaryo üret' });

    await input.setInputFiles(
      fakeFile('dokuman.docx', 1024, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
    );
    await expect(toast(page, 'Yalnızca .pdf dosyaları kabul edilir.')).toBeVisible();

    await input.setInputFiles(fakeFile('cok-buyuk.pdf', 10 * MB + 1, 'application/pdf'));
    await expect(toast(page, 'PDF dosyası en fazla 10MB olabilir.')).toBeVisible();
    await expect(submit).toBeDisabled();

    await input.setInputFiles(fakeFile('sinirda.pdf', Math.floor(9.9 * MB), 'application/pdf'));
    await expect(page.getByText('sinirda.pdf')).toBeVisible();
    await expect(submit).toBeEnabled();
  });

  test('TC-036 GFL-005 Kaynak sekmeleri arası geçiş ve seçili dosyayı kaldırma @navigation', async ({ page }) => {
    await page.goto(base);
    const tab = (name: string) => page.getByRole('link', { name, exact: true });

    // Aktif sekme link degil, vurgulu <span> olarak render edilir
    await expect(tab('Metin')).toHaveCount(0);

    for (const [name, path] of [
      ['Jira', '/jira'],
      ['Excel', '/excel'],
      ['PDF', '/pdf'],
      ['Metin', ''],
    ] as const) {
      await tab(name).click();
      await expect(page).toHaveURL(`${base}${path}`);
      await expect(tab(name)).toHaveCount(0);
    }

    await tab('Excel').click();
    await expect(page).toHaveURL(`${base}/excel`);
    await page.locator('input[type="file"]').setInputFiles(fakeFile('kaldir.xlsx', 1024, XLSX));
    const submit = page.getByRole('button', { name: 'Senaryo üret' });
    await expect(submit).toBeEnabled();

    await page.getByRole('button', { name: 'Dosyayı kaldır' }).click();
    await expect(page.getByText('kaldir.xlsx')).toBeHidden();
    await expect(page.getByText('Excel dosyası yükle')).toBeVisible();
    await expect(submit).toBeDisabled();
  });
});
