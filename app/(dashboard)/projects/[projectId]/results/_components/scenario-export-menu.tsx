'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { scenariosApi } from '@/lib/api/endpoints/scenarios';
import { downloadBlobResponse, FORMAT_EXTENSION } from '@/lib/api/download';
import type { ExportFormat } from '@/types/scenario';

const FORMAT_OPTIONS: { value: ExportFormat; label: string }[] = [
  { value: 'excel', label: 'Excel (.xlsx)' },
  { value: 'pdf', label: 'PDF (.pdf)' },
  { value: 'json', label: 'JSON (.json)' },
  { value: 'feature', label: 'Gherkin (.feature)' },
];

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'senaryo'
  );
}

/** Tek bir senaryoyu secilen formatta indiren menu */
export function ScenarioExportMenu({
  scenarioId,
  title,
}: {
  scenarioId: string;
  title: string;
}) {
  const exportMutation = useMutation({
    mutationFn: (format: ExportFormat) => scenariosApi.exportSingle(scenarioId, format),
    onSuccess: (res, format) => {
      downloadBlobResponse(res, `${slugify(title)}.${FORMAT_EXTENSION[format]}`);
      toast.success('Senaryo disa aktarildi');
    },
    onError: () => {
      toast.error('Disa aktarilamadi', {
        description: 'Lutfen tekrar deneyin.',
        duration: 4000,
      });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={exportMutation.isPending}
          className="inline-flex items-center gap-1 rounded-[6px] px-2.5 py-1 text-[12px] font-medium text-[#5c5a52] hover:bg-[#f4efe3] disabled:opacity-50"
        >
          {exportMutation.isPending ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Download className="size-3" />
          )}
          Disa aktar
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {FORMAT_OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onSelect={() => exportMutation.mutate(opt.value)}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
