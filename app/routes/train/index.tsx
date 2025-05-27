import { createFileRoute } from '@tanstack/react-router';

import { useHandTracking } from '../../hooks/useHandTracking';

export const Route = createFileRoute('/train/')({
    component: RouteComponent
});

function RouteComponent() {
    const {
        videoRef,
        canvasRef,
        currentLetter,
        isTraining,
        trainingProgress,
        isModelReady,
        downloadData,
        trainModel,
        downloadModel
    } = useHandTracking();

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <h1 className="text-2xl font-bold">Treino de Libras</h1>

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
            </div>

            <div className="text-xl font-bold">
                {currentLetter
                    ? `Capturando: ${currentLetter}`
                    : 'Pressione uma tecla (A–Z)'}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={downloadData}
                    className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                    disabled={isTraining}
                >
                    Baixar JSON
                </button>

                <button
                    onClick={trainModel}
                    className="rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
                    disabled={isTraining}
                >
                    {isTraining ? 'Treinando...' : 'Treinar Modelo'}
                </button>

                <button
                    onClick={downloadModel}
                    className="rounded bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600"
                    disabled={!isModelReady || isTraining}
                >
                    Baixar Modelo
                </button>
            </div>

            {trainingProgress && (
                <pre className="mt-4 w-full max-w-2xl overflow-auto rounded-lg bg-gray-100 p-4">
                    {trainingProgress}
                </pre>
            )}
        </div>
    );
}
