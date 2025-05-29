import { useCallback, useEffect, useState } from 'react';

import { HandLandmark, TrainingData } from '@/types';

import { useHandTracking } from './use-hand-tracking';

export function useHandCapture() {
    const [currentLetter, setCurrentLetter] = useState<string | null>(null);
    const [collectedData, setCollectedData] = useState<TrainingData[]>([]);

    const handleKeyDown = (event: KeyboardEvent) => {
        setCurrentLetter(event.key.toUpperCase());
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const action = useCallback(
        (results) => {
            if (currentLetter && results.multiHandLandmarks[0]) {
                const landmarks = results.multiHandLandmarks[0].flatMap(
                    (point: HandLandmark) => [point.x, point.y, point.z]
                );

                setCollectedData((prev): any => [
                    ...prev,
                    { landmarks, label: currentLetter }
                ]);
            }
        },
        [currentLetter]
    );

    const { videoRef, canvasRef } = useHandTracking({ action });

    return {
        videoRef,
        canvasRef,
        currentLetter,
        collectedData
    };
}
