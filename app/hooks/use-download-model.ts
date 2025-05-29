import * as tf from '@tensorflow/tfjs';

import { TrainingData } from '@/types';

export function useDownloadModel({
    model,
    collectedData
}: {
    model: tf.LayersModel | null;
    collectedData: TrainingData[];
}) {
    const classes = collectedData.reduce((acc, item) => {
        if (!acc.includes(item.label)) {
            acc.push(item.label);
        }

        return acc;
    }, [] as string[]);

    /**
     * Baixa o modelo treinado
     */
    const downloadModel = () => {
        if (!model) {
            alert('Nenhum modelo treinado disponível para download!');

            return;
        }

        model.setUserDefinedMetadata({ classes });

        model
            .save('downloads://modelo-libras')
            .then(() => {
                alert('✅ Modelo baixado com sucesso!');
            })
            .catch((error) => {
                console.error('Erro ao baixar modelo:', error);
                alert('Erro ao baixar o modelo!');
            });
    };

    return { downloadModel };
}
