import { useState } from 'react';
import { DetectionItem } from '../types/detection';

interface ApiDetails {
  name: string;
  quantity: number;
  confidence: number;
}

interface ApiResult {
  [key: string]: ApiDetails;
}

interface ApiResponse {
  results: ApiResult[];
}

export function useDetection() {
  const [predictions, setPredictions] = useState<DetectionItem[]>([]);
  const [resultsByImageId, setResultsByImageId] = useState<Map<string, DetectionItem[]>>(new Map()); // Used for aggregating results across multiple images
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aggregatePredictions = (resultsMap: Map<string, DetectionItem[]>): DetectionItem[] => {
    const aggregated = new Map<string, DetectionItem>();
    
    for (const predictions of resultsMap.values()) {
      predictions.forEach(prediction => {
        const existing = aggregated.get(prediction.label);
        if (existing) {
          existing.count += prediction.count;
          existing.confidence = (existing.confidence + prediction.confidence) / 2;
        } else {
          aggregated.set(prediction.label, { ...prediction });
        }
      });
    }
    
    const result = Array.from(aggregated.values());
    return result;
  };

  const detectObjects = async (images: HTMLImageElement[], imageIds: string[]) => {
    try {
      setIsProcessing(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

      const formData = new FormData();
      for (let i = 0; i < images.length; i++) {
        const response = await fetch(images[i].src);
        const blob = await response.blob();
        const file = new File([blob], `image-${i}.jpg`, { type: 'image/jpeg' });
        formData.append('files', file);
      }

      const response = await fetch(`${apiUrl}/detect`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'Detection failed');
      }

      const data = await response.json() as ApiResponse;

      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('Invalid API response format');
      }

      const allTransformedResults = data.results.map((result, index) => {
        const transformedPredictions = Object.entries(result).map(([key, details]) => ({
          label: details.name,
          count: details.quantity,
          confidence: details.confidence
        }));
        return { id: imageIds[index], predictions: transformedPredictions };
      });

      setResultsByImageId(prev => {
        const newMap = new Map(prev);
        allTransformedResults.forEach(({ id, predictions }) => {
          newMap.set(id, predictions);
        });
        const aggregated = aggregatePredictions(newMap);
        setPredictions(aggregated);
        return newMap;
      });

      setIsProcessing(false);
    } catch (error) {
      console.error('Detection error:', error);
      setError('Failed to process image');
      setIsProcessing(false);
    }
  };

  const removeImageResults = (imageId: string) => {
    setResultsByImageId(prev => {
      const newMap = new Map(prev);
      newMap.delete(imageId);
      
      const aggregated = aggregatePredictions(newMap);
      setPredictions(aggregated);
      
      return newMap;
    });
  };

  const clearDetections = () => {
    setPredictions([]);
    setResultsByImageId(new Map());
    setError(null);
  };

  return {
    predictions,
    isProcessing,
    error,
    detectObjects,
    removeImageResults,
    clearDetections
  };
}