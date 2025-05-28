import { createFileRoute } from '@tanstack/react-router';

import { useHandTranslate } from '@/hooks/use-hand-translate';
import { useImportModel } from '@/hooks/use-import-model';

export const Route = createFileRoute('/')({
    component: RouteComponent
});

function RouteComponent() {
    const { modelStatus, handleFileChange, loadModel, model } =
        useImportModel();
    const { videoRef, canvasRef, predictedLetter } = useHandTranslate({
        model
    });

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <h1 className="text-2xl font-bold">
                Reconhecimento de Letra em Libras
            </h1>

            <div className="mb-4 flex gap-4">
                <input
                    type="file"
                    onChange={handleFileChange}
                    multiple
                    accept=".json,.bin"
                    className="rounded border px-4 py-2"
                />
                <button
                    onClick={loadModel}
                    className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                >
                    Carregar Modelo
                </button>
            </div>

            <div className="text-lg font-semibold text-gray-700">
                {modelStatus}
            </div>

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
                <div className="absolute top-4 left-4 rounded-lg bg-black/50 p-4 text-4xl font-bold text-white">
                    Letra: {predictedLetter}
                </div>
            </div>
        </div>
    );
}
