/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BrowserContext, Request, Route } from '@playwright/test';
import { SEED_ACCESS_TOKEN, SEED_REFRESH_TOKEN, SEED_USER } from './auth';

/**
 * Bellek ici sahte NexTest backend'i.
 *
 * Frontend'in yaptigi tum `NEXT_PUBLIC_API_BASE_URL` isteklerini `context.route` ile yakalar
 * ve gercek backend gibi `ApiResponse<T>` zarfiyla cevaplar. Durum (proje, grup, senaryo,
 * webhook...) test boyunca tutulur; boylece "olustur → listede gor → sil" gibi akislar
 * gercekci sekilde test edilebilir. Testler `on()` ile tek tek uclari ezebilir,
 * `calls` ile atilan istekleri dogrulayabilir.
 */

export const API_BASE = process.env.E2E_API_URL ?? 'http://localhost:3001/api';
const API_PATH_PREFIX = new URL(API_BASE).pathname.replace(/\/$/, '');

// ---------------------------------------------------------------------------
// Tipler
// ---------------------------------------------------------------------------
type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

export interface MockRequest {
  method: string;
  path: string;
  query: URLSearchParams;
  params: string[];
  /** JSON govdesi (varsa) */
  body: any;
  /** Ham govde (multipart icin) */
  raw: string;
  headers: Record<string, string>;
}

export interface MockResponse {
  status?: number;
  json?: unknown;
  body?: string | Buffer;
  contentType?: string;
  headers?: Record<string, string>;
  /** Hic cevap verme (zaman asimi simulasyonu) */
  hang?: boolean;
  /** Cevabi geciktir (ms) — yukleniyor durumlarini gormek icin */
  delayMs?: number;
}

type Handler = (req: MockRequest) => MockResponse | Promise<MockResponse>;

interface RouteDef {
  method: Method;
  pattern: RegExp;
  handler: Handler;
  public?: boolean;
}

interface Override {
  method: Method;
  pattern: RegExp;
  handler: Handler;
  times: number;
}

export interface RecordedCall {
  method: string;
  path: string;
  query: URLSearchParams;
  body: any;
  raw: string;
  headers: Record<string, string>;
}

export type GroupType =
  | 'BUG'
  | 'FEATURE'
  | 'REGRESSION'
  | 'SMOKE'
  | 'INTEGRATION'
  | 'E2E'
  | 'PERFORMANCE'
  | 'OTHER';

