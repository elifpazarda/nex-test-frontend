'use client';

import { useState, use } from 'react';
import Link from 'next/link';

const SCENARIO = {
  id: 'TC-001',
  title: 'Gecerli kart ile odeme basariyla tamamlanir',
  category: 'happy_path',
  priority: 'critical',
  owner: 'Asli Cetin',
  duration: '1.2 sn',
  updated: '2 saat once',
  steps: [
    { kw: 'Given', text: 'kullanici sepetinde urun var ve odeme sayfasinda' },
    { kw: 'When', text: 'gecerli bir kredi karti bilgisi girer' },
    { kw: 'And', text: '"Ode" butonuna tiklar' },
    { kw: 'Then', text: 'odeme basariyla tamamlanir ve onay sayfasi gosterilir' },
  ],
};

const CODE_OUTPUTS: Record<string, { lang: string; file: string; code: string }> = {
  cucumber: {
    lang: 'gherkin',
    file: 'odeme-basarili.feature',
    code: `Feature: Odeme Akisi
  Kullanicilarin odeme yapabilmesi icin gerekli senaryolar.

  Background:
    Given kullanici sepetinde urun var ve odeme sayfasinda

  Scenario: Gecerli kart ile odeme basariyla tamamlanir
    When gecerli bir kredi karti bilgisi girer
    And "Ode" butonuna tiklar
    Then odeme basariyla tamamlanir ve onay sayfasi gosterilir`,
  },
  playwright: {
    lang: 'typescript',
    file: 'odeme-basarili.spec.ts',
    code: `import { test, expect } from '@playwright/test';

test.describe('Odeme Akisi', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/checkout');
    await expect(page.locator('[data-testid="cart-items"]')).toBeVisible();
  });

  test('gecerli kart ile odeme basariyla tamamlanir', async ({ page }) => {
    await page.fill('[data-testid="card-number"]', '4242424242424242');
    await page.fill('[data-testid="card-expiry"]', '12/28');
    await page.fill('[data-testid="card-cvc"]', '123');
    await page.click('[data-testid="pay-button"]');
    await expect(page).toHaveURL(/\\/confirmation/);
    await expect(page.locator('.success-message')).toBeVisible();
  });
});`,
  },
  cypress: {
    lang: 'javascript',
    file: 'odeme-basarili.cy.js',
    code: `describe('Odeme Akisi', () => {
  beforeEach(() => {
    cy.visit('/checkout');
    cy.get('[data-testid="cart-items"]').should('be.visible');
  });

  it('gecerli kart ile odeme basariyla tamamlanir', () => {
    cy.get('[data-testid="card-number"]').type('4242424242424242');
    cy.get('[data-testid="card-expiry"]').type('12/28');
    cy.get('[data-testid="card-cvc"]').type('123');
    cy.get('[data-testid="pay-button"]').click();
    cy.url().should('include', '/confirmation');
    cy.get('.success-message').should('be.visible');
  });
});`,
  },
};

const KW_COLORS: Record<string, string> = {
  Given: '#1f5c87',
  When: '#8a6b16',
  Then: '#157449',
  And: '#a8a595',
};

