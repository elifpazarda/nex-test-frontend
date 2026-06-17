'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Download } from 'lucide-react';
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
import { downloadBlobResponse, FORMAT_EXTENSION } from '@/lib/api/download';
import type { ExportFormat } from '@/types/scenario';

type ExportScope = 'group' | 'project';

const FORMAT_OPTIONS: { value: ExportFormat; label: string }[] = [
  { value: 'excel', label: 'Excel (.xlsx)' },
  { value: 'pdf', label: 'PDF (.pdf)' },
  { value: 'json', label: 'JSON (.json)' },
  { value: 'feature', label: 'Gherkin (.feature)' },
];

/** Dosya adi icin guvenli bir slug uretir */
function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'export'
  );
}

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  groupId: string;
  projectName: string;
  groupName: string;
}

export function ExportDialog({
  open,
  onOpenChange,
  projectId,
  groupId,
  projectName,
  groupName,
}: ExportDialogProps) {
  const [scope, setScope] = useState<ExportScope>('group');
  const [format, setFormat] = useState<ExportFormat>('excel');
  const [xrayFormat, setXrayFormat] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const exportMutation = useMutation({
    mutationFn: async () => {
      const options = {
        xrayFormat: format === 'excel' && xrayFormat ? true : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };
      return scope === 'group'
        ? scenariosApi.exportByGroup(groupId, format, options)
        : scenariosApi.exportByProject(projectId, format, options);
    },
    onSuccess: (res) => {
      const base = scope === 'group' ? groupName : projectName;
      downloadBlobResponse(res, `${slugify(base)}.${FORMAT_EXTENSION[format]}`);
      toast.success('Senaryolar dışa aktarıldı');
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Dışa aktarılamadı', {
        description: 'Lütfen tekrar deneyin.',
        duration: 4000,
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Senaryoları dışa aktar</DialogTitle>
          <DialogDescription>
            Kapsam ve format seçin; dosya tarayıcınıza indirilir.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Scope */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-foreground">Kapsam</span>
            <div className="grid grid-cols-2 gap-2">
              {(['group', 'project'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setScope(value)}
                  data-active={scope === value || undefined}
                  className="rounded-md border border-border px-3 py-2 text-left text-[13px] text-muted-foreground transition-colors data-active:border-primary data-active:bg-accent data-active:text-foreground"
                >
                  <span className="block font-medium">
                    {value === 'group' ? 'Bu grup' : 'Tüm proje'}
                  </span>
                  <span className="block truncate text-[12px] text-muted-foreground">
                    {value === 'group' ? groupName : projectName}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="export-format" className="text-[13px] font-medium text-foreground">
              Format
            </label>
            <select
              id="export-format"
              value={format}
              onChange={(e) => setFormat(e.target.value as ExportFormat)}
              className="h-9 w-full appearance-none rounded-md border border-border bg-white px-3 text-[13px] text-foreground outline-none focus:border-primary"
            >
              {FORMAT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Xray — yalnizca Excel icin anlamli */}
          {format === 'excel' && (
            <label className="flex cursor-pointer items-start gap-2.5 rounded-md border border-border p-3">
              <input
                type="checkbox"
                checked={xrayFormat}
                onChange={(e) => setXrayFormat(e.target.checked)}
                className="mt-0.5 size-4 accent-[#1f6f4e]"
              />
              <span>
                <span className="block text-[13px] font-medium text-foreground">
                  Xray formatı
                </span>
                <span className="block text-[12px] text-muted-foreground">
                  Jira Xray ile uyumlu test case kolonlarıyla dışa aktarır.
                </span>
              </span>
            </label>
          )}

          {/* Date range */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-foreground">
              Tarih aralığı{' '}
              <span className="font-normal text-muted-foreground">(isteğe bağlı)</span>
            </span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-white px-3 text-[13px] text-foreground outline-none focus:border-primary"
              />
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-white px-3 text-[13px] text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={exportMutation.isPending}
          >
            İptal
          </Button>
          <Button onClick={() => exportMutation.mutate()} disabled={exportMutation.isPending}>
            {exportMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            {exportMutation.isPending ? 'Aktarılıyor...' : 'İndir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
