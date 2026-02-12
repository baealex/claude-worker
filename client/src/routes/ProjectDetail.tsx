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
    const [mode, setMode] = useState<'create' | 'import'>('create');

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
        if (mode === 'create' && !issueTitle.trim()) return;
        if (mode === 'import' && !importId.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const payload = mode === 'import'
                ? { type: issueType, mode: 'existing', issueNo: Number(importId) }
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
            <div className="flex items-center justify-between pb-6 border-b border-border-default">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
                        {project.name}
                        <Badge variant="neutral" className="text-sm font-normal font-mono px-2 py-1">{project.path}</Badge>
                    </h1>
                    <p className="text-text-secondary mt-1">Manage issues and assign Claude Code.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setIsCreating(!isCreating)}>
                        {isCreating ? 'Cancel' : 'New Assignment'}
                    </Button>
                </div>
            </div>

            <ErrorBanner message={error} onDismiss={() => setError(null)} />

            {/* Creation Area (Collapsible) */}
            {isCreating && (
                <div className="bg-surface-raised border border-border-default rounded-xl p-6 animate-slide-up">
                    <h2 className="text-lg font-semibold text-text-primary mb-4">Assign Work to Claude Code</h2>

                    <div className="flex gap-4 mb-4">
                        {(['feat', 'fix', 'refactor', 'chore'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setIssueType(t)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${issueType === t
                                        ? 'bg-accent-primary border-accent-primary text-text-on-accent'
                                        : 'bg-surface-base border-border-default text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setMode('create')}
                            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${mode === 'create' ? 'bg-surface-overlay text-text-primary' : 'text-text-tertiary hover:text-text-secondary'}`}
                        >
                            Create New Issue
                        </button>
                        <button
                            onClick={() => setMode('import')}
                            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${mode === 'import' ? 'bg-surface-overlay text-text-primary' : 'text-text-tertiary hover:text-text-secondary'}`}
                        >
                            Import Existing Issue
                        </button>
                    </div>

                    {mode === 'create' ? (
                        <div className="space-y-4">
                            <Input
                                label="Issue Title"
                                placeholder="Brief summary of the task"
                                value={issueTitle}
                                onChange={(e) => setIssueTitle(e.target.value)}
                            />
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
                                <textarea
                                    className="w-full h-32 bg-surface-base border border-border-default rounded-lg p-3 text-text-primary focus:border-accent-primary outline-none resize-none"
                                    placeholder="Detailed description of the task..."
                                    value={issueBody}
                                    onChange={(e) => setIssueBody(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Input
                                label="GitHub Issue Number"
                                placeholder="123"
                                value={importId}
                                onChange={(e) => setImportId(e.target.value.replace(/\D/g, ''))}
                                helperText="Enter an existing GitHub issue number."
                            />
                        </div>
                    )}

                    <div className="flex justify-end mt-4">
                        <Button
                            onClick={handleCreateJob}
                            isLoading={loading}
                            disabled={(mode === 'create' ? !issueTitle.trim() : !importId.trim()) || loading}
                        >
                            Start Claude Code
                        </Button>
                    </div>
                </div>
            )}

            {/* Issue List */}
            <div className="flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-text-primary">Jobs</h2>
                    <span className="text-sm text-text-tertiary">{project.jobs?.length || 0} items</span>
                </div>
                <IssueList projectId={id!} jobs={project.jobs || []} />
            </div>
        </div>
    );
}
