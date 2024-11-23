"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ImageDropzone } from './ImageDropzone';

interface UploadedImage {
  id: string;
  src: string;
  status: 'valid' | 'invalid' | 'pending';
}

interface ImageUploadProps {
  onImageSelected: (images: HTMLImageElement[], imageIds: string[]) => void;
  onClear: () => void;
  isProcessing: boolean;
  onRemoveImage: (imageId: string) => void;
}

export function ImageUpload({ onImageSelected, onClear, isProcessing, onRemoveImage }: ImageUploadProps) {
  const [currentImages, setCurrentImages] = useState<UploadedImage[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [shouldUpdateDetection, setShouldUpdateDetection] = useState(false);

  const handleImagesSelected = useCallback(async (newImages: HTMLImageElement[]) => {
    console.log('handleImagesSelected called with images:', newImages.length);
    
    const newImageObjects = newImages.map(img => ({
      id: uuidv4(),
      src: img.src,
      status: 'pending' as const
    }));

    setCurrentImages(prev => [...prev, ...newImageObjects]);
    onImageSelected(newImages, newImageObjects.map(img => img.id));
  }, [onImageSelected]);

  const handleRemoveImage = useCallback((imageId: string) => {
    setCurrentImages(prev => prev.filter(img => img.id !== imageId));
    onRemoveImage(imageId);
  }, [onRemoveImage]);

  // Handle detection updates only when explicitly triggered
  useEffect(() => {
    if (shouldUpdateDetection) {
      const validImages = currentImages
        .filter(img => img.status === 'valid')
        .map(img => {
          const htmlImg = new Image();
          htmlImg.src = img.src;
          return htmlImg;
        });

      if (validImages.length > 0) {
        onImageSelected(validImages, validImages.map(img => img.src));
      } else {
        onClear();
      }
      
      setShouldUpdateDetection(false);
    }
  }, [shouldUpdateDetection, currentImages, onImageSelected, onClear]);

  const handleClear = useCallback(() => {
    setCurrentImages([]);
    onClear();
  }, [onClear]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#7f56d9]">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#101828]">
            Upload Images
          </h2>
          <div className="flex items-center gap-3">
            {currentImages.length > 0 && (
              <button
                onClick={handleClear}
                className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium 
                         ring-offset-background transition-colors focus-visible:outline-none 
                         focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
                         border border-gray-400 bg-white hover:bg-gray-100 text-gray-700
                         h-9 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isProcessing}
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear all
              </button>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium 
                       ring-offset-background transition-colors focus-visible:outline-none 
                       focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
                       border border-[#7f56d9] bg-[#7f56d9] hover:bg-[#6941c6] 
                       h-9 px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isProcessing}
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Upload
            </button>
          </div>
        </div>
        
        <ImageDropzone 
          onImageSelected={handleImagesSelected}
          fileInputRef={fileInputRef}
          currentImages={currentImages}
          maxImages={5}
          onRemoveImage={handleRemoveImage}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
}