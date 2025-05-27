import { useCallback, useRef, useState } from 'react';

export function useCamera() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 640,
                    height: 480,
                    facingMode: 'user'
                }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () =>
                    videoRef.current?.play();
            }
        } catch (err) {
            setError('Erro ao acessar a câmera: ' + (err as Error).message);
        }
    }, []);

    return {
        videoRef,
        error,
        startCamera
    };
}
