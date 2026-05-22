import { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/api';

/** AxiosError'dan kullaniciya gosterilecek mesaji cikar */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    if (error.response?.status === 429) {
      return 'Cok fazla istek gonderildi. Lutfen 1 dakika bekleyip tekrar deneyin.';
    }
    const body = error.response?.data as ApiErrorResponse | undefined;
    const msg = body?.error?.message;
    if (msg) return Array.isArray(msg) ? msg.join(', ') : msg;
  }
  return fallback;
}
