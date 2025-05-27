import { useModelTraining } from '@/hooks/use-model-training';
import { RecordedCharacter } from '@/types';

export function TrainModel({
    characters
}: {
    characters: RecordedCharacter[];
}) {
    const { isTraining, trainingProgress, trainModel, downloadModel } =
        useModelTraining();

    const handleTrainModel = async () => {
        const allSamples = characters.flatMap((c) => c.samples);

        debugger;
        // if (allSamples.length < 50) {
        //     alert('É necessário pelo menos 50 amostras para treinar o modelo');
        //     return;
        // }

        try {
            const config = {
                inputShape: [63], // 21 pontos * 3 coordenadas
                hiddenLayers: [128, 64],
                outputClasses: characters.map((c) => c.character),
                learningRate: 0.001,
                epochs: 50
            };

            const result = await trainModel(allSamples, config);
            alert('Modelo treinado com sucesso!');

            if (result?.model && result?.classes) {
                await downloadModel(result.model, result.classes);
            }
        } catch (error) {
            alert('Erro ao treinar modelo: ' + (error as Error).message);
        }
    };

    return (
        <div>
            <button
                onClick={handleTrainModel}
                disabled={isTraining || characters.length === 0}
                className="w-full rounded bg-purple-500 px-4 py-3 text-white hover:bg-purple-600 disabled:opacity-50"
            >
                {isTraining
                    ? `Treinando... ${trainingProgress.toFixed(1)}%`
                    : 'Treinar Modelo'}
            </button>

            {isTraining && (
                <div className="mt-2 h-2 rounded-full bg-gray-200">
                    <div
                        className="h-2 rounded-full bg-purple-500 transition-all duration-300"
                        style={{ width: `${trainingProgress}%` }}
                    />
                </div>
            )}
        </div>
    );
}
