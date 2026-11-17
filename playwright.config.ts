import { defineConfig, devices } from '@playwright/test';
import { AUTH_STORAGE_STATE } from './e2e/support/auth';

const PORT = Number(process.env.E2E_PORT ?? 3100);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

/**
 * NexTest frontend E2E testleri.
 *
 * - Backend `page.route` ile mock'lanir (e2e/support/mock-api.ts); gercek backend/AI gerekmez.
 * - Testler production build'e karsi kosar, cunku proxy.ts'deki oturum kontrolu
 *   dev modda devre disi (TC-007, TC-009, TC-011, TC-013 bunu dogrular).
 * - Varsayilan olarak her test oturum acik baslar; auth testleri bunu bosaltir.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    locale: 'tr-TR',
    timezoneId: 'Europe/Istanbul',
    viewport: { width: 1440, height: 900 },
    storageState: AUTH_STORAGE_STATE(BASE_URL),
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npm run build && npm run start -- --port ${PORT}`,
        url: BASE_URL,
        timeout: 240_000,
        reuseExistingServer: !process.env.CI,
      },
});
