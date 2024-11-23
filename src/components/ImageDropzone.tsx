"use client";
import React, { useState, DragEvent, ChangeEvent } from 'react';

interface ImageDropzoneProps {
  onImageSelected: (images: HTMLImageElement[]) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  currentImages: { 
    id: string; 
    src: string;
    status: 'valid' | 'invalid' | 'pending';
  }[];
  maxImages: number;
  onRemoveImage: (imageId: string) => void;
  isProcessing: boolean;
}

export function ImageDropzone({ 
  onImageSelected, 
  fileInputRef, 
  currentImages, 
  maxImages,
  onRemoveImage,
  isProcessing 
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const getBorderColor = (status: 'valid' | 'invalid' | 'pending') => {
    switch (status) {
      case 'valid':
        return 'border-emerald-500';
      case 'invalid':
        return 'border-red-500';
      case 'pending':
      default:
        return 'border-gray-200';
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    await processFiles(files);
    event.target.value = '';
  };

  const processFiles = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const remainingSlots = maxImages - currentImages.length;
    const filesToProcess = imageFiles.slice(0, remainingSlots);

    const processedImages: HTMLImageElement[] = await Promise.all(
      filesToProcess.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
              resolve(img);
            };
          };
          reader.readAsDataURL(file);
        });
      })
    );

    onImageSelected(processedImages);
  };

  return (
    <div className="mt-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full border-2 border-dashed rounded-lg p-4
          transition-colors min-h-[160px] cursor-pointer
          ${isDragging 
            ? 'border-[#7f56d9] bg-[#7f56d9]/10' 
            : 'border-[#7f56d9] hover:bg-[#7f56d9]/5'
          }`}
        onClick={(e) => {
          if (e.target === e.currentTarget || 
              (e.target as HTMLElement).classList.contains('dropzone-content')) {
            fileInputRef.current?.click();
          }
        }}
      >
        {currentImages.length > 0 ? (
          <div className="dropzone-content grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {currentImages.map((image) => (
              <div key={image.id} className="relative group">
                <div 
                  className={`relative rounded-lg overflow-hidden transition-all duration-200
                    cursor-pointer h-32 group-hover:shadow-lg
                    ${getBorderColor(image.status)} border-2`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const div = e.currentTarget;
                    div.classList.toggle('scale-[2.0]');
                    div.classList.toggle('z-50');
                  }}
                >
                  <img
                    src={image.src}
                    alt="Uploaded"
                    className="w-full h-full object-contain bg-white"
                  />
                  {image.status !== 'pending' && (
                    <div className={`absolute top-2 left-2 rounded-full p-1
                      ${image.status === 'valid' ? 'bg-emerald-500' : 'bg-red-500'}`}
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {image.status === 'valid' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        )}
                      </svg>
                    </div>
                  )}
                </div>
                {!isProcessing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveImage(image.id);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 
                             shadow-lg opacity-0 group-hover:opacity-100 transition-opacity
                             hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Remove image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="dropzone-content flex flex-col items-center justify-center w-full h-full">
            <svg 
              className="dropzone-content w-12 h-12 text-[#7f56d9]"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                className="dropzone-content"
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            <p className="dropzone-content mt-6 text-sm font-medium text-[#7f56d9]">
              Click or drag images here (jpeg, png, gif, webp)
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
}