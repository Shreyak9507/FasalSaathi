export type SupportedCrop = 'Corn' | 'Potato' | 'Rice' | 'Wheat' | 'Unknown';

export type ViTDiseaseClass =
  | 'Corn___Common_Rust'
  | 'Corn___Gray_Leaf_Spot'
  | 'Corn___Healthy'
  | 'Invalid'
  | 'Potato___Early_Blight'
  | 'Potato___Healthy'
  | 'Potato___Late_Blight'
  | 'Rice___Brown_Spot'
  | 'Rice___Healthy'
  | 'Rice___Leaf_Blast'
  | 'Wheat___Brown_Rust'
  | 'Wheat___Healthy'
  | 'Wheat___Yellow_Rust';

export interface DiseaseDetectionResult {
  crop: SupportedCrop;
  cropEmoji: string;
  condition: string;
  rawLabel: ViTDiseaseClass;
  confidence: number; // 0 - 100
  isHealthy: boolean;
  isInvalid: boolean;
  lowConfidence: boolean; // confidence < 60
  engine: 'huggingface' | 'gemini';
  whatWeFound: string;
  whatYouCanDo: string[];
  disclaimer: string;
}
