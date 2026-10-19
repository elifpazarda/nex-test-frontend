'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  GitBranch,
  Settings2,
  RefreshCw,
  History,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { scenarioGroupsApi } from '@/lib/api/endpoints/scenario-groups';
import { CopyField } from './copy-field';
import type { ScmConnection } from '@/types/scm-webhook';

interface Props {
  connection: ScmConnection;
  onEdit: () => void;
  onRotate: () => void;
  onDelete: () => void;
}

function Badge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: 'green' | 'muted' | 'amber';
}) {
  const styles = {
    green: 'bg-[#e8f3ee] text-[#157449]',
    muted: 'bg-[#f0ece0] text-[#7a7868]',
    amber: 'bg-[#fdf6e3] text-[#8a6d1f]',
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${styles}`}
    >
      {children}
    </span>
  );
}

export function ConnectionCard({ connection, onEdit, onRotate, onDelete }: Props) {
  // Hedef grup adini coz (yalnizca autoGenerate + targetGroupId varsa)
  const { data: group } = useQuery({
    queryKey: ['scenario-group', connection.targetGroupId],
    queryFn: () => scenarioGroupsApi.getById(connection.targetGroupId as string),
    select: (res) => res.data.data,
    enabled: !!connection.targetGroupId,
  });

  const showTarget = connection.autoGenerate && !!connection.targetGroupId;
  const scenariosHref =
    connection.projectId && connection.targetGroupId
      ? `/projects/${connection.projectId}/results?groupId=${connection.targetGroupId}`
      : null;

  return (
    <div className="rounded-[14px] border border-[#e8e1cf] bg-white">
      <div className="flex items-start gap-4 border-b border-[#f4efe3] px-6 py-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#1a1a18] text-white">
          <GitBranch className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[15px] font-semibold text-[#1a1a18]">
              {connection.label || 'İsimsiz bağlantı'}
            </h2>
            {connection.active ? (
              <Badge tone="green">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1f8a5b]" />
                Aktif
              </Badge>
            ) : (
              <Badge tone="muted">Pasif</Badge>
            )}
            {connection.autoGenerate ? (
              <Badge tone="amber">Oto-üretim açık</Badge>
            ) : (
              <Badge tone="muted">Oto-üretim kapalı</Badge>
            )}
          </div>
          <p className="mt-0.5 text-[12px] text-[#a8a595]">
            {new Date(connection.createdAt).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-6 py-5">
        {showTarget && (
          <div className="flex items-center justify-between gap-3 rounded-[10px] bg-[#f4efe3] px-3 py-2.5">
            <p className="min-w-0 text-[12.5px] text-[#5c5a52]">
              Üretilen senaryolar →{' '}
              <span className="font-medium text-[#1a1a18]">
                {group?.name ?? 'yükleniyor…'}
              </span>{' '}
              grubuna yazılır
            </p>
            {scenariosHref && (
              <Link
                href={scenariosHref}
                className="inline-flex shrink-0 items-center gap-1 text-[12.5px] font-medium text-[#1a5a40] hover:underline"
              >
                Senaryoları gör
                <ArrowRight className="size-3.5" />
              </Link>
            )}
          </div>
        )}

        <CopyField label="Payload URL" value={connection.webhookUrl} />
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-[#f4efe3] px-6 py-4">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-[#e8e1cf] bg-white px-3 text-[12.5px] font-medium text-[#1a1a18] hover:bg-[#f4efe3]"
        >
          <Settings2 className="size-3.5" />
          Ayarlar
        </button>
        <button
          type="button"
          onClick={onRotate}
          className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-[#e8e1cf] bg-white px-3 text-[12.5px] font-medium text-[#1a1a18] hover:bg-[#f4efe3]"
        >
          <RefreshCw className="size-3.5" />
          Secret yenile
        </button>
        <Link
          href={`/settings/webhooks/${connection.id}/events`}
          className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-[#e8e1cf] bg-white px-3 text-[12.5px] font-medium text-[#1a1a18] hover:bg-[#f4efe3]"
        >
          <History className="size-3.5" />
          Event geçmişi
        </Link>
        <button
          type="button"
          onClick={onDelete}
          className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-[#e8e1cf] bg-white px-3 text-[12.5px] font-medium text-[#9b2a2a] hover:border-[#f7e5e2] hover:bg-[#f7e5e2]"
        >
          <Trash2 className="size-3.5" />
          Sil
        </button>
      </div>
    </div>
  );
}
