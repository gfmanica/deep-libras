import { useState } from 'react';

import * as tf from '@tensorflow/tfjs';

export function useImportModel() {
    const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [modelFiles, setModelFiles] = useState<File[]>([]);
    const [modelStatus, setModelStatus] = useState('Nenhum modelo carregado');

    /**
     * Define os arquivos do modelo para o carregamento
     */
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setModelFiles(Array.from(event.target.files));
        }
    };

    /**
     * Define o modelo para previsão usando os arquivos selecionados
     */
    const loadModel = () => {
        if (modelFiles.length === 0) {
            alert('Selecione os arquivos do modelo primeiro!');

            return;
        }

        setModelStatus('Carregando modelo...');

        const handler = tf.io.browserFiles(modelFiles);

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
        modelFiles,
        modelStatus,
        handleFileChange,
        loadModel
    };
}
