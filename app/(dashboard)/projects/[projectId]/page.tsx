'use client';

import Link from 'next/link';
import { use } from 'react';

const MOCK_GROUPS = [
  {
    id: 'g1',
    name: 'Sepet · Odeme — Q2 PRD',
    type: 'FEATURE',
    source: 'text',
    scenarios: 24,
    priority: 'critical',
    author: 'AC',
    last: '2 saat once',
  },
  {
    id: 'g2',
    name: 'Kargo takip regresyon seti',
    type: 'REGRESSION',
    source: 'jira',
    scenarios: 18,
    priority: 'high',
    author: 'MO',
    last: '1 gun once',
  },
  {
    id: 'g3',
    name: 'Uyelik akisi — negatif testler',
    type: 'BUG',
    source: 'text',
    scenarios: 12,
    priority: 'medium',
    author: 'AC',
    last: '3 gun once',
  },
  {
    id: 'g4',
    name: 'Arama filtre smoke testi',
    type: 'SMOKE',
    source: 'excel',
    scenarios: 8,
    priority: 'low',
    author: 'SD',
    last: '5 gun once',
  },
  {
    id: 'g5',
    name: 'Performans limitleri',
    type: 'PERFORMANCE',
    source: 'pdf',
    scenarios: 6,
    priority: 'high',
    author: 'EK',
    last: '1 hafta once',
  },
];

const TYPE_COLORS: Record<string, { fg: string; bg: string }> = {
  FEATURE: { fg: '#1a5a40', bg: '#ecf5f0' },
  REGRESSION: { fg: '#6b4d8c', bg: '#ede5f5' },
  BUG: { fg: '#9b2a2a', bg: '#f5e5e2' },
  SMOKE: { fg: '#8a6b16', bg: '#f5eddb' },
  INTEGRATION: { fg: '#1f5c87', bg: '#e5eef5' },
  E2E: { fg: '#1f6f4e', bg: '#ecf5f0' },
  PERFORMANCE: { fg: '#b85b1a', bg: '#fbedd8' },
  OTHER: { fg: '#3f3d38', bg: '#f4efe3' },
};

const SOURCE_ICONS: Record<string, string> = {
  text: 'T',
  jira: 'J',
  excel: 'E',
  pdf: 'P',
};

const ACTIVITY = [
  {
    who: 'AC',
    name: 'Asli',
    action: '24 senaryo uretti',
    target: 'Sepet · Odeme — Q2 PRD',
    time: '2 saat once',
  },
  {
    who: 'MO',
    name: 'Mert',
    action: '3 senaryoyu sildi',
    target: 'Kargo takip regresyon seti',
    time: '5 saat once',
  },
  {
    who: 'AC',
    name: 'Asli',
    action: 'grup olusturdu',
    target: 'Uyelik akisi — negatif testler',
    time: '1 gun once',
  },
];

