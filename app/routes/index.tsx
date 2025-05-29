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
        <div className="flex flex-col items-center gap-8 rounded-xl border border-green-800/10 bg-gradient-to-br from-green-700/40 to-green-900/90 p-4 pt-12">
            <h1 className="font-inter text-3xl font-light text-white text-shadow-lg">
                Traduza{' '}
                <span className="font-instrument tracking-wider italic">
                    {' '}
                    Libras
                </span>{' '}
                para Português. Em tempo{' '}
                <span className="font-instrument tracking-wider italic">
                    real.
                </span>
            </h1>

            <p className="text-center text-sm font-light text-white">
                Atualmente, o modelo é capaz de traduzir apenas letras e
                números.
            </p>

            <div className="relative rounded-3xl border border-green-800/40 shadow-lg shadow-white/10">
                <video
                    ref={videoRef}
                    width={640}
                    height={480}
                    autoPlay
                    muted
                    className="scale-x-[-1] transform rounded-3xl"
                />
                <canvas
                    ref={canvasRef}
                    width={640}
                    height={480}
                    className="absolute top-0 left-0 rounded-3xl"
                />
                <div
                    data-hidden={!predictedLetter}
                    className="absolute top-4 left-4 rounded-lg bg-black/50 p-4 text-4xl font-bold text-white transition-opacity duration-300 data-[hidden=true]:opacity-0"
                >
                    Letra: {predictedLetter}
                </div>
            </div>

            <div className="text-lg font-light text-white">
                {modelStatus}
            </div>

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
                    className="cursor-pointer rounded-lg bg-gradient-to-tr from-blue-800 to-blue-700 px-3 py-1 font-light text-white shadow-xl transition-all hover:scale-103 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    Baixar modelo
                </button>
            </div>
        </div>
    );
}
