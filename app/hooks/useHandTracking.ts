import { useEffect, useRef, useState } from 'react';

import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Hands } from '@mediapipe/hands';
import * as tf from '@tensorflow/tfjs';

interface HandLandmark {
    x: number;
    y: number;
    z: number;
}

interface CollectedData {
    landmarks: number[];
    label: string;
}

export function useHandTracking() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentLetter, setCurrentLetter] = useState<string | null>(null);
    const [collectedData, setCollectedData] = useState<CollectedData[]>([]);
    const [isTraining, setIsTraining] = useState(false);
    const [trainingProgress, setTrainingProgress] = useState<string>('');
    const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [isModelReady, setIsModelReady] = useState(false);

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
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7
        });

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
                    drawConnectors(canvasCtx, landmarks, undefined, {
                        color: '#00FF00',
                        lineWidth: 2
                    });
                    drawLandmarks(canvasCtx, landmarks, {
                        color: '#FF0000',
                        lineWidth: 1
                    });
                }

                if (currentLetter) {
                    const landmarks = results.multiHandLandmarks[0].flatMap(
                        (point: HandLandmark) => [point.x, point.y, point.z]
                    );
                    setCollectedData((prev) => [
                        ...prev,
                        { landmarks, label: currentLetter }
                    ]);
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

        const handleKeyDown = (e: KeyboardEvent) => {
            const letter = e.key.toUpperCase();
            if (letter >= 'A' && letter <= 'Z') {
                setCurrentLetter(letter);
                setTimeout(() => {
                    setCurrentLetter(null);
                }, 1000);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            camera.stop();
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentLetter]);

    const trainModel = async () => {
        if (collectedData.length === 0) {
            alert('Nenhum dado coletado para treinar o modelo!');
            return;
        }

        setIsTraining(true);
        setTrainingProgress('Iniciando treinamento...\n');

        try {
            const classes = Array.from(
                new Set(collectedData.map((item) => item.label))
            );
            const entradas = collectedData.map((item) => item.landmarks);
            const saidas = collectedData.map((item) => item.label);

            // Codifica os rótulos como one-hot
            const labelsCodificadas = saidas.map((l) => {
                const vetor = Array(classes.length).fill(0);
                vetor[classes.indexOf(l)] = 1;
                return vetor;
            });

            // Converte para tensores
            const xs = tf.tensor2d(entradas);
            const ys = tf.tensor2d(labelsCodificadas);

            // Cria modelo
            const newModel = tf.sequential();
            newModel.add(
                tf.layers.dense({
                    inputShape: [63],
                    units: 128,
                    activation: 'relu'
                })
            );
            newModel.add(tf.layers.dropout({ rate: 0.3 }));
            newModel.add(tf.layers.dense({ units: 64, activation: 'relu' }));
            newModel.add(
                tf.layers.dense({
                    units: classes.length,
                    activation: 'softmax'
                })
            );

            newModel.compile({
                optimizer: 'adam',
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy']
            });

            await newModel.fit(xs, ys, {
                epochs: 60,
                batchSize: 32,
                shuffle: true,
                callbacks: {
                    onEpochEnd: (epoch, logs) => {
                        setTrainingProgress(
                            (prev) =>
                                prev +
                                `Epoch ${epoch + 1}: loss=${logs?.loss.toFixed(4)}, acc=${(logs?.acc || 0 * 100).toFixed(2)}%\n`
                        );
                    }
                }
            });

            setModel(newModel);
            setIsModelReady(true);
            setTrainingProgress(
                (prev) => prev + '\n✅ Modelo treinado com sucesso!'
            );

            // Salva o modelo no IndexedDB
            await newModel.save('indexeddb://modelo-libras');
        } catch (error) {
            console.error('Erro ao treinar modelo:', error);
            setTrainingProgress(
                (prev) => prev + '\n❌ Erro ao treinar modelo!'
            );
        } finally {
            setIsTraining(false);
        }
    };

    const downloadModel = async () => {
        if (!model) {
            alert('Nenhum modelo treinado disponível para download!');
            return;
        }

        try {
            // Salva o modelo usando a API do TensorFlow.js
            await model.save('downloads://modelo-libras');
            setTrainingProgress(
                (prev) => prev + '\n✅ Modelo baixado com sucesso!'
            );
        } catch (error) {
            console.error('Erro ao baixar modelo:', error);
            alert('Erro ao baixar o modelo!');
        }
    };

    const downloadData = () => {
        const blob = new Blob([JSON.stringify(collectedData)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'meu-dataset-libras.json';
        a.click();
    };

    return {
        videoRef,
        canvasRef,
        currentLetter,
        collectedData,
        isTraining,
        trainingProgress,
        model,
        isModelReady,
        downloadData,
        trainModel,
        downloadModel
    };
}
