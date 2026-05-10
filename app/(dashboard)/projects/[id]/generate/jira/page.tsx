'use client';

import { useState, use } from 'react';
import Link from 'next/link';

const MOCK_ISSUES = [
  {
    key: 'TRND-142',
    title: 'Odeme sayfasinda 3D Secure timeout handling',
    status: 'In Progress',
    priority: 'high',
    reporter: 'AC',
    updated: '2 saat once',
  },
  {
    key: 'TRND-138',
    title: 'Sepetten urun cikarma sonrasi fiyat guncellenmesi',
    status: 'To Do',
    priority: 'medium',
    reporter: 'MO',
    updated: '1 gun once',
  },
  {
    key: 'TRND-135',
    title: 'Kupon kodu uygulandiktan sonra sepet tutari',
    status: 'In Review',
    priority: 'critical',
    reporter: 'AC',
    updated: '2 gun once',
  },
  {
    key: 'TRND-131',
    title: 'Misafir kullanici checkout akisi',
    status: 'Done',
    priority: 'high',
    reporter: 'SD',
    updated: '3 gun once',
  },
  {
    key: 'TRND-128',
    title: 'Birden fazla adres secimi ve degisiklik',
    status: 'To Do',
    priority: 'low',
    reporter: 'EK',
    updated: '5 gun once',
  },
];

const STATUS_COLORS: Record<string, { fg: string; bg: string }> = {
  'To Do': { fg: '#5c5a52', bg: '#f4efe3' },
  'In Progress': { fg: '#1f5c87', bg: '#e5eef5' },
  'In Review': { fg: '#8a6b16', bg: '#f5eddb' },
  Done: { fg: '#157449', bg: '#e8f3ee' },
};

const PRI_COLORS: Record<string, { fg: string; bg: string }> = {
  critical: { fg: '#fff', bg: '#9b2a2a' },
  high: { fg: '#c0392b', bg: '#fbe5df' },
  medium: { fg: '#8a6b16', bg: '#f5eddb' },
  low: { fg: '#3f3d38', bg: '#f4efe3' },
};

