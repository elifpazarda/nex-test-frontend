import { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/api';

/** AxiosError'dan kullaniciya gosterilecek mesaji cikar */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return 'İşlem beklenenden uzun sürdü ve zaman aşımına uğradı. Lütfen tekrar deneyin.';
    }
    if (error.response?.status === 429) {
      return 'Çok fazla istek gönderildi. Lütfen 1 dakika bekleyip tekrar deneyin.';
    }
    const body = error.response?.data as ApiErrorResponse | undefined;
    const msg = body?.error?.message;
    if (msg) return Array.isArray(msg) ? msg.join(', ') : msg;
  }
  return fallback;
}
