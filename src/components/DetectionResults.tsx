"use client";
import React from 'react';

interface DetectionItem {
  name: string;
  quantity: number;
  confidence: number;
}

interface DetectionResult {
  [key: string]: DetectionItem;
}

interface CombinedResults {
  [key: string]: {
    name: string;
    quantity: number;
    confidence: number;
  };
}

interface DetectionResultsProps {
  results: DetectionResult[];
}

export function DetectionResults({ results }: DetectionResultsProps) {
  const combineResults = (results: DetectionResult[]): CombinedResults => {
    const combined: CombinedResults = {};

    results.forEach(imageResult => {
      Object.values(imageResult).forEach(item => {
        if (combined[item.name]) {
          // If item exists, update quantity and average confidence
          const existing = combined[item.name];
          const newQuantity = existing.quantity + item.quantity;
          const newConfidence = (existing.confidence * existing.quantity + item.confidence * item.quantity) / newQuantity;
          
          combined[item.name] = {
            name: item.name,
            quantity: newQuantity,
            confidence: Number(newConfidence.toFixed(2))
          };
        } else {
          // If item doesn't exist, add it
          combined[item.name] = {
            name: item.name,
            quantity: item.quantity,
            confidence: Number(item.confidence.toFixed(2))
          };
        }
      });
    });

    return combined;
  };

  const combinedResults = combineResults(results);

  return (
    <div className="mt-4">
      {Object.keys(combinedResults).length > 0 ? (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Detection Results:</h3>
          <ul className="space-y-2">
            {Object.values(combinedResults)
              .sort((a, b) => b.quantity - a.quantity) // Sort by quantity
              .map(item => (
                <li 
                  key={item.name} 
                  className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md"
                >
                  <span className="capitalize font-medium">
                    {item.name}: {item.quantity}
                  </span>
                  <span className="text-sm text-gray-500">
                    {item.confidence}% confidence
                  </span>
                </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
          Unable to detect food items. Try uploading a different image!
        </div>
      )}
    </div>
  );
} 