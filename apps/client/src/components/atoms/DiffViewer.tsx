interface DiffViewerProps {
    diff: string | null;
}

function classifyLine(line: string): 'add' | 'remove' | 'header' | 'range' | 'context' {
    if (line.startsWith('+++') || line.startsWith('---')) return 'header';
    if (line.startsWith('@@')) return 'range';
    if (line.startsWith('+')) return 'add';
    if (line.startsWith('-')) return 'remove';
    if (line.startsWith('diff ')) return 'header';
    if (line.startsWith('index ')) return 'header';
    return 'context';
}

const lineStyles: Record<ReturnType<typeof classifyLine>, string> = {
    add: 'bg-status-success/5 text-status-success',
    remove: 'bg-status-error/5 text-status-error',
    header: 'bg-surface-overlay/50 text-text-tertiary font-semibold',
    range: 'bg-accent-primary/5 text-accent-primary/80',
    context: 'text-text-secondary',
};

export default function DiffViewer({ diff }: DiffViewerProps) {
    if (!diff) {
        return (
            <div className="p-4 text-text-tertiary text-sm">
                No file changes to display.
            </div>
        );
    }

    const lines = diff.split('\n');

    return (
        <div className="text-xs font-mono overflow-auto">
            {lines.map((line, i) => {
                const type = classifyLine(line);
                return (
                    <div key={i} className={`px-4 py-0.5 whitespace-pre-wrap ${lineStyles[type]}`}>
                        {line || '\u00A0'}
                    </div>
                );
            })}
        </div>
    );
}
