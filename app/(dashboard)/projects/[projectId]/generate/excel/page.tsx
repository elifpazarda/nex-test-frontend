'use client';

import { useState, use } from 'react';
import Link from 'next/link';

export default function GenerateExcelPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId: id } = use(params);
  const [file, setFile] = useState<File | null>(null);
  const [groupName, setGroupName] = useState('');
  const [count, setCount] = useState(6);

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
        <span className="font-medium text-[#1a1a18]">Excel&apos;den uret</span>
      </nav>

      {/* Hero */}
      <div className="mb-6">
        <h1 className="font-heading text-[32px] font-medium tracking-tight text-[#1a1a18]">
          <em className="font-medium italic text-[#1a5a40]">Excel</em>&apos;den uret
        </h1>
        <p className="mt-1 text-[15px] text-[#5c5a52]">
          Test case&apos;lerini iceren bir .xlsx dosyasi yukle.
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
        <Link
          href={`/projects/${id}/generate/jira`}
          className="rounded-[8px] px-4 py-2 text-[13px] font-medium text-[#5c5a52] no-underline"
        >
          Jira
        </Link>
        <button
          data-active
          className="rounded-[8px] px-4 py-2 text-[13px] font-medium text-[#5c5a52] data-[active]:bg-[#1f6f4e] data-[active]:text-white data-[active]:shadow-[0_1px_3px_rgba(26,26,24,0.06)]"
        >
          Excel
        </button>
        <Link
          href={`/projects/${id}/generate/pdf`}
          className="rounded-[8px] px-4 py-2 text-[13px] font-medium text-[#5c5a52] no-underline"
        >
          PDF
        </Link>
      </nav>

      {/* Two-column grid */}
      <div className="grid grid-cols-[1fr_360px] gap-6">
        {/* Main: Upload area */}
        <section>
          {!file ? (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-[14px] border-[1.5px] border-dashed border-[#d6d3cb] bg-[#fbf8f1] p-12 text-center transition-colors hover:border-[#1f6f4e] hover:bg-[#ecf5f0]">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e8e1cf] bg-white text-[#157449]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2v6h6M8 13h8M8 17h8M8 9h2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <p className="text-[14px] font-semibold text-[#1a1a18]">Excel dosyasi yukle</p>
                <p className="mt-1 text-[12px] text-[#7a7868]">
                  Surukle birak veya tikla · .xlsx · Maks 5MB
                </p>
              </div>
              <input
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          ) : (
            <div className="rounded-[14px] border border-[#e8e1cf] bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#e8f3ee] text-[14px] font-bold text-[#157449]">
                  E
                </span>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-[#1a1a18]">{file.name}</p>
                  <p className="text-[12px] text-[#7a7868]">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="rounded-[6px] px-2 py-1 text-[12px] font-medium text-[#5c5a52] hover:bg-[#f4efe3]"
                >
                  Kaldir
                </button>
              </div>
              {/* Stats */}
              <div className="mt-4 flex gap-3">
                <span className="rounded-full bg-[#e8f3ee] px-2.5 py-1 text-[11px] font-medium text-[#157449]">
                  24 satir
                </span>
                <span className="rounded-full bg-[#ecf5f0] px-2.5 py-1 text-[11px] font-medium text-[#1a5a40]">
                  22 gecerli
                </span>
                <span className="rounded-full bg-[#f5eddb] px-2.5 py-1 text-[11px] font-medium text-[#8a6b16]">
                  2 atlanacak
                </span>
              </div>
              {/* Preview table */}
              <div className="mt-4 overflow-hidden rounded-[10px] border border-[#e8e1cf]">
                <div className="grid grid-cols-[40px_70px_1fr_80px_80px] gap-2 border-b border-[#e8e1cf] bg-[#fbf8f1] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#a8a595]">
                  <span>#</span>
                  <span>ID</span>
                  <span>Baslik</span>
                  <span>Oncelik</span>
                  <span>Modul</span>
                </div>
                {[
                  {
                    n: 1,
                    id: 'TC-01',
                    title: 'Basarili odeme islemi',
                    pri: 'High',
                    mod: 'Payment',
                  },
                  { n: 2, id: 'TC-02', title: 'Suresi dolmus kart', pri: 'High', mod: 'Payment' },
                  { n: 3, id: 'TC-03', title: 'Yetersiz bakiye', pri: 'Medium', mod: 'Payment' },
                  { n: 4, id: 'TC-04', title: 'Gecersiz CVV', pri: 'Medium', mod: 'Validation' },
                ].map((row) => (
                  <div
                    key={row.n}
                    className="grid grid-cols-[40px_70px_1fr_80px_80px] gap-2 border-b border-[#f4efe3] px-3 py-2 text-[13px] last:border-0"
                  >
                    <span className="text-[#a8a595]">{row.n}</span>
                    <span className="font-mono text-[11px] text-[#5c5a52]">{row.id}</span>
                    <span className="text-[#1a1a18]">{row.title}</span>
                    <span className="text-[#5c5a52]">{row.pri}</span>
                    <span className="text-[#7a7868]">{row.mod}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                    placeholder="Otomatik olusturulacak"
                    className="h-[42px] w-full rounded-[inherit] border-0 bg-transparent px-3.5 text-[15px] text-[#1a1a18] outline-none placeholder:text-[#a8a595]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#5c5a52]">
                  Satir basina senaryo
                </label>
                <div className="inline-flex items-center rounded-[8px] border border-[#e8e1cf]">
                  <button
                    onClick={() => setCount((c) => Math.max(1, c - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-l-[8px] bg-[#fbf8f1] text-[16px] text-[#5c5a52] hover:bg-[#f4efe3]"
                  >
                    −
                  </button>
                  <span className="flex h-9 w-12 items-center justify-center border-x border-[#e8e1cf] bg-white text-[14px] font-semibold text-[#1a1a18]">
                    {count}
                  </span>
                  <button
                    onClick={() => setCount((c) => Math.min(20, c + 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-r-[8px] bg-[#fbf8f1] text-[16px] text-[#5c5a52] hover:bg-[#f4efe3]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[14px] border border-[#d4e9dd] bg-gradient-to-b from-[#ecf5f0] to-white p-5">
            <button
              disabled={!file}
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
              Senaryo uret
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
