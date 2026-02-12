import { useState, useEffect, type FormEvent } from 'react';
import { api } from '../../api';
import Button from '../atoms/Button';
import Input from '../atoms/Input';

interface CreateProjectModalProps {
    onClose: () => void;
    onCreated: () => void;
}

interface BrowseEntry {
    name: string;
    path: string;
    isGitRepo: boolean;
}

export default function CreateProjectModal({ onClose, onCreated }: CreateProjectModalProps) {
    const [name, setName] = useState('');
    const [path, setPath] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Directory browser
    const [showBrowser, setShowBrowser] = useState(false);
    const [browseDir, setBrowseDir] = useState('');
    const [entries, setEntries] = useState<BrowseEntry[]>([]);
    const [browseLoading, setBrowseLoading] = useState(false);

    const browse = async (dir?: string) => {
        setBrowseLoading(true);
        try {
            const data = await api.browse(dir);
            setBrowseDir(data.dir);
            setEntries(data.entries);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setBrowseLoading(false);
        }
    };

    useEffect(() => {
        if (showBrowser && !browseDir) {
            browse();
        }
    }, [showBrowser]);

    const selectDir = (entry: BrowseEntry) => {
        if (entry.isGitRepo) {
            setPath(entry.path);
            if (!name) setName(entry.name);
            setShowBrowser(false);
        } else {
            browse(entry.path);
        }
    };

    const goUp = () => {
        const parent = browseDir.replace(/\/[^/]+$/, '') || '/';
        browse(parent);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!name || !path) return;

        setLoading(true);
        setError(null);

        try {
            await api.createProject({ name, path });
            onCreated();
            onClose();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface-raised border border-border-default rounded-xl w-full max-w-lg p-6 shadow-2xl animate-scale-in">
                <h2 className="text-xl font-bold text-text-primary mb-4">Create New Project</h2>

                {error && (
                    <div className="bg-status-error/10 text-status-error p-3 rounded-lg mb-4 text-sm flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="text-status-error/70 hover:text-status-error ml-2">&times;</button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Project Name"
                        placeholder="e.g. My Awesome App"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Local Path</label>
                        <div className="flex gap-2">
                            <input
                                className="flex-1 bg-surface-base border border-border-default text-text-primary text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 font-mono"
                                placeholder="/Users/username/projects/myapp"
                                value={path}
                                onChange={(e) => setPath(e.target.value)}
                            />
                            <Button type="button" variant="secondary" size="sm" onClick={() => setShowBrowser(!showBrowser)}>
                                Browse
                            </Button>
                        </div>
                    </div>

                    {/* Directory Browser */}
                    {showBrowser && (
                        <div className="bg-surface-base border border-border-default rounded-lg overflow-hidden">
                            <div className="px-3 py-2 border-b border-border-default bg-surface-overlay flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={goUp}
                                    className="text-xs text-text-secondary hover:text-text-primary px-2 py-1 rounded hover:bg-surface-base transition-colors"
                                >
                                    ..
                                </button>
                                <span className="text-xs font-mono text-text-tertiary truncate flex-1">{browseDir}</span>
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                                {browseLoading ? (
                                    <div className="p-4 text-center text-xs text-text-tertiary animate-pulse">Loading...</div>
                                ) : entries.length === 0 ? (
                                    <div className="p-4 text-center text-xs text-text-tertiary">No subdirectories</div>
                                ) : (
                                    entries.map((entry) => (
                                        <button
                                            key={entry.path}
                                            type="button"
                                            onClick={() => selectDir(entry)}
                                            className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-surface-overlay transition-colors border-b border-border-default/50 last:border-0"
                                        >
                                            <span className={`text-xs ${entry.isGitRepo ? 'text-status-success' : 'text-text-tertiary'}`}>
                                                {entry.isGitRepo ? '●' : '▸'}
                                            </span>
                                            <span className={`truncate ${entry.isGitRepo ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                                                {entry.name}
                                            </span>
                                            {entry.isGitRepo && (
                                                <span className="ml-auto text-[10px] text-status-success/70 font-mono">git</span>
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" isLoading={loading} disabled={!name || !path || loading}>
                            Create Project
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
