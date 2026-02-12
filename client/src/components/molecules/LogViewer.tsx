import { useEffect, useRef, useMemo } from 'react';

interface LogViewerProps {
    log: string;
    status: string;
}

function classifyLine(line: string): 'tool' | 'header' | 'divider' | 'error' | 'normal' {
    if (line.startsWith('▸ ')) return 'tool';
    if (line.startsWith('[') && line.includes('/5]')) return 'header';
    if (line.startsWith('════') || line.startsWith('────')) return 'divider';
    if (line.startsWith('Error:')) return 'error';
    return 'normal';
}

const lineStyles: Record<ReturnType<typeof classifyLine>, string> = {
    tool: 'text-accent-primary',
    header: 'text-status-info font-semibold',
    divider: 'text-text-tertiary/50',
    error: 'text-status-error font-semibold',
    normal: 'text-text-secondary',
};

export default function LogViewer({ log, status }: LogViewerProps) {
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [log]);

    const lines = useMemo(() => log.split('\n'), [log]);

    return (
        <div className="p-4">
            {log ? (
                lines.map((line, i) => (
                    <div key={i} className={`whitespace-pre-wrap leading-relaxed ${lineStyles[classifyLine(line)]}`}>
                        {line || '\u00A0'}
                    </div>
                ))
            ) : (
                <div className="text-text-tertiary">Waiting for output...</div>
            )}
            {status === 'running' && (
                <span className="animate-pulse text-accent-primary"> _</span>
            )}
            <div ref={endRef} />
        </div>
    );
}
