import { useState } from 'react';
import { DetectionItem, ApiResponse, TransformedPrediction, ResultWithId } from '../types/detection';

const aggregatePredictions = (resultsMap: Map<string, DetectionItem[]>): DetectionItem[] => {
  const combinedMap = new Map<string, DetectionItem>();

  for (const predictions of resultsMap.values()) {
    for (const pred of predictions) {
      const existing = combinedMap.get(pred.name);
      if (existing) {
        combinedMap.set(pred.name, {
          name: pred.name,
          quantity: existing.quantity + pred.quantity,
          confidence: (existing.confidence + pred.confidence) / 2
        });
      } else {
        combinedMap.set(pred.name, { ...pred });
      }
    }
  }

  return Array.from(combinedMap.values());
};

export function useDetection() {
  const [predictions, setPredictions] = useState<DetectionItem[]>([]);
  const [resultsByImageId, setResultsByImageId] = useState<Map<string, DetectionItem[]>>(new Map()); // Used for aggregating results across multiple images
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectObjects = async (images: HTMLImageElement[], imageIds: string[]) => {
    try {
      setIsProcessing(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
      console.log('API URL:', apiUrl);

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
        console.error('API Error:', errorData);
        throw new Error(errorData.detail || errorData.message || 'Detection failed');
      }

      const data = await response.json() as ApiResponse;
      console.log('Raw API response:', data);

      const allTransformedResults: ResultWithId[] = data.results.map((result, index) => {
        const transformedPredictions: TransformedPrediction[] = Object.entries(result || {}).map(([_, details]) => ({
          label: details.name,
          count: details.quantity,
          confidence: details.confidence
        }));
        return { id: imageIds[index], predictions: transformedPredictions };
      });

      console.log('Transformed results:', allTransformedResults);

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