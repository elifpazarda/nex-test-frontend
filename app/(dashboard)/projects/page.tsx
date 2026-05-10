'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

const MOCK_PROJECTS = [
  {
    id: 'p1',
    name: 'Trendyol Checkout',
    desc: 'Odeme akisi test senaryolari',
    initials: 'TC',
    groups: 6,
    scenarios: 142,
    updated: '2 saat once',
    members: ['AC', 'MO', 'SD'],
  },
  {
    id: 'p2',
    name: 'Getir Delivery',
    desc: 'Teslimat modulu entegrasyon testleri',
    initials: 'GD',
    groups: 4,
    scenarios: 87,
    updated: '1 gun once',
    members: ['AC', 'EK'],
  },
  {
    id: 'p3',
    name: 'HepsiBurada Search',
    desc: 'Arama ve filtreleme senaryolari',
    initials: 'HS',
    groups: 3,
    scenarios: 53,
    updated: '3 gun once',
    members: ['MO'],
  },
  {
    id: 'p4',
    name: 'N11 Mobile App',
    desc: 'Mobil uygulama regresyon testleri',
    initials: 'NM',
    groups: 8,
    scenarios: 204,
    updated: '5 gun once',
    members: ['SD', 'AC'],
  },
  {
    id: 'p5',
    name: 'Pazarama Auth',
    desc: 'Kimlik dogrulama akislari',
    initials: 'PA',
    groups: 2,
    scenarios: 31,
    updated: '1 hafta once',
    members: ['EK'],
  },
];

const AVATAR_COLORS: Record<string, { bg: string; fg: string }> = {
  AC: { bg: '#FED9B7', fg: '#7A3E12' },
  MO: { bg: '#C7E9D6', fg: '#1F6F4E' },
  SD: { bg: '#D9DCFF', fg: '#3F3DB5' },
  EK: { bg: '#F8D4D4', fg: '#9B2A2A' },
};

