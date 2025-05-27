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
