'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Sparkles, Plug, AlertTriangle } from 'lucide-react';
import { projectsApi } from '@/lib/api/endpoints/projects';
import { scenariosApi } from '@/lib/api/endpoints/scenarios';
import { scenarioGroupsApi } from '@/lib/api/endpoints/scenario-groups';
import { jiraApi } from '@/lib/api/endpoints/jira';
import { getApiErrorMessage } from '@/lib/api/error';
import { generateJiraSchema, type GenerateJiraFormData } from '@/lib/validations/scenario';
import { SCENARIO_GROUP_TYPES } from '@/types/scenario-group';
import type { GenerateResponse } from '@/types/scenario';
import { ScenarioReview } from '@/components/shared/scenario-review';
import { GenerateSourceTabs } from '@/components/shared/generate-source-tabs';

const GROUP_TYPE_LABELS: Record<string, string> = {
  FEATURE: 'Feature',
  REGRESSION: 'Regression',
  BUG: 'Bug',
  SMOKE: 'Smoke',
  INTEGRATION: 'Integration',
  E2E: 'E2E',
  PERFORMANCE: 'Performance',
  OTHER: 'Diğer',
};

export default function GenerateJiraPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [generated, setGenerated] = useState<GenerateResponse | null>(null);

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getById(projectId),
    select: (res) => res.data.data,
  });

  // Jira baglantisi yoksa backend 404 doner — retry kapali
  const {
    data: connection,
    isLoading: connectionLoading,
    isError: connectionMissing,
  } = useQuery({
    queryKey: ['jira-connection'],
    queryFn: () => jiraApi.getConnection(),
    select: (res) => res.data.data,
    retry: false,
  });

  const form = useForm<GenerateJiraFormData>({
    resolver: zodResolver(generateJiraSchema),
    defaultValues: { name: '', type: 'FEATURE', issueKey: '' },
  });

  const {
    register,
    getValues,
    formState: { errors },
  } = form;

  // --- Adim 1: Jira issue'dan AI ile uret (kaydetmez) ---
  const generateMutation = useMutation({
    mutationFn: (data: GenerateJiraFormData) =>
      scenariosApi.generateFromJira({ projectId, issueKey: data.issueKey }),
    onSuccess: (res) => {
      setGenerated(res.data.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (error) => {
      toast.error('Senaryo üretilemedi', {
        description: getApiErrorMessage(error, 'Lütfen tekrar deneyin.'),
        duration: 4000,
      });
    },
  });

  // --- Adim 2: Grup olustur + senaryolari kaydet ---
  const saveMutation = useMutation({
    mutationFn: async () => {
      const { name, type, issueKey } = getValues();
      const data = generated!;
      const groupRes = await scenarioGroupsApi.create({ name, type, projectId });
      const groupId = groupRes.data.data.id;
      await scenariosApi.save({
        groupId,
        input: data.input,
        sourceType: 'jira',
        sourceRef: issueKey,
        scenarios: data.scenarios.map((s) => ({
          title: s.title,
          category: s.category,
          priority: s.priority,
          preconditions: s.preconditions,
          steps: s.steps,
          expectedResult: s.expectedResult,
        })),
      });
      return groupId;
    },
    onSuccess: (groupId) => {
      toast.success('Senaryo grubu kaydedildi');
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      queryClient.invalidateQueries({ queryKey: ['scenario-groups', projectId] });
      router.push(`/projects/${projectId}/results?groupId=${groupId}`);
    },
    onError: (error) => {
      toast.error('Kaydedilemedi', {
        description: getApiErrorMessage(error, 'Lütfen tekrar deneyin.'),
        duration: 4000,
      });
    },
  });

  const onGenerate = form.handleSubmit((data) => generateMutation.mutate(data));

  // ===========================================================================
  // Adim 2 ekrani — uretilen senaryolari incele ve kaydet
  // ===========================================================================
  if (generated) {
    return (
      <ScenarioReview
        projectId={projectId}
        projectName={project?.name ?? 'Proje'}
        groupName={getValues('name')}
        scenarios={generated.scenarios}
        isSaving={saveMutation.isPending}
        onBack={() => setGenerated(null)}
        onSave={() => saveMutation.mutate()}
      />
    );
  }

  // ===========================================================================
  // Adim 1 ekrani — Jira issue key + grup ayarlari
  // ===========================================================================
  return (
    <form onSubmit={onGenerate} className="mx-auto max-w-[1280px] px-8 py-7 pb-20">
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
          {project?.name ?? 'Proje'}
        </Link>
        <span className="text-[#a8a595]">/</span>
        <span className="font-medium text-[#1a1a18]">Jira&apos;dan üret</span>
      </nav>

      {/* Hero */}
      <div className="mb-6">
        <h1 className="font-heading text-[32px] font-medium tracking-tight text-[#1a1a18]">
          <em className="font-medium italic text-[#1a5a40]">Jira</em>&apos;dan üret
        </h1>
        <p className="mt-1 text-[15px] text-[#5c5a52]">
          Bir issue key gir, NexTest o issue&apos;dan senaryoları otomatik üretsin.
        </p>
      </div>

      {/* Source tabs */}
      <GenerateSourceTabs projectId={projectId} active="jira" />

      {/* Two-column grid */}
      <div className="grid grid-cols-[1fr_360px] gap-6">
        {/* Main: connection + issue key */}
        <section className="flex flex-col gap-4">
          {/* Connection status */}
          {connectionLoading ? (
            <div className="flex items-center gap-2 rounded-[12px] border border-[#e8e1cf] bg-white px-4 py-3 text-[13px] text-[#7a7868]">
              <Loader2 className="size-4 animate-spin" />
              Jira bağlantısı kontrol ediliyor...
            </div>
          ) : connectionMissing || !connection ? (
            <div className="flex items-start gap-3 rounded-[12px] border border-[#f0d9a8] bg-[#fbf3df] px-4 py-3">
              <AlertTriangle className="mt-0.5 size-4 flex-shrink-0 text-[#8a6b16]" />
              <div className="flex-1">
                <p className="text-[13px] font-medium text-[#1a1a18]">Jira bağlantısı yok</p>
                <p className="mt-0.5 text-[12px] text-[#7a7868]">
                  Issue&apos;dan senaryo üretmek için önce Jira hesabını bağlaman gerekir.
                </p>
              </div>
              <Link
                href="/settings/jira"
                className="flex-shrink-0 rounded-[8px] bg-[#1f6f4e] px-3 py-1.5 text-[12px] font-semibold text-white no-underline hover:bg-[#1a5a40]"
              >
                Jira&apos;yı bağla
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-[12px] border border-[#d4e9dd] bg-[#ecf5f0] px-4 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-white text-[#1f5c87]">
                <Plug className="size-4" />
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-[#1a1a18]">{connection.siteName}</p>
                <p className="text-[11px] text-[#5c5a52]">{connection.siteUrl} · Bağlantı aktif</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-[#1f8a5b]" />
            </div>
          )}

          {/* Issue key input */}
          <div className="overflow-hidden rounded-[14px] border border-[#e8e1cf] bg-white">
            <div className="border-b border-[#f4efe3] px-[22px] py-3.5">
              <h3 className="text-[14px] font-semibold text-[#1a1a18]">Jira issue</h3>
            </div>
            <div className="flex flex-col gap-2 p-[18px_22px]">
              <label htmlFor="issue-key" className="text-[13px] font-medium text-[#5c5a52]">
                Issue key
              </label>
              <div
                className={`flex items-center rounded-[10px] border bg-white shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] ${
                  errors.issueKey
                    ? 'border-[#c0392b] shadow-[0_0_0_4px_rgba(192,57,43,0.1)]'
                    : 'border-[#d6d3cb] focus-within:border-[#1f6f4e] focus-within:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]'
                }`}
              >
                <input
                  id="issue-key"
                  {...register('issueKey')}
                  placeholder="Örn: TRND-142"
                  autoCapitalize="characters"
                  className="h-[42px] w-full rounded-[inherit] border-0 bg-transparent px-3.5 font-mono text-[15px] uppercase text-[#1a1a18] outline-none placeholder:font-sans placeholder:normal-case placeholder:text-[#a8a595]"
                />
              </div>
              {errors.issueKey ? (
                <p className="text-[12px] text-[#9b2a2a]">{errors.issueKey.message}</p>
              ) : (
                <p className="text-[12px] text-[#a8a595]">
                  Senaryolar bu issue&apos;nun özet ve açıklamasından üretilir.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="sticky top-[88px] flex flex-col gap-4 self-start">
          <div className="rounded-[14px] border border-[#e8e1cf] bg-white">
            <div className="border-b border-[#f4efe3] px-[22px] py-3.5">
              <h3 className="text-[14px] font-semibold text-[#1a1a18]">Grup ayarları</h3>
            </div>
            <div className="flex flex-col gap-4 p-[18px_22px]">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="group-name" className="text-[13px] font-medium text-[#5c5a52]">
                  Grup adı
                </label>
                <div
                  className={`flex items-center rounded-[10px] border bg-white shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] ${
                    errors.name
                      ? 'border-[#c0392b] shadow-[0_0_0_4px_rgba(192,57,43,0.1)]'
                      : 'border-[#d6d3cb] focus-within:border-[#1f6f4e] focus-within:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]'
                  }`}
                >
                  <input
                    id="group-name"
                    {...register('name')}
                    placeholder="Örn: TRND-142 Senaryoları"
                    className="h-[42px] w-full rounded-[inherit] border-0 bg-transparent px-3.5 text-[15px] text-[#1a1a18] outline-none placeholder:text-[#a8a595]"
                  />
                </div>
                {errors.name && (
                  <p className="text-[12px] text-[#9b2a2a]">{errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="group-type" className="text-[13px] font-medium text-[#5c5a52]">
                  Tip
                </label>
                <select
                  id="group-type"
                  {...register('type')}
                  className="h-[42px] w-full appearance-none rounded-[10px] border border-[#d6d3cb] bg-white px-3.5 text-[15px] text-[#1a1a18] shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] outline-none focus:border-[#1f6f4e] focus:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]"
                >
                  {SCENARIO_GROUP_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {GROUP_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-[14px] border border-[#d4e9dd] bg-gradient-to-b from-[#ecf5f0] to-white p-5">
            <button
              type="submit"
              disabled={generateMutation.isPending || connectionMissing || !connection}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#1f6f4e] text-[16px] font-semibold text-[#fffdf8] shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[#1a5a40] active:translate-y-[0.5px] disabled:cursor-not-allowed disabled:opacity-55"
            >
              {generateMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {generateMutation.isPending ? 'Üretiliyor...' : 'Senaryo üret'}
            </button>
            <p className="mt-3 text-center text-[12px] text-[#7a7868]">
              AI senaryoları üretir; kaydetmeden önce inceleyebilirsin.
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}
