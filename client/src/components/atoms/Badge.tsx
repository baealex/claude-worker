import type { ReactNode } from 'react';

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'accent';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

export default function Badge({
    children,
    variant = 'neutral',
    className = ''
}: BadgeProps) {
    const variants: Record<BadgeVariant, string> = {
        neutral: "bg-surface-raised text-text-secondary border-border-default",
        success: "bg-status-success/10 text-status-success border-status-success/20",
        warning: "bg-status-warning/10 text-status-warning border-status-warning/20",
        error: "bg-status-error/10 text-status-error border-status-error/20",
        info: "bg-status-info/10 text-status-info border-status-info/20",
        accent: "bg-accent-primary/10 text-accent-primary border-accent-primary/20",
    };

    return (
        <span className={`
      inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border
      ${variants[variant]}
      ${className}
    `}>
            {children}
        </span>
    );
}
