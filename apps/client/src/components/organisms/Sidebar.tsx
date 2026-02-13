import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Icon } from '@iconify/react';
import Button from '../atoms/Button';
import { api } from '../../api';
import type { Project } from '../../types';

interface SidebarProps {
    onOpenProjectModal: () => void;
    refreshTrigger: number;
}

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg>;
const GearIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>;

const LogoMark = () => (
    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-primary to-highlight flex items-center justify-center">
        <Icon icon="game-icons:bat" width="18" height="18" className="text-white" />
    </div>
);

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
        <aside className="w-64 h-screen bg-surface-raised/60 backdrop-blur-xl border-r border-border-subtle flex flex-col flex-shrink-0 z-50">
            <div className="p-5 flex items-center gap-3 border-b border-border-subtle">
                <LogoMark />
                <span className="font-semibold text-text-primary tracking-tight">Vampire</span>
            </div>

            <div className="p-3 pb-0">
                <Link to="/">
                    <Button
                        variant={isActive('/') ? 'secondary' : 'ghost'}
                        className="w-full justify-start text-sm"
                        icon={<HomeIcon />}
                    >
                        Dashboard
                    </Button>
                </Link>
            </div>
            <div className="px-3 pt-2 pb-3 border-b border-border-subtle">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-sm text-text-secondary hover:text-text-primary"
                    icon={<PlusIcon />}
                    onClick={onOpenProjectModal}
                >
                    New Project
                </Button>
            </div>

            <div className="px-4 py-2 mt-3 flex-1 overflow-y-auto">
                <h3 className="text-[11px] font-semibold text-text-tertiary uppercase tracking-widest mb-2 px-1">
                    Projects
                </h3>
                <div className="space-y-0.5">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <Link key={project.id} to={`/projects/${project.id}`}>
                                <div className={`
                                    flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 group
                                    ${isActive(`/projects/${project.id}`)
                                        ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/15'
                                        : 'text-text-secondary hover:bg-surface-overlay/60 hover:text-text-primary border border-transparent'}
                                `}>
                                    <FolderIcon />
                                    <span className="truncate flex-1">{project.name}</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-xs text-text-tertiary italic px-3 py-2">
                            No projects yet
                        </div>
                    )}
                </div>
            </div>

            <div className="px-3 py-2 border-t border-border-subtle">
                <Link to="/settings">
                    <Button
                        variant={isActive('/settings') ? 'secondary' : 'ghost'}
                        className="w-full justify-start text-sm"
                        icon={<GearIcon />}
                    >
                        Settings
                    </Button>
                </Link>
            </div>
            <div className="px-4 py-3 border-t border-border-subtle">
                <div className="text-[10px] text-text-tertiary/60 text-center">
                    Crafted by <a href="https://baejino.com">Jino Bae</a>
                </div>
            </div>
        </aside>
    );
}
