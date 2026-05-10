import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(2, 'Proje adi en az 2 karakter olmali'),
  description: z.string().optional(),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
