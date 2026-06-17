'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, FileSpreadsheet, X, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { scenariosApi } from '@/lib/api/endpoints/scenarios';
import { getApiErrorMessage } from '@/lib/api/error';
import type { ImportExcelResult } from '@/types/scenario';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

interface ImportExcelDialogProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** saveResults=true ile basarili bir import sonrasi cagrilir */
  onImported: () => void;
}

export function ImportExcelDialog({
  groupId,
  open,
  onOpenChange,
  onImported,
}: ImportExcelDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [saveResults, setSaveResults] = useState(true);
  const [result, setResult] = useState<ImportExcelResult | null>(null);

  function reset() {
    setFile(null);
    setSaveResults(true);
    setResult(null);
  }

  function pickFile(f: File | null) {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith('.xlsx')) {
      toast.error('Geçersiz dosya', { description: 'Yalnızca .xlsx dosyaları kabul edilir.' });
      return;
    }
    if (f.size > MAX_SIZE) {
      toast.error('Dosya çok büyük', { description: 'Excel dosyası en fazla 5MB olabilir.' });
      return;
    }
    setFile(f);
  }

  const importMutation = useMutation({
    mutationFn: () => scenariosApi.importExcel(groupId, file!, saveResults),
    onSuccess: (res) => {
      const data = res.data.data;
      setResult(data);
      if (saveResults && data.successCount > 0) {
        onImported();
        toast.success(`${data.successCount} senaryo içeri aktarıldı`);
      }
    },
    onError: (error) => {
      toast.error('İçeri aktarılamadı', {
        description: getApiErrorMessage(error, 'Lütfen tekrar deneyin.'),
        duration: 4000,
      });
    },
  });

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Excel&apos;den içeri aktar</DialogTitle>
          <DialogDescription>
            Hazır BDD senaryoları içeren bir .xlsx dosyasını bu gruba aktar.
          </DialogDescription>
        </DialogHeader>

        {/* --- Sonuc ekrani --- */}
        {result ? (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
              <div className="bg-white p-3 text-center">
                <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
                  Toplam
                </p>
                <p className="mt-0.5 font-heading text-[22px] font-medium text-foreground">
                  {result.totalRows}
                </p>
              </div>
              <div className="bg-white p-3 text-center">
                <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
                  Başarılı
                </p>
                <p className="mt-0.5 font-heading text-[22px] font-medium text-[#157449]">
                  {result.successCount}
                </p>
              </div>
              <div className="bg-white p-3 text-center">
                <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
                  Hatalı
                </p>
                <p className="mt-0.5 font-heading text-[22px] font-medium text-[#9b2a2a]">
                  {result.failureCount}
                </p>
              </div>
            </div>

            {!saveResults && (
              <p className="rounded-md bg-muted px-3 py-2 text-[12px] text-muted-foreground">
                Önizleme modu: satırlar kaydedilmedi. Kaydetmek için &quot;Sonuçları kaydet&quot;
                seçeneğini işaretleyip tekrar deneyin.
              </p>
            )}

            <div className="flex max-h-[260px] flex-col gap-1.5 overflow-y-auto">
              {result.results.map((row) => (
                <div
                  key={row.rowNumber}
                  className="flex items-start gap-2.5 rounded-md border border-border px-3 py-2"
                >
                  {row.error ? (
                    <AlertCircle className="mt-0.5 size-4 flex-shrink-0 text-[#9b2a2a]" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 size-4 flex-shrink-0 text-[#157449]" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-foreground">
                      <span className="mr-1.5 text-muted-foreground">#{row.rowNumber}</span>
                      {row.testSummary || row.issueKey || 'Satır'}
                    </p>
                    {row.error && (
                      <p className="mt-0.5 text-[12px] text-[#9b2a2a]">{row.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* --- Yukleme ekrani --- */
          <div className="flex flex-col gap-3">
            {!file ? (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-[1.5px] border-dashed border-border bg-muted/50 p-8 text-center transition-colors hover:border-primary hover:bg-accent">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-[#157449]">
                  <FileSpreadsheet className="size-5" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Excel dosyası seç</p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">.xlsx · Maks 5MB</p>
                </div>
                <input
                  type="file"
                  accept=".xlsx"
                  className="hidden"
                  onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                />
              </label>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-white p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#e8f3ee] text-[#157449]">
                  <FileSpreadsheet className="size-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-foreground">{file.name}</p>
                  <p className="text-[12px] text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  disabled={importMutation.isPending}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-50"
                  aria-label="Dosyayı kaldır"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}

            <label className="flex cursor-pointer items-start gap-2.5 rounded-md border border-border p-3">
              <input
                type="checkbox"
                checked={saveResults}
                onChange={(e) => setSaveResults(e.target.checked)}
                disabled={importMutation.isPending}
                className="mt-0.5 size-4 accent-[#1f6f4e]"
              />
              <span>
                <span className="block text-[13px] font-medium text-foreground">
                  Sonuçları kaydet
                </span>
                <span className="block text-[12px] text-muted-foreground">
                  İşaretliyse satırlar bu gruba senaryo olarak eklenir; değilse yalnızca önizlenir.
                </span>
              </span>
            </label>
          </div>
        )}

        <DialogFooter>
          {result ? (
            <Button onClick={() => handleOpenChange(false)}>Kapat</Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={importMutation.isPending}
              >
                İptal
              </Button>
              <Button
                onClick={() => importMutation.mutate()}
                disabled={!file || importMutation.isPending}
              >
                {importMutation.isPending && <Loader2 className="size-4 animate-spin" />}
                {importMutation.isPending ? 'Aktarılıyor...' : 'İçeri aktar'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
