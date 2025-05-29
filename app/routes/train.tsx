import { createFileRoute } from '@tanstack/react-router';

import { useDownloadModel } from '@/hooks/use-download-model';
import { useHandCapture } from '@/hooks/use-hand-capture';
import { useTrainModel } from '@/hooks/use-train-model';

export const Route = createFileRoute('/train')({
    component: RouteComponent
});

function RouteComponent() {
    const { canvasRef, videoRef, currentLetter, collectedData } =
        useHandCapture();
    const { trainModel, model, trainingStatus, trainingProgress } =
        useTrainModel({ collectedData });
    const { downloadModel } = useDownloadModel({ model });

    return (
        <>
            <h1 className="text-3xl font-light text-green-800">
                Treinar modelo de{' '}
                <span className="font-instrument tracking-wider italic">
                    Libras
                </span>
            </h1>

            <h2 className="inline-flex items-center gap-2 text-xl font-light">
                <div className="inline-flex size-[24px] items-center justify-center rounded-full bg-gradient-to-tr from-green-800 to-green-600">
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
                        className="scale-x-[-1] transform rounded-2xl"
                    />
                    <canvas
                        ref={canvasRef}
                        width={640}
                        height={480}
                        className="absolute top-0 left-0 rounded-2xl"
                    />

                    <div
                        data-hidden={!currentLetter}
                        className="absolute right-4 bottom-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100/80 text-3xl text-black opacity-100 transition-opacity duration-300 data-[hidden=true]:opacity-0"
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
                        <b className="font-bold">X</b> na letra dentro da
                        listagem para excluir a informação coletada.
                    </p>

                    <h1 className="text-xl font-light">Letras treinadas</h1>
                </div>
            </div>

            <h2 className="inline-flex items-center gap-2 text-xl font-light">
                <div className="inline-flex size-[24px] items-center justify-center rounded-full bg-gradient-to-tr from-green-800 to-green-600">
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
                    className="cursor-pointer rounded-lg bg-gradient-to-tr from-green-800 to-green-700 px-3 py-1 font-light text-white shadow-xl transition-all hover:scale-103 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={trainingStatus === 'training'}
                >
                    {trainingStatus === 'training'
                        ? 'Treinando...'
                        : 'Treinar modelo'}
                </button>

                <button
                    onClick={downloadModel}
                    className="cursor-pointer rounded-lg bg-gradient-to-tr from-blue-800 to-blue-700 px-3 py-1 font-light text-white shadow-xl transition-all hover:scale-103 disabled:cursor-not-allowed disabled:opacity-70"
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
