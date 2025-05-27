import { useCallback, useRef, useState } from 'react';

import pkg from '@mediapipe/hands';
const { Hands } = pkg;

import { HandLandmark } from '../types';

export function useMediaPipe() {
    const handsRef = useRef<any | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [currentLandmarks, setCurrentLandmarks] = useState<
        HandLandmark[] | null
    >(null);

    const initializeMediaPipe = useCallback(async () => {
        const hands = new Hands({
            locateFile: (file: string) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        hands.onResults((results: any) => {
            if (results.multiHandLandmarks && results.multiHandLandmarks[0]) {
                const landmarks = results.multiHandLandmarks[0].map(
                    (landmark) => ({
                        x: landmark.x,
                        y: landmark.y,
                        z: landmark.z
                    })
                );
                setCurrentLandmarks(landmarks);
            } else {
                setCurrentLandmarks(null);
            }
        });

        handsRef.current = hands;
        setIsInitialized(true);
    }, []);

    const processFrame = useCallback(async (videoElement: HTMLVideoElement) => {
        if (handsRef.current && videoElement.readyState >= 2) {
            await handsRef.current.send({ image: videoElement });
        }
    }, []);

    return {
        initializeMediaPipe,
        processFrame,
        isInitialized,
        currentLandmarks
    };
}
