'use client';

import { useState, use } from 'react';
import Link from 'next/link';

export default function GeneratePdfPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId: id } = use(params);
  const [file, setFile] = useState<File | null>(null);
  const [groupName, setGroupName] = useState('');
  const [count, setCount] = useState(8);

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
        <span className="font-medium text-[#1a1a18]">PDF&apos;den uret</span>
      </nav>

      {/* Hero */}
      <div className="mb-6">
        <h1 className="font-heading text-[32px] font-medium tracking-tight text-[#1a1a18]">
          <em className="font-medium italic text-[#1a5a40]">PDF</em>&apos;den uret
        </h1>
        <p className="mt-1 text-[15px] text-[#5c5a52]">
          PRD veya gereksinim dokumanini yukle, AI gereksinimleri cikarsin.
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
        <Link
          href={`/projects/${id}/generate/excel`}
          className="rounded-[8px] px-4 py-2 text-[13px] font-medium text-[#5c5a52] no-underline"
        >
          Excel
        </Link>
        <button
          data-active
          className="rounded-[8px] px-4 py-2 text-[13px] font-medium text-[#5c5a52] data-[active]:bg-[#1f6f4e] data-[active]:text-white data-[active]:shadow-[0_1px_3px_rgba(26,26,24,0.06)]"
        >
          PDF
        </button>
      </nav>

      {/* Two-column grid */}
      <div className="grid grid-cols-[1fr_360px] gap-6">
        {/* Main: Upload area */}
        <section>
          {!file ? (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-[14px] border-[1.5px] border-dashed border-[#d6d3cb] bg-[#fbf8f1] p-12 text-center transition-colors hover:border-[#1f6f4e] hover:bg-[#ecf5f0]">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e8e1cf] bg-white text-[#b85b1a]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2v6h6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 15h6M9 11h2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <div>
                <p className="text-[14px] font-semibold text-[#1a1a18]">PDF dokumani yukle</p>
                <p className="mt-1 text-[12px] text-[#7a7868]">
                  Surukle birak veya tikla · .pdf · Maks 10MB
                </p>
              </div>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          ) : (
            <div className="flex flex-col gap-4">
              {/* File info */}
              <div className="flex items-center gap-3 rounded-[14px] border border-[#e8e1cf] bg-white p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#fbedd8] text-[14px] font-bold text-[#b85b1a]">
                  P
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

              {/* Page scanning simulation */}
              <div className="rounded-[14px] border border-[#e8e1cf] bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold text-[#1a1a18]">Sayfa taraniyor</h3>
                  <span className="text-[12px] text-[#a8a595]">12 sayfa</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex h-12 items-center justify-center rounded-[6px] border text-[11px] font-medium"
                      style={{
                        background: i < 8 ? '#e8f3ee' : i === 8 ? '#e5eef5' : '#f4efe3',
                        borderColor: i < 8 ? '#d4e9dd' : i === 8 ? '#b8d4e8' : '#e8e1cf',
                        color: i < 8 ? '#157449' : i === 8 ? '#1f5c87' : '#a8a595',
                      }}
                    >
                      {i < 8 ? '✓' : i === 8 ? '...' : i + 1}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[12px] text-[#7a7868]">
                  8 / 12 sayfa tarandi · 14 gereksinim cikarildi
                </p>
              </div>

              {/* Extracted requirements */}
              <div className="rounded-[14px] border border-[#e8e1cf] bg-white p-5">
                <h3 className="mb-3 text-[14px] font-semibold text-[#1a1a18]">
                  Cikarilan gereksinimler
                </h3>
                <div className="flex flex-col gap-2">
                  {[
                    'Kullanici kredi karti ile odeme yapabilmeli',
                    'Odeme basarisiz olursa anlasilir hata mesaji gosterilmeli',
                    '3D Secure dogrulama zaman asiminda islem iptal edilmeli',
                    'Farkli odeme yontemleri arasinda gecis yapilabilmeli',
                    'Odeme sonrasi siparis onay e-postasi gonderilmeli',
                  ].map((req, i) => (
                    <label
                      key={i}
                      className="flex cursor-pointer items-start gap-2.5 rounded-[8px] border border-[#f4efe3] p-3 transition-colors hover:bg-[#fbf8f1]"
                    >
                      <input
                        type="checkbox"
                        defaultChecked
                        className="mt-0.5 h-[16px] w-[16px] rounded-[4px] border-[1.5px] border-[#d6d3cb] accent-[#1f6f4e]"
                      />
                      <span className="text-[13px] text-[#1a1a18]">{req}</span>
                    </label>
                  ))}
                </div>
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
                  Gereksinim basina senaryo
                </label>
                <div className="inline-flex items-center rounded-[8px] border border-[#e8e1cf]">
                  <button
                    onClick={() => setCount((c) => Math.max(3, c - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-l-[8px] bg-[#fbf8f1] text-[16px] text-[#5c5a52] hover:bg-[#f4efe3]"
                  >
                    −
                  </button>
                  <span className="flex h-9 w-12 items-center justify-center border-x border-[#e8e1cf] bg-white text-[14px] font-semibold text-[#1a1a18]">
                    {count}
                  </span>
                  <button
                    onClick={() => setCount((c) => Math.min(30, c + 1))}
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
            <div className="mt-3.5 flex items-center justify-between text-[12px] text-[#7a7868]">
              <span>Tahmini sure</span>
              <strong className="font-medium text-[#1a1a18]">~ 12 sn</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
