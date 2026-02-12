export interface Project {
  id: number;
  name: string;
  path: string;
  baseBranch: string;
  prompt: string;
  createdAt: string;
  jobs?: Job[];
}

export interface Job {
  id: number;
  projectId: number;
  project?: Project;
  issueNo: number;
  issueTitle: string;
  type: string;
  status: string;
  branch: string | null;
  prUrl: string | null;
  prBody: string | null;
  prTitle: string | null;
  diff: string | null;
  log: string;
  createdAt: string;
  updatedAt: string;
}