export default function ProjectsPage() {
  const { user } = useAuth();
  const [q, setQ] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = MOCK_PROJECTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.desc.toLowerCase().includes(q.toLowerCase()),
  );

  const firstName = user?.name.split(' ')[0] ?? '';

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-10 pb-16">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="font-heading text-[32px] font-medium leading-[1.1] tracking-tight text-[#1a1a18]">
          Tekrar <em className="font-medium italic text-[#1a5a40]">hos geldin</em>
          {firstName ? `, ${firstName}` : ''}.
        </h1>
        <p className="mt-2 text-[15px] text-[#5c5a52]">
          {MOCK_PROJECTS.length} aktif projen var. Bu hafta 47 yeni senaryo uretildi.
        </p>
        <button className="mt-5 inline-flex h-12 items-center gap-2 rounded-[10px] bg-[#1f6f4e] px-5 text-[16px] font-semibold text-[#fffdf8] shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[#1a5a40] active:translate-y-[0.5px] active:bg-[#154832]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Yeni proje
        </button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-4 gap-px overflow-hidden rounded-[14px] border border-[#e8e1cf] bg-[#e8e1cf]">
        {[
          { label: 'Aktif proje', value: '5', delta: '+1 bu ay' },
          { label: 'Toplam senaryo', value: '517', delta: '+47 bu hafta' },
          { label: 'AI kullanimi', value: '1.284', delta: '/ 5.000 kota' },
          { label: 'Ortalama sure', value: '2.1 sn', delta: 'uretim / senaryo' },
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
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex items-center gap-3">
        {/* Search */}
        <label className="flex h-9 w-[240px] items-center gap-2 rounded-[8px] border border-[#e8e1cf] bg-white px-3">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="text-[#a8a595]">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M11 11l3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Projelerde ara..."
            className="h-full flex-1 border-0 bg-transparent text-[13px] text-[#1a1a18] outline-none placeholder:text-[#a8a595]"
          />
        </label>

        {/* Filters */}
        <div className="flex items-center gap-1">
          {['Tumu', 'Benim', 'Son guncellenen'].map((f, i) => (
            <button
              key={f}
              data-active={i === 0 || undefined}
              className="rounded-full border border-[#e8e1cf] bg-white px-3 py-1.5 text-[12px] font-medium text-[#5c5a52] hover:border-[#d6d3cb] hover:text-[#1a1a18] data-[active]:border-[#1f6f4e] data-[active]:bg-[#ecf5f0] data-[active]:text-[#1a5a40]"
            >
              {f}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1 rounded-[8px] border border-[#e8e1cf] bg-[#f4efe3] p-1">
          <button
            onClick={() => setView('grid')}
            data-active={view === 'grid' || undefined}
            className="rounded-[6px] px-2.5 py-1 text-[12px] font-medium text-[#5c5a52] data-[active]:bg-white data-[active]:text-[#1a1a18] data-[active]:shadow-[0_1px_2px_rgba(26,26,24,0.05)]"
          >
            Grid
          </button>
          <button
            onClick={() => setView('list')}
            data-active={view === 'list' || undefined}
            className="rounded-[6px] px-2.5 py-1 text-[12px] font-medium text-[#5c5a52] data-[active]:bg-white data-[active]:text-[#1a1a18] data-[active]:shadow-[0_1px_2px_rgba(26,26,24,0.05)]"
          >
            Liste
          </button>
        </div>
      </div>

      {/* Project Grid */}
      {view === 'grid' ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
          {filtered.map((p) => (
            <a
              key={p.id}
              href={`/projects/${p.id}`}
              className="group flex flex-col rounded-[14px] border border-[#e8e1cf] bg-white p-5 no-underline transition-[box-shadow,transform] duration-[180ms] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(26,26,24,0.12),0_4px_8px_rgba(26,26,24,0.05)]"
            >
              {/* Head */}
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[10px] bg-[#ecf5f0] text-[13px] font-semibold text-[#1a5a40]">
                  {p.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[15px] font-semibold text-[#1a1a18]">{p.name}</h3>
                  <p className="mt-0.5 truncate text-[13px] text-[#7a7868]">{p.desc}</p>
                </div>
              </div>
              {/* Stats */}
              <div className="mt-4 flex gap-6 border-t border-[#f4efe3] pt-3.5">
                <div>
                  <span className="block font-heading text-[20px] font-medium text-[#1a1a18]">
                    {p.groups}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.06em] text-[#a8a595]">
                    Grup
                  </span>
                </div>
                <div>
                  <span className="block font-heading text-[20px] font-medium text-[#1a1a18]">
                    {p.scenarios}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.06em] text-[#a8a595]">
                    Senaryo
                  </span>
                </div>
              </div>
              {/* Footer */}
              <div className="mt-3.5 flex items-center justify-between">
                <span className="text-[12px] text-[#a8a595]">{p.updated}</span>
                <div className="flex -space-x-1.5">
                  {p.members.map((m) => (
                    <span
                      key={m}
                      className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold"
                      style={{ background: AVATAR_COLORS[m]?.bg, color: AVATAR_COLORS[m]?.fg }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
          {/* New project card */}
          <button className="flex flex-col items-center justify-center gap-3 rounded-[14px] border-2 border-dashed border-[#d6d3cb] bg-[#fbf8f1] p-8 text-center transition-colors hover:border-[#1f6f4e] hover:bg-[#ecf5f0]">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6d3cb] bg-white text-[#5c5a52]">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3v10M3 8h10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="text-[14px] font-medium text-[#5c5a52]">Yeni proje</span>
          </button>
        </div>
      ) : (
        /* List View */
        <div className="overflow-hidden rounded-[14px] border border-[#e8e1cf] bg-white">
          {/* Header */}
          <div className="grid grid-cols-[2fr_80px_90px_100px_130px_40px] items-center gap-3 border-b border-[#e8e1cf] bg-[#fbf8f1] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#a8a595]">
            <span>Proje</span>
            <span>Grup</span>
            <span>Senaryo</span>
            <span>Ekip</span>
            <span>Guncellendi</span>
            <span></span>
          </div>
          {/* Rows */}
          {filtered.map((p) => (
            <a
              key={p.id}
              href={`/projects/${p.id}`}
              className="grid grid-cols-[2fr_80px_90px_100px_130px_40px] items-center gap-3 border-b border-[#f4efe3] px-4 py-3 no-underline transition-colors last:border-0 hover:bg-[#fbf8f1]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[8px] bg-[#ecf5f0] text-[11px] font-semibold text-[#1a5a40]">
                  {p.initials}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-[14px] font-medium text-[#1a1a18]">{p.name}</h3>
                  <p className="truncate text-[12px] text-[#7a7868]">{p.desc}</p>
                </div>
              </div>
              <span className="text-[14px] font-medium text-[#1a1a18]">{p.groups}</span>
              <span className="text-[14px] font-medium text-[#1a1a18]">{p.scenarios}</span>
              <div className="flex -space-x-1.5">
                {p.members.map((m) => (
                  <span
                    key={m}
                    className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold"
                    style={{ background: AVATAR_COLORS[m]?.bg, color: AVATAR_COLORS[m]?.fg }}
                  >
                    {m}
                  </span>
                ))}
              </div>
              <span className="text-[12px] text-[#a8a595]">{p.updated}</span>
              <button className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[#a8a595] hover:bg-[#f4efe3] hover:text-[#1a1a18]">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="3" r="1.2" fill="currentColor" />
                  <circle cx="8" cy="8" r="1.2" fill="currentColor" />
                  <circle cx="8" cy="13" r="1.2" fill="currentColor" />
                </svg>
              </button>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
