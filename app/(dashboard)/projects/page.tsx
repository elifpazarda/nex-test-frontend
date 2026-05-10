'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { FolderPlus, Search, LayoutGrid, List, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { projectsApi } from '@/lib/api/endpoints/projects';
import { CreateProjectDialog } from './_components/create-project-dialog';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [q, setQ] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.list(1, 50),
    select: (res) => res.data.data,
  });

  const projects = data?.items ?? [];
  const firstName = user?.name.split(' ')[0] ?? '';

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      (p.description ?? '').toLowerCase().includes(q.toLowerCase()),
  );

  const initials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} dk once`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} saat once`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} gun once`;
    const weeks = Math.floor(days / 7);
    return `${weeks} hafta once`;
  };

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-10 pb-16">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="font-heading text-[32px] font-medium leading-[1.1] tracking-tight text-foreground">
          Tekrar hos geldin,{' '}
          {firstName && <em className="font-medium italic text-accent-foreground">{firstName}</em>}.
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          {projects.length > 0
            ? `${projects.length} aktif projen var.`
            : 'Henuz bir projen yok. Ilk projeni olusturarak basla!'}
        </p>
        {projects.length > 0 && (
          <button
            onClick={() => setDialogOpen(true)}
            className="mt-5 inline-flex h-12 items-center gap-2 rounded-md bg-primary px-5 text-[16px] font-semibold text-primary-foreground shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] transition-[background,transform] duration-100 hover:bg-[var(--palette-brand-700)] active:translate-y-[0.5px] active:bg-[var(--palette-brand-800)]"
          >
            <FolderPlus className="size-[18px]" />
            Yeni proje
          </button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--palette-neutral-300)] bg-[var(--palette-neutral-50)] px-6 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
            <FolderPlus className="size-7 text-accent-foreground" />
          </div>
          <h2 className="mt-5 font-heading text-[22px] font-medium text-foreground">
            Henuz proje olusturmadiniz
          </h2>
          <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
            Ilk projenizi olusturun ve AI destekli test senaryolari uretmeye hemen baslayin.
          </p>
          <button
            onClick={() => setDialogOpen(true)}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-[14px] font-semibold text-primary-foreground shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] transition-[background,transform] duration-100 hover:bg-[var(--palette-brand-700)] active:translate-y-[0.5px] active:bg-[var(--palette-brand-800)]"
          >
            <FolderPlus className="size-4" />
            Ilk projeni olustur
          </button>
        </div>
      )}

      {/* Content — only when there are projects */}
      {!isLoading && projects.length > 0 && (
        <>
          {/* Stats */}
          <div className="mb-8 grid grid-cols-4 gap-px overflow-hidden rounded-lg border border-border bg-border">
            {[
              { label: 'Aktif proje', value: String(projects.length) },
              {
                label: 'Toplam senaryo',
                value: String(projects.reduce((s, p) => s + p._count.scenarios, 0)),
              },
              {
                label: 'Senaryo grubu',
                value: String(projects.reduce((s, p) => s + p._count.scenarioGroups, 0)),
              },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-5">
                <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--palette-neutral-400)]">
                  {stat.label}
                </p>
                <p className="mt-1 font-heading text-[28px] font-medium tracking-tight text-foreground">
                  {stat.value}
                </p>
              </div>
            ))}
            <div className="bg-white p-5">
              <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--palette-neutral-400)]">
                Son guncelleme
              </p>
              <p className="mt-1 font-heading text-[28px] font-medium tracking-tight text-foreground">
                {projects.length > 0 ? timeAgo(projects[0].updatedAt) : '-'}
              </p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="mb-6 flex items-center gap-3">
            <label className="flex h-9 w-[240px] items-center gap-2 rounded-sm border border-border bg-white px-3">
              <Search className="size-[15px] text-[var(--palette-neutral-400)]" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Projelerde ara..."
                className="h-full flex-1 border-0 bg-transparent text-[13px] text-foreground outline-none placeholder:text-[var(--palette-neutral-400)]"
              />
            </label>

            <div className="ml-auto flex items-center gap-1 rounded-sm border border-border bg-secondary p-1">
              <button
                onClick={() => setView('grid')}
                data-active={view === 'grid' || undefined}
                className="flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[12px] font-medium text-muted-foreground data-[active]:bg-white data-[active]:text-foreground data-[active]:shadow-[0_1px_2px_rgba(26,26,24,0.05)]"
              >
                <LayoutGrid className="size-3.5" />
                Grid
              </button>
              <button
                onClick={() => setView('list')}
                data-active={view === 'list' || undefined}
                className="flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[12px] font-medium text-muted-foreground data-[active]:bg-white data-[active]:text-foreground data-[active]:shadow-[0_1px_2px_rgba(26,26,24,0.05)]"
              >
                <List className="size-3.5" />
                Liste
              </button>
            </div>
          </div>

          {/* No search results */}
          {filtered.length === 0 && q.length > 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--palette-neutral-300)] bg-[var(--palette-neutral-50)] px-6 py-16 text-center">
              <Search className="size-8 text-[var(--palette-neutral-400)]" />
              <h3 className="mt-4 text-[16px] font-semibold text-foreground">Sonuc bulunamadi</h3>
              <p className="mt-1 text-[13px] text-muted-foreground">
                &ldquo;{q}&rdquo; ile eslesen proje yok.
              </p>
            </div>
          )}

          {/* Grid View */}
          {view === 'grid' && filtered.length > 0 && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
              {filtered.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="group flex flex-col rounded-lg border border-border bg-white p-5 no-underline transition-[box-shadow,transform] duration-[180ms] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(26,26,24,0.12),0_4px_8px_rgba(26,26,24,0.05)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-accent text-[13px] font-semibold text-accent-foreground">
                      {initials(p.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[15px] font-semibold text-foreground">
                        {p.name}
                      </h3>
                      <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
                        {p.description || 'Aciklama yok'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-6 border-t border-secondary pt-3.5">
                    <div>
                      <span className="block font-heading text-[20px] font-medium text-foreground">
                        {p._count.scenarioGroups}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.06em] text-[var(--palette-neutral-400)]">
                        Grup
                      </span>
                    </div>
                    <div>
                      <span className="block font-heading text-[20px] font-medium text-foreground">
                        {p._count.scenarios}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.06em] text-[var(--palette-neutral-400)]">
                        Senaryo
                      </span>
                    </div>
                  </div>
                  <div className="mt-3.5 flex items-center">
                    <span className="text-[12px] text-[var(--palette-neutral-400)]">
                      {timeAgo(p.updatedAt)}
                    </span>
                  </div>
                </Link>
              ))}
              <button
                onClick={() => setDialogOpen(true)}
                className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-[var(--palette-neutral-300)] bg-muted p-8 text-center transition-colors hover:border-primary hover:bg-accent"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--palette-neutral-300)] bg-white text-muted-foreground">
                  <FolderPlus className="size-[18px]" />
                </span>
                <span className="text-[14px] font-medium text-muted-foreground">Yeni proje</span>
              </button>
            </div>
          )}

          {/* List View */}
          {view === 'list' && filtered.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-border bg-white">
              <div className="grid grid-cols-[2fr_80px_90px_130px] items-center gap-3 border-b border-border bg-muted px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--palette-neutral-400)]">
                <span>Proje</span>
                <span>Grup</span>
                <span>Senaryo</span>
                <span>Guncellendi</span>
              </div>
              {filtered.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="grid grid-cols-[2fr_80px_90px_130px] items-center gap-3 border-b border-secondary px-4 py-3 no-underline transition-colors last:border-0 hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm bg-accent text-[11px] font-semibold text-accent-foreground">
                      {initials(p.name)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-[14px] font-medium text-foreground">{p.name}</h3>
                      <p className="truncate text-[12px] text-muted-foreground">
                        {p.description || 'Aciklama yok'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[14px] font-medium text-foreground">
                    {p._count.scenarioGroups}
                  </span>
                  <span className="text-[14px] font-medium text-foreground">
                    {p._count.scenarios}
                  </span>
                  <span className="text-[12px] text-[var(--palette-neutral-400)]">
                    {timeAgo(p.updatedAt)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
      <CreateProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
