"use client";

import { useCallback } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { DetectionSection } from '@/components/DetectionSection';
import { useDetection } from '@/hooks/useDetection';
import { exportToCsv, exportToJson } from '@/utils/exportUtils';

export default function Home() {
  const { 
    predictions, 
    isProcessing, 
    error, 
    detectObjects,
    removeImageResults,
    clearDetections 
  } = useDetection();

  const handleImageSelected = useCallback(async (images: HTMLImageElement[], imageIds: string[]) => {
    await detectObjects(images, imageIds);
  }, [detectObjects]);

  const handleExport = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      exportToCsv(predictions);
    } else {
      exportToJson(predictions);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1>Fridge Ingredient Detection</h1>
      <ImageUpload 
        onImageSelected={handleImageSelected}
        onRemoveImage={removeImageResults}
        onClear={clearDetections}
        isProcessing={isProcessing}
      />
      <DetectionSection 
        predictions={predictions}
        isProcessing={isProcessing}
        error={error}
        onExport={handleExport}
      />
    </div>
  );
}
