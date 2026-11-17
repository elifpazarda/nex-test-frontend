import { test, expect, toast } from './support/fixtures';
import { SEED, DEFAULT_GENERATED, type MockApi } from './support/mock-api';

const JIRA_URL = `/projects/${SEED.projectWithGroups}/generate/jira`;

function connectJira(api: MockApi) {
  api.jiraConnection = {
    siteUrl: 'https://trendyol.atlassian.net',
    siteName: 'Trendyol Jira',
    connectedAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-11-01T10:00:00.000Z',
  };
}

test.describe('Scenario Generation / Jira', () => {
  test('TC-029 GJR-001 Jira bağlantısı yokken uyarı gösterimi @negative', async ({ page }) => {
    await page.goto(JIRA_URL);
    await expect(page.getByText('Jira bağlantısı yok')).toBeVisible();
    await expect(
      page.getByText("Issue'dan senaryo üretmek için önce Jira hesabını bağlaman gerekir."),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Senaryo üret' })).toBeDisabled();

    await page.getByRole('link', { name: "Jira'yı bağla" }).click();
    await expect(page).toHaveURL(/\/settings\/jira$/);
  });

  test('TC-030 GJR-002 Jira issue key format validasyonu @negative', async ({ page, api }) => {
    connectJira(api);
    await page.goto(JIRA_URL);
    await expect(page.getByText('Bağlantı aktif')).toBeVisible();
    await page.locator('#group-name').fill('Jira Grubu');

    const issueKey = page.locator('#issue-key');
    const submit = page.getByRole('button', { name: 'Senaryo üret' });
    const error = page.getByText('Geçersiz Jira issue key formatı (örn: PROJ-123)');

    for (const invalid of ['proj-123', 'PROJ123', '1PROJ-5']) {
      await issueKey.fill(invalid);
      await submit.click();
      await expect(error, `"${invalid}" reddedilmeli`).toBeVisible();
    }
    expect(api.callsTo('POST', '/scenarios/generate/jira')).toHaveLength(0);

    await issueKey.fill('TRND-142');
    await expect(error).toBeHidden();
  });

  test('TC-031 GJR-003 Jira issue\'dan senaryo üretme ve kaydetme @critical @integration', async ({ page, api }) => {
    connectJira(api);
    await page.goto(JIRA_URL);
    await page.locator('#issue-key').fill('TRND-142');
    await page.locator('#group-name').fill('TRND-142 Senaryoları');
    await page.getByRole('button', { name: 'Senaryo üret' }).click();

    await expect(page.getByRole('heading', { name: `${DEFAULT_GENERATED.length} senaryo üretildi` })).toBeVisible();
    await expect(page.locator('article')).toHaveCount(DEFAULT_GENERATED.length);
    expect(api.callsTo('POST', '/scenarios/generate/jira')[0].body).toEqual({
      projectId: SEED.projectWithGroups,
      issueKey: 'TRND-142',
    });

    await page.getByRole('button', { name: 'Grup olarak kaydet' }).click();
    await expect(toast(page, 'Senaryo grubu kaydedildi')).toBeVisible();
    const newGroup = api.groups[0];
    await expect(page).toHaveURL(`/projects/${SEED.projectWithGroups}/results?groupId=${newGroup.id}`);
    await expect(page.getByRole('heading', { level: 1, name: 'TRND-142 Senaryoları' })).toBeVisible();
    expect(api.callsTo('POST', '/scenarios')[0].body).toMatchObject({
      sourceType: 'jira',
      sourceRef: 'TRND-142',
    });
  });
});
