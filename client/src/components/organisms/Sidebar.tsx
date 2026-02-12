import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import Button from '../atoms/Button';
import { api } from '../../api';
import type { Project } from '../../types';

interface SidebarProps {
    onOpenProjectModal: () => void;
    refreshTrigger: number;
}

// Simple Icons
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg>;

export default function Sidebar({ onOpenProjectModal, refreshTrigger }: SidebarProps) {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        api.getProjects()
            .then((data) => setProjects(data.projects || []))
            .catch((e) => console.error("Failed to load projects for sidebar", e));
    }, [refreshTrigger]);

    return (
        <aside className="w-64 h-screen bg-surface-raised/50 backdrop-blur-xl border-r border-white/5 flex flex-col flex-shrink-0 transition-all duration-300 z-50">
            <div className="p-5 flex items-center gap-3 border-b border-white/5">
                <div className="w-8 h-8 rounded-lg bg-accent-primary text-text-on-accent flex items-center justify-center font-bold">
                    C
                </div>
                <span className="font-semibold text-text-primary">Claude Worker</span>
            </div>

            <div className="p-3 space-y-1">
                <Link to="/">
                    <Button
                        variant={isActive('/') ? 'secondary' : 'ghost'}
                        className="w-full justify-start text-sm"
                        icon={<HomeIcon />}
                    >
                        Dashboard
                    </Button>
                </Link>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-sm text-text-secondary hover:text-text-primary"
                    icon={<PlusIcon />}
                    onClick={onOpenProjectModal}
                >
                    New Project
                </Button>
            </div>

            <div className="px-4 py-2 mt-4 flex-1 overflow-y-auto">
                <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                    Recent Projects
                </h3>
                <div className="space-y-0.5">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <Link key={project.id} to={`/projects/${project.id}`}>
                                <div className={`
              flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors group
              ${isActive(`/projects/${project.id}`)
                                        ? 'bg-surface-overlay text-text-primary'
                                        : 'text-text-secondary hover:bg-surface-overlay/50 hover:text-text-primary'}
            `}>
                                    <FolderIcon />
                                    <span className="truncate flex-1">{project.name}</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-xs text-text-tertiary italic px-2">
                            No projects yet
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
