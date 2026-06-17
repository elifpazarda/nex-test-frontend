import { z } from 'zod';
import { SCENARIO_GROUP_TYPES } from '@/types/scenario-group';

/** Scenario grubu olusturma — backend: name 2-100, type enum */
export const scenarioGroupSchema = z.object({
  name: z
    .string()
    .min(2, 'Grup adı en az 2 karakter olmalı')
    .max(100, 'Grup adı en fazla 100 karakter olmalı'),
  type: z.enum(SCENARIO_GROUP_TYPES, {
    message: 'Geçerli bir grup tipi seçin',
  }),
});

export type ScenarioGroupFormData = z.infer<typeof scenarioGroupSchema>;

/** Senaryo grubu güncelleme — backend ile aynı kurallar */
export const updateScenarioGroupSchema = scenarioGroupSchema;

export type UpdateScenarioGroupFormData = z.infer<typeof updateScenarioGroupSchema>;

/** Metinden senaryo uretimi — backend: input 10-2000 karakter */
export const generateTextSchema = scenarioGroupSchema.extend({
  input: z
    .string()
    .min(10, 'Açıklama en az 10 karakter olmalı')
    .max(2000, 'Açıklama en fazla 2000 karakter olmalı'),
});

export type GenerateTextFormData = z.infer<typeof generateTextSchema>;

/** Jira issue key — orn: PROJ-123 */
export const jiraIssueKeySchema = z
  .string()
  .regex(/^[A-Z][A-Z0-9]+-\d+$/, 'Geçersiz Jira issue key formatı (örn: PROJ-123)');

/** Jira'dan senaryo uretimi — grup bilgisi + issue key */
export const generateJiraSchema = scenarioGroupSchema.extend({
  issueKey: jiraIssueKeySchema,
});

export type GenerateJiraFormData = z.infer<typeof generateJiraSchema>;

/** Dosyadan (Excel/PDF) senaryo uretimi — grup bilgisi yeterli, dosya ayrica dogrulanir */
export const generateFileSchema = scenarioGroupSchema;

export type GenerateFileFormData = z.infer<typeof generateFileSchema>;
