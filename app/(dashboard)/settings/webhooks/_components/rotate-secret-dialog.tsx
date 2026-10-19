'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { scmWebhooksApi } from '@/lib/api/endpoints/scm-webhooks';
import { getApiErrorMessage } from '@/lib/api/error';
import type { ScmConnection, ScmConnectionCreated } from '@/types/scm-webhook';
import { SecretReveal } from './secret-reveal';

interface Props {
  connection: ScmConnection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RotateSecretDialog({ connection, open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const [rotated, setRotated] = useState<ScmConnectionCreated | null>(null);

  const mutation = useMutation({
    mutationFn: () => scmWebhooksApi.rotateSecret(connection!.id),
    onSuccess: (res) => {
      setRotated(res.data.data);
      queryClient.invalidateQueries({ queryKey: ['scm-connections'] });
    },
    onError: (error) => {
      toast.error('Secret yenilenemedi', {
        description: getApiErrorMessage(error, 'Lütfen tekrar deneyin.'),
        duration: 4000,
      });
    },
  });

  function handleClose(next: boolean) {
    if (!next) setRotated(null);
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {rotated ? (
          <>
            <DialogHeader>
              <DialogTitle>Yeni secret oluşturuldu</DialogTitle>
              <DialogDescription>
                GitHub webhook ayarındaki Secret alanını bununla güncelleyin.
              </DialogDescription>
            </DialogHeader>
            <SecretReveal
              connection={rotated}
              hint="Eski secret artık geçersiz. GitHub'daki Secret'ı güncellemezseniz webhook'lar 401 döner."
            />
            <DialogFooter>
              <Button onClick={() => handleClose(false)}>Tamam</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Secret&apos;ı yenile</DialogTitle>
              <DialogDescription>
                {connection?.label ?? connection?.id}
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-start gap-2 rounded-[10px] border border-[#f0e2bf] bg-[#fdf6e3] px-3 py-2.5">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#b7791f]" />
              <p className="text-[12.5px] leading-relaxed text-[#8a6d1f]">
                Yeni secret üretildiğinde eski secret geçersiz olur. GitHub webhook
                ayarındaki Secret&apos;ı da güncellemeniz gerekir.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                İptal
              </Button>
              <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RefreshCw className="size-4" />
                )}
                Yenile
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
