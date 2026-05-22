import type { AxiosResponse } from 'axios';
import type { ExportFormat } from '@/types/scenario';

/** Export formatina karsilik gelen dosya uzantisi */
export const FORMAT_EXTENSION: Record<ExportFormat, string> = {
  excel: 'xlsx',
  pdf: 'pdf',
  json: 'json',
  feature: 'feature',
};

/**
 * Bir blob yanitini tarayicida indirilen dosyaya cevirir.
 * Dosya adi once `Content-Disposition` basligindan okunur; yoksa `fallbackName` kullanilir.
 */
export function downloadBlobResponse(response: AxiosResponse<Blob>, fallbackName: string) {
  const disposition = response.headers['content-disposition'] as string | undefined;
  let fileName = fallbackName;
  if (disposition) {
    const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
    if (match) fileName = decodeURIComponent(match[1]);
  }

  const url = URL.createObjectURL(response.data);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
