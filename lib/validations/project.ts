import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(2, 'Proje adı en az 2 karakter olmalı'),
  description: z.string().optional(),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
  name: z.string().min(2, 'Proje adı en az 2 karakter olmalı'),
  description: z.string().optional(),
});

export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;
