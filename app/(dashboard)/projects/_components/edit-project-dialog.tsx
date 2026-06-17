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
import { projectsApi } from '@/lib/api/endpoints/projects';
import { updateProjectSchema, type UpdateProjectFormData } from '@/lib/validations/project';
import type { ApiErrorResponse } from '@/types/api';
import type { Project } from '@/types/project';

interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
}

export function EditProjectDialog({ open, onOpenChange, project }: EditProjectDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateProjectFormData>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: { name: project.name, description: project.description ?? '' },
  });

  const {
    register,
    formState: { errors },
    reset,
  } = form;

  useEffect(() => {
    if (open) {
      reset({ name: project.name, description: project.description ?? '' });
    }
  }, [open, project, reset]);

  const mutation = useMutation({
    mutationFn: (data: UpdateProjectFormData) => projectsApi.update(project.id, data),
    onSuccess: () => {
      toast.success('Proje güncellendi');
      queryClient.invalidateQueries({ queryKey: ['project', project.id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      let message = 'Proje güncellenemedi. Lütfen tekrar deneyin.';
      if (error instanceof AxiosError && error.response?.data) {
        const body = error.response.data as ApiErrorResponse;
        const msg = body.error?.message;
        message = Array.isArray(msg) ? msg.join(', ') : msg || message;
      }
      toast.error('Proje güncellenemedi', { description: message, duration: 4000 });
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
          <DialogTitle className="text-[18px]">Projeyi düzenle</DialogTitle>
          <DialogDescription>Proje adını ve açıklamasını güncelleyin.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-project-name"
              className="text-[13px] font-medium text-[var(--palette-neutral-600)]"
            >
              Proje adı
            </label>
            <div
              className={`flex items-center rounded-md border bg-white shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] transition-[border-color,box-shadow] duration-100 ${errors.name ? 'border-[var(--palette-danger-500)] shadow-[0_0_0_4px_rgba(192,57,43,0.1)]' : 'border-border focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]'}`}
            >
              <input
                id="edit-project-name"
                type="text"
                placeholder="örn. Trendyol Checkout"
                autoFocus
                className="h-[42px] w-full rounded-[inherit] border-0 bg-transparent px-3.5 text-[15px] text-foreground outline-none placeholder:text-[var(--palette-neutral-400)]"
                {...register('name')}
              />
            </div>
            {errors.name && (
              <p className="text-[12px] text-[var(--palette-danger-600)]">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-project-desc"
              className="text-[13px] font-medium text-[var(--palette-neutral-600)]"
            >
              Açıklama{' '}
              <span className="font-normal text-[var(--palette-neutral-400)]">(opsiyonel)</span>
            </label>
            <div className="flex items-center rounded-md border border-border bg-white shadow-[inset_0_1px_2px_rgba(26,26,24,0.04)] transition-[border-color,box-shadow] duration-100 focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(31,111,78,0.15)]">
              <textarea
                id="edit-project-desc"
                rows={3}
                placeholder="Bu proje hakkında kısa bir açıklama..."
                className="w-full resize-none rounded-[inherit] border-0 bg-transparent px-3.5 py-2.5 text-[14px] text-foreground outline-none placeholder:text-[var(--palette-neutral-400)]"
                {...register('description')}
              />
            </div>
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
