import { test, expect, toast } from './support/fixtures';
import { SEED, DEFAULT_GENERATED } from './support/mock-api';
import type { Page } from '@playwright/test';

const GENERATE_URL = `/projects/${SEED.projectWithGroups}/generate`;
const VALID_INPUT =
  'Kullanıcı sepetine ürün ekledikten sonra ödeme sayfasına geçer ve kredi kartı ile ödeme yapar.';

async function fillForm(page: Page, opts: { input?: string; name?: string; type?: string } = {}) {
  await page.locator('textarea').fill(opts.input ?? VALID_INPUT);
  await page.locator('#group-name').fill(opts.name ?? 'Sepet · Ödeme');
  await page.locator('#group-type').selectOption(opts.type ?? 'FEATURE');
}

async function generate(page: Page) {
  await page.getByRole('button', { name: 'Senaryo üret' }).click();
  await expect(page.getByRole('heading', { name: `${DEFAULT_GENERATED.length} senaryo üretildi` })).toBeVisible();
}

test.describe('Scenario Generation / Text', () => {
  test('TC-024 GEN-001 Metinden senaryo üretme ve inceleme ekranı @smoke @critical', async ({ page, api }) => {
    api.delay('POST', '/scenarios/generate/text', 800);
    await page.goto(GENERATE_URL);
    await fillForm(page);
    await page.getByRole('button', { name: 'Senaryo üret' }).click();

    const pending = page.getByRole('button', { name: 'Üretiliyor...' });
    await expect(pending).toBeVisible();
    await expect(pending).toBeDisabled();

    await expect(page.getByRole('heading', { name: `${DEFAULT_GENERATED.length} senaryo üretildi` })).toBeVisible();
    const cards = page.locator('article');
    await expect(cards).toHaveCount(DEFAULT_GENERATED.length);
    await expect(cards.nth(0)).toContainText(DEFAULT_GENERATED[0].title);
    await expect(cards.nth(0)).toContainText('Happy path');
    await expect(cards.nth(0)).toContainText('Kritik');
    for (let i = 0; i < DEFAULT_GENERATED.length; i++) {
      await expect(cards.nth(i)).toContainText('Adımlar');
      await expect(cards.nth(i)).toContainText('Beklenen sonuç');
      await expect(cards.nth(i)).toContainText(DEFAULT_GENERATED[i].expectedResult);
    }

    expect(api.callsTo('POST', '/scenarios/generate/text')[0].body).toEqual({
      projectId: SEED.projectWithGroups,
      input: VALID_INPUT,
    });
    // Henuz kayit yapilmamali
    expect(api.callsTo('POST', '/scenario-groups')).toHaveLength(0);
    expect(api.callsTo('POST', '/scenarios')).toHaveLength(0);
  });

  test('TC-025 GEN-002 Açıklama uzunluğu validasyonu (10-2000 karakter) @boundary', async ({ page, api }) => {
    await page.goto(GENERATE_URL);
    const textarea = page.locator('textarea');
    const submit = page.getByRole('button', { name: 'Senaryo üret' });
    await page.locator('#group-name').fill('Sınır Testi');

    await textarea.fill('a'.repeat(9));
    await expect(page.getByText('Eksik', { exact: true })).toBeVisible();
    await submit.click();
    await expect(page.getByText('Açıklama en az 10 karakter olmalı')).toBeVisible();

    await textarea.fill('a'.repeat(10));
    await expect(page.getByText('Hazır', { exact: true })).toBeVisible();

    await textarea.fill('a'.repeat(2001));
    await submit.click();
    await expect(page.getByText('Açıklama en fazla 2000 karakter olmalı')).toBeVisible();

    await textarea.fill(VALID_INPUT);
    await page.locator('#group-name').fill('');
    await submit.click();
    await expect(page.getByText('Grup adı en az 2 karakter olmalı')).toBeVisible();

    expect(api.callsTo('POST', '/scenarios/generate/text')).toHaveLength(0);
  });

  test('TC-026 GEN-003 Üretilen senaryoları grup olarak kaydetme @smoke @critical', async ({ page, api }) => {
    await page.goto(GENERATE_URL);
    await fillForm(page);
    await generate(page);

    api.delay('POST', '/scenarios', 800);
    await page.getByRole('button', { name: 'Grup olarak kaydet' }).click();
    await expect(page.getByRole('button', { name: 'Kaydediliyor...' })).toBeDisabled();

    await expect(toast(page, 'Senaryo grubu kaydedildi')).toBeVisible();
    const newGroup = api.groups[0];
    expect(newGroup).toMatchObject({ name: 'Sepet · Ödeme', type: 'FEATURE', projectId: SEED.projectWithGroups });
    await expect(page).toHaveURL(`/projects/${SEED.projectWithGroups}/results?groupId=${newGroup.id}`);
    await expect(page.locator('p', { hasText: 'kayıtlı senaryo var' })).toHaveText(
      `Bu grupta ${DEFAULT_GENERATED.length} kayıtlı senaryo var.`,
    );

    const saveBody = api.callsTo('POST', '/scenarios')[0].body;
    expect(saveBody).toMatchObject({ groupId: newGroup.id, input: VALID_INPUT, sourceType: 'text' });
    expect(saveBody.scenarios).toHaveLength(DEFAULT_GENERATED.length);

    await page.getByRole('link', { name: 'Trendyol Checkout' }).click();
    await expect(page.getByRole('button', { name: /Sepet · Ödeme/ })).toHaveCount(2); // seed + yeni
  });

  test('TC-027 GEN-004 İnceleme ekranından forma dönüş', async ({ page, api }) => {
    await page.goto(GENERATE_URL);
    await fillForm(page, { name: 'Forma Dönüş Grubu', type: 'SMOKE' });
    await generate(page);

    await page.getByRole('button', { name: 'Forma dön' }).click();

    await expect(page.locator('textarea')).toHaveValue(VALID_INPUT);
    await expect(page.locator('#group-name')).toHaveValue('Forma Dönüş Grubu');
    await expect(page.locator('#group-type')).toHaveValue('SMOKE');
    expect(api.callsTo('POST', '/scenario-groups')).toHaveLength(0);

    await page.getByRole('link', { name: 'Trendyol Checkout' }).click();
    await expect(page.getByRole('button', { name: /Smoke Paketi/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Forma Dönüş Grubu/ })).toHaveCount(0);
  });

  test('TC-028 GEN-005 AI üretim hatası ve rate limit mesajları @negative', async ({ page, api }) => {
    await page.goto(GENERATE_URL);
    await fillForm(page);
    const submit = page.getByRole('button', { name: 'Senaryo üret' });

    // 1a) 500 + backend mesaji
    api.on('POST', '/scenarios/generate/text', api.error(500, 'AI servisi şu anda yanıt vermiyor'), 1);
    await submit.click();
    await expect(toast(page, 'AI servisi şu anda yanıt vermiyor')).toContainText('Senaryo üretilemedi');
    await expect(submit).toBeEnabled();

    // 1b) 500 + mesajsiz govde → varsayilan aciklama
    api.on('POST', '/scenarios/generate/text', { status: 500, body: '' , contentType: 'text/plain' }, 1);
    await submit.click();
    await expect(toast(page, 'Lütfen tekrar deneyin.')).toContainText('Senaryo üretilemedi');
    await expect(submit).toBeEnabled();

    // 2) 429 rate limit
    api.on('POST', '/scenarios/generate/text', api.error(429, 'Too Many Requests'), 1);
    await submit.click();
    await expect(
      toast(page, 'Çok fazla istek gönderildi. Lütfen 1 dakika bekleyip tekrar deneyin.'),
    ).toContainText('Senaryo üretilemedi');
    await expect(submit).toBeEnabled();
  });

  test('TC-028 GEN-005 (adım 3) Zaman aşımı mesajı @negative @slow', async ({ page, api }) => {
    // AI uclarinda istek bazli timeout 5 dk (lib/api/endpoints/scenarios.ts → AI_TIMEOUT).
    // Excel'deki "15 sn" global timeout'tur ve bu uca uygulanmaz. Uzun surdugu icin
    // yalnizca E2E_SLOW=1 ile kosar.
    test.skip(!process.env.E2E_SLOW, 'Yavaş test: E2E_SLOW=1 ile çalıştırın');
    test.setTimeout(6 * 60_000);

    await page.goto(GENERATE_URL);
    await fillForm(page);
    api.on('POST', '/scenarios/generate/text', { hang: true });
    await page.getByRole('button', { name: 'Senaryo üret' }).click();

    await expect(toast(page, 'İşlem beklenenden uzun sürdü ve zaman aşımına uğradı')).toBeVisible({
      timeout: 5.5 * 60_000,
    });
    await expect(page.getByRole('button', { name: 'Senaryo üret' })).toBeEnabled();
  });
});
