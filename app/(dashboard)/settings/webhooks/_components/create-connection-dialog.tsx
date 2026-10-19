'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';
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
import type { ScmConnectionCreated } from '@/types/scm-webhook';
import { Toggle } from './toggle';
import { SecretReveal } from './secret-reveal';
import { Field, FieldError, Select } from './form-bits';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateConnectionDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const [created, setCreated] = useState<ScmConnectionCreated | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ConnectionFormData>({
    resolver: zodResolver(connectionFormSchema),
    defaultValues: {
      label: '',
      projectId: '',
      autoGenerate: false,
      targetGroupId: '',
    },
  });

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

  const createMutation = useMutation({
    mutationFn: (data: ConnectionFormData) =>
      scmWebhooksApi.create({
        provider: 'github',
        label: data.label || undefined,
        projectId: data.projectId || undefined,
        autoGenerate: data.autoGenerate,
        targetGroupId: data.targetGroupId || undefined,
      }),
    onSuccess: (res) => {
      setCreated(res.data.data);
      queryClient.invalidateQueries({ queryKey: ['scm-connections'] });
    },
    onError: (error) => {
      toast.error('Bağlantı oluşturulamadı', {
        description: getApiErrorMessage(error, 'Lütfen tekrar deneyin.'),
        duration: 4000,
      });
    },
  });

  function handleClose(next: boolean) {
    if (!next) {
      reset();
      setCreated(null);
    }
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {created ? (
          <>
            <DialogHeader>
              <DialogTitle>Bağlantı oluşturuldu</DialogTitle>
              <DialogDescription>
                Payload URL ve secret&apos;ı GitHub webhook ayarına ekleyin.
              </DialogDescription>
            </DialogHeader>
            <SecretReveal connection={created} />
            <DialogFooter>
              <Button onClick={() => handleClose(false)}>Tamam</Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))}>
            <DialogHeader>
              <DialogTitle>Yeni webhook bağlantısı</DialogTitle>
              <DialogDescription>
                GitHub deposunu bağlayın; isterseniz gelen issue/PR&apos;lardan otomatik
                senaryo üretin.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              <Field label="Etiket (opsiyonel)">
                <Input placeholder="örn. backend-repo" {...register('label')} />
                <FieldError>{errors.label?.message}</FieldError>
              </Field>

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
              <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                İptal
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
                Oluştur
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
