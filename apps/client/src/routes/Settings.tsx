import { useState, useEffect } from 'react';
import { api } from '../api';

type TestStatus = 'untested' | 'testing' | 'connected' | 'error';

interface ProviderState {
    name: string;
    displayName: string;
    comingSoon?: boolean;
    status: TestStatus;
    message: string;
}

const SpinnerIcon = () => (
    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

const XIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 6-12 12" />
        <path d="m6 6 12 12" />
    </svg>
);

const CloudIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
);

export default function Settings() {
    const [providers, setProviders] = useState<ProviderState[]>([]);

    useEffect(() => {
        api.getProviders().then(data => {
            setProviders(data.providers.map(p => ({
                ...p,
                status: 'untested' as TestStatus,
                message: '',
            })));
        });
    }, []);

    const handleTest = async (name: string) => {
        setProviders(prev => prev.map(p =>
            p.name === name ? { ...p, status: 'testing', message: '' } : p
        ));

        try {
            const result = await api.testProvider(name);
            setProviders(prev => prev.map(p =>
                p.name === name
                    ? { ...p, status: result.ok ? 'connected' : 'error', message: result.message }
                    : p
            ));
        } catch (e: any) {
            setProviders(prev => prev.map(p =>
                p.name === name
                    ? { ...p, status: 'error', message: e.message }
                    : p
            ));
        }
    };

    const borderColor = (status: TestStatus) => {
        switch (status) {
            case 'connected': return 'border-status-success/40';
            case 'error': return 'border-status-error/40';
            case 'testing': return 'border-accent-primary/40';
            default: return 'border-border-default';
        }
    };

    return (
        <div className="flex flex-col h-full animate-fade-in space-y-6">
            <div className="pb-5 border-b border-border-subtle">
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">Settings</h1>
            </div>

            <div>
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">AI Providers</h2>
                <div className="grid gap-3">
                    {providers.map(p => (
                        <button
                            key={p.name}
                            onClick={() => !p.comingSoon && p.status !== 'testing' && handleTest(p.name)}
                            disabled={p.comingSoon || p.status === 'testing'}
                            className={`
                                w-full text-left bg-surface-raised border ${p.comingSoon ? 'border-border-default' : borderColor(p.status)} rounded-xl p-5
                                transition-all duration-300 group
                                ${p.comingSoon
                                    ? 'opacity-60 cursor-default'
                                    : p.status === 'testing'
                                        ? 'cursor-wait'
                                        : 'cursor-pointer hover:border-accent-primary/25 hover:shadow-lg hover:shadow-accent-glow'}
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`transition-colors ${p.comingSoon ? 'text-text-tertiary/50' : 'text-text-tertiary group-hover:text-text-secondary'}`}>
                                        <CloudIcon />
                                    </div>
                                    <div>
                                        <div className={`text-sm font-medium ${p.comingSoon ? 'text-text-secondary' : 'text-text-primary'}`}>{p.displayName}</div>
                                        <div className="text-xs text-text-tertiary font-mono">{p.name}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {p.comingSoon && (
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary bg-surface-overlay px-2.5 py-1 rounded-full">
                                            Coming Soon
                                        </span>
                                    )}
                                    {!p.comingSoon && p.status === 'testing' && (
                                        <div className="flex items-center gap-2 text-accent-primary">
                                            <SpinnerIcon />
                                            <span className="text-xs">Testing...</span>
                                        </div>
                                    )}
                                    {!p.comingSoon && p.status === 'connected' && (
                                        <div className="text-status-success">
                                            <CheckIcon />
                                        </div>
                                    )}
                                    {!p.comingSoon && p.status === 'error' && (
                                        <div className="text-status-error">
                                            <XIcon />
                                        </div>
                                    )}
                                    {!p.comingSoon && p.status === 'untested' && (
                                        <span className="text-xs text-text-tertiary group-hover:text-text-secondary transition-colors">
                                            Click to test
                                        </span>
                                    )}
                                </div>
                            </div>
                            {p.message && (
                                <div className={`mt-3 text-xs ${p.status === 'connected' ? 'text-status-success/80' : 'text-status-error/80'}`}>
                                    {p.message}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
