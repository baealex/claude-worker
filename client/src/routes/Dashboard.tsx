import { useState, useEffect } from 'react';
import { api } from '../api';
import ProjectCard from '../components/molecules/ProjectCard';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
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
                    <h1 className="text-3xl font-bold text-text-primary mb-1">Dashboard</h1>
                    <p className="text-text-secondary">Manage your coding assistant projects.</p>
                </div>
                <Button onClick={openProjectModal} icon={<span className="text-lg leading-none">+</span>}>
                    New Project
                </Button>
            </div>

            <ErrorBanner message={error} onDismiss={() => setError(null)} />

            <div>
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    Active Projects
                    <Badge variant="neutral">{projects.length}</Badge>
                </h2>

                {projects.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-border-default rounded-xl">
                        <div className="text-text-tertiary mb-4">No projects found</div>
                        <Button variant="secondary" onClick={openProjectModal}>Get Started</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
