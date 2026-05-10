'use client';

import { useState } from 'react';

export default function JiraSettingsPage() {
  const [connected, setConnected] = useState(true);

  return (
    <div className="mx-auto max-w-[720px] px-8 py-8 pb-16">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-heading text-[32px] font-medium tracking-tight text-[#1a1a18]">
          Jira <em className="font-medium italic text-[#1a5a40]">Entegrasyonu</em>
        </h1>
        <p className="mt-1 text-[15px] text-[#5c5a52]">
          Atlassian hesabinizi baglayarak Jira issue&apos;larindan test senaryolari uretin.
        </p>
      </div>

      {connected ? (
        /* Connected state */
        <div className="rounded-[14px] border border-[#e8e1cf] bg-white">
          <div className="border-b border-[#f4efe3] px-6 py-5">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#e5eef5] text-[18px] font-bold text-[#1f5c87]">
                J
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-[16px] font-semibold text-[#1a1a18]">Trendyol Workspace</h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3ee] px-2 py-0.5 text-[11px] font-medium text-[#157449]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1f8a5b]" />
                    Bagli
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] text-[#7a7868]">trendyol.atlassian.net</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#5c5a52]">Baglanma tarihi</span>
                <span className="text-[13px] font-medium text-[#1a1a18]">1 May 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#5c5a52]">Son guncelleme</span>
                <span className="text-[13px] font-medium text-[#1a1a18]">8 May 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#5c5a52]">Erisim kapsamı</span>
                <span className="text-[13px] font-medium text-[#1a1a18]">read:jira-work</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#f4efe3] px-6 py-4">
            <button
              onClick={() => setConnected(false)}
              className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#e8e1cf] bg-white px-4 text-[13px] font-medium text-[#9b2a2a] shadow-[0_1px_2px_rgba(26,26,24,0.05)] hover:border-[#f7e5e2] hover:bg-[#f7e5e2]"
            >
              Baglantıyı kes
            </button>
          </div>
        </div>
      ) : (
        /* Disconnected state */
        <div className="rounded-[14px] border border-[#e8e1cf] bg-white p-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#e8e1cf] bg-[#fbf8f1] text-[24px] font-bold text-[#1f5c87]">
            J
          </span>
          <h2 className="text-[18px] font-semibold text-[#1a1a18]">Jira hesabinizi baglayın</h2>
          <p className="mx-auto mt-2 max-w-[400px] text-[14px] text-[#5c5a52]">
            Atlassian hesabinizi baglayarak Jira issue&apos;larindan direkt test senaryolari
            uretebilirsiniz.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              onClick={() => setConnected(true)}
              className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#1f6f4e] px-6 text-[15px] font-semibold text-[#fffdf8] shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[#1a5a40]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1v6m0 0l2.5-2.5M8 7L5.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 10v2a3 3 0 003 3h8a3 3 0 003-3v-2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Jira&apos;ya baglan
            </button>
            <p className="text-[12px] text-[#a8a595]">Atlassian OAuth 2.0 ile guvenli baglanir</p>
          </div>

          <div className="mt-8 border-t border-[#f4efe3] pt-6">
            <h3 className="mb-3 text-[13px] font-semibold text-[#1a1a18]">
              Entegrasyon ne saglar?
            </h3>
            <div className="mx-auto grid max-w-[420px] grid-cols-2 gap-3 text-left">
              {[
                "Jira issue'larindan senaryo uret",
                'Issue key ile direkt erisim',
                'Proje ve sprint filtreleme',
                'Xray formatinda export',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-[12px] text-[#5c5a52]">
                  <span className="mt-0.5 text-[#1f8a5b]">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
