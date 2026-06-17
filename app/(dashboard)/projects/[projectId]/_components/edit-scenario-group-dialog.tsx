'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { scenarioGroupsApi } from '@/lib/api/endpoints/scenario-groups';
import {
  updateScenarioGroupSchema,
  type UpdateScenarioGroupFormData,
} from '@/lib/validations/scenario';
import { SCENARIO_GROUP_TYPES } from '@/types/scenario-group';
import type { ScenarioGroup } from '@/types/scenario-group';
import type { ApiErrorResponse } from '@/types/api';

const TYPE_LABELS: Record<string, string> = {
  FEATURE: 'Feature',
  REGRESSION: 'Regression',
  BUG: 'Bug',
  SMOKE: 'Smoke',
  INTEGRATION: 'Integration',
  E2E: 'E2E',
  PERFORMANCE: 'Performance',
  OTHER: 'Diğer',
};

interface EditScenarioGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: ScenarioGroup;
  projectId: string;
}

export function EditScenarioGroupDialog({
  open,
  onOpenChange,
  group,
  projectId,
}: EditScenarioGroupDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateScenarioGroupFormData>({
    resolver: zodResolver(updateScenarioGroupSchema),
    defaultValues: { name: group.name, type: group.type },
  });

  const {
    register,
    formState: { errors },
    reset,
  } = form;

  useEffect(() => {
    if (open) {
      reset({ name: group.name, type: group.type });
    }
  }, [open, group, reset]);

  const mutation = useMutation({
    mutationFn: (data: UpdateScenarioGroupFormData) => scenarioGroupsApi.update(group.id, data),
    onSuccess: () => {
      toast.success('Grup güncellendi');
      queryClient.invalidateQueries({ queryKey: ['scenario-groups', projectId] });
      queryClient.invalidateQueries({ queryKey: ['scenario-group', group.id] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      let message = 'Grup güncellenemedi. Lütfen tekrar deneyin.';
      if (error instanceof AxiosError && error.response?.data) {
        const body = error.response.data as ApiErrorResponse;
        const msg = body.error?.message;
        message = Array.isArray(msg) ? msg.join(', ') : msg || message;
      }
      toast.error('Grup güncellenemedi', { description: message, duration: 4000 });
    },
  });

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data));

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) reset();
        onOpenChange(value);
      }}
    >
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-[18px]">Grubu düzenle</DialogTitle>
          <DialogDescription>Grup adını ve tipini güncelleyin.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-group-name"
              className="text-[13px] font-medium text-[var(--palette-neutral-600)]"
            >
              Grup adı
            </label>
            <div
              className={`flex items-center rounded-md border bg-white shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] transition-[border-color,box-shadow] duration-100 ${errors.name ? 'border-[var(--palette-danger-500)] shadow-[0_0_0_4px_rgba(192,57,43,0.1)]' : 'border-border focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]'}`}
            >
              <input
                id="edit-group-name"
                type="text"
                placeholder="Örn: Sepet · Ödeme"
                autoFocus
                className="h-[42px] w-full rounded-[inherit] border-0 bg-transparent px-3.5 text-[15px] text-foreground outline-none placeholder:text-[var(--palette-neutral-400)]"
                {...register('name')}
              />
            </div>
            {errors.name && (
              <p className="text-[12px] text-[var(--palette-danger-600)]">{errors.name.message}</p>
            )}
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-group-type"
              className="text-[13px] font-medium text-[var(--palette-neutral-600)]"
            >
              Tip
            </label>
            <select
              id="edit-group-type"
              {...register('type')}
              className="h-[42px] w-full appearance-none rounded-md border border-border bg-white px-3.5 text-[15px] text-foreground shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] outline-none focus:border-primary focus:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]"
            >
              {SCENARIO_GROUP_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-[12px] text-[var(--palette-danger-600)]">{errors.type.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md px-4 py-2 text-[13px] font-medium text-[var(--palette-neutral-600)] hover:bg-muted"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-[13px] font-semibold text-primary-foreground shadow-[0_6px_18px_-6px_rgba(31,111,78,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] transition-[background,transform] duration-100 hover:bg-[var(--palette-brand-700)] active:translate-y-[0.5px] active:bg-[var(--palette-brand-800)] disabled:cursor-not-allowed disabled:opacity-55"
            >
              {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {mutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
