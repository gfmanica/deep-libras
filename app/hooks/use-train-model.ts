import { useState } from 'react';

import * as tf from '@tensorflow/tfjs';

import { TrainingStatus } from '@/types';

export function useTrainModel({ collectedData }: { collectedData: any[] }) {
    const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [trainingStatus, setTrainingStatus] =
        useState<TrainingStatus>('idle');
    const [trainingProgress, setTrainingProgress] = useState('');

    const trainModel = async () => {
        if (collectedData.length === 0) {
            alert('Nenhum dado coletado para treinar o modelo!');
            return;
        }

        setTrainingStatus('training');
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
                            (prev: string) =>
                                prev +
                                `Epoch ${epoch + 1}: loss=${logs?.loss.toFixed(4)}, acc=${(logs?.acc || 0 * 100).toFixed(2)}%\n`
                        );
                    }
                }
            });

            setModel(newModel);
            setTrainingStatus('ready');
            setTrainingProgress(
                (prev) => prev + '\n✅ Modelo treinado com sucesso!'
            );

            // Salva o modelo no IndexedDB
            await newModel.save('indexeddb://modelo-libras');
        } catch (error) {
            console.error('Erro ao treinar modelo:', error);
            setTrainingStatus('error');

            setTrainingProgress(
                (prev) => prev + '\n❌ Erro ao treinar modelo!'
            );
        }
    };

    return { trainModel, model, trainingStatus, trainingProgress };
}
