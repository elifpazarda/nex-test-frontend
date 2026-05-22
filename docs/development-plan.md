# NexTest Frontend — Gelistirme Plani

Backend (`nex-test-backend`) hazir; bu plan FE'yi backend'in mevcut yetenekleriyle
esitlemek icindir. Referans: `nex-test-backend/docs/api/postman-test-plan.md`.

**Mevcut durum:** auth (login/register) ve projeler (liste, detay, olusturma) gercek
API'ye bagli. Senaryoyla ilgili tum sayfalar (generate, results, code, history,
settings/jira) su an mock UI kabugu.

---

## Faz 0 — API katmani & tip altyapisi `[onkosul]`

Diger her fazin bagli oldugu temel. Sayfa yok, sadece `lib/` + `types/`.

- [x] `types/jira.ts` — `JiraAuthUrl`, `JiraConnection`
- [x] `lib/api/endpoints/jira.ts` — `getAuthUrl`, `getConnection`, `deleteConnection`
- [x] `types/scenario.ts` — `ImportExcelResult` + `ImportExcelResultItem`
- [x] `lib/api/endpoints/scenarios.ts` — `importExcel` donusu tiplendi;
      `exportByGroup`/`exportSingle`'a `startDate/endDate/xrayFormat` eklendi
- [x] `lib/validations/scenario.ts` — generate-text semasi (`input` 10-2000),
      scenario-group semasi

## Faz 1 — Cekirdek akis: Metinden senaryo uretimi `[en kritik]`

Iki adimli akis: **uret -> incele -> kaydet**.

- [x] `generate/page.tsx` gercek API'ye baglanir:
      `generateFromText` -> inceleme ekrani -> grup olustur + `save`
- [x] Hardcoded "Trendyol Checkout" breadcrumb'i gercek proje adiyla degisir
- [x] Backend-desteksiz kontroller kaldirilir (kategori/oncelik filtreleri, sayi slider'i)
- [x] Rate limit (5/dk) ve hata durumlari toast ile yonetilir

## Faz 2 — Results & senaryo goruntuleme

- [x] `results/page.tsx` -> `listByGroup` ile gercek veri (`?groupId=` query param)
- [x] Senaryo silme (`scenarios.delete`) + `confirm-dialog`
- [x] `results/[scenarioId]/code/page.tsx` -> `getById` + `convertToBdd` (framework basina)
- [x] Proje detay sayfasinda grup satirlari results sayfasina linklenir

## Faz 3 — Diger uretim kaynaklari

- [x] `generate/excel/page.tsx` -> `generateFromExcel` + review/save
- [x] `generate/pdf/page.tsx` -> `generateFromPdf` + review/save
- [x] `generate/jira/page.tsx` -> `generateFromJira` (manuel `issueKey` girisi;
      `MOCK_ISSUES` kaldirildi, baglanti durumu `getConnection` ile gosteriliyor)
- [x] Import Excel akisi (`importExcel`) -> results sayfasinda dialog
- [x] Ortak `ScenarioReview` + `GenerateSourceTabs` bilesenleri cikarildi;
      `getApiErrorMessage` `lib/api/error.ts`'e tasindi

## Faz 4 — Jira entegrasyonu (Ayarlar)

- [x] `settings/jira/page.tsx` -> `getConnection` / `getAuthUrl` / `deleteConnection`
- [x] `jira/callback/page.tsx` zaten gercek

## Faz 5 — Export

- [x] `results` sayfasina export butonlari (proje/grup/tekil, format secimi,
      Xray opsiyonu, blob indirme)
- [x] `lib/api/download.ts` — `Content-Disposition` farkindali blob indirme
- [x] Grup/proje export dialog'u + senaryo basina export dropdown'u

## Kapsam disi / engelli

- **History** — backend'de `history/runs` endpoint'i yok; mock kaliyor.
- **Scenario-group yonetimi** (yeniden adlandir/sil) — gerekirse Faz 2'ye eklenir.

## Backend'e bildirilecek boskluklar

1. History/runs endpoint'i yok.
2. Jira issue listeleme/arama endpoint'i yok — `generateFromJira` sadece
   dogrudan `issueKey` ile calisiyor.
