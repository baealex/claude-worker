import { Link } from 'react-router';
import Badge from '../atoms/Badge';
import type { Project } from '../../types';

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'completed': return 'success' as const;
            case 'failed': return 'error' as const;
            case 'running': return 'accent' as const;
            default: return 'neutral' as const;
        }
    };

    return (
        <Link to={`/projects/${project.id}`} className="block group animate-scale-in">
            <div className="
        h-full p-6 rounded-xl glass-card
        flex flex-col gap-4 relative overflow-hidden
      ">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-surface-overlay flex items-center justify-center text-text-secondary group-hover:text-text-primary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                                {project.name}
                            </h3>
                            <p className="text-xs text-text-tertiary">
                                Last updated 2h ago
                            </p>
                        </div>
                    </div>
                    <Badge variant={getStatusVariant((project as any).status)}>
                        {(project as any).status}
                    </Badge>
                </div>

                <p className="text-sm text-text-secondary line-clamp-2">
                    {(project as any).description || "No description provided."}
                </p>

                <div className="mt-auto pt-3 border-t border-border-subtle flex justify-between items-center text-xs text-text-tertiary">
                    <span>{project.jobs?.length || 0} jobs</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                        Open Project
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}
