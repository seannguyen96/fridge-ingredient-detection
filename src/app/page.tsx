"use client";

import { useCallback } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { DetectionSection } from '@/components/DetectionSection';
import { useDetection } from '@/hooks/useDetection';
import { exportToCsv, exportToJson } from '@/utils/exportUtils';

export default function Page() {
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
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-semibold text-[#101828]">
            Fridge Ingredient Detection with AI
          </h1>
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
      </div>
    </main>
  );
}
