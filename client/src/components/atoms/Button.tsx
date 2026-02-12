import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    icon?: ReactNode;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const variants: Record<ButtonVariant, string> = {
        primary: "bg-accent-primary text-text-on-accent hover:bg-accent-secondary focus:ring-accent-primary shadow-sm",
        secondary: "bg-surface-raised border border-border-default text-text-primary hover:bg-border-subtle focus:ring-border-focus",
        ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-raised focus:ring-border-focus",
        danger: "bg-status-error/10 text-status-error hover:bg-status-error/20 focus:ring-status-error border border-transparent",
    };

    const sizes: Record<ButtonSize, string> = {
        sm: "h-8 px-3 text-xs gap-1.5",
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-6 text-base gap-2.5",
    };

    return (
        <button
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : icon ? (
                <span className="flex-shrink-0">{icon}</span>
            ) : null}

            {children}
        </button>
    );
}
