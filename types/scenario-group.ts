export const SCENARIO_GROUP_TYPES = [
  'BUG',
  'FEATURE',
  'REGRESSION',
  'SMOKE',
  'INTEGRATION',
  'E2E',
  'PERFORMANCE',
  'OTHER',
] as const;

export type ScenarioGroupType = (typeof SCENARIO_GROUP_TYPES)[number];

export interface ScenarioGroup {
  id: string;
  name: string;
  type: ScenarioGroupType;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    scenarios: number;
  };
}

export interface CreateScenarioGroupRequest {
  name: string;
  type: ScenarioGroupType;
  projectId: string;
}

export interface UpdateScenarioGroupRequest {
  name?: string;
  type?: ScenarioGroupType;
}
