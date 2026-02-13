import { Link } from 'react-router';
import type { Project } from '../../types';

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const jobCount = project.jobs?.length || 0;
    const runningJobs = project.jobs?.filter(j => j.status === 'running').length || 0;

    return (
        <Link to={`/projects/${project.id}`} className="block group animate-scale-in">
            <div className="h-full rounded-xl glass-card p-5 flex flex-col gap-4 relative overflow-hidden">
                {/* Top gradient line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent-primary/0 via-accent-primary/50 to-highlight/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent-primary/8 border border-accent-primary/15 flex items-center justify-center text-accent-primary group-hover:bg-accent-primary/15 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-text-primary group-hover:text-accent-secondary transition-colors truncate">
                            {project.name}
                        </h3>
                        <p className="text-xs text-text-tertiary font-mono mt-0.5 truncate">{project.path}</p>
                    </div>
                </div>

                <div className="mt-auto pt-3 border-t border-border-subtle flex items-center gap-4 text-xs text-text-tertiary">
                    <span>{jobCount} {jobCount === 1 ? 'job' : 'jobs'}</span>
                    {runningJobs > 0 && (
                        <span className="flex items-center gap-1.5 text-highlight">
                            <span className="w-1.5 h-1.5 rounded-full bg-highlight animate-pulse" />
                            {runningJobs} running
                        </span>
                    )}
                    <span className="ml-auto flex items-center gap-1 group-hover:text-accent-secondary group-hover:translate-x-0.5 transition-all duration-200">
                        Open
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}
