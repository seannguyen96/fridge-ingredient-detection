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

export interface ApiResponse {
  results: Array<{
    [key: string]: {
      name: string;
      quantity: number;
      confidence: number;
    }
  }>;
}

export interface TransformedPrediction {
  label: string;
  count: number;
  confidence: number;
}

export interface ResultWithId {
  id: string;
  predictions: TransformedPrediction[];
} 