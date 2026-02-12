import type { Project, Job } from './types';

const BASE = '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null as T;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

interface BrowseEntry { name: string; path: string; isGitRepo: boolean }

export const api = {
  browse: (path?: string) =>
    request<{ dir: string; entries: BrowseEntry[] }>(`/browse${path ? `?path=${encodeURIComponent(path)}` : ''}`),
  getProjects: () => request<{ projects: Project[] }>('/projects'),
  getProject: (id: string | number) => request<{ project: Project }>(`/projects/${id}`),
  createProject: (body: { name: string; path: string; baseBranch?: string }) =>
    request<{ project: Project }>('/projects', { method: 'POST', body: JSON.stringify(body) }),
  updateProject: (id: string | number, body: { prompt?: string }) =>
    request<{ project: Project }>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteProject: (id: string | number) =>
    request<null>(`/projects/${id}`, { method: 'DELETE' }),

  getJob: (jobId: string | number) => request<{ job: Job }>(`/jobs/${jobId}`),
  createJob: (projectId: string | number, body: Record<string, unknown>) =>
    request<{ job: Job }>(`/projects/${projectId}/jobs`, { method: 'POST', body: JSON.stringify(body) }),
  cancelJob: (jobId: string | number) =>
    request<{ job: Job }>(`/jobs/${jobId}/cancel`, { method: 'POST' }),
  retryJob: (jobId: string | number) =>
    request<{ job: Job }>(`/jobs/${jobId}/retry`, { method: 'POST' }),
  deleteJob: (jobId: string | number) =>
    request<null>(`/jobs/${jobId}`, { method: 'DELETE' }),
  followUpJob: (jobId: string | number, body: { message: string }) =>
    request<{ job: Job }>(`/jobs/${jobId}/followup`, { method: 'POST', body: JSON.stringify(body) }),
  createPR: (jobId: string | number, body: { prTitle: string; prBody: string }) =>
    request<{ job: Job }>(`/jobs/${jobId}/pr`, { method: 'POST', body: JSON.stringify(body) }),
};
