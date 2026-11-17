import { test, expect, toast, login, loggedOut } from './support/fixtures';
import { SEED_USER } from './support/auth';
import { SEED } from './support/mock-api';

test.use(loggedOut);

test.describe('Auth / Register', () => {
  test('TC-001 AUTH-001 Geçerli bilgilerle kayıt formu gönderimi @smoke @critical', async ({ page, api }) => {
    api.delay('POST', '/auth/register', 800);
    const email = `yeni.${Date.now()}@nextest.dev`;

    await page.goto('/register');
    await page.locator('#name').fill('Test Kullanıcı');
    await page.locator('#email').fill(email);
    await page.locator('#password').fill('Test1234!');
    await page.locator('#confirmPassword').fill('Test1234!');
    await page.getByRole('button', { name: 'Hesap oluştur' }).click();

    const pending = page.getByRole('button', { name: 'Kayıt olunuyor...' });
    await expect(pending).toBeVisible();
    await expect(pending).toBeDisabled();

    await expect(toast(page, 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);

    const [call] = api.callsTo('POST', '/auth/register');
    expect(call.body).toEqual({ name: 'Test Kullanıcı', email, password: 'Test1234!' });
  });

  test('TC-002 AUTH-002 Kayıt formu alan validasyonları (sınır değer) @boundary', async ({ page, api }) => {
    await page.goto('/register');

    await page.locator('#name').fill('A');
    await page.locator('#name').blur();
    await expect(page.getByText('İsim en az 2 karakter olmalı')).toBeVisible();

    await page.locator('#email').fill('gecersiz-email');
    await page.locator('#email').blur();
    await expect(page.getByText('Geçerli bir e-posta adresi girin')).toBeVisible();

    await page.locator('#password').fill('1234567');
    await page.locator('#password').blur();
    await expect(page.getByText('Şifre en az 8 karakter olmalı')).toBeVisible();

    await page.locator('#confirmPassword').fill('farkli-deger');
    await page.locator('#confirmPassword').blur();
    await expect(page.getByText('Şifreler eşleşmiyor')).toBeVisible();

    // 5. adim: sinir degerlerin hemen ustu → tum hatalar kaybolur
    await page.locator('#name').fill('Ab');
    await page.locator('#email').fill(`sinir.${Date.now()}@nextest.dev`);
    await page.locator('#password').fill('12345678');
    await page.locator('#confirmPassword').fill('12345678');
    await page.locator('#confirmPassword').blur();

    for (const msg of [
      'İsim en az 2 karakter olmalı',
      'Geçerli bir e-posta adresi girin',
      'Şifre en az 8 karakter olmalı',
      'Şifreler eşleşmiyor',
    ]) {
      await expect(page.getByText(msg)).toBeHidden();
    }

    await page.getByRole('button', { name: 'Hesap oluştur' }).click();
    await expect.poll(() => api.callsTo('POST', '/auth/register').length).toBe(1);
  });

  test('TC-003 AUTH-003 Kayıtlı e-posta ile kayıt denemesi @negative', async ({ page }) => {
    await page.goto('/register');
    await page.locator('#name').fill('Tekrar Kullanıcı');
    await page.locator('#email').fill(SEED_USER.email);
    await page.locator('#password').fill('Test1234!');
    await page.locator('#confirmPassword').fill('Test1234!');
    await page.getByRole('button', { name: 'Hesap oluştur' }).click();

    const t = toast(page, 'Kayıt başarısız');
    await expect(t).toBeVisible();
    await expect(t).toContainText('Bu email zaten kullanılıyor');
    await expect(page).toHaveURL(/\/register$/);
    await expect(page.locator('#name')).toHaveValue('Tekrar Kullanıcı');
    await expect(page.locator('#email')).toHaveValue(SEED_USER.email);
  });
});

test.describe('Auth / Login', () => {
  test('TC-004 AUTH-004 Geçerli bilgilerle giriş @smoke @critical', async ({ page, api, context }) => {
    api.delay('POST', '/auth/login', 800);
    await page.goto('/login');
    await login(page);

    const pending = page.getByRole('button', { name: 'Giriş yapılıyor...' });
    await expect(pending).toBeVisible();
    await expect(pending).toBeDisabled();

    await expect(page).toHaveURL(/\/projects$/);

    const storage = await page.evaluate(() => ({
      access: localStorage.getItem('access_token'),
      refresh: localStorage.getItem('refresh_token'),
    }));
    expect(storage.access).toBeTruthy();
    expect(storage.refresh).toBeTruthy();

    const cookie = (await context.cookies()).find((c) => c.name === 'access_token');
    expect(cookie?.value).toBe(storage.access);
    expect(cookie?.path).toBe('/');
    expect(cookie?.sameSite).toBe('Lax');
  });

  test('TC-005 AUTH-005 Hatalı şifre ile giriş @negative @security', async ({ page }) => {
    await page.goto('/login');
    await login(page, SEED_USER.email, 'YanlisSifre1!');

    const t = toast(page, 'Giriş başarısız');
    await expect(t).toBeVisible();
    await expect(t).toContainText('Geçersiz kimlik bilgileri');
    await expect(page).toHaveURL(/\/login$/);
    expect(await page.evaluate(() => localStorage.getItem('access_token'))).toBeNull();
  });

  test('TC-006 AUTH-006 Giriş formu istemci validasyonları @negative', async ({ page, api }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Giriş yap' }).click();
    await expect(page.getByText('Geçerli bir e-posta adresi girin')).toBeVisible();
    await expect(page.getByText('Şifre en az 8 karakter olmalı')).toBeVisible();

    await login(page, 'abc', '1234567');
    await expect(page.getByText('Geçerli bir e-posta adresi girin')).toBeVisible();
    await expect(page.getByText('Şifre en az 8 karakter olmalı')).toBeVisible();

    expect(api.callsTo('POST', '/auth/login')).toHaveLength(0);
  });

  test('TC-007 AUTH-007 callbackUrl ile giriş sonrası yönlendirme @navigation', async ({ page }) => {
    await page.goto(`/projects/${SEED.projectWithGroups}`);
    await expect(page).toHaveURL(`/login?callbackUrl=%2Fprojects%2F${SEED.projectWithGroups}`);

    await login(page);
    await expect(page).toHaveURL(`/projects/${SEED.projectWithGroups}`);
    await expect(page.getByRole('heading', { name: 'Trendyol Checkout' })).toBeVisible();
  });
});

test.describe('Auth / Navigation', () => {
  test('TC-008 AUTH-008 Login ve register sayfaları arası geçiş @navigation', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Hesap oluştur' }).click();
    await expect(page).toHaveURL(/\/register$/);

    await page.getByRole('link', { name: 'Giriş yap' }).click();
    await expect(page).toHaveURL(/\/login$/);

    await page.getByRole('link', { name: 'NexTest' }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
