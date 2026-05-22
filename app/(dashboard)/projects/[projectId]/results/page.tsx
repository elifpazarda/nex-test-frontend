'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Loader2, FolderOpen, FileSpreadsheet, Download } from 'lucide-react';
import { projectsApi } from '@/lib/api/endpoints/projects';
import { scenarioGroupsApi } from '@/lib/api/endpoints/scenario-groups';
import { scenariosApi } from '@/lib/api/endpoints/scenarios';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { ImportExcelDialog } from './_components/import-excel-dialog';
import { ExportDialog } from './_components/export-dialog';
import { ScenarioExportMenu } from './_components/scenario-export-menu';
import type { TestScenario } from '@/types/scenario';
import type { ApiErrorResponse } from '@/types/api';

const CAT_STYLE: Record<string, { fg: string; bg: string }> = {
  happy_path: { fg: '#157449', bg: '#e8f3ee' },
  edge_case: { fg: '#8a6b16', bg: '#f5eddb' },
  negative: { fg: '#9b2a2a', bg: '#f7e5e2' },
};

const PRI_STYLE: Record<string, { fg: string; bg: string }> = {
  critical: { fg: '#ffffff', bg: '#9b2a2a' },
  high: { fg: '#c0392b', bg: '#fbe5df' },
  medium: { fg: '#8a6b16', bg: '#f5eddb' },
  low: { fg: '#3f3d38', bg: '#f4efe3' },
};

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

/** AxiosError'dan kullaniciya gosterilecek mesaji cikar */
function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError && error.response?.data) {
    const msg = (error.response.data as ApiErrorResponse).error?.message;
    if (msg) return Array.isArray(msg) ? msg.join(', ') : msg;
  }
  return fallback;
}

export default function ResultsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const searchParams = useSearchParams();
  const groupId = searchParams.get('groupId');
  const queryClient = useQueryClient();

  const [deleteTarget, setDeleteTarget] = useState<TestScenario | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getById(projectId),
    select: (res) => res.data.data,
  });

  const { data: group } = useQuery({
    queryKey: ['scenario-group', groupId],
    queryFn: () => scenarioGroupsApi.getById(groupId!),
    select: (res) => res.data.data,
    enabled: !!groupId,
  });

  const { data: scenarios, isLoading } = useQuery({
    queryKey: ['scenarios', groupId],
    queryFn: () => scenariosApi.listByGroup(groupId!, 1, 100),
    select: (res) => res.data.data.items,
    enabled: !!groupId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => scenariosApi.delete(id),
    onSuccess: () => {
      toast.success('Senaryo silindi');
      queryClient.invalidateQueries({ queryKey: ['scenarios', groupId] });
      queryClient.invalidateQueries({ queryKey: ['scenario-group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      queryClient.invalidateQueries({ queryKey: ['scenario-groups', projectId] });
      setDeleteTarget(null);
    },
    onError: (error) => {
      toast.error('Senaryo silinemedi', {
        description: getErrorMessage(error, 'Lutfen tekrar deneyin.'),
        duration: 4000,
      });
    },
  });

  // groupId yoksa — kullaniciyi proje sayfasina yonlendir
  if (!groupId) {
    return (
      <div className="mx-auto max-w-[1240px] px-8 py-7">
        <EmptyState
          icon={FolderOpen}
          title="Senaryo grubu secilmedi"
          description="Senaryolari gormek icin proje sayfasindan bir senaryo grubu secin."
          action={
            <Link
              href={`/projects/${projectId}`}
              className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-[13px] font-semibold text-primary-foreground no-underline hover:bg-[var(--palette-brand-700)]"
            >
              Projeye don
            </Link>
          }
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="size-6 animate-spin text-[#7a7868]" />
      </div>
    );
  }

  const list = scenarios ?? [];

  return (
    <div className="mx-auto max-w-[1240px] px-8 py-7 pb-20">
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
        <span className="font-medium text-[#1a1a18]">{group?.name ?? 'Senaryolar'}</span>
      </nav>

      {/* Hero */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading text-[32px] font-medium tracking-tight text-[#1a1a18]">
              {group?.name ?? 'Senaryolar'}
            </h1>
            {group && (
              <span className="rounded-[4px] bg-[#f4efe3] px-2 py-0.5 text-[12px] font-medium text-[#5c5a52]">
                {group.type}
              </span>
            )}
          </div>
          <p className="mt-1 text-[15px] text-[#5c5a52]">
            Bu grupta <strong>{list.length}</strong> kayitli senaryo var.
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#e8e1cf] bg-white px-3.5 text-[13px] font-medium text-[#5c5a52] hover:bg-[#f4efe3]"
          >
            <FileSpreadsheet className="size-4" />
            Excel&apos;den aktar
          </button>
          <button
            type="button"
            onClick={() => setExportOpen(true)}
            disabled={list.length === 0}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#1f6f4e] px-3.5 text-[13px] font-semibold text-[#fffdf8] shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4)] hover:bg-[#1a5a40] disabled:cursor-not-allowed disabled:opacity-55"
          >
            <Download className="size-4" />
            Disa aktar
          </button>
        </div>
      </div>

      {/* Empty */}
      {list.length === 0 && (
        <EmptyState
          icon={FolderOpen}
          title="Bu grupta henuz senaryo yok"
          description="Senaryolar bu gruba kaydedildikten sonra burada gorunur."
        />
      )}

      {/* Scenario cards */}
      <div className="flex flex-col gap-3">
        {list.map((s, i) => (
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
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                  style={{
                    background: CAT_STYLE[s.category]?.bg ?? '#f4efe3',
                    color: CAT_STYLE[s.category]?.fg ?? '#5c5a52',
                  }}
                >
                  {CATEGORY_LABELS[s.category] ?? s.category}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                  style={{
                    background: PRI_STYLE[s.priority]?.bg ?? '#f4efe3',
                    color: PRI_STYLE[s.priority]?.fg ?? '#5c5a52',
                  }}
                >
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
            <div className="flex items-center justify-end gap-1 border-t border-[#f4efe3] bg-[#fbf8f1] px-[22px] py-2.5">
              <Link
                href={`/projects/${projectId}/results/${s.id}/code`}
                className="rounded-[6px] px-2.5 py-1 text-[12px] font-medium text-[#5c5a52] no-underline hover:bg-[#f4efe3]"
              >
                Kod
              </Link>
              <ScenarioExportMenu scenarioId={s.id} title={s.title} />
              <button
                type="button"
                onClick={() => setDeleteTarget(s)}
                className="rounded-[6px] px-2.5 py-1 text-[12px] font-medium text-[#5c5a52] hover:bg-[#f7e5e2] hover:text-[#9b2a2a]"
              >
                Sil
              </button>
            </div>
          </article>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Senaryoyu sil"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" senaryosu kalici olarak silinecek. Bu islem geri alinamaz.`
            : ''
        }
        confirmLabel="Sil"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />

      <ImportExcelDialog
        groupId={groupId}
        open={importOpen}
        onOpenChange={setImportOpen}
        onImported={() => {
          queryClient.invalidateQueries({ queryKey: ['scenarios', groupId] });
          queryClient.invalidateQueries({ queryKey: ['scenario-group', groupId] });
          queryClient.invalidateQueries({ queryKey: ['project', projectId] });
          queryClient.invalidateQueries({ queryKey: ['scenario-groups', projectId] });
        }}
      />

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        projectId={projectId}
        groupId={groupId}
        projectName={project?.name ?? 'Proje'}
        groupName={group?.name ?? 'Grup'}
      />
    </div>
  );
}
