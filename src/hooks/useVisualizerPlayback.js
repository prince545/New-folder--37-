import { useEffect, useRef } from 'react';

/**
 * Controls the auto-play interval for visualizer step playback.
 * Speed is a multiplier (0.5 = slow, 1 = normal, 3 = fast).
 */
export function useVisualizerPlayback({
    isPlaying,
    steps,
    speed,
    onStepChange,
    onPlayEnd
}) {
    const intervalRef = useRef(null);

    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (isPlaying && steps && steps.length > 0) {
            const intervalMs = Math.max(200, Math.round(1500 / (speed || 1)));

            intervalRef.current = setInterval(() => {
                onStepChange(prev => {
                    if (prev >= steps.length - 1) {
                        onPlayEnd();
                        return prev;
                    }
                    return prev + 1;
                });
            }, intervalMs);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, steps, speed, onStepChange, onPlayEnd]);
}
