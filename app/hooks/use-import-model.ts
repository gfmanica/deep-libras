import { useState } from 'react';

import * as tf from '@tensorflow/tfjs';

export function useImportModel() {
    const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [modelStatus, setModelStatus] = useState('Nenhum modelo carregado');

    /**
     * Define o modelo para previsão usando os arquivos selecionados
     */
    const loadModel = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);

        if (files.length === 0) {
            alert('Selecione os arquivos do modelo primeiro!');

            return;
        }

        setModelStatus('Carregando modelo...');

        const handler = tf.io.browserFiles(files);

        tf.loadLayersModel(handler)
            .then((loadedModel) => {
                setModel(loadedModel);

                setModelStatus('✅ Modelo carregado com sucesso!');
            })
            .catch((error) => {
                console.error('Erro ao carregar modelo:', error);

                setModelStatus('❌ Erro ao carregar modelo.');
            });
    };

    return {
        model,
        modelStatus,
        loadModel
    };
}
