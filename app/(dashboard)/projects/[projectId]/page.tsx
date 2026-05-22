'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Loader2, FolderPlus, Sparkles } from 'lucide-react';
import { projectsApi } from '@/lib/api/endpoints/projects';
import { scenarioGroupsApi } from '@/lib/api/endpoints/scenario-groups';
import type { ScenarioGroupType } from '@/types/scenario-group';

const TYPE_COLORS: Record<ScenarioGroupType, { fg: string; bg: string }> = {
  FEATURE: { fg: 'var(--palette-brand-700)', bg: 'var(--palette-brand-50)' },
  REGRESSION: { fg: '#6b4d8c', bg: '#ede5f5' },
  BUG: { fg: 'var(--palette-danger-600)', bg: 'var(--palette-danger-50)' },
  SMOKE: { fg: 'var(--palette-warning-muted)', bg: 'var(--palette-warning-100)' },
  INTEGRATION: { fg: 'var(--palette-info-600)', bg: 'var(--palette-info-50)' },
  E2E: { fg: 'var(--palette-brand-600)', bg: 'var(--palette-brand-50)' },
  PERFORMANCE: { fg: '#b85b1a', bg: '#fbedd8' },
  OTHER: { fg: 'var(--palette-neutral-600)', bg: 'var(--palette-neutral-100)' },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} dk once`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} saat once`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gun once`;
  const weeks = Math.floor(days / 7);
  return `${weeks} hafta once`;
}

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getById(projectId),
    select: (res) => res.data.data,
  });

  const { data: groupsData, isLoading: groupsLoading } = useQuery({
    queryKey: ['scenario-groups', projectId],
    queryFn: () => scenarioGroupsApi.listByProject(projectId, 1, 50),
    select: (res) => res.data.data,
  });

  const groups = groupsData?.items ?? [];
  const isLoading = projectLoading || groupsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) return null;

  const createdDate = new Date(project.createdAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-8 pb-16">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-[13px] text-muted-foreground">
        <Link href="/projects" className="text-muted-foreground no-underline hover:text-foreground">
          Projeler
        </Link>
        <span className="text-[var(--palette-neutral-400)]">/</span>
        <span className="font-medium text-foreground">{project.name}</span>
      </nav>

      {/* Hero */}
      <section className="mb-8 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-accent text-[16px] font-semibold text-accent-foreground">
            {initials(project.name)}
          </div>
          <div>
            <h1 className="font-heading text-[32px] font-medium tracking-tight text-foreground">
              {project.name}
            </h1>
            {project.description && (
              <p className="mt-1 text-[15px] text-muted-foreground">{project.description}</p>
            )}
            <div className="mt-3 flex items-center gap-5 text-[13px] text-muted-foreground">
              <span>
                <span className="text-[var(--palette-neutral-400)]">Olusturuldu</span>{' '}
                <span className="ml-1">{createdDate}</span>
              </span>
            </div>
          </div>
        </div>
        <Link
          href={`/projects/${projectId}/generate`}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-[13px] font-semibold text-primary-foreground no-underline shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4)] transition-colors hover:bg-[var(--palette-brand-700)]"
        >
          <Sparkles className="size-[14px]" />
          Senaryo uret
        </Link>
      </section>

      {/* Stats */}
      <section className="mb-8 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
        <div className="bg-white p-5">
          <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--palette-neutral-400)]">
            Senaryo grubu
          </p>
          <p className="mt-1 font-heading text-[28px] font-medium tracking-tight text-foreground">
            {project._count.scenarioGroups}
          </p>
        </div>
        <div className="bg-white p-5">
          <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--palette-neutral-400)]">
            Toplam senaryo
          </p>
          <p className="mt-1 font-heading text-[28px] font-medium tracking-tight text-foreground">
            {project._count.scenarios}
          </p>
        </div>
        <div className="bg-white p-5">
          <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--palette-neutral-400)]">
            Son guncelleme
          </p>
          <p className="mt-1 font-heading text-[28px] font-medium tracking-tight text-foreground">
            {timeAgo(project.updatedAt)}
          </p>
        </div>
      </section>

      {/* Two-column: Groups + Sidebar */}
      <div className="grid grid-cols-[1fr_320px] gap-6">
        {/* Groups */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-semibold text-foreground">Senaryo gruplari</h2>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                Her grup bir kaynaktan uretilmis bir senaryo setidir.
              </p>
            </div>
          </div>

          {/* Empty state */}
          {groups.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--palette-neutral-300)] bg-[var(--palette-neutral-50)] px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
                <FolderPlus className="size-6 text-accent-foreground" />
              </div>
              <h3 className="mt-4 font-heading text-[18px] font-medium text-foreground">
                Henuz senaryo grubu yok
              </h3>
              <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
                Senaryo uret butonuna tiklayarak AI ile ilk test senaryolarinizi olusturun.
              </p>
              <Link
                href={`/projects/${projectId}/generate`}
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-[13px] font-semibold text-primary-foreground no-underline shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4)] transition-colors hover:bg-[var(--palette-brand-700)]"
              >
                <Sparkles className="size-4" />
                Senaryo uret
              </Link>
            </div>
          )}

          {/* Groups table */}
          {groups.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-border bg-white">
              <div className="grid grid-cols-[2fr_120px_90px_130px] items-center gap-3 border-b border-border bg-muted px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--palette-neutral-400)]">
                <span>Grup</span>
                <span>Tip</span>
                <span>Senaryo</span>
                <span>Guncellendi</span>
              </div>
              {groups.map((g) => (
                <Link
                  key={g.id}
                  href={`/projects/${projectId}/results?groupId=${g.id}`}
                  className="grid grid-cols-[2fr_120px_90px_130px] items-center gap-3 border-b border-secondary px-4 py-3 no-underline transition-colors last:border-0 hover:bg-muted"
                >
                  <div className="min-w-0">
                    <h3 className="truncate text-[14px] font-medium text-foreground">{g.name}</h3>
                  </div>
                  <span>
                    <span
                      className="inline-flex items-center rounded-[4px] px-2 py-0.5 text-[11px] font-medium"
                      style={{
                        background: TYPE_COLORS[g.type]?.bg,
                        color: TYPE_COLORS[g.type]?.fg,
                      }}
                    >
                      {g.type}
                    </span>
                  </span>
                  <span className="text-[14px] font-medium text-foreground">
                    {g._count.scenarios}
                  </span>
                  <span className="text-[12px] text-[var(--palette-neutral-400)]">
                    {timeAgo(g.updatedAt)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Sidebar: Quick generate */}
        <aside>
          <div className="rounded-lg border border-border bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-foreground">Hizli uret</h3>
              <span className="text-[12px] text-[var(--palette-neutral-400)]">Bir kaynak sec</span>
            </div>
            <div className="flex flex-col gap-2">
              {[
                {
                  href: `/projects/${projectId}/generate?source=text`,
                  icon: 'T',
                  label: 'Metinden',
                  hint: 'Bir paragraf yapistir',
                },
                {
                  href: `/projects/${projectId}/generate?source=jira`,
                  icon: 'J',
                  label: "Jira'dan",
                  hint: 'Bir issue ile bagla',
                },
                {
                  href: `/projects/${projectId}/generate?source=excel`,
                  icon: 'E',
                  label: "Excel'den",
                  hint: 'Toplu yukleme yap',
                },
                {
                  href: `/projects/${projectId}/generate?source=pdf`,
                  icon: 'P',
                  label: "PDF'den",
                  hint: 'Dokuman yukle',
                },
              ].map((item) => (
                <Link
                  key={item.icon}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md border border-secondary p-3 no-underline transition-colors hover:border-primary hover:bg-accent"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm bg-accent text-[12px] font-semibold text-accent-foreground">
                    {item.icon}
                  </span>
                  <span>
                    <strong className="block text-[13px] font-medium text-foreground">
                      {item.label}
                    </strong>
                    <em className="block text-[12px] not-italic text-muted-foreground">
                      {item.hint}
                    </em>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
