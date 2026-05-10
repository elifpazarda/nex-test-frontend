'use client';

import { useState, use } from 'react';
import Link from 'next/link';

const SCENARIOS = [
  {
    id: 'TC-001',
    title: 'Gecerli kart ile odeme basariyla tamamlanir',
    category: 'happy_path',
    priority: 'critical',
    source: 'text',
    duration: '1.2 sn',
    steps: [
      { kw: 'Given', text: 'kullanici sepetinde urun var ve odeme sayfasinda' },
      { kw: 'When', text: 'gecerli bir kredi karti bilgisi girer' },
      { kw: 'And', text: '"Ode" butonuna tiklar' },
      { kw: 'Then', text: 'odeme basariyla tamamlanir ve onay sayfasi gosterilir' },
    ],
  },
  {
    id: 'TC-002',
    title: 'Yetersiz bakiye durumunda uyari gosterilir',
    category: 'negative',
    priority: 'high',
    source: 'text',
    duration: '0.9 sn',
    steps: [
      { kw: 'Given', text: 'kullanici odeme sayfasinda' },
      { kw: 'When', text: 'bakiyesi yetersiz bir kart ile odeme yapmaya calisir' },
      { kw: 'Then', text: '"Yetersiz bakiye" hata mesaji gosterilir' },
      { kw: 'And', text: 'odeme islemi gerceklesmez' },
    ],
  },
  {
    id: 'TC-003',
    title: 'Suresi dolmus kart reddedilir',
    category: 'negative',
    priority: 'high',
    source: 'text',
    duration: '0.8 sn',
    steps: [
      { kw: 'Given', text: 'kullanici odeme sayfasinda' },
      { kw: 'When', text: 'suresi dolmus bir kart numarasi girer' },
      { kw: 'Then', text: '"Kart suresi dolmus" uyarisi gosterilir' },
    ],
  },
  {
    id: 'TC-004',
    title: '3D Secure dogrulama zaman asiminda islem iptal edilir',
    category: 'edge_case',
    priority: 'medium',
    source: 'text',
    duration: '1.4 sn',
    steps: [
      { kw: 'Given', text: 'kullanici 3D Secure dogrulama sayfasina yonlendirilmis' },
      { kw: 'When', text: '3 dakika icinde dogrulama tamamlanmazsa' },
      { kw: 'Then', text: 'islem iptal edilir ve kullanici odeme sayfasina doner' },
      { kw: 'And', text: '"Zaman asimi" mesaji gosterilir' },
    ],
  },
  {
    id: 'TC-005',
    title: 'Bos sepet ile odeme sayfasina erisim engellenir',
    category: 'edge_case',
    priority: 'medium',
    source: 'text',
    duration: '0.6 sn',
    steps: [
      { kw: 'Given', text: 'kullanicinin sepetinde hicbir urun yok' },
      { kw: 'When', text: "dogrudan odeme URL'sine gider" },
      { kw: 'Then', text: 'sepet sayfasina yonlendirilir' },
    ],
  },
  {
    id: 'TC-006',
    title: 'Havale ile odeme secenegi dogru calisir',
    category: 'happy_path',
    priority: 'high',
    source: 'text',
    duration: '1.1 sn',
    steps: [
      { kw: 'Given', text: 'kullanici odeme sayfasinda' },
      { kw: 'When', text: '"Havale/EFT" odeme yontemini secer' },
      { kw: 'And', text: 'banka bilgilerini onaylar' },
      { kw: 'Then', text: 'havale talimati goruntulenir ve siparis olusturulur' },
    ],
  },
];

const CAT_STYLE: Record<string, { fg: string; bg: string }> = {
  happy_path: { fg: '#157449', bg: '#e8f3ee' },
  edge_case: { fg: '#8a6b16', bg: '#f5eddb' },
  negative: { fg: '#9b2a2a', bg: '#f7e5e2' },
};

const PRI_STYLE: Record<string, { fg: string; bg: string }> = {
  critical: { fg: '#ffffff', bg: '#9b2a2a' },
  high: { fg: '#c0392b', bg: '#fbe5df' },
  medium: { fg: '#8a6b16', bg: '#f5eddb' },
  low: { fg: '#3f3d38', bg: '#f4efe3' },
};

