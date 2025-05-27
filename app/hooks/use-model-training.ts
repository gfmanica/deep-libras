import { useCallback, useState } from 'react';

import * as tf from '@tensorflow/tfjs';

import { ModelConfig, TrainingData } from '../types';

export function useModelTraining() {
    const [isTraining, setIsTraining] = useState(false);
    const [trainingProgress, setTrainingProgress] = useState(0);
    const [model, setModel] = useState<tf.LayersModel | null>(null);

    const createModel = useCallback((config: ModelConfig) => {
        const model = tf.sequential({
            layers: [
                tf.layers.dense({
                    inputShape: config.inputShape,
                    units: config.hiddenLayers[0],
                    activation: 'relu'
                }),
                tf.layers.dropout({ rate: 0.2 }),
                tf.layers.dense({
                    units: config.hiddenLayers[1],
                    activation: 'relu'
                }),
                tf.layers.dropout({ rate: 0.2 }),
                tf.layers.dense({
                    units: config.outputClasses.length,
                    activation: 'softmax'
                })
            ]
        });

        model.compile({
            optimizer: tf.train.adam(config.learningRate),
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy']
        });

        return model;
    }, []);

    const prepareTrainingData = useCallback((data: TrainingData[]) => {
        const features: number[][] = [];
        const labels: number[][] = [];
        const uniqueLabels = [...new Set(data.map((d) => d.label))];

        data.forEach((sample) => {
            // Flatten landmarks para array 1D
            const flattenedLandmarks = sample.landmarks.flatMap((l) => [
                l.x,
                l.y,
                l.z
            ]);
            features.push(flattenedLandmarks);

            // One-hot encoding para labels
            const oneHot = new Array(uniqueLabels.length).fill(0);
            oneHot[uniqueLabels.indexOf(sample.label)] = 1;
            labels.push(oneHot);
        });

        return {
            features: tf.tensor2d(features),
            labels: tf.tensor2d(labels),
            classes: uniqueLabels
        };
    }, []);

    const trainModel = useCallback(
        async (trainingData: TrainingData[], config: ModelConfig) => {
            setIsTraining(true);
            setTrainingProgress(0);

            try {
                const { features, labels, classes } =
                    prepareTrainingData(trainingData);
                const newModel = createModel({
                    ...config,
                    outputClasses: classes
                });

                await newModel.fit(features, labels, {
                    epochs: config.epochs,
                    batchSize: 32,
                    validationSplit: 0.2,
                    callbacks: {
                        onEpochEnd: (epoch, logs) => {
                            const progress =
                                ((epoch + 1) / config.epochs) * 100;
                            setTrainingProgress(progress);
                        }
                    }
                });

                setModel(newModel);
                return { model: newModel, classes };
            } catch (error) {
                console.error('Erro no treinamento:', error);
                throw error;
            } finally {
                setIsTraining(false);
            }
        },
        [createModel, prepareTrainingData]
    );

    const downloadModel = useCallback(
        async (model: tf.LayersModel, classes: string[]) => {
            try {
                // Salvar modelo
                await model.save('downloads://libras-model');

                // Salvar classes em arquivo JSON
                const classesData = { classes };
                const blob = new Blob([JSON.stringify(classesData, null, 2)], {
                    type: 'application/json'
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'model-classes.json';
                link.click();
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Erro ao baixar modelo:', error);
                throw error;
            }
        },
        []
    );

    return {
        isTraining,
        trainingProgress,
        model,
        trainModel,
        downloadModel
    };
}
