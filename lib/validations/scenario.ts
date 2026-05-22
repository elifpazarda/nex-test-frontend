import { z } from 'zod';
import { SCENARIO_GROUP_TYPES } from '@/types/scenario-group';

/** Scenario grubu olusturma — backend: name 2-100, type enum */
export const scenarioGroupSchema = z.object({
  name: z
    .string()
    .min(2, 'Grup adi en az 2 karakter olmali')
    .max(100, 'Grup adi en fazla 100 karakter olmali'),
  type: z.enum(SCENARIO_GROUP_TYPES, {
    message: 'Gecerli bir grup tipi secin',
  }),
});

export type ScenarioGroupFormData = z.infer<typeof scenarioGroupSchema>;

/** Metinden senaryo uretimi — backend: input 10-2000 karakter */
export const generateTextSchema = scenarioGroupSchema.extend({
  input: z
    .string()
    .min(10, 'Aciklama en az 10 karakter olmali')
    .max(2000, 'Aciklama en fazla 2000 karakter olmali'),
});

export type GenerateTextFormData = z.infer<typeof generateTextSchema>;

/** Jira issue key — orn: PROJ-123 */
export const jiraIssueKeySchema = z
  .string()
  .regex(/^[A-Z][A-Z0-9]+-\d+$/, 'Gecersiz Jira issue key formati (orn: PROJ-123)');

/** Jira'dan senaryo uretimi — grup bilgisi + issue key */
export const generateJiraSchema = scenarioGroupSchema.extend({
  issueKey: jiraIssueKeySchema,
});

export type GenerateJiraFormData = z.infer<typeof generateJiraSchema>;

/** Dosyadan (Excel/PDF) senaryo uretimi — grup bilgisi yeterli, dosya ayrica dogrulanir */
export const generateFileSchema = scenarioGroupSchema;

export type GenerateFileFormData = z.infer<typeof generateFileSchema>;
