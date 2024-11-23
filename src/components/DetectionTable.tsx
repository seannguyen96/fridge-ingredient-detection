"use client";
import { DetectionItem } from '@/types/detection';

interface DetectionTableProps {
  predictions: DetectionItem[];
  showConfidence: boolean;
  showAnimations: boolean;
}

export function DetectionTable({ predictions, showConfidence, showAnimations }: DetectionTableProps) {
  if (!predictions || predictions.length === 0) return null;

  const getDelay = (index: number) => {
    return `${(index * (2000 / Math.max(predictions.length, 1))) * 0.8}ms`;
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Item</th>
            <th scope="col" className="px-6 py-3">Quantity</th>
            {showConfidence && (
              <th scope="col" className="px-6 py-3">Confidence</th>
            )}
          </tr>
        </thead>
        <tbody>
          {predictions.map((prediction, index) => (
            <tr 
              key={`${prediction.label}-${index}`}
              className="bg-white border-b"
              style={showAnimations ? {
                opacity: 0,
                animationName: 'row-fade-in',
                animationDuration: '500ms',
                animationTimingFunction: 'ease-out',
                animationFillMode: 'forwards',
                animationDelay: getDelay(index)
              } : {
                opacity: 1
              }}
            >
              <td className="px-6 py-4">{prediction.name}</td>
              <td className="px-6 py-4">{prediction.quantity}</td>
              {showConfidence && (
                <td className="px-6 py-4">{(prediction.confidence * 100).toFixed(1)}%</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}