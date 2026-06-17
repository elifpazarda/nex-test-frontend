'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

export default function JiraCallbackPage() {
  return (
    <Suspense>
      <CallbackContent />
    </Suspense>
  );
}

function CallbackContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const error = searchParams.get('error');

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-8">
      <div className="w-full max-w-[420px] rounded-[14px] border border-[#e8e1cf] bg-white p-8 text-center">
        {success ? (
          <>
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f3ee] text-[24px] text-[#1f8a5b]">
              ✓
            </span>
            <h1 className="text-[20px] font-semibold text-[#1a1a18]">Jira başarıyla bağlandı</h1>
            <p className="mt-2 text-[14px] text-[#5c5a52]">
              Artık Jira issue&apos;larından test senaryoları üretebilirsiniz.
            </p>
            <Link
              href="/settings/jira"
              className="mt-6 inline-flex h-10 items-center rounded-[8px] bg-[#1f6f4e] px-5 text-[14px] font-semibold text-white no-underline shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4)] hover:bg-[#1a5a40]"
            >
              Ayarlara dön
            </Link>
          </>
        ) : (
          <>
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f7e5e2] text-[24px] text-[#9b2a2a]">
              ✕
            </span>
            <h1 className="text-[20px] font-semibold text-[#1a1a18]">Bağlantı başarısız</h1>
            <p className="mt-2 text-[14px] text-[#5c5a52]">
              {error || 'Jira bağlantısı sırasında bir hata oluştu.'}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                href="/settings/jira"
                className="inline-flex h-10 items-center rounded-[8px] border border-[#d6d3cb] bg-white px-4 text-[13px] font-medium text-[#1a1a18] no-underline shadow-[0_1px_2px_rgba(26,26,24,0.05)] hover:bg-[#fbf8f1]"
              >
                Ayarlara dön
              </Link>
              <Link
                href="/settings/jira"
                className="inline-flex h-10 items-center rounded-[8px] bg-[#1f6f4e] px-4 text-[13px] font-semibold text-white no-underline shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4)] hover:bg-[#1a5a40]"
              >
                Tekrar dene
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
