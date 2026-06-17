'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Plug, Link2 } from 'lucide-react';
import { jiraApi } from '@/lib/api/endpoints/jira';
import { getApiErrorMessage } from '@/lib/api/error';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function JiraSettingsPage() {
  const queryClient = useQueryClient();
  const [disconnectOpen, setDisconnectOpen] = useState(false);

  // Jira baglantisi yoksa backend 404 doner — retry kapali
  const {
    data: connection,
    isLoading,
    isError: notConnected,
  } = useQuery({
    queryKey: ['jira-connection'],
    queryFn: () => jiraApi.getConnection(),
    select: (res) => res.data.data,
    retry: false,
  });

  // Atlassian OAuth akisini baslat
  const connectMutation = useMutation({
    mutationFn: () => jiraApi.getAuthUrl(),
    onSuccess: (res) => {
      window.location.href = res.data.data.authUrl;
    },
    onError: (error) => {
      toast.error('Bağlantı başlatılamadı', {
        description: getApiErrorMessage(error, 'Lütfen tekrar deneyin.'),
        duration: 4000,
      });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: () => jiraApi.deleteConnection(),
    onSuccess: () => {
      toast.success('Jira bağlantısı kaldırıldı');
      queryClient.invalidateQueries({ queryKey: ['jira-connection'] });
      setDisconnectOpen(false);
    },
    onError: (error) => {
      toast.error('Bağlantı kaldırılamadı', {
        description: getApiErrorMessage(error, 'Lütfen tekrar deneyin.'),
        duration: 4000,
      });
    },
  });

  return (
    <div className="mx-auto max-w-[720px] px-8 py-8 pb-16">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-heading text-[32px] font-medium tracking-tight text-[#1a1a18]">
          Jira <em className="font-medium italic text-[#1a5a40]">Entegrasyonu</em>
        </h1>
        <p className="mt-1 text-[15px] text-[#5c5a52]">
          Atlassian hesabınızı bağlayarak Jira issue&apos;larından test senaryoları üretin.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-[14px] border border-[#e8e1cf] bg-white py-20">
          <Loader2 className="size-6 animate-spin text-[#7a7868]" />
        </div>
      ) : connection && !notConnected ? (
        /* Connected state */
        <div className="rounded-[14px] border border-[#e8e1cf] bg-white">
          <div className="border-b border-[#f4efe3] px-6 py-5">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#e5eef5] text-[#1f5c87]">
                <Plug className="size-6" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-[16px] font-semibold text-[#1a1a18]">
                    {connection.siteName}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f3ee] px-2 py-0.5 text-[11px] font-medium text-[#157449]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1f8a5b]" />
                    Bağlı
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] text-[#7a7868]">{connection.siteUrl}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#5c5a52]">Bağlanma tarihi</span>
                <span className="text-[13px] font-medium text-[#1a1a18]">
                  {formatDate(connection.connectedAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#5c5a52]">Son güncelleme</span>
                <span className="text-[13px] font-medium text-[#1a1a18]">
                  {formatDate(connection.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#f4efe3] px-6 py-4">
            <button
              type="button"
              onClick={() => setDisconnectOpen(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#e8e1cf] bg-white px-4 text-[13px] font-medium text-[#9b2a2a] shadow-[0_1px_2px_rgba(26,26,24,0.05)] hover:border-[#f7e5e2] hover:bg-[#f7e5e2]"
            >
              Bağlantıyı kes
            </button>
          </div>
        </div>
      ) : (
        /* Disconnected state */
        <div className="rounded-[14px] border border-[#e8e1cf] bg-white p-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#e8e1cf] bg-[#fbf8f1] text-[#1f5c87]">
            <Plug className="size-7" />
          </span>
          <h2 className="text-[18px] font-semibold text-[#1a1a18]">Jira hesabınızı bağlayın</h2>
          <p className="mx-auto mt-2 max-w-[400px] text-[14px] text-[#5c5a52]">
            Atlassian hesabınızı bağlayarak Jira issue&apos;larından direkt test senaryoları
            üretebilirsiniz.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => connectMutation.mutate()}
              disabled={connectMutation.isPending}
              className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#1f6f4e] px-6 text-[15px] font-semibold text-[#fffdf8] shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[#1a5a40] disabled:cursor-not-allowed disabled:opacity-55"
            >
              {connectMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Link2 className="size-4" />
              )}
              {connectMutation.isPending ? 'Yönlendiriliyor...' : "Jira'ya bağlan"}
            </button>
            <p className="text-[12px] text-[#a8a595]">Atlassian OAuth 2.0 ile güvenli bağlanır</p>
          </div>

          <div className="mt-8 border-t border-[#f4efe3] pt-6">
            <h3 className="mb-3 text-[13px] font-semibold text-[#1a1a18]">
              Entegrasyon ne sağlar?
            </h3>
            <div className="mx-auto grid max-w-[420px] grid-cols-2 gap-3 text-left">
              {[
                "Jira issue'larından senaryo üret",
                'Issue key ile direkt erişim',
                'Xray formatında export',
                'Tek tıkla yeniden bağlan',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-[12px] text-[#5c5a52]">
                  <span className="mt-0.5 text-[#1f8a5b]">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={disconnectOpen}
        onOpenChange={setDisconnectOpen}
        title="Jira bağlantısını kes"
        description="Jira bağlantısı kaldırılacak. Issue'lardan senaryo üretmek için tekrar bağlanmanız gerekir."
        confirmLabel="Bağlantıyı kes"
        variant="destructive"
        isLoading={disconnectMutation.isPending}
        onConfirm={() => disconnectMutation.mutate()}
      />
    </div>
  );
}
