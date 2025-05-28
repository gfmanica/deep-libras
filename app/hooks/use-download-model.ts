import * as tf from '@tensorflow/tfjs';

export function useDownloadModel({ model }: { model: tf.LayersModel | null }) {
    /**
     * Baixa o modelo treinado
     */
    const downloadModel = () => {
        if (!model) {
            alert('Nenhum modelo treinado disponível para download!');

            return;
        }

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
