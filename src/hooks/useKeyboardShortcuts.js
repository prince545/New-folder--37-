import { useEffect } from 'react';

/**
 * Registers global keyboard shortcuts for the Workspace.
 */
export function useKeyboardShortcuts({
    onRun,
    onVisualize,
    onSave,
    onExpandToggle,
    isExpanded
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl/Cmd + Enter: Run code
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                onRun();
            }

            // Ctrl/Cmd + Shift + V: Visualize
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'V') {
                e.preventDefault();
                onVisualize();
            }

            // Ctrl/Cmd + S: Save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                onSave();
            }

            // Escape: Exit fullscreen
            if (e.key === 'Escape' && isExpanded) {
                onExpandToggle();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onRun, onVisualize, onSave, onExpandToggle, isExpanded]);
}
