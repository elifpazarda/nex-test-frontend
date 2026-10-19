'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { projectsApi } from '@/lib/api/endpoints/projects';
import { scenarioGroupsApi } from '@/lib/api/endpoints/scenario-groups';
import { scmWebhooksApi } from '@/lib/api/endpoints/scm-webhooks';
import { getApiErrorMessage } from '@/lib/api/error';
import {
  connectionFormSchema,
  type ConnectionFormData,
} from '@/lib/validations/scm-webhook';
import type { ScmConnection } from '@/types/scm-webhook';
import { Toggle } from './toggle';
import { Field, FieldError, Select } from './form-bits';

interface Props {
  connection: ScmConnection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditConnectionDialog({ connection, open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const [active, setActive] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ConnectionFormData>({
    resolver: zodResolver(connectionFormSchema),
    defaultValues: { label: '', projectId: '', autoGenerate: false, targetGroupId: '' },
  });

  // Diyalog acilinca formu baglantinin mevcut degerleriyle doldur
  useEffect(() => {
    if (connection && open) {
      reset({
        label: connection.label ?? '',
        projectId: connection.projectId ?? '',
        autoGenerate: connection.autoGenerate,
        targetGroupId: connection.targetGroupId ?? '',
      });
      setActive(connection.active);
    }
  }, [connection, open, reset]);

  const projectId = watch('projectId');
  const targetGroupId = watch('targetGroupId');
  const autoGenerate = watch('autoGenerate');

  const { data: projects } = useQuery({
    queryKey: ['projects', 'all'],
    queryFn: () => projectsApi.list(1, 100),
    select: (res) => res.data.data.items,
    enabled: open,
  });

  const { data: groups } = useQuery({
    queryKey: ['scenario-groups', projectId],
    queryFn: () => scenarioGroupsApi.listByProject(projectId as string, 1, 100),
    select: (res) => res.data.data.items,
    enabled: open && !!projectId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: ConnectionFormData) =>
      scmWebhooksApi.update(connection!.id, {
        label: data.label || undefined,
        active,
        autoGenerate: data.autoGenerate,
        targetGroupId: data.targetGroupId || undefined,
      }),
    onSuccess: () => {
      toast.success('Bağlantı güncellendi');
      queryClient.invalidateQueries({ queryKey: ['scm-connections'] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error('Güncellenemedi', {
        description: getApiErrorMessage(error, 'Lütfen tekrar deneyin.'),
        duration: 4000,
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))}>
          <DialogHeader>
            <DialogTitle>Bağlantı ayarları</DialogTitle>
            <DialogDescription>
              Etiket, durum ve otomatik üretim ayarlarını güncelleyin.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <Field label="Etiket">
              <Input placeholder="örn. backend-repo" {...register('label')} />
              <FieldError>{errors.label?.message}</FieldError>
            </Field>

            <div className="flex items-center justify-between rounded-[10px] border border-[#e8e1cf] px-3 py-2.5">
              <div>
                <p className="text-[13px] font-medium text-[#1a1a18]">Aktif</p>
                <p className="text-[12px] text-[#7a7868]">
                  Pasifken gelen webhook&apos;lar reddedilir
                </p>
              </div>
              <Toggle checked={active} onChange={setActive} />
            </div>

            <Field label="Proje (otomatik üretim için)">
              <Select
                value={projectId}
                onChange={(e) => {
                  setValue('projectId', e.target.value);
                  setValue('targetGroupId', '', { shouldValidate: true });
                }}
              >
                <option value="">Seçilmedi</option>
                {projects?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Hedef grup">
              <Select
                value={targetGroupId}
                disabled={!projectId}
                onChange={(e) =>
                  setValue('targetGroupId', e.target.value, { shouldValidate: true })
                }
              >
                <option value="">{projectId ? 'Seçilmedi' : 'Önce proje seçin'}</option>
                {groups?.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </Select>
              <FieldError>{errors.targetGroupId?.message}</FieldError>
            </Field>

            <div className="flex items-center justify-between rounded-[10px] border border-[#e8e1cf] px-3 py-2.5">
              <div>
                <p className="text-[13px] font-medium text-[#1a1a18]">
                  Otomatik senaryo üret
                </p>
                <p className="text-[12px] text-[#7a7868]">
                  issue/PR açıldığında AI ile senaryo üretir
                </p>
              </div>
              <Toggle
                checked={autoGenerate}
                onChange={(v) => setValue('autoGenerate', v, { shouldValidate: true })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Kaydet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
