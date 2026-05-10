export interface Project {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    scenarios: number;
    scenarioGroups: number;
  };
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}
