import { useNavigate } from 'react-router';
import Badge from '../atoms/Badge';
import type { Job } from '../../types';

interface IssueListProps {
    projectId: string | number;
    jobs: Job[];
}

const statusConfig: Record<string, { dot: string; label: string }> = {
    running: { dot: 'bg-highlight animate-pulse', label: 'Working...' },
    completed: { dot: 'bg-status-success', label: 'Completed' },
    failed: { dot: 'bg-status-error', label: 'Failed' },
    cancelled: { dot: 'bg-status-warning', label: 'Cancelled' },
};

export default function IssueList({ projectId, jobs }: IssueListProps) {
    const navigate = useNavigate();

    if (jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-56 border border-dashed border-border-default rounded-xl bg-surface-raised/30">
                <div className="w-10 h-10 rounded-full bg-accent-primary/8 border border-accent-primary/15 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="m9 15 3-3 3 3"/></svg>
                </div>
                <div className="text-text-tertiary text-sm mb-1">No jobs yet</div>
                <div className="text-xs text-text-tertiary/60">Create a new assignment to get started</div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {jobs.map((job) => {
                const cfg = statusConfig[job.status] || { dot: 'bg-text-tertiary', label: 'Pending' };
                return (
                    <div
                        key={job.id}
                        onClick={() => navigate(`/projects/${projectId}/jobs/${job.id}`)}
                        className="group bg-surface-raised border border-border-subtle rounded-lg px-5 py-4 cursor-pointer hover:border-accent-primary/25 transition-all duration-200 hover:shadow-md hover:shadow-accent-glow"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2.5">
                                        {job.issueNo != null && (
                                            <span className="font-mono text-xs text-text-tertiary flex-shrink-0">#{job.issueNo}</span>
                                        )}
                                        <h3 className="font-medium text-text-primary truncate group-hover:text-accent-secondary transition-colors">
                                            {job.issueTitle || (job.issueNo != null ? `${job.type} #${job.issueNo}` : job.type)}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-text-tertiary">
                                        <span>{cfg.label}</span>
                                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <Badge variant="neutral" className="uppercase text-[10px] tracking-wider flex-shrink-0">{job.type}</Badge>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
