
export interface PlantInfo {
  name: string;
  englishName: string;
  sowingTime: string;
  floweringSeason: string;
  characteristics: string;
  varieties: string;
  precautions: string;
  imageUrls: string[];
  specificAnswer?: string;
}

export interface PlantSuggestion {
  name: string;
  imageUrls: string[];
}

export interface AnalysisResult {
  isPlant: boolean;
  plantInfo?: Omit<PlantInfo, 'imageUrls'>;
  suggestions?: Omit<PlantSuggestion, 'imageUrls'>[];
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
