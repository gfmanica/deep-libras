import { createFileRoute } from '@tanstack/react-router';
import { X } from 'lucide-react';

import { useDownloadModel } from '@/hooks/use-download-model';
import { useHandCapture } from '@/hooks/use-hand-capture';
import { useTrainModel } from '@/hooks/use-train-model';

export const Route = createFileRoute('/train')({
    component: RouteComponent
});

function RouteComponent() {
    const {
        canvasRef,
        videoRef,
        currentLetter,
        collectedData,
        removeCollectedData
    } = useHandCapture();
    const { trainModel, model, trainingStatus, trainingProgress } =
        useTrainModel({ collectedData });
    const { downloadModel } = useDownloadModel({ model, collectedData });

    const groupedCollectedData = () => {
        const initial: Record<string, number> = {};

        collectedData.forEach((item) => {
            if (!initial[item.label]) {
                initial[item.label] = 0;
            }

            initial[item.label] += 1;
        });

        return initial;
    };

    return (
        <>
            <h1 className="text-3xl font-light text-green-800">
                Treinar modelo de{' '}
                <span className="font-instrument tracking-wider italic">
                    Libras
                </span>
            </h1>

            <h2 className="inline-flex items-center gap-2 text-xl font-light">
                <div className="inline-flex size-[24px] items-center justify-center rounded-full bg-gradient-to-tr from-green-800 to-green-600 shadow-md">
                    <p className="font-instrument text-base text-white italic">
                        1
                    </p>
                </div>
                Coletar dados para o modelo
            </h2>

            <div className="flex flex-1 gap-4">
                <div className="relative h-[480px] w-[640px]">
                    <video
                        ref={videoRef}
                        width={640}
                        height={480}
                        autoPlay
                        muted
                        className="z-2 scale-x-[-1] transform rounded-2xl"
                    />
                    <canvas
                        ref={canvasRef}
                        width={640}
                        height={480}
                        className="absolute top-0 left-0 z-2 rounded-2xl"
                    />

                    <p className="absolute top-1/2 left-1/2 z-1 -translate-x-1/2 -translate-y-1/2 text-sm font-light whitespace-nowrap text-white">
                        Permita acesso à câmera para começar a coletar dados.
                    </p>

                    <div
                        data-hidden={!currentLetter}
                        className="absolute right-4 bottom-4 z-3 flex h-16 w-16 items-center justify-center rounded-lg border border-white/40 bg-white/40 text-3xl text-black opacity-100 shadow-md backdrop-blur-md transition-opacity duration-300 data-[hidden=true]:opacity-0"
                    >
                        {currentLetter}
                    </div>
                </div>

                <div className="flex flex-1 flex-col gap-4">
                    <p className="font-light">
                        Digite alguma <b className="font-bold">letra</b> ou{' '}
                        <b className="font-bold">número</b> para realizar a
                        coleta dos dados, que dura 1 segundo por caracter. Caso
                        tenha digitado algum caracter por engano, clique em no{' '}
                        <b className="font-bold">X</b> no caracter dentro da
                        listagem para excluir a informação coletada.
                    </p>

                    <div className="flex flex-col gap-2">
                        <h1 className="text-xl font-light">
                            Caracteres coletados
                        </h1>

                        {!Object.entries(groupedCollectedData()).length && (
                            <p className="text-sm font-light text-zinc-500">
                                Nenhum caracter coletado.
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {Object.entries(groupedCollectedData()).map(
                            ([label, count]) => (
                                <div
                                    key={label}
                                    className="relative inline-flex h-16 w-16 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-gradient-to-tr from-zinc-50 to-zinc-100 shadow-sm"
                                >
                                    <button
                                        onClick={() =>
                                            removeCollectedData(label)
                                        }
                                        className="absolute -top-2 -right-2 cursor-pointer rounded-full border border-zinc-300 bg-zinc-100 text-xs text-zinc-800 transition-all hover:scale-105"
                                    >
                                        <X size={14} strokeWidth={2} />
                                    </button>
                                    <p className="text-2xl text-zinc-800">
                                        {label}
                                    </p>
                                    <p className="absolute right-1 bottom-1 text-xs text-black">
                                        {count}
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            <h2 className="inline-flex items-center gap-2 text-xl font-light">
                <div className="inline-flex size-[24px] items-center justify-center rounded-full bg-gradient-to-tr from-green-800 to-green-600 shadow-md">
                    <p className="font-instrument text-base text-white italic">
                        2
                    </p>
                </div>
                Realizar treinamento
            </h2>

            <p className="font-light">
                Para realizar o treinamento, é necessário ter coletado ao mínimo
                <b className="font-bold"> 1 amostra</b> de caracter. Após isso,
                clique no botão{' '}
                <b className="font-bold text-green-800">Treinar modelo</b> para
                iniciar o treinamento. <br />
                Enquanto o treinamento está em andamento, será exibido métricas
                sobre o treinamento, e não será possível coletar outros dados,
                realizar outro treinamento ou baixar o modelo. <br />
                Quando o treinamento for concluído, clique em{' '}
                <b className="font-bold text-blue-800">Baixar modelo</b> para
                salvar o modelo treinado no dispositivo.
            </p>

            <div className="flex gap-4">
                <button
                    onClick={trainModel}
                    className="cursor-pointer rounded-lg border border-green-800/10 bg-gradient-to-tr from-green-900/90 to-green-700/70 px-3 py-1 font-light text-white shadow-xl transition-all hover:scale-103 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={
                        trainingStatus === 'training' ||
                        !Object.entries(groupedCollectedData()).length
                    }
                >
                    {trainingStatus === 'training'
                        ? 'Treinando...'
                        : 'Treinar modelo'}
                </button>

                <button
                    onClick={downloadModel}
                    className="cursor-pointer rounded-lg border border-blue-800/10 bg-gradient-to-tr from-blue-900/90 to-blue-700/70 px-3 py-1 font-light text-white shadow-xl transition-all hover:scale-103 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={trainingStatus !== 'ready'}
                >
                    Baixar modelo
                </button>
            </div>

            {trainingProgress && (
                <pre className="mt-4 w-full max-w-2xl overflow-auto rounded-lg bg-zinc-100 p-4">
                    {trainingProgress}
                </pre>
            )}
        </>
    );
}
