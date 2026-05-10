'use client';

import { useState, use } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  { id: 'happy', label: 'Happy path' },
  { id: 'edge', label: 'Edge case' },
  { id: 'negative', label: 'Negative' },
];

const SUGGESTIONS = ['Sepet · Odeme', 'Login akisi', 'Arama filtresi', 'Uyelik yonetimi'];

export default function GenerateTextPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [text, setText] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupType, setGroupType] = useState('feature');
  const [cats, setCats] = useState<Record<string, boolean>>({
    happy: true,
    edge: true,
    negative: true,
  });
  const [priority, setPriority] = useState('all');
  const [count, setCount] = useState(12);
  const [phase, setPhase] = useState<'idle' | 'generating' | 'done'>('idle');

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

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
        <span className="font-medium text-[#1a1a18]">Yeni grup olustur</span>
      </nav>

      {/* Hero */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-heading text-[32px] font-medium tracking-tight text-[#1a1a18]">
            <em className="font-medium italic text-[#1a5a40]">Senaryo</em> uret
          </h1>
          <p className="mt-1 text-[15px] text-[#5c5a52]">
            Bir paragraf yapistir, NexTest senin icin BDD senaryolari hazirlasin.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-[8px] px-3 py-2 text-[13px] font-medium text-[#5c5a52] hover:bg-[#f4efe3]">
            Ornek doldur
          </button>
          <Link
            href={`/projects/${id}`}
            className="rounded-[8px] px-3 py-2 text-[13px] font-medium text-[#5c5a52] no-underline hover:bg-[#f4efe3]"
          >
            Vazgec
          </Link>
        </div>
      </div>

      {/* Source tabs */}
      <nav className="mb-6 inline-flex gap-1 rounded-[10px] bg-[#f4efe3] p-1">
        {[
          { label: 'Metin', active: true },
          { label: 'Jira', active: false },
          { label: 'Excel', active: false },
          { label: 'PDF', active: false },
        ].map((tab) => (
          <button
            key={tab.label}
            data-active={tab.active || undefined}
            className="rounded-[8px] px-4 py-2 text-[13px] font-medium text-[#5c5a52] data-[active]:bg-[#1f6f4e] data-[active]:text-white data-[active]:shadow-[0_1px_3px_rgba(26,26,24,0.06)]"
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Two-column grid */}
      <div className="grid grid-cols-[1fr_360px] gap-6">
        {/* Main: Textarea card */}
        <section>
          <div className="overflow-hidden rounded-[14px] border border-[#e8e1cf] bg-white">
            <div className="flex items-center justify-between border-b border-[#f4efe3] px-[22px] py-3.5">
              <h3 className="text-[14px] font-semibold text-[#1a1a18]">Kaynak metin</h3>
              <span className="text-[12px] text-[#a8a595]">
                PRD, gereksinim notu, kullanici hikayesi...
              </span>
            </div>
            <div className="relative p-[18px_22px]">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Orn: Kullanici sepete urun ekledikten sonra odeme sayfasina gecis yapar. Kredi karti, banka karti veya havale ile odeme yapabilir..."
                className="min-h-[280px] w-full resize-y border-0 bg-transparent text-[15px] leading-relaxed text-[#1a1a18] outline-none placeholder:text-[#a8a595]"
              />
              <div className="absolute bottom-5 right-6 text-[12px] text-[#a8a595]">
                {wordCount} kelime · {charCount} karakter
              </div>
            </div>
            {/* Suggestions */}
            <div className="border-t border-[#f4efe3] px-[22px] py-3">
              <span className="mr-2 text-[12px] text-[#a8a595]">Hizli baslik onerileri →</span>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setGroupName(s)}
                  className="mr-1.5 rounded-full border border-[#e8e1cf] bg-[#fbf8f1] px-2.5 py-1 text-[11px] font-medium text-[#5c5a52] hover:border-[#1f6f4e] hover:bg-[#ecf5f0] hover:text-[#1f6f4e]"
                >
                  {s}
                </button>
              ))}
            </div>
            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[#f4efe3] bg-[#fbf8f1] px-[22px] py-2.5 text-[12px] text-[#a8a595]">
              <span>
                Ipucu:{' '}
                <span className="inline-flex h-[18px] items-center rounded border border-[#d6d3cb] bg-white px-1 text-[10px] font-medium text-[#5c5a52]">
                  ⌘
                </span>{' '}
                +{' '}
                <span className="inline-flex h-[18px] items-center rounded border border-[#d6d3cb] bg-white px-1 text-[10px] font-medium text-[#5c5a52]">
                  Enter
                </span>{' '}
                ile uret
              </span>
              <span>{charCount < 30 ? 'En az 30 karakter gerekli' : 'Hazir'}</span>
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="sticky top-[88px] flex flex-col gap-4 self-start">
          {/* Group settings */}
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
                    placeholder="Orn: Sepet · Odeme"
                    className="h-[42px] w-full rounded-[inherit] border-0 bg-transparent px-3.5 text-[15px] text-[#1a1a18] outline-none placeholder:text-[#a8a595]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#5c5a52]">Tip</label>
                <select
                  value={groupType}
                  onChange={(e) => setGroupType(e.target.value)}
                  className="h-[42px] w-full appearance-none rounded-[10px] border border-[#d6d3cb] bg-white px-3.5 text-[15px] text-[#1a1a18] shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] outline-none focus:border-[#1f6f4e] focus:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]"
                >
                  <option value="feature">Feature</option>
                  <option value="integration">Integration</option>
                  <option value="regression">Regression</option>
                  <option value="smoke">Smoke</option>
                  <option value="e2e">E2E</option>
                  <option value="bug">Bug</option>
                  <option value="performance">Performance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Generation settings */}
          <div className="rounded-[14px] border border-[#e8e1cf] bg-white">
            <div className="border-b border-[#f4efe3] px-[22px] py-3.5">
              <h3 className="text-[14px] font-semibold text-[#1a1a18]">Uretim ayarlari</h3>
            </div>
            <div className="flex flex-col gap-5 p-[18px_22px]">
              {/* Categories */}
              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#5c5a52]">
                  Kategoriler
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCats((prev) => ({ ...prev, [c.id]: !prev[c.id] }))}
                      data-active={cats[c.id] || undefined}
                      className="flex items-center gap-1.5 rounded-[8px] border border-[#e8e1cf] bg-[#fbf8f1] px-2.5 py-2 text-[12px] font-medium text-[#5c5a52] data-[active]:border-[#1f6f4e] data-[active]:bg-[#ecf5f0] data-[active]:text-[#1a5a40]"
                    >
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border border-current text-[9px]">
                        {cats[c.id] && '✓'}
                      </span>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Priority */}
              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#5c5a52]">Oncelik</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="h-[42px] w-full appearance-none rounded-[10px] border border-[#d6d3cb] bg-white px-3.5 text-[15px] text-[#1a1a18] shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] outline-none focus:border-[#1f6f4e] focus:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]"
                >
                  <option value="all">Otomatik (AI belirlesin)</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <p className="mt-1.5 text-[11px] text-[#a8a595]">
                  Uretilen senaryolara oncelik etiketi atanir.
                </p>
              </div>
              {/* Count */}
              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#5c5a52]">
                  Senaryo sayisi
                </label>
                <div className="inline-flex items-center gap-0 rounded-[8px] border border-[#e8e1cf]">
                  <button
                    onClick={() => setCount((c) => Math.max(3, c - 1))}
                    disabled={count <= 3}
                    className="flex h-9 w-9 items-center justify-center rounded-l-[8px] bg-[#fbf8f1] text-[16px] text-[#5c5a52] hover:bg-[#f4efe3] disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="flex h-9 w-12 items-center justify-center border-x border-[#e8e1cf] bg-white text-[14px] font-semibold text-[#1a1a18]">
                    {count}
                  </span>
                  <button
                    onClick={() => setCount((c) => Math.min(30, c + 1))}
                    disabled={count >= 30}
                    className="flex h-9 w-9 items-center justify-center rounded-r-[8px] bg-[#fbf8f1] text-[16px] text-[#5c5a52] hover:bg-[#f4efe3] disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-[#a8a595]">3 – 30 arasi</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-[14px] border border-[#d4e9dd] bg-gradient-to-b from-[#ecf5f0] to-white p-5">
            <button
              disabled={charCount < 30 || phase === 'generating'}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#1f6f4e] text-[16px] font-semibold text-[#fffdf8] shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[#1a5a40] active:translate-y-[0.5px] active:bg-[#154832] disabled:cursor-not-allowed disabled:opacity-55"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 2l1.5 3.5L13 7l-3 2.5.5 4L8 11.5 5.5 13.5l.5-4L3 7l3.5-1.5L8 2z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
              {phase === 'generating' ? 'Uretiliyor...' : 'Senaryo uret'}
            </button>
            <div className="mt-3.5 flex items-center justify-between text-[12px] text-[#7a7868]">
              <span>Tahmini sure</span>
              <strong className="font-medium text-[#1a1a18]">~ {Math.ceil(count * 0.4)} sn</strong>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[12px] text-[#7a7868]">
              <span>AI kotasi kullanimi</span>
              <strong className="font-medium text-[#1a1a18]">{count} / 1.392</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