export default function GenerateJiraPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [q, setQ] = useState('');
  const [groupName, setGroupName] = useState('');
  const [count, setCount] = useState(8);

  const filtered = MOCK_ISSUES.filter(
    (i) =>
      i.title.toLowerCase().includes(q.toLowerCase()) ||
      i.key.toLowerCase().includes(q.toLowerCase()),
  );

  function toggle(key: string) {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });
  }

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-7 pb-20">
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
        <span className="font-medium text-[#1a1a18]">Jira&apos;dan uret</span>
      </nav>

      {/* Hero */}
      <div className="mb-6">
        <h1 className="font-heading text-[32px] font-medium tracking-tight text-[#1a1a18]">
          <em className="font-medium italic text-[#1a5a40]">Jira</em>&apos;dan uret
        </h1>
        <p className="mt-1 text-[15px] text-[#5c5a52]">
          Issue sec, NexTest senaryolari otomatik uretsin.
        </p>
      </div>

      {/* Source tabs */}
      <nav className="mb-6 inline-flex gap-1 rounded-[10px] bg-[#f4efe3] p-1">
        <Link
          href={`/projects/${id}/generate`}
          className="rounded-[8px] px-4 py-2 text-[13px] font-medium text-[#5c5a52] no-underline"
        >
          Metin
        </Link>
        <button
          data-active
          className="rounded-[8px] px-4 py-2 text-[13px] font-medium text-[#5c5a52] data-[active]:bg-[#1f6f4e] data-[active]:text-white data-[active]:shadow-[0_1px_3px_rgba(26,26,24,0.06)]"
        >
          Jira
        </button>
        <Link
          href={`/projects/${id}/generate/excel`}
          className="rounded-[8px] px-4 py-2 text-[13px] font-medium text-[#5c5a52] no-underline"
        >
          Excel
        </Link>
        <Link
          href={`/projects/${id}/generate/pdf`}
          className="rounded-[8px] px-4 py-2 text-[13px] font-medium text-[#5c5a52] no-underline"
        >
          PDF
        </Link>
      </nav>

      {/* Two-column grid */}
      <div className="grid grid-cols-[1fr_360px] gap-6">
        {/* Main: Jira connection + issue list */}
        <section className="flex flex-col gap-4">
          {/* Connection status */}
          <div className="flex items-center gap-3 rounded-[12px] border border-[#d4e9dd] bg-[#ecf5f0] px-4 py-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-white text-[12px] font-bold text-[#1f5c87]">
              J
            </span>
            <div className="flex-1">
              <p className="text-[13px] font-medium text-[#1a1a18]">Trendyol Workspace</p>
              <p className="text-[11px] text-[#5c5a52]">trendyol.atlassian.net · Baglanti aktif</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-[#1f8a5b]" />
          </div>

          {/* Search */}
          <label className="flex h-10 items-center gap-2 rounded-[10px] border border-[#e8e1cf] bg-white px-3.5">
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
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Issue key veya baslik ile ara..."
              className="h-full flex-1 border-0 bg-transparent text-[14px] text-[#1a1a18] outline-none placeholder:text-[#a8a595]"
            />
          </label>

          {/* Issue list */}
          <div className="overflow-hidden rounded-[14px] border border-[#e8e1cf] bg-white">
            <div className="grid grid-cols-[32px_80px_1fr_100px_80px_100px] items-center gap-2 border-b border-[#e8e1cf] bg-[#fbf8f1] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#a8a595]">
              <span></span>
              <span>Key</span>
              <span>Baslik</span>
              <span>Durum</span>
              <span>Oncelik</span>
              <span>Guncellendi</span>
            </div>
            {filtered.map((issue) => (
              <div
                key={issue.key}
                onClick={() => toggle(issue.key)}
                className="grid cursor-pointer grid-cols-[32px_80px_1fr_100px_80px_100px] items-center gap-2 border-b border-[#f4efe3] px-4 py-3 transition-colors last:border-0 hover:bg-[#fbf8f1]"
                data-selected={selected.has(issue.key) || undefined}
              >
                <span
                  className={`flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border-[1.5px] text-[9px] ${selected.has(issue.key) ? 'border-[#1f6f4e] bg-[#1f6f4e] text-white' : 'border-[#d6d3cb] bg-white'}`}
                >
                  {selected.has(issue.key) && '✓'}
                </span>
                <span className="font-mono text-[12px] font-medium text-[#5c5a52]">
                  {issue.key}
                </span>
                <span className="truncate text-[14px] text-[#1a1a18]">{issue.title}</span>
                <span
                  className="inline-flex w-fit rounded-[4px] px-2 py-0.5 text-[11px] font-medium"
                  style={{
                    background: STATUS_COLORS[issue.status]?.bg,
                    color: STATUS_COLORS[issue.status]?.fg,
                  }}
                >
                  {issue.status}
                </span>
                <span
                  className="inline-flex w-fit rounded-[4px] px-2 py-0.5 text-[11px] font-medium"
                  style={{
                    background: PRI_COLORS[issue.priority]?.bg,
                    color: PRI_COLORS[issue.priority]?.fg,
                  }}
                >
                  {issue.priority}
                </span>
                <span className="text-[12px] text-[#a8a595]">{issue.updated}</span>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-[#a8a595]">{selected.size} issue secildi</p>
        </section>

        {/* Sidebar */}
        <aside className="sticky top-[88px] flex flex-col gap-4 self-start">
          <div className="rounded-[14px] border border-[#e8e1cf] bg-white">
            <div className="border-b border-[#f4efe3] px-[22px] py-3.5">
              <h3 className="text-[14px] font-semibold text-[#1a1a18]">Grup ayarlari</h3>
            </div>
            <div className="flex flex-col gap-4 p-[18px_22px]">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#5c5a52]">Grup adi</label>
                <div className="flex items-center rounded-[10px] border border-[#d6d3cb] bg-white shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] focus-within:border-[#1f6f4e] focus-within:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]">
                  <input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Orn: TRND Sprint 12"
                    className="h-[42px] w-full rounded-[inherit] border-0 bg-transparent px-3.5 text-[15px] text-[#1a1a18] outline-none placeholder:text-[#a8a595]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#5c5a52]">
                  Issue basina senaryo
                </label>
                <div className="inline-flex items-center rounded-[8px] border border-[#e8e1cf]">
                  <button
                    onClick={() => setCount((c) => Math.max(3, c - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-l-[8px] bg-[#fbf8f1] text-[16px] text-[#5c5a52] hover:bg-[#f4efe3] disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="flex h-9 w-12 items-center justify-center border-x border-[#e8e1cf] bg-white text-[14px] font-semibold text-[#1a1a18]">
                    {count}
                  </span>
                  <button
                    onClick={() => setCount((c) => Math.min(30, c + 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-r-[8px] bg-[#fbf8f1] text-[16px] text-[#5c5a52] hover:bg-[#f4efe3] disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[14px] border border-[#d4e9dd] bg-gradient-to-b from-[#ecf5f0] to-white p-5">
            <button
              disabled={selected.size === 0}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#1f6f4e] text-[16px] font-semibold text-[#fffdf8] shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[#1a5a40] disabled:cursor-not-allowed disabled:opacity-55"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 2l1.5 3.5L13 7l-3 2.5.5 4L8 11.5 5.5 13.5l.5-4L3 7l3.5-1.5L8 2z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
              {selected.size} issue&apos;dan uret
            </button>
            <div className="mt-3.5 flex items-center justify-between text-[12px] text-[#7a7868]">
              <span>Tahmini sure</span>
              <strong className="font-medium text-[#1a1a18]">
                ~ {Math.ceil(selected.size * count * 0.4)} sn
              </strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
