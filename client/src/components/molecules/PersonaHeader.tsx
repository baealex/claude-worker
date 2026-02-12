interface WorkerStatusProps {
    status: string;
}

export default function WorkerStatus({ status }: WorkerStatusProps) {
    const isActive = status === 'running';

    return (
        <div className="bg-surface-raised border border-border-default rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${isActive ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' : 'bg-surface-overlay text-text-tertiary border border-border-default'}`}>
                C
            </div>
            <div className="flex-1">
                <div className="font-medium text-text-primary text-sm">Claude Code</div>
                <div className="text-xs text-text-secondary">
                    {isActive ? 'Working on this issue...' : status === 'completed' ? 'Finished successfully' : status === 'failed' ? 'Encountered an error' : status === 'cancelled' ? 'Cancelled' : 'Idle'}
                </div>
            </div>
            {isActive && (
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-bounce [animation-delay:0ms]" />
                    <div className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-bounce [animation-delay:150ms]" />
                    <div className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
            )}
        </div>
    );
}
