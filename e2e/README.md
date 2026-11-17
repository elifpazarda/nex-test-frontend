# E2E Testleri (Playwright)

`QA_Platform_Frontend_Test_Cases.xlsx` içindeki 50 test case'in otomasyonu. Her testin adı
Excel'deki ID ve kodla başlar (örn. `TC-014 PRJ-001 ...`), etiketler (`@smoke`, `@critical`,
`@negative`...) Excel'deki tag'lerden gelir.

## Çalıştırma

```bash
npx playwright install chromium   # ilk sefer
npm run test:e2e                  # build + start (port 3100) + tüm testler
npm run test:e2e:smoke            # yalnızca @smoke
npm run test:e2e:ui               # Playwright UI modu
npm run test:e2e:report           # son HTML raporu
npx playwright test -g "TC-024"   # tek bir case
E2E_SLOW=1 npx playwright test -g "zaman aşımı"   # 5 dk'lık timeout testi
```

Testler **production build**'e karşı koşar; çünkü `proxy.ts` oturum kontrolünü dev modda
atlar (TC-007, TC-009, TC-011, TC-013 bunu doğrular). Çalışan bir sunucuya karşı koşmak için:
`E2E_BASE_URL=http://localhost:3000 npx playwright test`.

## Mimari

| Dosya | Görev |
| --- | --- |
| `support/mock-api.ts` | Bellek içi sahte backend. `localhost:3001/api/**` isteklerini yakalar, gerçek `ApiResponse<T>` zarfıyla cevaplar. Gerçek backend ve AI servisi gerekmez. |
| `support/fixtures.ts` | `test` (her teste taze `api`), `toast()`, `login()`, `fakeFile()` yardımcıları |
| `support/auth.ts` | Seed kullanıcı ve oturum açık/kapalı `storageState` |

Testler varsayılan olarak oturum açık başlar; auth testleri `test.use(loggedOut)` kullanır.
Bir ucu ezmek veya istekleri doğrulamak için:

```ts
api.on('POST', '/scenarios/generate/text', api.error(429, 'Too Many Requests'), 1);
api.delay('POST', '/projects', 800);              // yükleniyor durumunu görmek için
expect(api.callsTo('POST', '/auth/login')).toHaveLength(0);
```

## Spec ↔ Excel eşlemesi

| Spec | Case'ler |
| --- | --- |
| `auth.spec.ts` | TC-001 – TC-008 |
| `session.spec.ts` | TC-009 – TC-013 |
| `projects.spec.ts` | TC-014 – TC-019 |
| `scenario-groups.spec.ts` | TC-020 – TC-023 |
| `generation-text.spec.ts` | TC-024 – TC-028 |
| `generation-jira.spec.ts` | TC-029 – TC-031 |
| `generation-file.spec.ts` | TC-032 – TC-036 |
| `results.spec.ts` | TC-037 – TC-039 |
| `export-import.spec.ts` | TC-040 – TC-043 |
| `bdd-code.spec.ts` | TC-044 – TC-045 |
| `settings-jira.spec.ts` | TC-046 – TC-047 |
| `settings-webhooks.spec.ts` | TC-048 – TC-050 |

## Excel ile uygulama arasındaki farklar

- **TC-019:** Proje silme diyaloğunda vazgeç butonu "İptal" değil **"Vazgeç"**.
- **TC-028 adım 3:** AI uçlarında timeout 15 sn değil **5 dk** (`AI_TIMEOUT`). Test bu yüzden `E2E_SLOW=1` ile koşar.
- **TC-040 / TC-043:** İndirilen dosyanın *içeriği* (Xray sütunları) ve satır ikonları backend'e bağlı; burada istek parametreleri (`xrayFormat=true`, `saveResults`) ve satır metinleri doğrulanır.
- **TC-046 adım 2:** Gerçek Atlassian izni otomasyona alınamaz; Atlassian sayfası stub'lanır ve callback `?success=true` ile açılır.
