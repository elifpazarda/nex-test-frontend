import { test, expect, login, loggedOut } from './support/fixtures';
import { SEED_ACCESS_TOKEN, SEED_REFRESH_TOKEN } from './support/auth';

test.describe('Session & Routing / Oturumsuz', () => {
  test.use(loggedOut);

  test('TC-009 SES-001 Oturumsuz kullanıcının korumalı sayfaya erişimi @security @critical', async ({ page }) => {
    for (const path of ['/projects', '/settings/webhooks', '/history']) {
      await page.goto(path);
      await expect(page).toHaveURL(`/login?callbackUrl=${encodeURIComponent(path)}`);
      await expect(page.getByRole('heading', { name: /Tekrar hoş geldin/ })).toBeVisible();
    }
  });
});

test.describe('Session & Routing / Oturumlu', () => {
  test('TC-010 SES-002 Oturumlu kullanıcının public sayfalara erişimi @navigation', async ({ page }) => {
    for (const path of ['/', '/login', '/register']) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/projects$/);
    }
  });

  test('TC-011 SES-003 Çıkış yap akışı @critical @security', async ({ page, context, api }) => {
    await page.goto('/projects');
    await page.getByRole('button', { name: /Elif Test/ }).click();
    await page.getByRole('menuitem', { name: 'Çıkış yap' }).click();

    await expect(page).toHaveURL(/\/login$/);
    expect(
      await page.evaluate(() => [localStorage.getItem('access_token'), localStorage.getItem('refresh_token')]),
    ).toEqual([null, null]);
    expect((await context.cookies()).find((c) => c.name === 'access_token')).toBeUndefined();
    expect(api.callsTo('POST', '/auth/logout')).toHaveLength(1);

    // Geri tusu ile korumali sayfaya donus → proxy tekrar login'e atar
    await page.goBack();
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC-012 SES-004 Access token süresi dolunca otomatik yenileme @integration', async ({ page, api }) => {
    await page.goto('/projects');
    await expect(page.getByRole('heading', { name: 'Trendyol Checkout' })).toBeVisible();
    api.calls.length = 0;

    await page.evaluate(() => localStorage.setItem('access_token', 'bozuk-token'));
    await page.reload();

    await expect(page.getByRole('heading', { name: 'Trendyol Checkout' })).toBeVisible();

    const projectCalls = api.callsTo('GET', '/projects');
    expect(projectCalls[0].headers['authorization']).toBe('Bearer bozuk-token');
    expect(api.callsTo('POST', '/auth/refresh')).toHaveLength(1);
    expect(api.callsTo('POST', '/auth/refresh')[0].body).toEqual({ refreshToken: SEED_REFRESH_TOKEN });
    expect(projectCalls.at(-1)!.headers['authorization']).toMatch(/^Bearer access-/);

    const tokens = await page.evaluate(() => [localStorage.getItem('access_token'), localStorage.getItem('refresh_token')]);
    expect(tokens[0]).toMatch(/^access-/);
    expect(tokens[1]).toMatch(/^refresh-/);
    expect(tokens).not.toContain(SEED_ACCESS_TOKEN);
  });

  test('TC-013 SES-005 Refresh token geçersizken login\'e yönlendirme ve 404 sayfası @security', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.getByRole('heading', { name: 'Trendyol Checkout' })).toBeVisible();

    await page.evaluate(() => {
      localStorage.setItem('access_token', 'bozuk-access');
      localStorage.setItem('refresh_token', 'bozuk-refresh');
    });
    await page.reload();

    await expect(page).toHaveURL(/\/login/);
    expect(
      await page.evaluate(() => [localStorage.getItem('access_token'), localStorage.getItem('refresh_token')]),
    ).toEqual([null, null]);

    await login(page);
    await expect(page).toHaveURL(/\/projects$/);

    await page.goto('/olmayan-sayfa');
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    await expect(page.getByText('Aradiginiz sayfa bulunamadi')).toBeVisible();

    await page.getByRole('link', { name: 'Ana Sayfaya Don' }).click();
    await expect(page).toHaveURL(/\/projects$/);
  });
});
