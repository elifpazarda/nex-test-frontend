'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, AlertCircle } from 'lucide-react';
import { scenariosApi } from '@/lib/api/endpoints/scenarios';
import type { TestFramework } from '@/types/scenario';

const FRAMEWORKS: TestFramework[] = ['cucumber', 'playwright', 'cypress'];

const CATEGORY_LABELS: Record<string, string> = {
  happy_path: 'Happy path',
  edge_case: 'Edge case',
  negative: 'Negative',
};

export default function CodePage({
  params,
}: {
  params: Promise<{ projectId: string; scenarioId: string }>;
}) {
  const { projectId, scenarioId } = use(params);
  const [framework, setFramework] = useState<TestFramework>('cucumber');
  const [copied, setCopied] = useState(false);

  const { data: scenario, isLoading: scenarioLoading } = useQuery({
    queryKey: ['scenario', scenarioId],
    queryFn: () => scenariosApi.getById(scenarioId),
    select: (res) => res.data.data,
  });

  // Secili framework icin BDD kodunu uretir (framework basina cache'lenir)
  const {
    data: bdd,
    isFetching: bddLoading,
    isError: bddError,
  } = useQuery({
    queryKey: ['bdd', scenarioId, framework],
    queryFn: () =>
      scenariosApi.convertToBdd({
        projectId: scenario!.projectId,
        framework,
        scenarios: [
          {
            id: scenario!.id,
            title: scenario!.title,
            category: scenario!.category,
            priority: scenario!.priority,
            preconditions: scenario!.preconditions,
            steps: scenario!.steps,
            expectedResult: scenario!.expectedResult,
          },
        ],
      }),
    select: (res) => res.data.data.results[0],
    enabled: !!scenario,
    staleTime: Infinity,
  });

  function copyCode() {
    if (!bdd?.code) return;
    navigator.clipboard.writeText(bdd.code);
    setCopied(true);
    toast.success('Kod kopyalandı');
    setTimeout(() => setCopied(false), 2000);
  }

  if (scenarioLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="size-6 animate-spin text-[#7a7868]" />
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="mx-auto max-w-[1240px] px-8 py-7">
        <p className="text-[15px] text-[#5c5a52]">Senaryo bulunamadı.</p>
        <Link
          href={`/projects/${projectId}`}
          className="mt-3 inline-block text-[14px] font-medium text-[#1f6f4e] hover:underline"
        >
          ← Projeye dön
        </Link>
      </div>
    );
  }

  const resultsHref = `/projects/${projectId}/results?groupId=${scenario.groupId}`;

  return (
    <div className="mx-auto max-w-[1240px] px-8 py-7 pb-16">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1.5 text-[13px] text-[#7a7868]">
        <Link href="/projects" className="text-[#7a7868] no-underline hover:text-[#1a1a18]">
          Projeler
        </Link>
        <span className="text-[#a8a595]">/</span>
        <Link
          href={`/projects/${projectId}`}
          className="text-[#7a7868] no-underline hover:text-[#1a1a18]"
        >
          {scenario.project?.name ?? 'Proje'}
        </Link>
        <span className="text-[#a8a595]">/</span>
        <Link href={resultsHref} className="text-[#7a7868] no-underline hover:text-[#1a1a18]">
          {scenario.group?.name ?? 'Senaryolar'}
        </Link>
        <span className="text-[#a8a595]">/</span>
        <span className="font-medium text-[#1a1a18]">Kod</span>
      </nav>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1.5 flex items-center gap-2 text-[12px] text-[#a8a595]">
            <span className="text-[#157449]">
              {CATEGORY_LABELS[scenario.category] ?? scenario.category}
            </span>
            <span>·</span>
            <span>öncelik: {scenario.priority}</span>
          </div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#1a1a18]">
            {scenario.title}
          </h1>
        </div>
        <Link
          href={resultsHref}
          className="inline-flex h-8 flex-shrink-0 items-center rounded-[6px] border border-[#d6d3cb] bg-white px-3 text-[12px] font-medium text-[#1a1a18] no-underline shadow-[0_1px_2px_rgba(26,26,24,0.05)] hover:bg-[#fbf8f1]"
        >
          ← Geri
        </Link>
      </div>

      {/* Two-column: Sidebar + Code */}
      <div className="grid grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-[14px] border border-[#e8e1cf] bg-white p-4">
            <h3 className="mb-3 text-[13px] font-semibold text-[#1a1a18]">Senaryo adımları</h3>
            <ol className="flex flex-col gap-1.5">
              {scenario.steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-[12px] text-[#3f3d38]">
                  <span className="text-[#a8a595]">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-[14px] border border-[#e8e1cf] bg-white p-4">
            <h3 className="mb-3 text-[13px] font-semibold text-[#1a1a18]">Detaylar</h3>
            <div className="flex flex-col gap-2 text-[12px]">
              <div className="flex justify-between gap-3">
                <span className="text-[#7a7868]">Kategori</span>
                <span className="font-medium text-[#1a1a18]">{scenario.category}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[#7a7868]">Öncelik</span>
                <span className="font-medium text-[#1a1a18]">{scenario.priority}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[#7a7868]">Kaynak</span>
                <span className="font-mono font-medium text-[#1a1a18]">
                  {scenario.sourceType ?? '—'}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Code block */}
        <div className="overflow-hidden rounded-[14px] border border-[#2a2925]">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-[#3f3d38] bg-[#1a1a18] px-4 py-2.5">
            <div className="flex items-center gap-1">
              {FRAMEWORKS.map((fw) => (
                <button
                  key={fw}
                  type="button"
                  onClick={() => setFramework(fw)}
                  data-active={framework === fw || undefined}
                  className="rounded-[6px] px-3 py-1.5 text-[12px] font-medium capitalize text-[#a8a595] hover:text-[#e8e1cf] data-[active]:bg-[#3f3d38] data-[active]:text-white"
                >
                  {fw}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={copyCode}
              disabled={!bdd?.code}
              className="rounded-[4px] px-2 py-1 text-[11px] font-medium text-[#a8a595] hover:bg-[#3f3d38] hover:text-white disabled:opacity-40"
            >
              {copied ? '✓ Kopyalandı' : 'Kopyala'}
            </button>
          </div>
          {/* Code */}
          <div className="min-h-[320px] bg-[#1a1a18]">
            {bddLoading && (
              <div className="flex items-center justify-center gap-2 py-32 text-[13px] text-[#a8a595]">
                <Loader2 className="size-4 animate-spin" />
                {framework} kodu üretiliyor...
              </div>
            )}
            {bddError && !bddLoading && (
              <div className="flex flex-col items-center justify-center gap-2 py-32 text-[13px] text-[#d99b94]">
                <AlertCircle className="size-5" />
                Kod üretilemedi. Lütfen tekrar deneyin.
              </div>
            )}
            {!bddLoading && !bddError && bdd && (
              <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.7] text-[#e4e4e7]">
                <code>{bdd.code}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
