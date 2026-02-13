interface ErrorBannerProps {
    message: string | null;
    onDismiss?: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
    if (!message) return null;

    return (
        <div className="bg-status-error/10 border border-status-error/20 text-status-error p-4 rounded-lg flex items-center justify-between">
            <span className="text-sm">{message}</span>
            {onDismiss && (
                <button onClick={onDismiss} className="text-status-error hover:text-status-error/80 ml-4 text-lg leading-none">
                    &times;
                </button>
            )}
        </div>
    );
}
