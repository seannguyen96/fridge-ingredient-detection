import { useState } from 'react';
import { DetectionItem } from '@/types/detection';

interface ApiPrediction {
  label: string;
  count: number;
  confidence: number;
}

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
    if (!images || images.length === 0 || !imageIds || imageIds.length === 0) {
      if (predictions.length === 0) {
        setError('Please select an image to process.');
      }
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: images.map(img => img.src)
        })
      });

      if (!response.ok) {
        throw new Error(`Detection error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Raw API Response:', result);

      if (!result?.predictions) {
        throw new Error('Invalid response format');
      }

      const transformedPredictions = result.predictions.map((pred: ApiPrediction) => ({
        name: pred.label,
        quantity: pred.count,
        confidence: pred.confidence
      }));

      setResultsByImageId(prev => {
        const newMap = new Map(prev);
        newMap.set(imageIds[0], transformedPredictions);
        
        const aggregated = aggregatePredictions(newMap);
        setPredictions(aggregated);
        
        return newMap;
      });

    } catch (err) {
      console.error('Detection error:', err);
      setError('Failed to process image. Please try again.');
    } finally {
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