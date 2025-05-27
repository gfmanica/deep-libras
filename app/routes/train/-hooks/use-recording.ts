import { useCallback, useEffect, useRef, useState } from 'react';


import { HandLandmark, TrainingData } from '@/types';

const MAX_SAMPLES = 30;
const SAMPLE_INTERVAL = 33; // ~30fps

interface UseRecordingProps {
    currentLandmarks: HandLandmark[] | null;
    onFinish: (character: string, data: TrainingData[]) => void;
}

export function useRecording({
    currentLandmarks,
    onFinish
}: UseRecordingProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingCharacter, setRecordingCharacter] = useState<string | null>(
        null
    );
    const [recordingData, setRecordingData] = useState<TrainingData[]>([]);
    const [recordingProgress, setRecordingProgress] = useState(0);

    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = useCallback(
        (character: string) => {
            if (!currentLandmarks) {
                alert('Posicione sua mão na frente da câmera');
                return;
            }

            if (isRecording) return;

            setIsRecording(true);
            setRecordingCharacter(character);
            setRecordingData([]);
            setRecordingProgress(0);

            let sampleCount = 0;

            recordingIntervalRef.current = setInterval(() => {
                if (currentLandmarks) {
                    const sample: TrainingData = {
                        landmarks: currentLandmarks,
                        label: character,
                        timestamp: Date.now()
                    };

                    setRecordingData((prev) => [...prev, sample]);
                    sampleCount++;

                    const progress = (sampleCount / MAX_SAMPLES) * 100;
                    setRecordingProgress(progress);

                    if (sampleCount >= MAX_SAMPLES) {
                        finishRecording(character);
                    }
                }
            }, SAMPLE_INTERVAL);
        },
        [currentLandmarks, isRecording]
    );

    const finishRecording = useCallback(
        (character: string) => {
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
                recordingIntervalRef.current = null;
            }

            setIsRecording(false);
            setRecordingCharacter(null);
            setRecordingProgress(0);

            onFinish(character, recordingData);
        },
        [recordingData, onFinish]
    );

    useEffect(() => {
        return () => {
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
            }
        };
    }, []);

    return {
        isRecording,
        recordingCharacter,
        recordingData,
        recordingProgress,
        startRecording,
        finishRecording
    };
}
