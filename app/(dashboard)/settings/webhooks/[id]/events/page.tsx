'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ArrowLeft, Inbox } from 'lucide-react';
import { scmWebhooksApi } from '@/lib/api/endpoints/scm-webhooks';
import {
  SCM_EVENT_STATUSES,
  type ScmEventStatus,
  type ScmWebhookEvent,
} from '@/types/scm-webhook';

const STATUS_STYLES: Record<ScmEventStatus, string> = {
  RECEIVED: 'bg-[#e5eef5] text-[#1f5c87]',
  PROCESSED: 'bg-[#e8f3ee] text-[#157449]',
  SKIPPED: 'bg-[#f0ece0] text-[#7a7868]',
  FAILED: 'bg-[#f7e5e2] text-[#9b2a2a]',
};

const STATUS_LABELS: Record<ScmEventStatus, string> = {
  RECEIVED: 'Alındı',
  PROCESSED: 'Üretildi',
  SKIPPED: 'Atlandı',
  FAILED: 'Hata',
};

function StatusBadge({ status }: { status: ScmEventStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function EventRow({ event }: { event: ScmWebhookEvent }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-start gap-3 border-b border-[#f4efe3] px-5 py-3.5 last:border-b-0">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-medium text-[#1a1a18]">
            {event.eventType}
            {event.action ? `/${event.action}` : ''}
          </span>
          <StatusBadge status={event.status} />
        </div>
        <p className="mt-0.5 truncate text-[12px] text-[#7a7868]">
          {event.sourceRef ?? '—'}
        </p>
        {event.error && (
          <p className="mt-1 text-[12px] text-[#9b2a2a]">{event.error}</p>
        )}
      </div>
      <span className="whitespace-nowrap text-[12px] text-[#a8a595]">
        {new Date(event.createdAt).toLocaleString('tr-TR', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    </div>
  );
}

export default function WebhookEventsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ScmEventStatus | ''>('');

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['scm-events', id, page, status],
    queryFn: () =>
      scmWebhooksApi.listEvents(id, {
        page,
        limit: 20,
        status: status || undefined,
      }),
    select: (res) => res.data.data,
  });

  const items = data?.items ?? [];
  const meta = data?.meta;

  return (
    <div className="mx-auto max-w-[720px] px-8 py-8 pb-16">
      <Link
        href="/settings/webhooks"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5c5a52] hover:text-[#1a1a18]"
      >
        <ArrowLeft className="size-4" />
        Webhook bağlantıları
      </Link>

      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-[28px] font-medium tracking-tight text-[#1a1a18]">
            Event <em className="font-medium italic text-[#1a5a40]">Geçmişi</em>
          </h1>
          <p className="mt-1 text-[14px] text-[#5c5a52]">
            Bu bağlantıya gelen webhook teslimatları ve işlenme durumları.
          </p>
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as ScmEventStatus | '');
            setPage(1);
          }}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">Tüm durumlar</option>
          {SCM_EVENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-[14px] border border-[#e8e1cf] bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-6 animate-spin text-[#7a7868]" />
          </div>
        ) : items.length > 0 ? (
          items.map((e) => <EventRow key={e.id} event={e} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Inbox className="size-10 text-[#d8d2c2]" />
            <p className="mt-3 text-[14px] font-medium text-[#1a1a18]">Henüz event yok</p>
            <p className="mt-1 text-[13px] text-[#7a7868]">
              GitHub&apos;dan webhook geldiğinde burada görünür.
            </p>
          </div>
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[12px] text-[#7a7868]">
            {meta.total} kayıt · sayfa {meta.page}/{meta.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => p - 1)}
              className="inline-flex h-8 items-center rounded-[8px] border border-[#e8e1cf] bg-white px-3 text-[12.5px] font-medium text-[#1a1a18] hover:bg-[#f4efe3] disabled:opacity-40"
            >
              Önceki
            </button>
            <button
              type="button"
              disabled={page >= meta.totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex h-8 items-center rounded-[8px] border border-[#e8e1cf] bg-white px-3 text-[12.5px] font-medium text-[#1a1a18] hover:bg-[#f4efe3] disabled:opacity-40"
            >
              Sonraki
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
