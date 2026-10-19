'use client';

import { AlertTriangle } from 'lucide-react';
import { CopyField } from './copy-field';
import type { ScmConnectionCreated } from '@/types/scm-webhook';

interface SecretRevealProps {
  connection: ScmConnectionCreated;
  /** Kurulum ipucu (olusturma vs yenileme icin farkli). */
  hint?: string;
}

/** Secret + webhook URL'ini bir kez gosterir (olusturma ve rotate sonrasi). */
export function SecretReveal({ connection, hint }: SecretRevealProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2 rounded-[10px] border border-[#f0e2bf] bg-[#fdf6e3] px-3 py-2.5">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#b7791f]" />
        <p className="text-[12.5px] leading-relaxed text-[#8a6d1f]">
          {hint ??
            'Bu secret yalnızca şimdi gösteriliyor. GitHub webhook ayarındaki Secret alanına yapıştırın; daha sonra tekrar görüntülenemez.'}
        </p>
      </div>

      <CopyField label="Payload URL" value={connection.webhookUrl} />
      <CopyField label="Secret" value={connection.secret} />

      <div className="rounded-[10px] bg-[#f4efe3] px-3 py-2.5 text-[12px] leading-relaxed text-[#5c5a52]">
        GitHub → <strong>Settings → Webhooks → Add webhook</strong>: Payload URL ve Secret&apos;ı
        yukarıdaki değerlerle doldurun, <strong>Content type</strong>&apos;ı{' '}
        <code className="font-mono text-[#1a1a18]">application/json</code> seçin.
      </div>
    </div>
  );
}