export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId: id } = use(params);

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-8 pb-16">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-[13px] text-[#7a7868]">
        <Link href="/projects" className="text-[#7a7868] no-underline hover:text-[#1a1a18]">
          Projeler
        </Link>
        <span className="text-[#a8a595]">/</span>
        <span className="font-medium text-[#1a1a18]">Trendyol Checkout</span>
      </nav>

      {/* Hero */}
      <section className="mb-8 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[14px] border border-[#e8e1cf] bg-[#ecf5f0] text-[16px] font-semibold text-[#1a5a40]">
            TC
          </div>
          <div>
            <h1 className="font-heading text-[32px] font-medium tracking-tight text-[#1a1a18]">
              Trendyol Checkout
            </h1>
            <p className="mt-1 text-[15px] text-[#5c5a52]">Odeme akisi test senaryolari</p>
            <div className="mt-3 flex items-center gap-5 text-[13px] text-[#7a7868]">
              <span>
                <span className="text-[#a8a595]">Sahibi</span>{' '}
                <span className="ml-1 font-medium text-[#1a1a18]">Asli Cetin</span>
              </span>
              <span>
                <span className="text-[#a8a595]">Olusturuldu</span>{' '}
                <span className="ml-1">14 Nis 2026</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#d6d3cb] bg-white px-3 text-[13px] font-medium text-[#1a1a18] shadow-[0_1px_2px_rgba(26,26,24,0.05)] hover:bg-[#fbf8f1]">
            Duzenle
          </button>
          <button className="inline-flex h-9 items-center gap-1.5 rounded-[8px] bg-[#1f6f4e] px-4 text-[13px] font-semibold text-white shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4)] hover:bg-[#1a5a40]">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2l1.5 3.5L13 7l-3 2.5.5 4L8 11.5 5.5 13.5l.5-4L3 7l3.5-1.5L8 2z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
            Senaryo uret
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-8 grid grid-cols-4 gap-px overflow-hidden rounded-[14px] border border-[#e8e1cf] bg-[#e8e1cf]">
        {[
          { label: 'Senaryo grubu', value: String(MOCK_GROUPS.length), delta: '+2 bu hafta' },
          { label: 'Toplam senaryo', value: '68', delta: '+24 bugun' },
          { label: 'Son aktivite', value: '2 sa', delta: 'once' },
          { label: 'AI kotasi', value: '68', delta: '/ 1.392 kullanildi' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-5">
            <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[#a8a595]">
              {stat.label}
            </p>
            <p className="mt-1 font-heading text-[28px] font-medium tracking-tight text-[#1a1a18]">
              {stat.value}
            </p>
            <p className="mt-0.5 text-[12px] text-[#7a7868]">{stat.delta}</p>
          </div>
        ))}
      </section>

      {/* Two-column: Groups + Sidebar */}
      <div className="grid grid-cols-[1fr_320px] gap-6">
        {/* Groups table */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-semibold text-[#1a1a18]">Senaryo gruplari</h2>
              <p className="mt-0.5 text-[13px] text-[#7a7868]">
                Her grup bir kaynaktan uretilmis bir senaryo setidir.
              </p>
            </div>
            <button className="inline-flex h-8 items-center gap-1.5 rounded-[6px] border border-[#d6d3cb] bg-white px-3 text-[12px] font-medium text-[#1a1a18] shadow-[0_1px_2px_rgba(26,26,24,0.05)] hover:bg-[#fbf8f1]">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3v10M3 8h10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Yeni grup
            </button>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-[14px] border border-[#e8e1cf] bg-white">
            <div className="grid grid-cols-[2fr_130px_130px_90px_140px_40px] items-center gap-3 border-b border-[#e8e1cf] bg-[#fbf8f1] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#a8a595]">
              <span>Grup</span>
              <span>Tip</span>
              <span>Kaynak</span>
              <span>Senaryo</span>
              <span>Son guncelleme</span>
              <span></span>
            </div>
            {MOCK_GROUPS.map((g) => (
              <Link
                key={g.id}
                href={`/projects/${id}/groups/${g.id}`}
                className="grid grid-cols-[2fr_130px_130px_90px_140px_40px] items-center gap-3 border-b border-[#f4efe3] px-4 py-3 no-underline transition-colors last:border-0 hover:bg-[#fbf8f1]"
              >
                {/* Name */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[8px] bg-[#f4efe3] text-[12px] font-semibold text-[#5c5a52]">
                    {SOURCE_ICONS[g.source]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-[14px] font-medium text-[#1a1a18]">{g.name}</h3>
                  </div>
                </div>
                {/* Type badge */}
                <span>
                  <span
                    className="inline-flex items-center rounded-[4px] px-2 py-0.5 text-[11px] font-medium"
                    style={{ background: TYPE_COLORS[g.type]?.bg, color: TYPE_COLORS[g.type]?.fg }}
                  >
                    {g.type}
                  </span>
                </span>
                {/* Source */}
                <span className="text-[13px] capitalize text-[#5c5a52]">{g.source}</span>
                {/* Count */}
                <span className="text-[14px] font-medium text-[#1a1a18]">{g.scenarios}</span>
                {/* Time */}
                <span className="text-[12px] text-[#a8a595]">{g.last}</span>
                {/* Menu */}
                <button className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[#a8a595] hover:bg-[#f4efe3] hover:text-[#1a1a18]">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="3" r="1.2" fill="currentColor" />
                    <circle cx="8" cy="8" r="1.2" fill="currentColor" />
                    <circle cx="8" cy="13" r="1.2" fill="currentColor" />
                  </svg>
                </button>
              </Link>
            ))}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          {/* Quick generate */}
          <div className="rounded-[14px] border border-[#e8e1cf] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[#1a1a18]">Hizli uret</h3>
              <span className="text-[12px] text-[#a8a595]">Bir kaynak sec</span>
            </div>
            <div className="flex flex-col gap-2">
              {[
                {
                  href: `/projects/${id}/generate?source=text`,
                  icon: 'T',
                  label: 'Metinden',
                  hint: 'Bir paragraf yapistir',
                },
                {
                  href: `/projects/${id}/generate?source=jira`,
                  icon: 'J',
                  label: "Jira'dan",
                  hint: 'Bir issue ile bagla',
                },
                {
                  href: `/projects/${id}/generate?source=excel`,
                  icon: 'E',
                  label: "Excel'den",
                  hint: 'Toplu yukleme yap',
                },
                {
                  href: `/projects/${id}/generate?source=pdf`,
                  icon: 'P',
                  label: "PDF'den",
                  hint: 'Dokuman yukle',
                },
              ].map((item) => (
                <Link
                  key={item.icon}
                  href={item.href}
                  className="flex items-center gap-3 rounded-[10px] border border-[#f4efe3] p-3 no-underline transition-colors hover:border-[#1f6f4e] hover:bg-[#ecf5f0]"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[8px] bg-[#ecf5f0] text-[12px] font-semibold text-[#1f6f4e]">
                    {item.icon}
                  </span>
                  <span>
                    <strong className="block text-[13px] font-medium text-[#1a1a18]">
                      {item.label}
                    </strong>
                    <em className="block text-[12px] not-italic text-[#7a7868]">{item.hint}</em>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-[14px] border border-[#e8e1cf] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[#1a1a18]">Aktivite</h3>
              <span className="text-[12px] font-medium text-[#1a5a40]">Tumu →</span>
            </div>
            <ul className="flex flex-col gap-3">
              {ACTIVITY.map((a, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
                    style={{ background: '#d4e9dd', color: '#154832' }}
                  >
                    {a.who}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] text-[#1a1a18]">
                      <strong className="font-medium">{a.name}</strong> {a.action}
                    </p>
                    <p className="truncate text-[12px] text-[#7a7868]">{a.target}</p>
                    <span className="text-[11px] text-[#a8a595]">{a.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
