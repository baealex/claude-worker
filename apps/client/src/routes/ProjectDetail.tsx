import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { api } from '../api';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import Input from '../components/atoms/Input';
import ErrorBanner from '../components/atoms/ErrorBanner';
import IssueList from '../components/organisms/IssueList';
import type { Project } from '../types';

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Issue Creation State
    const [isCreating, setIsCreating] = useState(false);
    const [issueType, setIssueType] = useState('feat');
    const [issueTitle, setIssueTitle] = useState('');
    const [issueBody, setIssueBody] = useState('');
    const [importId, setImportId] = useState('');
    const [mode, setMode] = useState<'create' | 'import' | 'direct'>('direct');

    const load = async () => {
        try {
            const data = await api.getProject(id!);
            setProject(data.project);
        } catch (e: any) {
            setError(e.message);
        }
    };

    useEffect(() => { load(); }, [id]);

    const handleCreateJob = async () => {
        if ((mode === 'create' || mode === 'direct') && !issueTitle.trim()) return;
        if (mode === 'import' && !importId.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const payload = mode === 'import'
                ? { type: issueType, mode: 'existing', issueNo: Number(importId) }
                : mode === 'direct'
                    ? { type: issueType, mode: 'direct', issueTitle: issueTitle.trim(), issueBody: issueBody.trim() }
                    : { type: issueType, mode: 'create', issueTitle: issueTitle.trim(), issueBody: issueBody.trim() };

            await api.createJob(id!, payload);
            setIssueTitle('');
            setIssueBody('');
            setImportId('');
            setIsCreating(false);
            await load();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    if (!project) return <div className="p-10 text-center text-text-tertiary">Loading workspace...</div>;

    return (
        <div className="flex flex-col h-full animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-border-subtle">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3 tracking-tight">
                        {project.name}
                        <Badge variant="neutral" className="text-xs font-normal font-mono px-2 py-0.5">{project.baseBranch}</Badge>
                    </h1>
                    <p className="text-xs text-text-tertiary mt-1 font-mono">{project.path}</p>
                </div>
                <Button variant="secondary" onClick={() => setIsCreating(!isCreating)}>
                    {isCreating ? 'Cancel' : 'New Assignment'}
                </Button>
            </div>

            <ErrorBanner message={error} onDismiss={() => setError(null)} />

            {/* Creation Area */}
            {isCreating && (
                <div className="bg-surface-raised border border-border-subtle rounded-xl p-6 animate-slide-up">
                    <h2 className="text-base font-semibold text-text-primary mb-4">Assign Work</h2>

                    {/* Type selector */}
                    <div className="flex gap-2 mb-4">
                        {(['feat', 'fix', 'refactor', 'chore'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setIssueType(t)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 border ${issueType === t
                                        ? 'bg-accent-primary/15 border-accent-primary/30 text-accent-primary'
                                        : 'bg-transparent border-border-default text-text-tertiary hover:text-text-secondary hover:border-border-focus'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex gap-1 mb-5 bg-surface-base rounded-lg p-1 w-fit">
                        {([
                            { key: 'direct', label: 'Direct' },
                            { key: 'create', label: 'Create Issue' },
                            { key: 'import', label: 'Import Issue' },
                        ] as const).map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setMode(key)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${mode === key
                                        ? 'bg-surface-overlay text-text-primary shadow-sm'
                                        : 'text-text-tertiary hover:text-text-secondary'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {mode === 'import' ? (
                        <div className="space-y-4">
                            <Input
                                label="GitHub Issue Number"
                                placeholder="123"
                                value={importId}
                                onChange={(e) => setImportId(e.target.value.replace(/\D/g, ''))}
                                helperText="Enter an existing GitHub issue number."
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Input
                                label={mode === 'direct' ? 'Title' : 'Issue Title'}
                                placeholder="Brief summary of the task"
                                value={issueTitle}
                                onChange={(e) => setIssueTitle(e.target.value)}
                            />
                            <div>
                                <label className="block text-xs font-medium text-text-secondary mb-1.5 ml-1">Description</label>
                                <textarea
                                    className="w-full h-28 bg-surface-base border border-border-default rounded-lg p-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 outline-none resize-none transition-all"
                                    placeholder="Detailed description of the task..."
                                    value={issueBody}
                                    onChange={(e) => setIssueBody(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end mt-5">
                        <Button
                            onClick={handleCreateJob}
                            isLoading={loading}
                            disabled={(mode === 'import' ? !importId.trim() : !issueTitle.trim()) || loading}
                        >
                            Start Agent
                        </Button>
                    </div>
                </div>
            )}

            {/* Job List */}
            <div className="flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Jobs</h2>
                    <span className="text-xs text-text-tertiary bg-surface-overlay px-2 py-0.5 rounded-full">{project.jobs?.length || 0}</span>
                </div>
                <IssueList projectId={id!} jobs={project.jobs || []} />
            </div>
        </div>
    );
}
