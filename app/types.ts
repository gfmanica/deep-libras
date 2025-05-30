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
export type ImportingStatus = 'importing' | 'error' | 'success' | 'default';

export const importingText: Record<ImportingStatus, string> = {
    importing: 'Carregando modelo...',
    error: 'Erro ao carregar modelo.',
    success: 'Modelo carregado com sucesso!',
    default: 'Usando modelo padrão'
} as const;
