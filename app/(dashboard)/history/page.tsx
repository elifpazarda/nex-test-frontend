'use client';

import { useState } from 'react';

const HISTORY_DATA = [
  {
    day: 'Bugun',
    date: '10 May 2026',
    runs: 3,
    scenarios: 24,
    items: [
      {
        id: 'h1',
        title: 'Sepet · Odeme — Q2 PRD',
        project: 'Trendyol Checkout',
        source: 'text',
        duration: '4.2 sn',
        user: 'AC',
        scenarios: 12,
        time: '14:32',
        status: 'ok',
      },
      {
        id: 'h2',
        title: 'Kargo takip regresyon',
        project: 'Trendyol Checkout',
        source: 'jira',
        duration: '6.1 sn',
        user: 'MO',
        scenarios: 8,
        time: '11:15',
        status: 'ok',
      },
      {
        id: 'h3',
        title: 'Login edge case analizi',
        project: 'Pazarama Auth',
        source: 'text',
        duration: '2.8 sn',
        user: 'AC',
        scenarios: 4,
        time: '09:45',
        status: 'warn',
      },
    ],
  },
  {
    day: 'Dun',
    date: '9 May 2026',
    runs: 2,
    scenarios: 18,
    items: [
      {
        id: 'h4',
        title: 'Uyelik akisi negatif testler',
        project: 'Trendyol Checkout',
        source: 'text',
        duration: '5.5 sn',
        user: 'AC',
        scenarios: 10,
        time: '16:20',
        status: 'ok',
      },
      {
        id: 'h5',
        title: 'Arama filtre smoke',
        project: 'HepsiBurada Search',
        source: 'excel',
        duration: '8.3 sn',
        user: 'SD',
        scenarios: 8,
        time: '10:00',
        status: 'ok',
      },
    ],
  },
  {
    day: 'Onceki',
    date: '7 May 2026',
    runs: 1,
    scenarios: 6,
    items: [
      {
        id: 'h6',
        title: 'Performans limitleri',
        project: 'Trendyol Checkout',
        source: 'pdf',
        duration: '12.1 sn',
        user: 'EK',
        scenarios: 6,
        time: '14:00',
        status: 'fail',
      },
    ],
  },
];

const SOURCE_COLORS: Record<string, { fg: string; bg: string }> = {
  text: { fg: '#1a5a40', bg: '#ecf5f0' },
  jira: { fg: '#1f5c87', bg: '#e5eef5' },
  excel: { fg: '#157449', bg: '#e8f3ee' },
  pdf: { fg: '#b85b1a', bg: '#fbedd8' },
};

const STATUS_COLORS: Record<string, { fg: string; bg: string }> = {
  ok: { fg: '#157449', bg: '#e8f3ee' },
  warn: { fg: '#8a6b16', bg: '#f5eddb' },
  fail: { fg: '#9b2a2a', bg: '#f7e5e2' },
};

export default function HistoryPage() {
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [q, setQ] = useState('');

  return (
    <div className="mx-auto max-w-[1240px] px-8 py-8 pb-16">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-heading text-[32px] font-medium tracking-tight text-[#1a1a18]">
          <em className="font-medium italic text-[#1a5a40]">Gecmis</em> tum uretimler
        </h1>
        <p className="mt-1 text-[15px] text-[#5c5a52]">
          Tum AI uretim gecmisini buradan takip edebilirsin.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-4 gap-px overflow-hidden rounded-[14px] border border-[#e8e1cf] bg-[#e8e1cf]">
        {[
          { label: 'Bu hafta uretilen', value: '48', delta: '+23% gecen haftaya gore' },
          { label: 'Onay orani', value: '%87', delta: '42 / 48 senaryo korundu' },
          { label: 'Bugun', value: '24', delta: '3 calistirma · ort. 4.4 sn' },
          { label: 'Basari orani', value: '%94', delta: '45 basarili / 48 toplam' },
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
        <label className="flex h-9 w-[220px] items-center gap-2 rounded-[8px] border border-[#e8e1cf] bg-white px-3">
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
            placeholder="Gecmiste ara..."
            className="h-full flex-1 border-0 bg-transparent text-[13px] text-[#1a1a18] outline-none placeholder:text-[#a8a595]"
          />
        </label>
        <div className="flex items-center gap-1">
          {[
            { id: null, label: 'Tumu' },
            { id: 'text', label: 'Metin' },
            { id: 'jira', label: 'Jira' },
            { id: 'excel', label: 'Excel' },
            { id: 'pdf', label: 'PDF' },
          ].map((f) => (
            <button
              key={f.label}
              onClick={() => setSourceFilter(f.id)}
              data-active={sourceFilter === f.id || undefined}
              className="rounded-full border border-[#e8e1cf] bg-white px-3 py-1.5 text-[12px] font-medium text-[#5c5a52] hover:border-[#d6d3cb] data-[active]:border-[#1f6f4e] data-[active]:bg-[#ecf5f0] data-[active]:text-[#1a5a40]"
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* History grouped by day */}
      <div className="flex flex-col gap-8">
        {HISTORY_DATA.map((day) => {
          const filteredItems = day.items.filter((item) => {
            if (sourceFilter && item.source !== sourceFilter) return false;
            if (q && !item.title.toLowerCase().includes(q.toLowerCase())) return false;
            return true;
          });
          if (filteredItems.length === 0) return null;
          return (
            <section key={day.day}>
              {/* Day header */}
              <div className="mb-3 flex items-center gap-3">
                <h2 className="font-heading text-[18px] font-medium italic text-[#1a1a18]">
                  {day.day}
                </h2>
                <span className="text-[12px] text-[#a8a595]">{day.date}</span>
                <span className="text-[12px] text-[#a8a595]">
                  · {day.runs} calistirma · {day.scenarios} senaryo
                </span>
              </div>
              {/* Rows */}
              <div className="flex flex-col gap-2">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-[12px] border border-[#e8e1cf] bg-white px-4 py-3 transition-colors hover:bg-[#fbf8f1]"
                  >
                    {/* Source icon */}
                    <span
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[8px] text-[12px] font-semibold"
                      style={{
                        background: SOURCE_COLORS[item.source]?.bg,
                        color: SOURCE_COLORS[item.source]?.fg,
                      }}
                    >
                      {item.source[0].toUpperCase()}
                    </span>
                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[14px] font-medium text-[#1a1a18]">
                        {item.title}
                      </h3>
                      <div className="mt-0.5 flex items-center gap-3 text-[12px] text-[#7a7868]">
                        <span>{item.project}</span>
                        <span>·</span>
                        <span>{item.source}</span>
                        <span>·</span>
                        <span>{item.duration}</span>
                        <span>·</span>
                        <span>{item.user}</span>
                      </div>
                    </div>
                    {/* Scenario count */}
                    <span className="text-[14px] font-medium text-[#1a1a18]">{item.scenarios}</span>
                    {/* Status */}
                    <span
                      className="rounded-[4px] px-2 py-0.5 text-[11px] font-medium"
                      style={{
                        background: STATUS_COLORS[item.status]?.bg,
                        color: STATUS_COLORS[item.status]?.fg,
                      }}
                    >
                      {item.status === 'ok'
                        ? 'Basarili'
                        : item.status === 'warn'
                          ? 'Uyari'
                          : 'Hata'}
                    </span>
                    {/* Time */}
                    <span className="text-[12px] text-[#a8a595]">{item.time}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
