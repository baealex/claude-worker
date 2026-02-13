interface WorkerStatusProps {
    status: string;
}

export default function WorkerStatus({ status }: WorkerStatusProps) {
    const isActive = status === 'running';
    const isCompleted = status === 'completed';
    const isFailed = status === 'failed';

    const borderColor = isActive
        ? 'border-accent-primary/30'
        : isCompleted
            ? 'border-status-success/20'
            : isFailed
                ? 'border-status-error/20'
                : 'border-border-subtle';

    const bgColor = isActive
        ? 'bg-accent-primary/5'
        : 'bg-surface-raised';

    return (
        <div className={`${bgColor} border ${borderColor} rounded-lg px-4 py-3 flex items-center gap-3 transition-colors`}>
            <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${isActive
                    ? 'bg-accent-primary/15 text-accent-primary'
                    : isCompleted
                        ? 'bg-status-success/10 text-status-success'
                        : isFailed
                            ? 'bg-status-error/10 text-status-error'
                            : 'bg-surface-overlay text-text-tertiary'
                }`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
            </div>
            <div className="flex-1">
                <div className="font-medium text-text-primary text-sm">Vampire</div>
                <div className="text-xs text-text-secondary">
                    {isActive ? 'Processing...' : isCompleted ? 'Finished successfully' : isFailed ? 'Encountered an error' : status === 'cancelled' ? 'Cancelled' : 'Idle'}
                </div>
            </div>
            {isActive && (
                <div className="flex gap-1 items-center">
                    <div className="w-1 h-1 bg-accent-primary rounded-full animate-bounce [animation-delay:0ms]" />
                    <div className="w-1 h-1 bg-accent-primary rounded-full animate-bounce [animation-delay:150ms]" />
                    <div className="w-1 h-1 bg-accent-primary rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
            )}
        </div>
    );
}
