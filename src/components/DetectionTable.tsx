"use client";
import { DetectionItem } from '@/types/detection';

interface DetectionTableProps {
  predictions: DetectionItem[];
  showConfidence: boolean;
  showAnimations: boolean;
}

export function DetectionTable({ predictions, showConfidence, showAnimations }: DetectionTableProps) {
  console.log('DetectionTable received predictions:', predictions);

  if (!predictions || predictions.length === 0) return null;

  const getDelay = (index: number) => {
    return `${(index * (2000 / Math.max(predictions.length, 1))) * 0.8}ms`;
  };

  return (
    <div className="relative overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="w-full text-sm text-left text-black">
        <thead className="text-xs text-black uppercase bg-gray-50">
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
              className="bg-white border-b hover:bg-gray-50"
              style={showAnimations ? {
                opacity: 0,
                animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s forwards`
              } : undefined}
            >
              <td className="px-6 py-4 text-black">{prediction.label}</td>
              <td className="px-6 py-4 text-black">{prediction.count}</td>
              {showConfidence && (
                <td className="px-6 py-4 text-black">{(prediction.confidence * 100).toFixed(1)}%</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}