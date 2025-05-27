import { useEffect, useRef, useState } from 'react';

import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS, Hands } from '@mediapipe/hands';
import { createFileRoute } from '@tanstack/react-router';
import * as tf from '@tensorflow/tfjs';

export const Route = createFileRoute('/')({
    component: RouteComponent
});

function RouteComponent() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [modelStatus, setModelStatus] = useState('Nenhum modelo carregado');
    const [predictedLetter, setPredictedLetter] = useState('-');
    const [modelFiles, setModelFiles] = useState<File[]>([]);

    useEffect(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const videoElement = videoRef.current;
        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext('2d');

        if (!canvasCtx) return;

        const hands = new Hands({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7
        });

        const onResults = async (results: any) => {
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

                if (model && results.multiHandLandmarks.length > 0) {
                    const pontos = results.multiHandLandmarks[0];
                    const entrada = pontos.flatMap((p) => [p.x, p.y, p.z]);
                    const tensor = tf.tensor2d([entrada]);
                    const pred = model.predict(tensor) as tf.Tensor;

                    try {
                        const arr = await pred.array();
                        const index = arr[0].indexOf(Math.max(...arr[0]));
                        const letras = [
                            'A',
                            'B',
                            'C',
                            'D',
                            'E',
                            'F',
                            'G',
                            'H',
                            'I',
                            'J',
                            'K',
                            'L',
                            'M',
                            'N',
                            'O',
                            'P',
                            'Q',
                            'R',
                            'S',
                            'T',
                            'U',
                            'V',
                            'W',
                            'X',
                            'Y',
                            'Z'
                        ];
                        setPredictedLetter(letras[index] || '-');
                    } catch (error) {
                        console.error('Erro ao fazer predição:', error);
                    } finally {
                        tensor.dispose();
                        pred.dispose();
                    }
                }
            }

            canvasCtx.restore();
        };

        hands.onResults(onResults);

        const camera = new Camera(videoElement, {
            onFrame: async () => {
                await hands.send({ image: videoElement });
            },
            width: 640,
            height: 480
        });

        camera.start();

        return () => {
            camera.stop();
        };
    }, [model]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setModelFiles(Array.from(event.target.files));
        }
    };

    const loadModel = async () => {
        if (modelFiles.length === 0) {
            alert('Selecione os arquivos do modelo primeiro!');
            return;
        }

        try {
            setModelStatus('Carregando modelo...');
            const handler = tf.io.browserFiles(modelFiles);
            const loadedModel = await tf.loadLayersModel(handler);
            setModel(loadedModel);
            setModelStatus('✅ Modelo carregado com sucesso!');
        } catch (error) {
            console.error('Erro ao carregar modelo:', error);
            setModelStatus('❌ Erro ao carregar modelo.');
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <h1 className="text-2xl font-bold">
                Reconhecimento de Letra em Libras
            </h1>

            <div className="mb-4 flex gap-4">
                <input
                    type="file"
                    onChange={handleFileChange}
                    multiple
                    accept=".json,.bin"
                    className="rounded border px-4 py-2"
                />
                <button
                    onClick={loadModel}
                    className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                >
                    Carregar Modelo
                </button>
            </div>

            <div className="text-lg font-semibold text-gray-700">
                {modelStatus}
            </div>

            <div className="relative">
                <video
                    ref={videoRef}
                    width={640}
                    height={480}
                    autoPlay
                    muted
                    className="scale-x-[-1] transform"
                />
                <canvas
                    ref={canvasRef}
                    width={640}
                    height={480}
                    className="absolute top-0 left-0"
                />
                <div className="absolute top-4 left-4 rounded-lg bg-black/50 p-4 text-4xl font-bold text-white">
                    Letra: {predictedLetter}
                </div>
            </div>
        </div>
    );
}
