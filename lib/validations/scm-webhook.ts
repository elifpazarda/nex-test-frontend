import { z } from 'zod';

// Baglanti olusturma/guncelleme formu. autoGenerate acikken targetGroupId zorunlu
// (backend ile ayni kural). projectId grup secimini surukler.
export const connectionFormSchema = z
  .object({
    label: z.string().max(100, 'En fazla 100 karakter olabilir').optional(),
    projectId: z.string().optional(),
    autoGenerate: z.boolean(),
    targetGroupId: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.autoGenerate && !val.targetGroupId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['targetGroupId'],
        message: 'Otomatik üretim için bir hedef grup seçin',
      });
    }
  });

export type ConnectionFormData = z.infer<typeof connectionFormSchema>;
