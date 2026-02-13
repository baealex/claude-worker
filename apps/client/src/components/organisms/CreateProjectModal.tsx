import { useState, useEffect, type FormEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { api } from '../../api';
import Button from '../atoms/Button';
import Input from '../atoms/Input';

interface CreateProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated: () => void;
}

interface BrowseEntry {
    name: string;
    path: string;
    isGitRepo: boolean;
}

export default function CreateProjectModal({ open, onOpenChange, onCreated }: CreateProjectModalProps) {
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

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            setName('');
            setPath('');
            setError(null);
            setShowBrowser(false);
            setBrowseDir('');
            setEntries([]);
        }
    }, [open]);

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
            onOpenChange(false);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-surface-raised border border-border-subtle rounded-xl w-full max-w-lg p-6 shadow-2xl animate-scale-in">
                    <Dialog.Title className="text-xl font-bold text-text-primary mb-4">
                        Create New Project
                    </Dialog.Title>

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
                                    className="flex-1 bg-surface-base border border-border-default text-text-primary text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/50 font-mono transition-all"
                                    placeholder="/Users/username/projects/myapp"
                                    value={path}
                                    onChange={(e) => setPath(e.target.value)}
                                />
                                <Button type="button" variant="secondary" size="lg" onClick={() => setShowBrowser(!showBrowser)}>
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
                            <Dialog.Close asChild>
                                <Button type="button" variant="ghost">Cancel</Button>
                            </Dialog.Close>
                            <Button type="submit" isLoading={loading} disabled={!name || !path || loading}>
                                Create Project
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
