export interface DetectionItem {
  name: string;
  quantity: number;
  confidence: number;
}

export interface DetectionResults {
  [key: string]: DetectionItem;
}

export interface PredictionResult {
  label: string;
  count: number;
  confidence: number;
} 