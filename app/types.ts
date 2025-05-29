export interface HandLandmark {
    x: number;
    y: number;
    z: number;
}

export interface TrainingData {
    landmarks: HandLandmark[];
    label: string;
    timestamp: number;
}

export interface RecordedCharacter {
    character: string;
    samples: TrainingData[];
    isRecording: boolean;
}

export interface ModelConfig {
    inputShape: number[];
    hiddenLayers: number[];
    outputClasses: string[];
    learningRate: number;
    epochs: number;
}

export type TrainingStatus = 'idle' | 'training' | 'ready' | 'error';
export type ImportingStatus = 'idle' | 'importing' | 'error' | 'success';

export const importingText: Record<ImportingStatus, string> = {
    idle: 'Nenhum modelo carregado',
    importing: 'Carregando modelo...',
    error: 'Erro ao carregar modelo.',
    success: 'Modelo carregado com sucesso!'
} as const;