const KW_COLORS: Record<string, string> = {
  Given: '#1f5c87',
  When: '#8a6b16',
  Then: '#157449',
  And: '#a8a595',
};

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [discarded, setDiscarded] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  const kept = SCENARIOS.filter((s) => !discarded.has(s.id));
  const filtered = kept.filter((s) => {
    if (categoryFilter && s.category !== categoryFilter) return false;
    if (priorityFilter && s.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-[1240px] px-8 py-7 pb-20">
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
        <span className="font-medium text-[#1a1a18]">Sonuclari incele</span>
      </nav>

      {/* Hero */}
      <div className="mb-6">
        <h1 className="font-heading text-[38px] font-normal tracking-tight text-[#1a1a18]">
          Senaryolar <em className="font-medium italic text-[#1a5a40]">uretildi</em>
        </h1>
        <p className="mt-1 text-[15px] text-[#5c5a52]">
          Begendiklerini sakla, gerekenleri duzenle, gerisini at.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#ecf5f0] px-3 py-1.5 text-[12px] font-medium text-[#1a5a40]">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 6h12M5 2v2M11 2v2M3 4h10a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          Eklenecek grup: <strong>Sepet · Odeme — Q2 PRD</strong>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-3 z-[5] mb-6 flex items-center gap-4 rounded-[14px] border border-[#e8e1cf] bg-white/90 px-5 py-3 shadow-[0_4px_12px_-2px_rgba(26,26,24,0.08)] backdrop-blur-sm">
        <div>
          <div className="font-heading text-[22px] font-medium italic text-[#1a1a18]">
            {kept.length}
          </div>
          <div className="text-[12px] text-[#7a7868]">Toplam {filtered.length} senaryo</div>
        </div>
        <div className="mx-2 h-8 w-px bg-[#e8e1cf]" />
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              setCategoryFilter(null);
              setPriorityFilter(null);
            }}
            data-active={(!categoryFilter && !priorityFilter) || undefined}
            className="rounded-full border border-[#e8e1cf] px-2.5 py-1 text-[12px] font-medium text-[#5c5a52] data-[active]:border-[#1f6f4e] data-[active]:bg-[#1f6f4e] data-[active]:text-white"
          >
            Tumu <span className="ml-1 opacity-70">{kept.length}</span>
          </button>
          {['happy_path', 'edge_case', 'negative'].map((cat) => {
            const n = kept.filter((s) => s.category === cat).length;
            if (n === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => {
                  setCategoryFilter(categoryFilter === cat ? null : cat);
                  setPriorityFilter(null);
                }}
                data-active={categoryFilter === cat || undefined}
                className="rounded-full border border-[#e8e1cf] px-2.5 py-1 text-[12px] font-medium text-[#5c5a52] data-[active]:border-[#1f6f4e] data-[active]:bg-[#1f6f4e] data-[active]:text-white"
              >
                {cat.replace('_', ' ')} <span className="ml-1 opacity-70">{n}</span>
              </button>
            );
          })}
          <span className="mx-1 h-[18px] w-px bg-[#e8e1cf]" />
          {['critical', 'high', 'medium', 'low'].map((pri) => {
            const n = kept.filter((s) => s.priority === pri).length;
            if (n === 0) return null;
            return (
              <button
                key={pri}
                onClick={() => {
                  setPriorityFilter(priorityFilter === pri ? null : pri);
                  setCategoryFilter(null);
                }}
                data-active={priorityFilter === pri || undefined}
                className="rounded-full border border-[#e8e1cf] px-2.5 py-1 text-[12px] font-medium text-[#5c5a52] data-[active]:border-[#1f6f4e] data-[active]:bg-[#1f6f4e] data-[active]:text-white"
              >
                {pri} <span className="ml-1 opacity-70">{n}</span>
              </button>
            );
          })}
        </div>
        <button className="inline-flex h-8 items-center gap-1.5 rounded-[6px] bg-[#1f6f4e] px-3 text-[12px] font-semibold text-white shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4)] hover:bg-[#1a5a40]">
          ✓ {kept.length} senaryoyu kaydet
        </button>
      </div>

      {/* Scenario cards */}
      <div className="flex flex-col gap-3">
        {filtered.map((s, idx) => {
          const isDiscarded = discarded.has(s.id);
          return (
            <article
              key={s.id}
              className="overflow-hidden rounded-[14px] border border-[#e8e1cf] bg-white transition-opacity"
              style={{ opacity: isDiscarded ? 0.5 : 1, animationDelay: `${idx * 40}ms` }}
            >
              {/* Card head */}
              <div className="flex items-start gap-3.5 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="mb-1.5 flex items-center gap-2 text-[11px] text-[#a8a595]">
                    <span className="rounded bg-[#f4efe3] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#5c5a52]">
                      {s.id}
                    </span>
                    <span>·</span>
                    <span style={{ color: CAT_STYLE[s.category]?.fg }}>
                      {s.category.replace('_', ' ')}
                    </span>
                    <span>·</span>
                    <span>
                      kaynak: <span className="font-mono">{s.source}</span>
                    </span>
                  </div>
                  <h3 className="text-[16px] font-semibold leading-snug text-[#1a1a18]">
                    {s.title}
                  </h3>
                </div>
                <span
                  className="flex-shrink-0 rounded-[4px] px-2 py-0.5 text-[11px] font-medium"
                  style={{
                    background: PRI_STYLE[s.priority]?.bg,
                    color: PRI_STYLE[s.priority]?.fg,
                  }}
                >
                  {s.priority}
                </span>
              </div>

              {/* BDD Steps */}
              <div className="border-t border-[#f4efe3] bg-[#fbf8f1] px-5 py-3">
                {s.steps.map((step, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[64px_1fr] items-baseline py-1 text-[13px]"
                  >
                    <span
                      className="font-mono text-[12px] font-medium"
                      style={{ color: KW_COLORS[step.kw] }}
                    >
                      {step.kw}
                    </span>
                    <span className="text-[#3f3d38]">{step.text}</span>
                  </div>
                ))}
              </div>

              {/* Card footer */}
              <div className="flex items-center justify-between border-t border-[#f4efe3] px-5 py-2.5">
                <div className="flex items-center gap-4 text-[12px] text-[#a8a595]">
                  <span className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
                      <path
                        d="M8 5v3.5l2.5 1.5"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                    {s.duration}
                  </span>
                  <span>{s.steps.length} adim</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="rounded-[6px] px-2 py-1 text-[12px] font-medium text-[#5c5a52] hover:bg-[#f4efe3]">
                    Duzenle
                  </button>
                  <button className="rounded-[6px] px-2 py-1 text-[12px] font-medium text-[#5c5a52] hover:bg-[#f4efe3]">
                    Yeniden uret
                  </button>
                  <button className="rounded-[6px] px-2 py-1 text-[12px] font-medium text-[#5c5a52] hover:bg-[#f4efe3]">
                    Kod
                  </button>
                  <button
                    onClick={() => setDiscarded((p) => new Set([...p, s.id]))}
                    className="rounded-[6px] px-2 py-1 text-[12px] font-medium text-[#5c5a52] hover:bg-[#f7e5e2] hover:text-[#9b2a2a]"
                  >
                    At
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
