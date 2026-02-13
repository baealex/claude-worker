import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { api } from '../api';
import { useSSE } from '../hooks/useSSE';
import Breadcrumb from '../components/molecules/Breadcrumb';
import Badge from '../components/atoms/Badge';
import Button from '../components/atoms/Button';
import ErrorBanner from '../components/atoms/ErrorBanner';
import LogViewer from '../components/molecules/LogViewer';
import DiffViewer from '../components/atoms/DiffViewer';
import PRForm from '../components/molecules/PRForm';
import WorkerStatus from '../components/molecules/PersonaHeader';
import type { Job } from '../types';

export default function JobDetail() {
    const { id: projectId, jobId } = useParams<{ id: string; jobId: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<Job | null>(null);
    const [log, setLog] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Follow-up state
    const [followUpMessage, setFollowUpMessage] = useState('');
    const [followUpLoading, setFollowUpLoading] = useState(false);

    const load = async () => {
        try {
            const data = await api.getJob(jobId!);
            setJob(data.job);
            setLog(data.job.log || '');
            setStatus(data.job.status);
        } catch (e: any) {
            setError(e.message);
        }
    };

    useEffect(() => { load(); }, [jobId]);

    const onLog = useCallback((chunk: string) => {
        setLog((prev) => prev + chunk);
    }, []);

    const onDone = useCallback((newStatus: string) => {
        setStatus(newStatus);
        api.getJob(jobId!).then((data) => {
            setJob(data.job);
            setLog(data.job.log || '');
        }).catch(() => { });
    }, [jobId]);

    useSSE(jobId, status, { onLog, onDone });

    const handleCancel = async () => {
        try {
            const data = await api.cancelJob(jobId!);
            setJob(data.job);
            setStatus(data.job.status);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleRetry = async () => {
        try {
            const data = await api.retryJob(jobId!);
            navigate(`/projects/${projectId}/jobs/${data.job.id}`);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleDelete = async () => {
        try {
            await api.deleteJob(jobId!);
            navigate(`/projects/${projectId}`);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleCreatePR = async (body: { prTitle: string; prBody: string }) => {
        try {
            const data = await api.createPR(jobId!, body);
            setJob(data.job);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleFollowUp = async () => {
        if (!followUpMessage.trim()) return;
        setFollowUpLoading(true);
        setError(null);
        try {
            const data = await api.followUpJob(jobId!, { message: followUpMessage.trim() });
            setFollowUpMessage('');
            navigate(`/projects/${projectId}/jobs/${data.job.id}`);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setFollowUpLoading(false);
        }
    };

    if (!job && !error) {
        return <div className="text-text-tertiary py-8 text-center animate-pulse">Loading job details...</div>;
    }

    if (!job) {
        return <ErrorBanner message={error} />;
    }

    const isCompleted = status === 'completed';
    const hasBranch = !!job.branch;
    const hasPR = !!job.prUrl;

    return (
        <div className="max-w-6xl mx-auto space-y-5 animate-fade-in">
            <Breadcrumb
                items={[
                    { label: 'Dashboard', to: '/' },
                    { label: job.project!.name, to: `/projects/${job.project!.id}` },
                    { label: job.issueNo != null ? `Issue #${job.issueNo}` : (job.issueTitle || `Job #${job.id}`) },
                ]}
            />

            <div className="flex justify-between items-start border-b border-border-subtle pb-5">
                <div>
                    <h1 className="text-xl font-bold text-text-primary mb-2 flex items-center gap-3 tracking-tight">
                        {job.issueTitle || (job.issueNo != null ? `${job.type} #${job.issueNo}` : job.type)}
                        <Badge variant={status === 'completed' ? 'success' : status === 'failed' ? 'error' : status === 'running' ? 'accent' : status === 'cancelled' ? 'warning' : 'neutral'}>
                            {status}
                        </Badge>
                    </h1>
                    <div className="flex gap-3 text-xs text-text-secondary">
                        <span className="font-mono bg-surface-overlay px-2 py-0.5 rounded">{job.type}</span>
                        {job.branch && <span className="font-mono bg-surface-overlay px-2 py-0.5 rounded">{job.branch}</span>}
                        <span className="text-text-tertiary">{new Date(job.createdAt).toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {status === 'running' && (
                        <Button variant="danger" size="sm" onClick={handleCancel}>Cancel</Button>
                    )}
                    {(status === 'failed' || status === 'cancelled') && (
                        <Button variant="secondary" size="sm" onClick={handleRetry}>Retry</Button>
                    )}
                    {status !== 'running' && (
                        <Button variant="ghost" size="sm" className="text-status-error hover:bg-status-error/10" onClick={handleDelete}>
                            Delete
                        </Button>
                    )}
                </div>
            </div>

            <ErrorBanner message={error} onDismiss={() => setError(null)} />

            <WorkerStatus status={status} />

            {/* PR Created Banner */}
            {hasPR && (
                <div className="bg-status-success/5 border border-status-success/20 rounded-lg px-5 py-3 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-status-success" />
                    <span className="text-sm font-medium text-status-success">PR Created</span>
                    <a href={job.prUrl!} className="text-status-success/80 hover:text-status-success hover:underline text-sm ml-1 truncate" target="_blank" rel="noopener noreferrer">
                        {job.prUrl}
                    </a>
                </div>
            )}

            {/* PR Form */}
            {isCompleted && hasBranch && !hasPR && (
                <div className="bg-surface-raised border border-border-subtle rounded-lg p-5">
                    <h3 className="text-base font-semibold mb-4 text-text-primary">Create Pull Request</h3>
                    <PRForm
                        defaultTitle={job.prTitle || (job.issueNo != null ? `${job.type}: Issue #${job.issueNo}` : `${job.type}: ${job.issueTitle}`)}
                        defaultBody={job.prBody || ''}
                        onSubmit={handleCreatePR}
                    />
                </div>
            )}

            {/* Follow-up */}
            {isCompleted && hasBranch && !hasPR && (
                <div className="bg-surface-raised border border-border-subtle rounded-lg p-5">
                    <h3 className="text-sm font-semibold mb-2 text-text-primary">Request Changes</h3>
                    <p className="text-xs text-text-tertiary mb-3">
                        Provide feedback to continue work on the same branch.
                    </p>
                    <textarea
                        className="w-full h-20 bg-surface-base border border-border-default rounded-lg p-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 outline-none resize-none transition-all"
                        placeholder="Describe the changes you'd like..."
                        value={followUpMessage}
                        onChange={(e) => setFollowUpMessage(e.target.value)}
                    />
                    <div className="flex justify-end mt-3">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleFollowUp}
                            isLoading={followUpLoading}
                            disabled={!followUpMessage.trim() || followUpLoading}
                        >
                            Send Feedback
                        </Button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]">
                <div className="bg-surface-raised border border-border-subtle rounded-lg overflow-hidden flex flex-col">
                    <div className="px-4 py-2 border-b border-border-subtle bg-surface-overlay/50 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                        File Changes
                    </div>
                    <div className="flex-1 overflow-auto p-0">
                        <DiffViewer diff={job.diff} />
                    </div>
                </div>

                <div className="bg-surface-raised border border-border-subtle rounded-lg overflow-hidden flex flex-col">
                    <div className="px-4 py-2 border-b border-border-subtle bg-surface-overlay/50 text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                        Output
                    </div>
                    <div className="flex-1 overflow-auto bg-surface-base font-mono text-xs">
                        <LogViewer log={log} status={status} />
                    </div>
                </div>
            </div>
        </div>
    );
}