export interface ProjectRec {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GroupRec {
  id: string;
  name: string;
  type: GroupType;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioRec {
  id: string;
  title: string;
  input: string;
  category: 'happy_path' | 'edge_case' | 'negative';
  priority: 'critical' | 'high' | 'medium' | 'low';
  preconditions: string;
  steps: string[];
  expectedResult: string;
  sourceType: 'text' | 'jira' | 'excel' | 'pdf' | null;
  sourceRef: string | null;
  projectId: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScmConnectionRec {
  id: string;
  provider: string;
  label: string | null;
  active: boolean;
  autoGenerate: boolean;
  targetGroupId: string | null;
  projectId: string | null;
  webhookUrl: string;
  createdAt: string;
}

export interface GeneratedScenario {
  id: string;
  title: string;
  category: ScenarioRec['category'];
  priority: ScenarioRec['priority'];
  preconditions: string;
  steps: string[];
  expectedResult: string;
}

// ---------------------------------------------------------------------------
// Seed verisi
// ---------------------------------------------------------------------------
const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

export const SEED = {
  projectWithGroups: 'p-checkout',
  projectMobile: 'p-mobile',
  projectEmpty: 'p-admin',
  groupCheckout: 'g-checkout',
  groupSmoke: 'g-smoke',
  groupLogin: 'g-login',
  groupEmpty: 'g-empty',
};

function scenario(
  id: string,
  groupId: string,
  projectId: string,
  title: string,
  priority: ScenarioRec['priority'],
  category: ScenarioRec['category'] = 'happy_path',
): ScenarioRec {
  return {
    id,
    title,
    input: 'Kullanici sepete urun ekler ve odeme yapar.',
    category,
    priority,
    preconditions: 'Kullanici giris yapmis olmali.',
    steps: ['Sepete urun ekle', 'Odeme sayfasina gec', 'Kart bilgilerini gir ve onayla'],
    expectedResult: 'Siparis basariyla olusturulur.',
    sourceType: 'text',
    sourceRef: null,
    projectId,
    groupId,
    createdAt: hoursAgo(30),
    updatedAt: hoursAgo(30),
  };
}

export const DEFAULT_GENERATED: GeneratedScenario[] = [
  {
    id: 'gen-1',
    title: 'Gecerli kredi karti ile odeme tamamlanir',
    category: 'happy_path',
    priority: 'critical',
    preconditions: 'Sepette en az bir urun var.',
    steps: ['Odeme sayfasini ac', 'Gecerli kart bilgilerini gir', 'Odemeyi onayla'],
    expectedResult: 'Siparis onay sayfasi gosterilir.',
  },
  {
    id: 'gen-2',
    title: 'Hatali kart bilgisi ile hata mesaji gosterilir',
    category: 'negative',
    priority: 'high',
    preconditions: 'Sepette en az bir urun var.',
    steps: ['Odeme sayfasini ac', 'Hatali kart numarasi gir', 'Odemeyi onayla'],
    expectedResult: 'Kart bilgileri hatali mesaji gosterilir.',
  },
  {
    id: 'gen-3',
    title: '3 basarisiz denemeden sonra islem kilitlenir',
    category: 'edge_case',
    priority: 'medium',
    preconditions: '',
    steps: ['3 kez hatali kart gir', 'Dorduncu kez dene'],
    expectedResult: 'Islem 5 dakika kilitlenir.',
  },
];

const BDD_CODE: Record<string, string> = {
  cucumber:
    'Feature: Odeme\n  Scenario: Gecerli kart ile odeme\n    Given kullanici odeme sayfasinda\n    When gecerli kart bilgilerini girer\n    Then siparis olusturulur',
  playwright:
    "import { test, expect } from '@playwright/test';\n\ntest('Gecerli kart ile odeme', async ({ page }) => {\n  await page.goto('/checkout');\n  await expect(page.getByText('Siparis')).toBeVisible();\n});",
  cypress:
    "describe('Odeme', () => {\n  it('Gecerli kart ile odeme', () => {\n    cy.visit('/checkout');\n    cy.contains('Siparis').should('be.visible');\n  });\n});",
};

// ---------------------------------------------------------------------------
// MockApi
// ---------------------------------------------------------------------------
export class MockApi {
  users = [{ ...SEED_USER, createdAt: hoursAgo(24 * 30) }];
  accessTokens = new Map<string, string>([[SEED_ACCESS_TOKEN, SEED_USER.id]]);
  refreshTokens = new Map<string, string>([[SEED_REFRESH_TOKEN, SEED_USER.id]]);

  projects: ProjectRec[] = [
    {
      id: SEED.projectWithGroups,
      name: 'Trendyol Checkout',
      description: 'Ödeme akışı testleri',
      createdAt: hoursAgo(24 * 10),
      updatedAt: hoursAgo(2),
    },
    {
      id: SEED.projectMobile,
      name: 'Mobil Uygulama',
      description: 'iOS ve Android regresyon paketi',
      createdAt: hoursAgo(24 * 8),
      updatedAt: hoursAgo(5),
    },
    {
      id: SEED.projectEmpty,
      name: 'Admin Panel',
      description: null,
      createdAt: hoursAgo(24 * 3),
      updatedAt: hoursAgo(24),
    },
  ];

  groups: GroupRec[] = [
    {
      id: SEED.groupCheckout,
      name: 'Sepet · Ödeme',
      type: 'FEATURE',
      projectId: SEED.projectWithGroups,
      createdAt: hoursAgo(48),
      updatedAt: hoursAgo(3),
    },
    {
      id: SEED.groupSmoke,
      name: 'Smoke Paketi',
      type: 'SMOKE',
      projectId: SEED.projectWithGroups,
      createdAt: hoursAgo(40),
      updatedAt: hoursAgo(4),
    },
    {
      id: SEED.groupLogin,
      name: 'Login Regression',
      type: 'REGRESSION',
      projectId: SEED.projectMobile,
      createdAt: hoursAgo(30),
      updatedAt: hoursAgo(6),
    },
    {
      id: SEED.groupEmpty,
      name: 'Bos Grup',
      type: 'OTHER',
      projectId: SEED.projectMobile,
      createdAt: hoursAgo(20),
      updatedAt: hoursAgo(7),
    },
  ];

  scenarios: ScenarioRec[] = [
    scenario('s-1', SEED.groupCheckout, SEED.projectWithGroups, 'Gecerli kart ile odeme tamamlanir', 'critical'),
    scenario('s-2', SEED.groupCheckout, SEED.projectWithGroups, 'Yetersiz bakiye uyarisi gosterilir', 'high', 'negative'),
    scenario('s-3', SEED.groupCheckout, SEED.projectWithGroups, '3D Secure zaman asiminda geri al', 'medium', 'edge_case'),
    scenario('s-4', SEED.groupSmoke, SEED.projectWithGroups, 'Ana sayfa acilir', 'low'),
    scenario('s-5', SEED.groupSmoke, SEED.projectWithGroups, 'Sepete urun eklenir', 'high'),
    scenario('s-6', SEED.groupLogin, SEED.projectMobile, 'Gecerli bilgilerle giris', 'critical'),
  ];

  jiraConnection: {
    siteUrl: string;
    siteName: string;
    connectedAt: string;
    updatedAt: string;
  } | null = null;

  scmConnections: ScmConnectionRec[] = [];

  /** generate/* uclarinin donecegi senaryolar */
  generated: GeneratedScenario[] = DEFAULT_GENERATED.map((s) => ({ ...s }));

  /** import-excel ucunun donecegi satirlar */
  importRows = [
    { rowNumber: 2, issueKey: 'TRND-1', testSummary: 'Gecerli satir 1', input: 'x', bddOutput: 'Feature: A' },
    { rowNumber: 3, issueKey: 'TRND-2', testSummary: 'Gecerli satir 2', input: 'y', bddOutput: 'Feature: B' },
    { rowNumber: 4, issueKey: 'TRND-3', testSummary: 'Hatali satir', input: '', bddOutput: '', error: 'BDD kolonu bos' },
  ];

  calls: RecordedCall[] = [];

  private overrides: Override[] = [];
  private seq = 100;
  private routes: RouteDef[] = this.buildRoutes();

  // -------------------------------------------------------------------------
  // Test API
  // -------------------------------------------------------------------------

  /** Bir ucu ezer. `times` verilmezse kalici olur. */
  on(method: Method, path: string | RegExp, handler: Handler | MockResponse, times = Infinity) {
    const pattern = typeof path === 'string' ? new RegExp(`^${escapeRegex(path)}$`) : path;
    const fn: Handler = typeof handler === 'function' ? handler : () => handler;
    this.overrides.unshift({ method, pattern, handler: fn, times });
    return this;
  }

  /** Mevcut davranisi koruyarak cevabi geciktirir. */
  delay(method: Method, path: string | RegExp, ms: number) {
    const pattern = typeof path === 'string' ? new RegExp(`^${escapeRegex(path)}$`) : path;
    this.overrides.unshift({
      method,
      pattern,
      times: Infinity,
      handler: async (req) => ({ ...(await this.dispatch(req, true)), delayMs: ms }),
    });
    return this;
  }

  /** Belirli bir uca yapilan istekler */
  callsTo(method: string, path: string | RegExp) {
    return this.calls.filter(
      (c) => c.method === method && (typeof path === 'string' ? c.path === path : path.test(c.path)),
    );
  }

  groupsOf(projectId: string) {
    return this.groups.filter((g) => g.projectId === projectId);
  }

  scenariosOf(groupId: string) {
    return this.scenarios.filter((s) => s.groupId === groupId);
  }

  async attach(context: BrowserContext) {
    await context.route(`${API_BASE}/**`, (route, request) => this.handle(route, request));
  }

  // -------------------------------------------------------------------------
  // Istek isleme
  // -------------------------------------------------------------------------
  private async handle(route: Route, request: Request) {
    const origin = request.headers()['origin'] ?? '*';
    const cors = {
      'access-control-allow-origin': origin,
      'access-control-allow-credentials': 'true',
      'access-control-allow-headers': 'authorization, content-type',
      'access-control-allow-methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'access-control-expose-headers': 'content-disposition',
    };

    if (request.method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: cors });
      return;
    }

    const url = new URL(request.url());
    const path = url.pathname.slice(API_PATH_PREFIX.length) || '/';
    const raw = request.postDataBuffer()?.toString('latin1') ?? '';
    let body: any = null;
    try {
      body = request.postDataJSON();
    } catch {
      body = null;
    }

    const req: MockRequest = {
      method: request.method(),
      path,
      query: url.searchParams,
      params: [],
      body,
      raw,
      headers: request.headers(),
    };
    this.calls.push({ method: req.method, path, query: url.searchParams, body, raw, headers: req.headers });

    let res: MockResponse;
    try {
      res = await this.dispatch(req);
    } catch (e) {
      res = this.error(500, `Mock hata: ${(e as Error).message}`, path);
    }

    if (res.hang) return; // istemci zaman asimina dussun
    if (res.delayMs) await new Promise((r) => setTimeout(r, res.delayMs));

    try {
      await route.fulfill({
        status: res.status ?? 200,
        headers: { ...cors, ...(res.headers ?? {}) },
        contentType: res.contentType ?? 'application/json',
        body: res.json !== undefined ? JSON.stringify(res.json) : res.body ?? '',
      });
    } catch {
      // Sayfa kapandiysa yoksay
    }
  }

