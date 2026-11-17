import { test as base, expect, type Locator, type Page } from '@playwright/test';
import { MockApi } from './mock-api';
import { LOGGED_OUT, SEED_USER } from './auth';

type Fixtures = {
  /** Her test icin taze, durumlu sahte backend (otomatik baglanir). */
  api: MockApi;
};

export const test = base.extend<Fixtures>({
  api: [
    async ({ context }, use) => {
      const api = new MockApi();
      await api.attach(context);
      await use(api);
    },
    { auto: true },
  ],
});

export { expect };

/** Testi oturum kapali baslatir (describe icinde `test.use(loggedOut)`). */
export const loggedOut = { storageState: LOGGED_OUT };

/** Sonner toast'u — baslik ve/veya aciklama metniyle. */
export function toast(page: Page, text: string | RegExp): Locator {
  return page.locator('[data-sonner-toast]').filter({ hasText: text });
}

/** Login formunu doldurup gonderir. */
export async function login(page: Page, email = SEED_USER.email, password = SEED_USER.password) {
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: 'Giriş yap' }).click();
}

/** Bellekte dosya olusturur (setInputFiles icin). */
export function fakeFile(name: string, sizeBytes = 2048, mimeType = 'application/octet-stream') {
  return { name, mimeType, buffer: Buffer.alloc(sizeBytes, 1) };
}

export const MB = 1024 * 1024;
