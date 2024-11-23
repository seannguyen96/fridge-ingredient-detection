import { useState } from 'react';
import { DetectionItem } from '@/types/detection';
import { DetectionTable } from './DetectionTable';
import { ExportButton } from './ExportButton';

interface DetectionSectionProps {
  predictions: DetectionItem[];
  isProcessing: boolean;
  error: string | null;
  onExport: (format: 'csv' | 'json') => void;
}

export function DetectionSection({ predictions, isProcessing, error, onExport }: DetectionSectionProps) {
  const [showConfidence, setShowConfidence] = useState(true);
  const [showAnimations, setShowAnimations] = useState(true);
  const hasResults = predictions && predictions.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#7f56d9]">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#101828]">
            Detection Results
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowConfidence(!showConfidence)}
              className="inline-flex items-center text-sm text-[#7f56d9] hover:text-[#6941c6] gap-2"
            >
              {showConfidence ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
              {showConfidence ? 'Hide' : 'Show'} Confidence
            </button>
            <button
              onClick={() => setShowAnimations(!showAnimations)}
              className="inline-flex items-center text-sm text-[#7f56d9] hover:text-[#6941c6] gap-2"
            >
              {showAnimations ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
              {showAnimations ? 'Disable' : 'Enable'} Animations
            </button>
            {hasResults && (
              <ExportButton 
                predictions={predictions}
                onExport={onExport}
              />
            )}
          </div>
        </div>
        
        {isProcessing ? (
          <div className={`flex items-center justify-center py-8 ${showAnimations ? '' : 'animate-none'}`}>
            <div className={`rounded-full h-8 w-8 border-b-2 border-[#7f56d9] ${showAnimations ? 'animate-spin' : ''}`} />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
          </div>
        ) : !hasResults ? (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No results</h3>
            <p className="mt-1 text-sm text-gray-500">Please select an image to process.</p>
          </div>
        ) : (
          <DetectionTable 
            predictions={predictions} 
            showConfidence={showConfidence}
            showAnimations={showAnimations}
          />
        )}
      </div>
    </div>
  );
} 