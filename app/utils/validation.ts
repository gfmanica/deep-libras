export const validateCharacter = (char: string): boolean => {
    // Permite apenas letras A-Z e números 0-9
    const validPattern = /^[A-Z0-9]$/;
    return validPattern.test(char.toUpperCase());
};

export const sanitizeCharacter = (input: string): string => {
    return input.toUpperCase().trim();
};

export const isValidTrainingData = (samples: any[]): boolean => {
    return samples.length >= 10; // Mínimo 10 amostras por caractere
};
