import { useNavigate } from 'react-router';
import Badge from '../atoms/Badge';
import type { Job } from '../../types';

interface IssueListProps {
    projectId: string | number;
    jobs: Job[];
}

export default function IssueList({ projectId, jobs }: IssueListProps) {
    const navigate = useNavigate();

    if (jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border-default rounded-xl bg-surface-base/50">
                <div className="text-text-tertiary mb-2">No jobs found</div>
                <div className="text-sm text-text-secondary">Create a new assignment to get started</div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
                <div
                    key={job.id}
                    onClick={() => navigate(`/projects/${projectId}/jobs/${job.id}`)}
                    className="group bg-surface-raised border border-border-default rounded-lg p-5 cursor-pointer hover:border-accent-primary/50 transition-all hover:shadow-lg hover:shadow-accent-primary/5"
                >
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-sm text-text-tertiary">#{job.issueNo}</span>
                                <h3 className="font-medium text-text-primary text-lg group-hover:text-accent-primary transition-colors">
                                    {job.issueTitle || `${job.type} #${job.issueNo}`}
                                </h3>
                                <Badge variant={job.status === 'completed' ? 'success' : job.status === 'failed' ? 'error' : job.status === 'running' ? 'accent' : job.status === 'cancelled' ? 'warning' : 'neutral'}>
                                    {job.status}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge variant="neutral" className="uppercase text-[10px] tracking-wider">{job.type}</Badge>
                            <span className="text-xs text-text-tertiary">{new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border-subtle/50 flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${job.status === 'running' ? 'bg-accent-primary/10 text-accent-primary' : 'bg-surface-overlay text-text-tertiary'}`}>
                            C
                        </div>
                        <div className="text-xs text-text-tertiary">
                            {job.status === 'running' ? 'Claude is working...' : job.status === 'completed' ? 'Work completed' : job.status === 'failed' ? 'Work failed' : job.status === 'cancelled' ? 'Work cancelled' : 'Pending'}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
