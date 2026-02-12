import { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router';
import Sidebar from '../organisms/Sidebar';
import CreateProjectModal from '../organisms/CreateProjectModal';

type ContextType = {
    openProjectModal: () => void;
    refreshTrigger: number;
    triggerRefresh: () => void;
};

export default function MainLayout() {
    const [isCreating, setIsCreating] = useState(false);
    // Lifted state for refresh trigger
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const openProjectModal = () => setIsCreating(true);
    const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

    return (
        <div className="flex h-screen w-full bg-surface-base overflow-hidden">
            <Sidebar
                onOpenProjectModal={openProjectModal}
                refreshTrigger={refreshTrigger}
            />
            <main className="flex-1 overflow-auto relative">
                <div className="max-w-[1600px] mx-auto p-6 md:p-8 lg:p-10 min-h-full">
                    {/* Provide context to children (Dashboard) */}
                    <Outlet context={{ openProjectModal, refreshTrigger, triggerRefresh } satisfies ContextType} />
                </div>
            </main>

            {isCreating && (
                <CreateProjectModal
                    onClose={() => setIsCreating(false)}
                    onCreated={() => {
                        triggerRefresh();
                    }}
                />
            )}
        </div>
    );
}

export function useProjectCreation() {
    return useOutletContext<ContextType>();
}