  private async dispatch(req: MockRequest, skipOverrides = false): Promise<MockResponse> {
    if (!skipOverrides) {
      for (const o of this.overrides) {
        if (o.method === req.method && o.pattern.test(req.path) && o.times > 0) {
          o.times -= 1;
          return o.handler(req);
        }
      }
    }

    for (const r of this.routes) {
      if (r.method !== req.method) continue;
      const m = r.pattern.exec(req.path);
      if (!m) continue;
      req.params = m.slice(1);
      if (!r.public && !this.userIdFrom(req)) {
        return this.error(401, 'Unauthorized', req.path);
      }
      return r.handler(req);
    }
    return this.error(404, `Mock route yok: ${req.method} ${req.path}`, req.path);
  }

  private userIdFrom(req: MockRequest): string | null {
    const auth = req.headers['authorization'] ?? '';
    const token = auth.replace(/^Bearer\s+/i, '');
    return this.accessTokens.get(token) ?? null;
  }

  // -------------------------------------------------------------------------
  // Yardimcilar
  // -------------------------------------------------------------------------
  ok(data: unknown, path = '/', status = 200): MockResponse {
    return {
      status,
      json: { success: true, timestamp: new Date().toISOString(), path: `/api${path}`, data },
    };
  }

  error(status: number, message: string | string[], path = '/'): MockResponse {
    return {
      status,
      json: {
        success: false,
        timestamp: new Date().toISOString(),
        path: `/api${path}`,
        error: { statusCode: status, message },
      },
    };
  }

