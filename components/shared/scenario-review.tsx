import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';
import type { GeneratedScenario } from '@/types/scenario';

const CATEGORY_LABELS: Record<string, string> = {
  happy_path: 'Happy path',
  edge_case: 'Edge case',
  negative: 'Negative',
};

const PRIORITY_LABELS: Record<string, string> = {
  critical: 'Kritik',
  high: 'Yuksek',
  medium: 'Orta',
  low: 'Dusuk',
};

interface ScenarioReviewProps {
  projectId: string;
  projectName: string;
  groupName: string;
  scenarios: GeneratedScenario[];
  isSaving: boolean;
  onBack: () => void;
  onSave: () => void;
}

/** Uretilen senaryolari kaydetmeden once inceleme ekrani — tum generate akislarinda ortak */
export function ScenarioReview({
  projectId,
  projectName,
  groupName,
  scenarios,
  isSaving,
  onBack,
  onSave,
}: ScenarioReviewProps) {
  return (
    <div className="mx-auto max-w-[920px] px-8 py-7 pb-24">
      <nav className="mb-5 flex items-center gap-1.5 text-[13px] text-[#7a7868]">
        <Link href="/projects" className="text-[#7a7868] no-underline hover:text-[#1a1a18]">
          Projeler
        </Link>
        <span className="text-[#a8a595]">/</span>
        <Link
          href={`/projects/${projectId}`}
          className="text-[#7a7868] no-underline hover:text-[#1a1a18]"
        >
          {projectName}
        </Link>
        <span className="text-[#a8a595]">/</span>
        <span className="font-medium text-[#1a1a18]">Senaryolari incele</span>
      </nav>

      <div className="mb-6">
        <h1 className="font-heading text-[32px] font-medium tracking-tight text-[#1a1a18]">
          <em className="font-medium italic text-[#1a5a40]">{scenarios.length}</em> senaryo uretildi
        </h1>
        <p className="mt-1 text-[15px] text-[#5c5a52]">
          Inceleyin; uygunsa <strong>{groupName}</strong> grubu olarak kaydedin.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {scenarios.map((s, i) => (
          <article
            key={s.id}
            className="overflow-hidden rounded-[14px] border border-[#e8e1cf] bg-white"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#f4efe3] px-[22px] py-3.5">
              <h3 className="text-[15px] font-semibold text-[#1a1a18]">
                <span className="mr-2 text-[#a8a595]">{i + 1}.</span>
                {s.title}
              </h3>
              <div className="flex flex-shrink-0 items-center gap-1.5">
                <span className="rounded-full bg-[#f4efe3] px-2 py-0.5 text-[11px] font-medium text-[#5c5a52]">
                  {CATEGORY_LABELS[s.category] ?? s.category}
                </span>
                <span className="rounded-full bg-[#ecf5f0] px-2 py-0.5 text-[11px] font-medium text-[#1a5a40]">
                  {PRIORITY_LABELS[s.priority] ?? s.priority}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 px-[22px] py-4 text-[14px]">
              {s.preconditions && (
                <div>
                  <span className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#a8a595]">
                    On kosul
                  </span>
                  <p className="mt-0.5 text-[#5c5a52]">{s.preconditions}</p>
                </div>
              )}
              <div>
                <span className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#a8a595]">
                  Adimlar
                </span>
                <ol className="mt-1 flex flex-col gap-1">
                  {s.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-2 text-[#1a1a18]">
                      <span className="text-[#a8a595]">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <span className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#a8a595]">
                  Beklenen sonuc
                </span>
                <p className="mt-0.5 text-[#1a1a18]">{s.expectedResult}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 mt-6 flex items-center justify-between gap-3 rounded-[14px] border border-[#e8e1cf] bg-[#fbf8f1] px-5 py-3.5 shadow-[0_-4px_16px_-8px_rgba(26,26,24,0.18)]">
        <button
          type="button"
          onClick={onBack}
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 rounded-[8px] px-3 py-2 text-[13px] font-medium text-[#5c5a52] hover:bg-[#f4efe3] disabled:opacity-50"
        >
          <ArrowLeft className="size-4" />
          Forma don
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-[#1f6f4e] px-6 text-[15px] font-semibold text-[#fffdf8] shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4)] hover:bg-[#1a5a40] active:translate-y-[0.5px] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {isSaving && <Loader2 className="size-4 animate-spin" />}
          {isSaving ? 'Kaydediliyor...' : 'Grup olarak kaydet'}
        </button>
      </div>
    </div>
  );
}
