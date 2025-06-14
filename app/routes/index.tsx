import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpToLine } from 'lucide-react';

import { useHandTranslate } from '@/hooks/use-hand-translate';
import { useImportModel } from '@/hooks/use-import-model';
import { importingText } from '@/types';

export const Route = createFileRoute('/')({
    component: RouteComponent
});

function RouteComponent() {
    const { modelStatus, loadModel, model } = useImportModel();

    const { videoRef, canvasRef, predictedLetter } = useHandTranslate({
        model
    });

    return (
        <div className="mx-4 flex flex-col items-center gap-8 rounded-xl border border-green-800/10 bg-gradient-to-br from-green-700/50 to-green-900/90 p-8 pt-12 xl:mx-0">
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
                    className="z-2 scale-x-[-1] transform rounded-3xl"
                />
                <canvas
                    ref={canvasRef}
                    width={640}
                    height={480}
                    className="absolute top-0 left-0 z-2 rounded-3xl"
                />

                <p className="absolute top-1/2 left-1/2 z-1 -translate-x-1/2 -translate-y-1/2 text-sm font-light whitespace-nowrap text-white">
                    Permita acesso à câmera para começar a traduzir.
                </p>

                <div
                    data-hidden={!predictedLetter}
                    className="absolute right-4 bottom-4 z-3 flex h-16 w-16 items-center justify-center rounded-lg border border-white/40 bg-white/40 text-3xl text-black opacity-100 shadow-md backdrop-blur-md transition-opacity duration-300 data-[hidden=true]:opacity-0"
                >
                    {predictedLetter}
                </div>
            </div>

            <p className="max-w-[560px] text-center text-sm font-light text-white">
                Você pode usar seu próprio modelo de aprendizado de máquina para
                traduzir! Para isso, basta importar os arquivos com as
                extensões <span className="font-semibold">json</span> e{' '}
                <span className="font-semibold">bin</span>, gerados a partir do
                treino realizado. Caso não tenha treinado, você pode{' '}
                <Link
                    to="/train"
                    className="font-semibold underline underline-offset-4"
                >
                    treinar um modelo
                </Link>
                .
            </p>

            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-4">
                    <input
                        id="file-upload"
                        type="file"
                        onChange={loadModel}
                        multiple
                        accept=".json,.bin"
                        className="hidden"
                    />

                    <label
                        htmlFor="file-upload"
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/40 bg-white/40 p-2 px-4 py-2 pl-4 text-black shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105"
                    >
                        Selecionar arquivos do modelo{' '}
                        <ArrowUpToLine size={16} />
                    </label>
                </div>

                <p className="text-sm font-light text-white">
                    {importingText[modelStatus]}
                </p>
            </div>
        </div>
    );
}