  private paginate<T>(items: T[], req: MockRequest) {
    const page = Number(req.query.get('page') ?? 1);
    const limit = Number(req.query.get('limit') ?? 20);
    const slice = items.slice((page - 1) * limit, page * limit);
    return {
      items: slice,
      meta: { total: items.length, page, limit, totalPages: Math.max(1, Math.ceil(items.length / limit)) },
    };
  }

  private nextId(prefix: string) {
    this.seq += 1;
    return `${prefix}-${this.seq}`;
  }

  private issueTokens(userId: string) {
    const access = this.nextId('access');
    const refresh = this.nextId('refresh');
    this.accessTokens.set(access, userId);
    this.refreshTokens.set(refresh, userId);
    return { accessToken: access, refreshToken: refresh };
  }

  projectDto(p: ProjectRec) {
    return {
      ...p,
      userId: SEED_USER.id,
      _count: {
        scenarios: this.scenarios.filter((s) => s.projectId === p.id).length,
        scenarioGroups: this.groups.filter((g) => g.projectId === p.id).length,
      },
    };
  }

  groupDto(g: GroupRec) {
    return { ...g, _count: { scenarios: this.scenariosOf(g.id).length } };
  }

  scenarioDto(s: ScenarioRec) {
    const p = this.projects.find((x) => x.id === s.projectId);
    const g = this.groups.find((x) => x.id === s.groupId);
    return {
      ...s,
      rawOutput: '',
      bddOutput: '',
      project: p ? { ...p, userId: SEED_USER.id } : undefined,
      group: g ? { id: g.id, name: g.name, type: g.type } : undefined,
    };
  }

