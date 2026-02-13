import { useState, type FormEvent } from 'react';
import Button from '../atoms/Button';

interface PRFormProps {
    defaultTitle: string;
    defaultBody: string;
    onSubmit: (data: { prTitle: string; prBody: string }) => void;
}

export default function PRForm({ defaultTitle, defaultBody, onSubmit }: PRFormProps) {
    const [title, setTitle] = useState(defaultTitle);
    const [body, setBody] = useState(defaultBody);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({ prTitle: title, prBody: body });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-xs font-medium text-text-secondary ml-1 mb-1.5 block">PR Title</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-surface-base border border-border-default text-text-primary text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/50 transition-all"
                />
            </div>
            <div>
                <label className="text-xs font-medium text-text-secondary ml-1 mb-1.5 block">PR Body</label>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={8}
                    className="w-full bg-surface-base border border-border-default text-text-primary text-sm rounded-lg px-3 py-2.5 resize-y focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/50 font-mono transition-all"
                />
            </div>
            <div className="flex justify-end">
                <Button type="submit" disabled={!title.trim()}>Create PR</Button>
            </div>
        </form>
    );
}
