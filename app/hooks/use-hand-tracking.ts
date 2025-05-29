import { useCallback, useEffect, useRef, useState } from 'react';

import camera from '@mediapipe/camera_utils';
import drawing from '@mediapipe/drawing_utils';
import hands from '@mediapipe/hands';

const { Hands, HAND_CONNECTIONS } = hands;
const { Camera } = camera;
const { drawConnectors, drawLandmarks } = drawing;

export function useHandTracking() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [results, setResults] = useState<any>(null);

    // Refs para as instâncias
    const handsRef = useRef<hands.Hands | null>(null);
    const cameraRef = useRef<camera.Camera | null>(null);

    const initializeHands = useCallback(() => {
        handsRef.current = new Hands({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });
        handsRef.current.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7
        });
    }, []);

    const initializeCamera = useCallback((videoElement: HTMLVideoElement) => {
        cameraRef.current = new Camera(videoElement, {
            onFrame: async () => {
                await handsRef.current?.send({ image: videoElement });
            },
            width: 640,
            height: 480
        });
    }, []);

    useEffect(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const videoElement = videoRef.current;
        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext('2d');

        if (!canvasCtx) return;

        // Inicializa Hands apenas uma vez
        if (!handsRef.current) {
            initializeHands();
        }

        const onResults = (results: any) => {
            canvasCtx.save();
            canvasCtx.clearRect(
                0,
                0,
                canvasElement.width,
                canvasElement.height
            );
            canvasCtx.drawImage(
                results.image,
                0,
                0,
                canvasElement.width,
                canvasElement.height
            );

            if (results.multiHandLandmarks) {
                for (const landmarks of results.multiHandLandmarks) {
                    drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                        color: '#00FF00',
                        lineWidth: 2
                    });
                    drawLandmarks(canvasCtx, landmarks, {
                        color: '#FF0000',
                        lineWidth: 1
                    });
                }

                if (results.multiHandLandmarks.length > 0) {
                    setResults(results);
                }
            }

            canvasCtx.restore();
        };

        handsRef.current?.onResults(onResults);

        // Inicializa Camera apenas uma vez
        if (!cameraRef.current) {
            initializeCamera(videoElement);
        }

        cameraRef.current?.start();

        return () => {
            cameraRef.current && cameraRef.current.stop();
        };
    }, []);

    return { videoRef, canvasRef, results };
}
