import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    helperText,
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    return (
        <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
            {label && (
                <label className="text-xs font-medium text-text-secondary ml-1">
                    {label}
                </label>
            )}

            <div className="relative">
                <input
                    ref={ref}
                    className={`
            w-full bg-surface-base border border-border-default
            text-text-primary text-sm rounded-lg px-3 py-2.5
            placeholder:text-text-tertiary
            focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/50
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${error ? 'border-status-error focus:ring-status-error/50 focus:border-status-error' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>

            {(error || helperText) && (
                <p className={`text-xs ml-1 ${error ? 'text-status-error' : 'text-text-tertiary'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
