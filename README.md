# NexTest — Frontend

**NexTest**, yapay zeka destekli bir QA test senaryosu üretim platformudur. Kullanıcılar proje oluşturur, farklı kaynaklardan (metin, Jira, Excel, PDF) test senaryoları üretir, üretilen senaryoları inceleyip düzenler ve çeşitli formatlarda dışa aktarır.

Bu repo platformun **frontend** uygulamasıdır: Next.js 16 + React 19 ile geliştirilmiştir. Backend ayrı bir serviste (`localhost:3001/api`) çalışır.

> **Dil notu:** Tüm arayüz metinleri, doğrulama mesajları ve kullanıcıya görünen içerik **Türkçe**dir.

---

## İçindekiler

- [Özellikler](#özellikler)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Sistem Mimarisi](#sistem-mimarisi)
- [Başlangıç](#başlangıç)
- [Ortam Değişkenleri](#ortam-değişkenleri)
- [Komutlar](#komutlar)
- [Senaryo Üretim Akışı](#senaryo-üretim-akışı)
- [Jira OAuth Akışı](#jira-oauth-akışı)
- [Proje Yapısı](#proje-yapısı)
- [Mimari Notlar](#mimari-notlar)

---

## Özellikler

- 🗂️ **Proje yönetimi** — proje oluşturma, düzenleme, silme
- 🤖 **AI ile senaryo üretimi** — dört kaynaktan:
  - **Metin** — doğal dil açıklaması (10–2000 karakter)
  - **Jira** — issue key ile bağlama (örn. `PROJ-123`)
  - **Excel** — toplu `.xlsx` yükleme
  - **PDF** — doküman yükleme
- 📝 **İki adımlı akış** — üret → incele/düzenle → kaydet (üretim sırasında otomatik kayıt yok)
- 🥒 **BDD dönüşümü** — senaryoları Cucumber / Playwright / Cypress formatına çevirme
- 📦 **Senaryo grupları** — her kaynak için ayrı grup; grup düzenleme & silme
- 📤 **Dışa aktarma** — çeşitli formatlarda (Excel, Xray vb.) export
- 🔐 **Kimlik doğrulama** — JWT tabanlı login/register, otomatik token yenileme
- 🔗 **Jira entegrasyonu** — OAuth 2.0 ile hesap bağlama

---

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Framework | Next.js **16.2.6** (App Router) |
| UI | React **19.2.4** |
| Stil | Tailwind CSS **v4** (`@theme inline`) |
| Bileşenler | shadcn/ui (Radix) |
| Sunucu durumu | TanStack React Query |
| Form & doğrulama | React Hook Form + Zod |
| HTTP | Axios (auth interceptor + token refresh) |
| Bildirimler | Sonner (toast) |
| İkonlar | lucide-react |

---

## Sistem Mimarisi

```mermaid
flowchart LR
    User["Kullanıcı<br/>(Tarayıcı)"]

    subgraph FE["Frontend Katmanı"]
        NextApp["Next.js 16 + React 19<br/>Port 3000<br/>TanStack Query · Tailwind v4"]
    end

    subgraph BE["Backend Katmanı"]
        NestApp["NestJS 11 + TypeScript<br/>Port 3001 · /api<br/>JWT Auth · Rate Limit"]
    end

    subgraph Data["Veri Katmanı"]
        Postgres[("PostgreSQL<br/>Prisma 7 ORM")]
    end

    subgraph External["Harici Servisler"]
        Claude["Anthropic<br/>Claude API"]
        Jira["Atlassian<br/>Jira Cloud REST API"]
    end

    User -->|HTTPS| NextApp
    NextApp -->|REST + JSON<br/>JWT Bearer| NestApp
    NestApp -->|SQL| Postgres
    NestApp -->|Senaryo üretimi<br/>BDD dönüşümü| Claude
    NestApp -->|OAuth 2.0<br/>Issue çekme| Jira
```

---

## Başlangıç

**Önkoşullar:** Node.js 20+, çalışan NexTest backend (`localhost:3001`).

```bash
# Bağımlılıkları yükle
npm install

# Ortam dosyasını oluştur
cp .env.example .env.local

# Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini aç.

---

## Ortam Değişkenleri

`.env.local` içinde tanımlanır (`.env.example`'dan kopyalayın):

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=NexApp
```

---

## Komutlar

```bash
npm run dev      # Geliştirme sunucusu (http://localhost:3000)
npm run build    # Üretim derlemesi
npm run start    # Üretim sunucusu
npm run lint     # ESLint (flat config, v9)
```

> Yapılandırılmış bir test koşucusu yoktur.

---

## Senaryo Üretim Akışı

Üretim **iki adımlıdır**: AI senaryoları üretir (kaydetmez) → kullanıcı inceler/düzenler → kaydedilir.

```mermaid
flowchart LR
    Start(["Giriş yapılmış kullanıcı"]) --> P["Proje Seç /<br/>Oluştur"]
    P --> G["Senaryo Grubu Seç /<br/>Oluştur"]
    G --> K{"Kaynak<br/>Seç"}

    K -->|Metin| T["Doğal dil metni<br/>(10-2000 karakter)"]
    K -->|Jira| J["Issue key<br/>(örn. PROJ-123)"]
    K -->|Excel| X["Excel dosyası<br/>(≤ 5 MB .xlsx)"]
    K -->|PDF| D["PDF dosyası<br/>(≤ 10 MB .pdf)"]

    T --> AI["Claude API<br/>generate-scenario"]
    J --> AI
    X --> AI
    D --> AI

    AI --> R["İnceleme Ekranı<br/>Yapılandırılmış senaryolar"]
    R --> E["Kullanıcı düzenler"]
    E --> BDD["Claude API<br/>convert-bdd<br/>(cucumber / playwright / cypress)"]
    BDD --> EB["Kullanıcı BDD'yi düzenler"]
    EB --> S["POST /api/scenarios<br/>Gruba kaydet"]
    S --> End(["Kalıcı senaryo<br/>rawOutput + bddOutput"])

    style AI fill:#8B5CF6,color:#FFF
    style BDD fill:#8B5CF6,color:#FFF
    style S fill:#10B981,color:#FFF
    style K fill:#FFD700,color:#000
```

> AI üretim/dönüşüm uçları uzun sürebildiğinden, bu istekler global 15sn'lik timeout yerine istek bazında **5 dakikalık** timeout kullanır.

---

## Jira OAuth Akışı

Jira hesabı **OAuth 2.0 üç bacaklı (3LO)** akışı ile bağlanır:

```mermaid
sequenceDiagram
    autonumber
    participant U as Kullanıcı
    participant FE as Frontend
    participant BE as Backend
    participant A as Atlassian

    U->>FE: "Jira'ya Bağlan" tıklar
    FE->>BE: GET /api/jira/auth-url
    BE-->>FE: { authUrl }
    FE->>U: Tarayıcıyı authUrl'e yönlendir
    U->>A: Giriş yapar ve izin verir
    A->>BE: GET /api/jira/callback?code=...&state=...
    BE->>A: POST /oauth/token (code exchange)
    A-->>BE: { access_token, refresh_token, expires_in }
    BE->>A: GET /accessible-resources (cloudId + site bilgisi)
    A-->>BE: { cloudId, url, name }
    Note over BE: Tokenları AES-256-GCM ile şifrele
    BE->>BE: jira_connections tablosuna kaydet
    BE->>FE: Redirect → /jira/callback?success=true
    FE->>U: Bağlantı başarılı ekranı
```

---

## Proje Yapısı

```
app/
├── (auth)/                  # Login & register (iki sütunlu layout)
├── (dashboard)/             # Korumalı rotalar
│   ├── projects/            # Proje listesi, detay, üretim, sonuçlar
│   ├── settings/            # Profil & Jira ayarları
│   ├── history/             # Üretim geçmişi
│   └── jira/callback/       # Jira OAuth dönüş ekranı
├── _components/             # Landing page bileşenleri
└── page.tsx                 # Public landing page

components/
├── ui/                      # shadcn/ui primitifleri
├── shared/                  # Tekrar kullanılan app bileşenleri
└── layout/                  # Topbar, sidebar, theme toggle

lib/
├── api/
│   ├── client.ts            # Axios + auth interceptor + token refresh
│   └── endpoints/           # Domain bazlı API fonksiyonları
└── validations/             # Zod şemaları (Türkçe hata mesajları)

types/                       # Backend DTO'larıyla eşleşen TS arayüzleri
proxy.ts                     # Rota koruma middleware'i (access_token cookie)
```

---

## Mimari Notlar

- **Tüm dashboard sayfaları `'use client'`** — korumalı içerik için SSR yoktur.
- **Kimlik doğrulama:** `setTokens()` JWT'yi hem localStorage (client okur) hem cookie'ye (middleware okur) yazar. 401 yanıtları token yenileme + retry kuyruğunu tetikler.
- **Rota koruma:** `proxy.ts` middleware'i `access_token` cookie'sini okur; kimliksiz → `/login`, kimlikli public sayfada → `/projects` yönlendirir (dev modunda kontrol atlanır).
- **Sunucu durumu:** React Query (60sn stale time, 1 retry, focus'ta refetch yok). **Auth durumu:** React Context. **Form durumu:** React Hook Form + Zod. Redux/Zustand kullanılmaz.
- **Tasarım sistemi:** `globals.css` içinde iki katmanlı CSS değişken sistemi — ham palet (`--palette-*`) ve semantik token'lar (`--background`, `--primary`, `--border`...). Bileşenler **yalnızca** semantik token'lara referans verir.
- **API sözleşmesi:** Tüm yanıtlar `ApiResponse<T>` zarfını izler; listeler `PaginatedData<T>` (`{ items, meta }`) kullanır.
