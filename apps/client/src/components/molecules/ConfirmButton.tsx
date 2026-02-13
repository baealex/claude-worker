import { useState, type ReactNode } from 'react';
import Button from '../atoms/Button';

interface ConfirmButtonProps {
    onConfirm: () => void;
    children: ReactNode;
    confirmText?: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function ConfirmButton({
    onConfirm,
    children,
    confirmText = 'Are you sure?',
    variant = 'danger',
    size = 'sm',
    className,
}: ConfirmButtonProps) {
    const [confirming, setConfirming] = useState(false);

    const handleClick = () => {
        if (confirming) {
            onConfirm();
            setConfirming(false);
        } else {
            setConfirming(true);
            setTimeout(() => setConfirming(false), 3000);
        }
    };

    return (
        <Button variant={variant} size={size} className={className} onClick={handleClick}>
            {confirming ? confirmText : children}
        </Button>
    );
}