  private exportFile(format: string, payload: unknown): MockResponse {
    const types: Record<string, string> = {
      excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      pdf: 'application/pdf',
      json: 'application/json',
      feature: 'text/plain',
    };
    return {
      status: 200,
      contentType: types[format] ?? 'application/octet-stream',
      body: JSON.stringify(payload),
    };
  }

  // -------------------------------------------------------------------------
  // Uc tanimlari
  // -------------------------------------------------------------------------
  private buildRoutes(): RouteDef[] {
    const R = (method: Method, path: string, handler: Handler, isPublic = false): RouteDef => ({
      method,
      // ":id" parcalarini yakalama grubuna cevir
      pattern: new RegExp(`^${path.replace(/:[a-zA-Z]+/g, '([^/]+)')}$`),
      handler,
      public: isPublic,
    });

    return [
      // ---------------- Auth ----------------
      R(
        'POST',
        '/auth/register',
        (req) => {
          const { name, email, password } = req.body ?? {};
          if (this.users.some((u) => u.email === email)) {
            return this.error(409, 'Bu email zaten kullanılıyor', req.path);
          }
          const user = { id: this.nextId('u'), name, email, password, createdAt: new Date().toISOString() };
          this.users.push(user);
          return this.ok({ id: user.id, name, email, createdAt: user.createdAt }, req.path, 201);
        },
        true,
      ),
      R(
        'POST',
        '/auth/login',
        (req) => {
          const { email, password } = req.body ?? {};
          const user = this.users.find((u) => u.email === email && u.password === password);
          if (!user) return this.error(401, 'Geçersiz kimlik bilgileri', req.path);
          return this.ok(this.issueTokens(user.id), req.path);
        },
        true,
      ),
      R(
        'POST',
        '/auth/refresh',
        (req) => {
          const token = req.body?.refreshToken;
          const userId = this.refreshTokens.get(token);
          if (!userId) return this.error(401, 'Geçersiz refresh token', req.path);
          this.refreshTokens.delete(token);
          return this.ok(this.issueTokens(userId), req.path);
        },
        true,
      ),
      R('GET', '/auth/me', (req) => {
        const user = this.users.find((u) => u.id === this.userIdFrom(req))!;
        return this.ok({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }, req.path);
      }),
      R('POST', '/auth/logout', (req) => this.ok({ message: 'ok' }, req.path), true),

      // ---------------- Projects ----------------
      R('GET', '/projects', (req) =>
        this.ok(this.paginate(this.projects.map((p) => this.projectDto(p)), req), req.path),
      ),
      R('POST', '/projects', (req) => {
        const now = new Date().toISOString();
        const p: ProjectRec = {
          id: this.nextId('p'),
          name: req.body.name,
          description: req.body.description || null,
          createdAt: now,
          updatedAt: now,
        };
        this.projects.unshift(p);
        return this.ok(this.projectDto(p), req.path, 201);
      }),
      R('GET', '/projects/:id', (req) => {
        const p = this.projects.find((x) => x.id === req.params[0]);
        return p ? this.ok(this.projectDto(p), req.path) : this.error(404, 'Proje bulunamadı', req.path);
      }),
      R('PATCH', '/projects/:id', (req) => {
        const p = this.projects.find((x) => x.id === req.params[0]);
        if (!p) return this.error(404, 'Proje bulunamadı', req.path);
        Object.assign(p, req.body, { updatedAt: new Date().toISOString() });
        return this.ok(this.projectDto(p), req.path);
      }),
      R('DELETE', '/projects/:id', (req) => {
        const id = req.params[0];
        this.projects = this.projects.filter((p) => p.id !== id);
        this.groups = this.groups.filter((g) => g.projectId !== id);
        this.scenarios = this.scenarios.filter((s) => s.projectId !== id);
        return this.ok({ message: 'Proje silindi' }, req.path);
      }),

      // ---------------- Scenario groups ----------------
      R('GET', '/scenario-groups/project/:id', (req) =>
        this.ok(this.paginate(this.groupsOf(req.params[0]).map((g) => this.groupDto(g)), req), req.path),
      ),
      R('GET', '/scenario-groups/:id', (req) => {
        const g = this.groups.find((x) => x.id === req.params[0]);
        return g ? this.ok(this.groupDto(g), req.path) : this.error(404, 'Grup bulunamadı', req.path);
      }),
      R('POST', '/scenario-groups', (req) => {
        const now = new Date().toISOString();
        const g: GroupRec = {
          id: this.nextId('g'),
          name: req.body.name,
          type: req.body.type,
          projectId: req.body.projectId,
          createdAt: now,
          updatedAt: now,
        };
        this.groups.unshift(g);
        return this.ok(this.groupDto(g), req.path, 201);
      }),
      R('PATCH', '/scenario-groups/:id', (req) => {
        const g = this.groups.find((x) => x.id === req.params[0]);
        if (!g) return this.error(404, 'Grup bulunamadı', req.path);
        Object.assign(g, req.body, { updatedAt: new Date().toISOString() });
        return this.ok(this.groupDto(g), req.path);
      }),
      R('DELETE', '/scenario-groups/:id', (req) => {
        const id = req.params[0];
        this.groups = this.groups.filter((g) => g.id !== id);
        this.scenarios = this.scenarios.filter((s) => s.groupId !== id);
        return this.ok({ message: 'Grup silindi' }, req.path);
      }),

      // ---------------- Scenarios: generate / convert / import / export ----------------
      R('POST', '/scenarios/generate/text', (req) =>
        this.ok({ scenarios: this.generated, input: req.body.input, sourceType: 'text', sourceRef: null }, req.path),
      ),
      R('POST', '/scenarios/generate/jira', (req) =>
        this.ok(
          { scenarios: this.generated, input: `Jira ${req.body.issueKey}`, sourceType: 'jira', sourceRef: req.body.issueKey },
          req.path,
        ),
      ),
      R('POST', '/scenarios/generate/excel', (req) =>
        this.ok({ scenarios: this.generated, input: 'excel', sourceType: 'excel', sourceRef: null }, req.path),
      ),
      R('POST', '/scenarios/generate/pdf', (req) =>
        this.ok({ scenarios: this.generated, input: 'pdf', sourceType: 'pdf', sourceRef: null }, req.path),
      ),
      R('POST', '/scenarios/convert-bdd', (req) => {
        const fw: string = req.body.framework;
        return this.ok(
          {
            framework: fw,
            results: req.body.scenarios.map((s: { id: string }) => ({
              scenarioId: s.id,
              framework: fw,
              language: fw === 'cucumber' ? 'gherkin' : 'typescript',
              code: BDD_CODE[fw],
            })),
          },
          req.path,
        );
      }),
      R('POST', '/scenarios/import-excel', (req) => {
        const groupId = /name="groupId"\r\n\r\n([^\r]+)/.exec(req.raw)?.[1] ?? '';
        const save = /name="saveResults"\r\n\r\ntrue/.test(req.raw);
        const group = this.groups.find((g) => g.id === groupId);
        const results = this.importRows.map((r) => ({ ...r }));
        if (save && group) {
          for (const r of results) {
            if (r.error) continue;
            const s = scenario(this.nextId('s'), group.id, group.projectId, r.testSummary, 'medium');
            this.scenarios.push(s);
            (r as { savedId?: string }).savedId = s.id;
          }
        }
        const failureCount = results.filter((r) => r.error).length;
        return this.ok(
          { totalRows: results.length, successCount: results.length - failureCount, failureCount, results },
          req.path,
        );
      }),
      R('GET', '/scenarios/export/all/:id', (req) =>
        this.exportFile(req.query.get('format') ?? 'excel', this.scenarios.filter((s) => s.projectId === req.params[0])),
      ),
      R('GET', '/scenarios/export/group/:id', (req) =>
        this.exportFile(req.query.get('format') ?? 'excel', this.scenariosOf(req.params[0])),
      ),
      R('GET', '/scenarios/export/:id', (req) =>
        this.exportFile(req.query.get('format') ?? 'excel', this.scenarios.filter((s) => s.id === req.params[0])),
      ),
      R('GET', '/scenarios/group/:id', (req) =>
        this.ok(this.paginate(this.scenariosOf(req.params[0]).map((s) => this.scenarioDto(s)), req), req.path),
      ),
      R('GET', '/scenarios/:id', (req) => {
        const s = this.scenarios.find((x) => x.id === req.params[0]);
        return s ? this.ok(this.scenarioDto(s), req.path) : this.error(404, 'Senaryo bulunamadı', req.path);
      }),
      R('DELETE', '/scenarios/:id', (req) => {
        this.scenarios = this.scenarios.filter((s) => s.id !== req.params[0]);
        return this.ok({ message: 'Senaryo silindi' }, req.path);
      }),
      R('POST', '/scenarios', (req) => {
        const group = this.groups.find((g) => g.id === req.body.groupId);
        if (!group) return this.error(404, 'Grup bulunamadı', req.path);
        const now = new Date().toISOString();
        const saved = req.body.scenarios.map((s: Omit<ScenarioRec, 'id'>) => {
          const rec: ScenarioRec = {
            ...s,
            id: this.nextId('s'),
            input: req.body.input,
            sourceType: req.body.sourceType ?? null,
            sourceRef: req.body.sourceRef ?? null,
            projectId: group.projectId,
            groupId: group.id,
            createdAt: now,
            updatedAt: now,
          };
          this.scenarios.push(rec);
          return this.scenarioDto(rec);
        });
        return this.ok(saved, req.path, 201);
      }),

      // ---------------- Jira ----------------
      R('GET', '/jira/connection', (req) =>
        this.jiraConnection ? this.ok(this.jiraConnection, req.path) : this.error(404, 'Jira bağlantısı bulunamadı', req.path),
      ),
      R('GET', '/jira/auth-url', (req) =>
        this.ok({ authUrl: 'https://auth.atlassian.com/authorize?client_id=nextest-e2e&state=e2e' }, req.path),
      ),
      R('DELETE', '/jira/connection', (req) => {
        this.jiraConnection = null;
        return this.ok({ message: 'Bağlantı kaldırıldı' }, req.path);
      }),

      // ---------------- SCM webhooks ----------------
      R('GET', '/v1/scm-webhooks', (req) => this.ok(this.scmConnections, req.path)),
      R('POST', '/v1/scm-webhooks', (req) => {
        const id = this.nextId('scm');
        const c: ScmConnectionRec = {
          id,
          provider: 'github',
          label: req.body.label ?? null,
          active: true,
          autoGenerate: !!req.body.autoGenerate,
          targetGroupId: req.body.targetGroupId ?? null,
          projectId: req.body.projectId ?? null,
          webhookUrl: `https://api.nextest.dev/api/v1/scm-webhooks/github/${id}`,
          createdAt: new Date().toISOString(),
        };
        this.scmConnections.push(c);
        return this.ok({ ...c, secret: `whsec_${id}_${'a'.repeat(24)}` }, req.path, 201);
      }),
      R('PATCH', '/v1/scm-webhooks/:id', (req) => {
        const c = this.scmConnections.find((x) => x.id === req.params[0]);
        if (!c) return this.error(404, 'Bağlantı bulunamadı', req.path);
        Object.assign(c, req.body);
        return this.ok(c, req.path);
      }),
      R('POST', '/v1/scm-webhooks/:id/rotate-secret', (req) => {
        const c = this.scmConnections.find((x) => x.id === req.params[0]);
        if (!c) return this.error(404, 'Bağlantı bulunamadı', req.path);
        return this.ok({ ...c, secret: `whsec_rotated_${this.nextId('r')}` }, req.path);
      }),
      R('DELETE', '/v1/scm-webhooks/:id', (req) => {
        this.scmConnections = this.scmConnections.filter((x) => x.id !== req.params[0]);
        return this.ok({ deleted: true }, req.path);
      }),
      R('GET', '/v1/scm-webhooks/:id/events', (req) => this.ok(this.paginate([], req), req.path)),

      // ---------------- Generations (history sayfasi) ----------------
      R('GET', '/generations', (req) => this.ok(this.paginate([], req), req.path)),
      R('GET', '/generations/stats', (req) =>
        this.ok(
          {
            weekly: { scenarioCount: 0, changePercent: 0 },
            approval: { rate: 0, saved: 0, total: 0 },
            today: { runCount: 0, scenarioCount: 0, avgDurationSec: 0 },
            success: { rate: 0, successful: 0, total: 0 },
          },
          req.path,
        ),
      ),
    ];
  }
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
