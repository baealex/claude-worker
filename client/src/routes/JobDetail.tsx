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
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
            <div className="flex flex-col gap-1">
                <Breadcrumb
                    items={[
                        { label: 'Dashboard', to: '/' },
                        { label: job.project!.name, to: `/projects/${job.project!.id}` },
                        { label: `Issue #${job.issueNo}` },
                    ]}
                />
            </div>

            <div className="flex justify-between items-start border-b border-border-default pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary mb-2 flex items-center gap-3">
                        {job.issueTitle || `${job.type} #${job.issueNo}`}
                        <Badge variant={status === 'completed' ? 'success' : status === 'failed' ? 'error' : status === 'running' ? 'accent' : status === 'cancelled' ? 'warning' : 'neutral'}>
                            {status}
                        </Badge>
                    </h1>
                    <div className="flex gap-4 text-sm text-text-secondary">
                        <span className="font-mono bg-surface-raised px-2 py-0.5 rounded text-xs">{job.type}</span>
                        {job.branch && <span className="font-mono bg-surface-raised px-2 py-0.5 rounded text-xs">{job.branch}</span>}
                        <span className="text-text-tertiary">{new Date(job.createdAt).toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {status === 'running' && (
                        <Button variant="danger" size="sm" onClick={handleCancel}>Cancel Job</Button>
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

            {/* PR 생성 완료 배너 */}
            {hasPR && (
                <div className="bg-[#1a2a1a] border border-[#2a4a2a] rounded-lg px-5 py-4 flex items-center gap-3">
                    <span className="text-sm font-semibold text-status-success">PR Created</span>
                    <a href={job.prUrl!} className="text-status-success hover:underline text-sm" target="_blank" rel="noopener noreferrer">
                        {job.prUrl}
                    </a>
                </div>
            )}

            {/* PR Form if ready */}
            {isCompleted && hasBranch && !hasPR && (
                <div className="bg-surface-raised border border-border-default rounded-lg p-5">
                    <h3 className="text-lg font-semibold mb-4 text-text-primary">Create Pull Request</h3>
                    <PRForm
                        defaultTitle={job.prTitle || `${job.type}: Issue #${job.issueNo}`}
                        defaultBody={job.prBody || ''}
                        onSubmit={handleCreatePR}
                    />
                </div>
            )}

            {/* Follow-up: 추가 수정 요청 */}
            {isCompleted && hasBranch && !hasPR && (
                <div className="bg-surface-raised border border-border-default rounded-lg p-5">
                    <h3 className="text-sm font-semibold mb-3 text-text-primary">Request Changes</h3>
                    <p className="text-xs text-text-tertiary mb-3">
                        결과물에 수정이 필요하면 피드백을 입력하세요. 같은 브랜치에서 이어서 작업합니다.
                    </p>
                    <textarea
                        className="w-full h-24 bg-surface-base border border-border-default rounded-lg p-3 text-sm text-text-primary focus:border-accent-primary outline-none resize-none"
                        placeholder="e.g. 에러 핸들링 추가해줘, 변수명을 camelCase로 바꿔줘..."
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
                <div className="bg-surface-raised border border-border-default rounded-lg overflow-hidden flex flex-col">
                    <div className="px-4 py-2 border-b border-border-default bg-surface-overlay text-xs font-semibold text-text-secondary uppercase">
                        File Changes
                    </div>
                    <div className="flex-1 overflow-auto p-0">
                        <DiffViewer diff={job.diff} />
                    </div>
                </div>

                <div className="bg-surface-raised border border-border-default rounded-lg overflow-hidden flex flex-col">
                    <div className="px-4 py-2 border-b border-border-default bg-surface-overlay text-xs font-semibold text-text-secondary uppercase">
                        Claude Code Output
                    </div>
                    <div className="flex-1 overflow-auto bg-[#0d0d0d] font-mono text-xs">
                        <LogViewer log={log} status={status} />
                    </div>
                </div>
            </div>
        </div>
    );
}
