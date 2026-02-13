import { Link } from 'react-router';

interface BreadcrumbItem {
    label: string;
    to?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex items-center gap-2 text-sm text-text-tertiary">
            {items.map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                    {i > 0 && <span>/</span>}
                    {item.to ? (
                        <Link to={item.to} className="hover:text-text-primary transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-text-primary">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}
