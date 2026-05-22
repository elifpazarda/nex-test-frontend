'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Sparkles, FileSpreadsheet, X } from 'lucide-react';
import { projectsApi } from '@/lib/api/endpoints/projects';
import { scenariosApi } from '@/lib/api/endpoints/scenarios';
import { scenarioGroupsApi } from '@/lib/api/endpoints/scenario-groups';
import { getApiErrorMessage } from '@/lib/api/error';
import { generateFileSchema, type GenerateFileFormData } from '@/lib/validations/scenario';
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
  OTHER: 'Diger',
};

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function GenerateExcelPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [file, setFile] = useState<File | null>(null);
  const [generated, setGenerated] = useState<GenerateResponse | null>(null);

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getById(projectId),
    select: (res) => res.data.data,
  });

  const form = useForm<GenerateFileFormData>({
    resolver: zodResolver(generateFileSchema),
    defaultValues: { name: '', type: 'FEATURE' },
  });

  const {
    register,
    getValues,
    formState: { errors },
  } = form;

  function pickFile(f: File | null) {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith('.xlsx')) {
      toast.error('Gecersiz dosya', { description: 'Yalnizca .xlsx dosyalari kabul edilir.' });
      return;
    }
    if (f.size > MAX_SIZE) {
      toast.error('Dosya cok buyuk', { description: 'Excel dosyasi en fazla 5MB olabilir.' });
      return;
    }
    setFile(f);
  }

  // --- Adim 1: Excel'den AI ile uret (kaydetmez) ---
  const generateMutation = useMutation({
    mutationFn: () => scenariosApi.generateFromExcel(projectId, file!),
    onSuccess: (res) => {
      setGenerated(res.data.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (error) => {
      toast.error('Senaryo uretilemedi', {
        description: getApiErrorMessage(error, 'Lutfen tekrar deneyin.'),
        duration: 4000,
      });
    },
  });

  // --- Adim 2: Grup olustur + senaryolari kaydet ---
  const saveMutation = useMutation({
    mutationFn: async () => {
      const { name, type } = getValues();
      const data = generated!;
      const groupRes = await scenarioGroupsApi.create({ name, type, projectId });
      const groupId = groupRes.data.data.id;
      await scenariosApi.save({
        groupId,
        input: data.input,
        sourceType: 'excel',
        sourceRef: file?.name ?? null,
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
        description: getApiErrorMessage(error, 'Lutfen tekrar deneyin.'),
        duration: 4000,
      });
    },
  });

  const onGenerate = form.handleSubmit(() => {
    if (!file) {
      toast.error('Dosya secilmedi', { description: 'Once bir .xlsx dosyasi yukleyin.' });
      return;
    }
    generateMutation.mutate();
  });

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
  // Adim 1 ekrani — Excel yukleme + grup ayarlari
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
        <span className="font-medium text-[#1a1a18]">Excel&apos;den uret</span>
      </nav>

      {/* Hero */}
      <div className="mb-6">
        <h1 className="font-heading text-[32px] font-medium tracking-tight text-[#1a1a18]">
          <em className="font-medium italic text-[#1a5a40]">Excel</em>&apos;den uret
        </h1>
        <p className="mt-1 text-[15px] text-[#5c5a52]">
          Test case&apos;lerini iceren bir .xlsx dosyasi yukle, AI senaryolari uretsin.
        </p>
      </div>

      {/* Source tabs */}
      <GenerateSourceTabs projectId={projectId} active="excel" />

      {/* Two-column grid */}
      <div className="grid grid-cols-[1fr_360px] gap-6">
        {/* Main: Upload area */}
        <section>
          {!file ? (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-[14px] border-[1.5px] border-dashed border-[#d6d3cb] bg-[#fbf8f1] p-12 text-center transition-colors hover:border-[#1f6f4e] hover:bg-[#ecf5f0]">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e8e1cf] bg-white text-[#157449]">
                <FileSpreadsheet className="size-[22px]" />
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
                onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
              />
            </label>
          ) : (
            <div className="rounded-[14px] border border-[#e8e1cf] bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#e8f3ee] text-[#157449]">
                  <FileSpreadsheet className="size-5" />
                </span>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-[#1a1a18]">{file.name}</p>
                  <p className="text-[12px] text-[#7a7868]">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  disabled={generateMutation.isPending}
                  className="rounded-[6px] p-1.5 text-[#5c5a52] hover:bg-[#f4efe3] disabled:opacity-50"
                  aria-label="Dosyayi kaldir"
                >
                  <X className="size-4" />
                </button>
              </div>
              <p className="mt-4 rounded-[10px] bg-[#fbf8f1] px-3.5 py-3 text-[12px] text-[#7a7868]">
                Dosya yuklendi. <strong className="text-[#1a1a18]">Senaryo uret</strong>{' '}
                butonuna basildiginda Excel icerigi AI ile islenecek.
              </p>
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
                <label htmlFor="group-name" className="text-[13px] font-medium text-[#5c5a52]">
                  Grup adi
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
                    placeholder="Orn: Excel · Regression"
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
              disabled={!file || generateMutation.isPending}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#1f6f4e] text-[16px] font-semibold text-[#fffdf8] shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[#1a5a40] active:translate-y-[0.5px] disabled:cursor-not-allowed disabled:opacity-55"
            >
              {generateMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {generateMutation.isPending ? 'Uretiliyor...' : 'Senaryo uret'}
            </button>
            <p className="mt-3 text-center text-[12px] text-[#7a7868]">
              AI senaryolari uretir; kaydetmeden once inceleyebilirsin.
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}
