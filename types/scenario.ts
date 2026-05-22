export type ScenarioCategory = 'happy_path' | 'edge_case' | 'negative';
export type ScenarioPriority = 'critical' | 'high' | 'medium' | 'low';
export type SourceType = 'text' | 'jira' | 'excel' | 'pdf';
export type TestFramework = 'cucumber' | 'playwright' | 'cypress';
export type ExportFormat = 'excel' | 'pdf' | 'json' | 'feature';

export interface TestScenario {
  id: string;
  title: string;
  input: string;
  rawOutput: string;
  bddOutput: string;
  category: ScenarioCategory;
  priority: ScenarioPriority;
  preconditions: string;
  steps: string[];
  expectedResult: string;
  sourceType: SourceType | null;
  sourceRef: string | null;
  projectId: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    name: string;
    description: string | null;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
  group?: {
    id: string;
    name: string;
    type: string;
  };
}

/** AI generation response (not yet saved) */
export interface GeneratedScenario {
  id: string;
  title: string;
  category: ScenarioCategory;
  priority: ScenarioPriority;
  preconditions: string;
  steps: string[];
  expectedResult: string;
}

export interface GenerateTextRequest {
  projectId: string;
  input: string;
}

export interface GenerateJiraRequest {
  projectId: string;
  issueKey: string;
}

export interface SaveScenariosRequest {
  groupId: string;
  input: string;
  sourceType?: SourceType;
  sourceRef?: string | null;
  scenarios: {
    title: string;
    category: ScenarioCategory;
    priority: ScenarioPriority;
    preconditions: string;
    steps: string[];
    expectedResult: string;
    bdd?: {
      framework: TestFramework;
      language: string;
      code: string;
    };
  }[];
}

export interface ConvertBddRequest {
  projectId: string;
  framework: TestFramework;
  scenarios: GeneratedScenario[];
}

export interface BddResult {
  scenarioId: string;
  framework: TestFramework;
  language: string;
  code: string;
}

export interface GenerateResponse {
  scenarios: GeneratedScenario[];
  input: string;
  sourceType: SourceType;
  sourceRef: string | null;
}

export interface ConvertBddResponse {
  framework: TestFramework;
  results: BddResult[];
}

/** Single row outcome of POST /scenarios/import-excel */
export interface ImportExcelResultItem {
  rowNumber: number;
  issueKey: string;
  testSummary: string;
  input: string;
  bddOutput: string;
  savedId?: string;
  error?: string;
}

/** POST /scenarios/import-excel → data field */
export interface ImportExcelResult {
  totalRows: number;
  successCount: number;
  failureCount: number;
  results: ImportExcelResultItem[];
}