export default function CodePage({
  params,
}: {
  params: Promise<{ projectId: string; scenarioId: string }>;
}) {
  const { projectId: id } = use(params);
  const [framework, setFramework] = useState<'cucumber' | 'playwright' | 'cypress'>('cucumber');
  const [copied, setCopied] = useState(false);

  const output = CODE_OUTPUTS[framework];

  function copyCode() {
    navigator.clipboard.writeText(output.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-[1240px] px-8 py-7 pb-16">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1.5 text-[13px] text-[#7a7868]">
        <Link href="/projects" className="text-[#7a7868] no-underline hover:text-[#1a1a18]">
          Projeler
        </Link>
        <span className="text-[#a8a595]">/</span>
        <Link href={`/projects/${id}`} className="text-[#7a7868] no-underline hover:text-[#1a1a18]">
          Trendyol Checkout
        </Link>
        <span className="text-[#a8a595]">/</span>
        <Link
          href={`/projects/${id}/results`}
          className="text-[#7a7868] no-underline hover:text-[#1a1a18]"
        >
          Sonuclar
        </Link>
        <span className="text-[#a8a595]">/</span>
        <span className="font-medium text-[#1a1a18]">Kod</span>
      </nav>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="mb-1.5 flex items-center gap-2 text-[12px] text-[#a8a595]">
            <span className="rounded bg-[#f4efe3] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#5c5a52]">
              {SCENARIO.id}
            </span>
            <span>·</span>
            <span className="text-[#157449]">{SCENARIO.category.replace('_', ' ')}</span>
            <span>·</span>
            <span className="rounded-[4px] bg-[#9b2a2a] px-2 py-0.5 text-[11px] font-medium text-white">
              {SCENARIO.priority}
            </span>
          </div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#1a1a18]">
            {SCENARIO.title}
          </h1>
          <div className="mt-2 flex items-center gap-4 text-[12px] text-[#7a7868]">
            <span>{SCENARIO.owner}</span>
            <span>·</span>
            <span>{SCENARIO.duration}</span>
            <span>·</span>
            <span>{SCENARIO.updated}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/projects/${id}/results`}
            className="inline-flex h-8 items-center rounded-[6px] border border-[#d6d3cb] bg-white px-3 text-[12px] font-medium text-[#1a1a18] no-underline shadow-[0_1px_2px_rgba(26,26,24,0.05)] hover:bg-[#fbf8f1]"
          >
            ← Geri
          </Link>
          <button className="inline-flex h-8 items-center rounded-[6px] border border-[#d6d3cb] bg-white px-3 text-[12px] font-medium text-[#1a1a18] shadow-[0_1px_2px_rgba(26,26,24,0.05)] hover:bg-[#fbf8f1]">
            Yeniden uret
          </button>
        </div>
      </div>

      {/* Two-column: Sidebar + Code */}
      <div className="grid grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          {/* Steps card */}
          <div className="rounded-[14px] border border-[#e8e1cf] bg-white p-4">
            <h3 className="mb-3 text-[13px] font-semibold text-[#1a1a18]">Senaryo adimlari</h3>
            <div className="flex flex-col gap-1.5">
              {SCENARIO.steps.map((step, i) => (
                <div key={i} className="flex items-baseline gap-2 text-[12px]">
                  <span
                    className="font-mono font-medium"
                    style={{ color: KW_COLORS[step.kw], minWidth: '44px' }}
                  >
                    {step.kw}
                  </span>
                  <span className="text-[#3f3d38]">{step.text}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Details card */}
          <div className="rounded-[14px] border border-[#e8e1cf] bg-white p-4">
            <h3 className="mb-3 text-[13px] font-semibold text-[#1a1a18]">Detaylar</h3>
            <div className="flex flex-col gap-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#7a7868]">Kategori</span>
                <span className="font-medium text-[#1a1a18]">{SCENARIO.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7a7868]">Oncelik</span>
                <span className="font-medium text-[#1a1a18]">{SCENARIO.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7a7868]">Kaynak</span>
                <span className="font-mono font-medium text-[#1a1a18]">text</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7a7868]">Uretim sayisi</span>
                <span className="font-medium text-[#1a1a18]">1</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Code block */}
        <div className="overflow-hidden rounded-[14px] border border-[#2a2925]">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-[#3f3d38] bg-[#1a1a18] px-4 py-2.5">
            <div className="flex items-center gap-1">
              {(['cucumber', 'playwright', 'cypress'] as const).map((fw) => (
                <button
                  key={fw}
                  onClick={() => setFramework(fw)}
                  data-active={framework === fw || undefined}
                  className="rounded-[6px] px-3 py-1.5 text-[12px] font-medium capitalize text-[#a8a595] hover:text-[#e8e1cf] data-[active]:bg-[#3f3d38] data-[active]:text-white"
                >
                  {fw}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-[#7a7868]">{output.file}</span>
              <button
                onClick={copyCode}
                className="rounded-[4px] px-2 py-1 text-[11px] font-medium text-[#a8a595] hover:bg-[#3f3d38] hover:text-white"
              >
                {copied ? '✓ Kopyalandi' : 'Kopyala'}
              </button>
            </div>
          </div>
          {/* Code */}
          <pre className="overflow-x-auto bg-[#1a1a18] p-5 font-mono text-[13px] leading-[1.7] text-[#e4e4e7]">
            <code>{output.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
