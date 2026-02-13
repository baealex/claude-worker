import { useState, useEffect } from 'react';
import { api } from '../api';
import ProjectCard from '../components/molecules/ProjectCard';
import Button from '../components/atoms/Button';
import ErrorBanner from '../components/atoms/ErrorBanner';
import { useProjectCreation } from '../components/templates/MainLayout';
import type { Project } from '../types';

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { openProjectModal, refreshTrigger } = useProjectCreation();

    const load = async () => {
        try {
            const data = await api.getProjects();
            setProjects(data.projects);
        } catch (e: any) {
            setError(e.message);
        }
    };

    useEffect(() => { load(); }, [refreshTrigger]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary mb-1 tracking-tight">Dashboard</h1>
                    <p className="text-sm text-text-secondary">Feed it issues, get pull requests back.</p>
                </div>
                <Button onClick={openProjectModal} icon={<span className="text-lg leading-none">+</span>}>
                    New Project
                </Button>
            </div>

            <ErrorBanner message={error} onDismiss={() => setError(null)} />

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border-default rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-accent-primary/8 border border-accent-primary/15 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-primary"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg>
                    </div>
                    <div className="text-text-secondary mb-1">No projects yet</div>
                    <p className="text-xs text-text-tertiary mb-5">Add your first project to start assigning work.</p>
                    <Button variant="secondary" onClick={openProjectModal}>Get Started</Button>
                </div>
            ) : (
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Projects</h2>
                        <span className="text-xs text-text-tertiary bg-surface-overlay px-2 py-0.5 rounded-full">{projects.length}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
                    </div>
                </div>
            )}
        </div>
    );
}
