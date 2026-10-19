'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Plus, Webhook, AlertCircle } from 'lucide-react';
import { scmWebhooksApi } from '@/lib/api/endpoints/scm-webhooks';
import { getApiErrorMessage } from '@/lib/api/error';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import type { ScmConnection } from '@/types/scm-webhook';
import { ConnectionCard } from './_components/connection-card';
import { CreateConnectionDialog } from './_components/create-connection-dialog';
import { EditConnectionDialog } from './_components/edit-connection-dialog';
import { RotateSecretDialog } from './_components/rotate-secret-dialog';

export default function WebhooksSettingsPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ScmConnection | null>(null);
  const [rotateTarget, setRotateTarget] = useState<ScmConnection | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ScmConnection | null>(null);

  const {
    data: connections,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['scm-connections'],
    queryFn: () => scmWebhooksApi.list(),
    select: (res) => res.data.data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => scmWebhooksApi.remove(id),
    onSuccess: () => {
      toast.success('Bağlantı silindi');
      queryClient.invalidateQueries({ queryKey: ['scm-connections'] });
      setDeleteTarget(null);
    },
    onError: (error) => {
      toast.error('Silinemedi', {
        description: getApiErrorMessage(error, 'Lütfen tekrar deneyin.'),
        duration: 4000,
      });
    },
  });

  return (
    <div className="mx-auto max-w-[720px] px-8 py-8 pb-16">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-[32px] font-medium tracking-tight text-[#1a1a18]">
            SCM <em className="font-medium italic text-[#1a5a40]">Webhooks</em>
          </h1>
          <p className="mt-1 text-[15px] text-[#5c5a52]">
            GitHub deponuzu bağlayın; issue/PR olaylarından otomatik test senaryosu üretin.
          </p>
        </div>
        {connections && connections.length > 0 && (
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-[10px] bg-[#1f6f4e] px-4 text-[14px] font-semibold text-[#fffdf8] shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[#1a5a40]"
          >
            <Plus className="size-4" />
            Yeni bağlantı
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-[14px] border border-[#e8e1cf] bg-white py-20">
          <Loader2 className="size-6 animate-spin text-[#7a7868]" />
        </div>
      ) : isError ? (
        <div className="rounded-[14px] border border-[#f0d9d2] bg-[#fdf3f1] p-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#f0d9d2] bg-white text-[#9b2a2a]">
            <AlertCircle className="size-7" />
          </span>
          <h2 className="text-[18px] font-semibold text-[#1a1a18]">Bağlantılar yüklenemedi</h2>
          <p className="mx-auto mt-2 max-w-[420px] text-[14px] text-[#5c5a52]">
            Oturumunuz sona ermiş olabilir veya sunucuya ulaşılamıyor. Lütfen tekrar deneyin.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mx-auto mt-6 inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#e8e1cf] bg-white px-5 text-[14px] font-semibold text-[#1a1a18] hover:bg-[#f4efe3] disabled:opacity-55"
          >
            {isFetching && <Loader2 className="size-4 animate-spin" />}
            Tekrar dene
          </button>
        </div>
      ) : connections && connections.length > 0 ? (
        <div className="flex flex-col gap-4">
          {connections.map((c) => (
            <ConnectionCard
              key={c.id}
              connection={c}
              onEdit={() => setEditTarget(c)}
              onRotate={() => setRotateTarget(c)}
              onDelete={() => setDeleteTarget(c)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[14px] border border-[#e8e1cf] bg-white p-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#e8e1cf] bg-[#fbf8f1] text-[#1a1a18]">
            <Webhook className="size-7" />
          </span>
          <h2 className="text-[18px] font-semibold text-[#1a1a18]">Henüz webhook bağlantısı yok</h2>
          <p className="mx-auto mt-2 max-w-[420px] text-[14px] text-[#5c5a52]">
            Bir GitHub deposunu bağlayın. İsterseniz gelen issue ve PR&apos;lardan otomatik
            olarak test senaryosu üretelim.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#1f6f4e] px-6 text-[15px] font-semibold text-[#fffdf8] shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[#1a5a40]"
            >
              <Plus className="size-4" />
              Bağlantı oluştur
            </button>
            <p className="text-[12px] text-[#a8a595]">HMAC-SHA256 imza ile güvenli doğrulama</p>
          </div>
        </div>
      )}

      <CreateConnectionDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditConnectionDialog
        connection={editTarget}
        open={!!editTarget}
        onOpenChange={(o) => !o && setEditTarget(null)}
      />
      <RotateSecretDialog
        connection={rotateTarget}
        open={!!rotateTarget}
        onOpenChange={(o) => !o && setRotateTarget(null)}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Bağlantıyı sil"
        description="Bu webhook bağlantısı ve event geçmişi kalıcı olarak silinecek. GitHub tarafındaki webhook'u da kaldırmanız önerilir."
        confirmLabel="Sil"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
