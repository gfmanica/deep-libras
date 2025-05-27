import { useCallback, useEffect, useRef, useState } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { useCamera } from '@/hooks/use-camera';
import { useMediaPipe } from '@/hooks/use-mediapipe';
import { useModelTraining } from '@/hooks/use-model-training';
import { RecordedCharacter, TrainingData } from '@/types';
import { sanitizeCharacter, validateCharacter } from '@/utils/validation';

import { TrainModel } from './-components/train-model';
import { useRecording } from './-hooks/use-recording';

export const Route = createFileRoute('/train/')({
    component: RouteComponent
});

function RouteComponent() {
    const { videoRef, error, startCamera } = useCamera();
    const {
        initializeMediaPipe,
        processFrame,
        isInitialized,
        currentLandmarks
    } = useMediaPipe();

    const [characters, setCharacters] = useState<RecordedCharacter[]>([]);
    const [newCharacter, setNewCharacter] = useState('');

    const {
        isRecording,
        recordingCharacter,
        recordingData,
        recordingProgress,
        startRecording,
        finishRecording
    } = useRecording({
        currentLandmarks,
        onFinish: (character, data) => {
            setCharacters((prev) =>
                prev.map((c) =>
                    c.character === character
                        ? {
                              ...c,
                              samples: [...c.samples, ...data]
                          }
                        : c
                )
            );
        }
    });

    useEffect(() => {
        initializeMediaPipe();
        startCamera();
    }, []);

    useEffect(() => {
        if (!isInitialized || !videoRef.current) return;

        const processVideo = () => {
            if (videoRef.current) {
                processFrame(videoRef.current);
            }
            return setTimeout(processVideo, 100);
        };

        const timeoutId = processVideo();
        return () => clearTimeout(timeoutId);
    }, [isInitialized, processFrame]);

    const handleStartRecording = useCallback(
        (character: string) => {
            if (!currentLandmarks) {
                alert('Posicione sua mão na frente da câmera');
                return;
            }

            if (isRecording) return;

            startRecording(character);
        },
        [currentLandmarks, isRecording, startRecording]
    );

    const handleAddCharacter = () => {
        const sanitized = sanitizeCharacter(newCharacter);

        if (!validateCharacter(sanitized)) {
            alert('Digite apenas letras (A-Z) ou números (0-9)');
            return;
        }

        if (characters.find((c) => c.character === sanitized)) {
            alert('Este caractere já foi adicionado');
            return;
        }

        setCharacters((prev) => [
            ...prev,
            {
                character: sanitized,
                samples: [],
                isRecording: false
            }
        ]);
        setNewCharacter('');
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="mb-6 text-3xl font-bold">
                Treinar Modelo de Libras
            </h1>

            {error && (
                <div className="mb-6">
                    <p className="mt-2 text-red-500">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CameraSection
                    videoRef={videoRef}
                    isRecording={isRecording}
                    recordingCharacter={recordingCharacter}
                    recordingData={recordingData}
                />

                <ControlsSection
                    newCharacter={newCharacter}
                    setNewCharacter={setNewCharacter}
                    characters={characters}
                    isRecording={isRecording}
                    recordingCharacter={recordingCharacter}
                    onAddCharacter={handleAddCharacter}
                    onStartRecording={handleStartRecording}
                />
            </div>
        </div>
    );
}

// Componentes auxiliares
function CameraSection({
    videoRef,
    isRecording,
    recordingCharacter,
    recordingData
}: {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    isRecording: boolean;
    recordingCharacter: string | null;
    recordingData: TrainingData[];
}) {
    return (
        <div>
            <video
                ref={videoRef}
                className="w-full rounded border"
                autoPlay
                muted
                playsInline
            />
            {isRecording && (
                <div className="mt-2 rounded border border-red-300 bg-red-100 p-2">
                    <p className="font-semibold text-red-700">
                        🔴 Gravando: {recordingCharacter} (
                        {recordingData.length} amostras)
                    </p>
                </div>
            )}
        </div>
    );
}

function ControlsSection({
    newCharacter,
    setNewCharacter,
    characters,
    isRecording,
    recordingCharacter,
    onAddCharacter,
    onStartRecording
}: {
    newCharacter: string;
    setNewCharacter: (value: string) => void;
    characters: RecordedCharacter[];
    isRecording: boolean;
    recordingCharacter: string | null;
    onAddCharacter: () => void;
    onStartRecording: (character: string) => void;
}) {
    return (
        <div>
            <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold">
                    Adicionar Caractere
                </h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newCharacter}
                        onChange={(e) => setNewCharacter(e.target.value)}
                        maxLength={1}
                        className="flex-1 rounded border px-3 py-2"
                        placeholder="Digite uma letra ou número"
                    />
                    <button
                        onClick={onAddCharacter}
                        disabled={!newCharacter}
                        className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
                    >
                        Adicionar
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold">
                    Caracteres ({characters.length})
                </h3>
                <div className="max-h-64 space-y-2 overflow-y-auto">
                    {characters.map((char) => (
                        <div
                            key={char.character}
                            className="flex items-center justify-between rounded border p-2"
                        >
                            <span className="font-mono text-lg">
                                {char.character}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    {char.samples.length} amostras
                                </span>
                                <button
                                    onClick={() =>
                                        onStartRecording(char.character)
                                    }
                                    disabled={isRecording}
                                    className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {isRecording &&
                                    recordingCharacter === char.character
                                        ? 'Gravando...'
                                        : 'Gravar'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <TrainModel characters={characters} />
        </div>
    );
}
