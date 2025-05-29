import { useEffect, useRef, useState } from 'react';

import { HandLandmark, TrainingData } from '@/types';

import { useHandTracking } from './use-hand-tracking';

const isValidKey = (key: string) => /^[a-zA-Z0-9]$/.test(key);

export function useHandCapture() {
    const [currentLetter, setCurrentLetter] = useState<string | null>(null);
    const [collectedData, setCollectedData] = useState<TrainingData[]>([]);
    const isCapturingDelayed = useRef(false);
    const { videoRef, canvasRef, results } = useHandTracking();

    /**
     * Captura a letra digitada pelo usuário e a salva.
     * Aguarda 1 segundo após a digitação para limpar a letra atual.
     */
    const handleKeyDown = (event: KeyboardEvent) => {
        if (isCapturingDelayed.current || !isValidKey(event.key)) return;

        setCurrentLetter(event.key.toUpperCase());

        isCapturingDelayed.current = true;

        setTimeout(() => {
            isCapturingDelayed.current = false;

            setCurrentLetter(null);
        }, 1000);
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (
            currentLetter &&
            results.multiHandLandmarks.length > 0 &&
            results.multiHandLandmarks[0]
        ) {
            const landmarks = results.multiHandLandmarks[0].flatMap(
                (point: HandLandmark) => [point.x, point.y, point.z]
            );

            setCollectedData((prev): any => [
                ...prev,
                { landmarks, label: currentLetter }
            ]);
        }
    }, [results]);

    /**
     * Remove um item da lista de dados coletados.
     */
    const removeCollectedData = (label: string) => {
        setCollectedData((prevCollectedData) =>
            prevCollectedData.filter((item) => item.label !== label)
        );
    };

    return {
        videoRef,
        canvasRef,
        currentLetter,
        collectedData,
        removeCollectedData
    };
}
