import { useEffect, useState } from 'react';

import * as tf from '@tensorflow/tfjs';

import { useHandTracking } from './use-hand-tracking';

export function useHandTranslate({ model }: { model: tf.LayersModel | null }) {
    const [predictedLetter, setPredictedLetter] = useState('');
    const { videoRef, canvasRef, results } = useHandTracking();

    useEffect(() => {
        if (model && results.multiHandLandmarks.length > 0) {
            const pontos = results.multiHandLandmarks[0];
            const entrada = pontos.flatMap((p) => [p.x, p.y, p.z]);
            const tensor = tf.tensor2d([entrada]);
            const pred = model.predict(tensor) as tf.Tensor;

            pred.array()
                .then((arr) => {
                    const index = arr[0].indexOf(Math.max(...arr[0]));
                    const { classes } = model.getUserDefinedMetadata() as {
                        classes: string[];
                    };
                    setPredictedLetter(classes[index] || '');
                })
                .catch((error) => {
                    console.error('Erro ao fazer predição:', error);
                })
                .finally(() => {
                    tensor.dispose();
                    pred.dispose();
                });
        }
    }, [results]);

    useEffect(() => {
        if (predictedLetter) {
            const timeout = setTimeout(() => setPredictedLetter(''), 3000);

            return () => clearTimeout(timeout);
        }
    }, [predictedLetter]);

    return {
        videoRef,
        canvasRef,
        predictedLetter
    };
}
