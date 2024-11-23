import { DetectionItem } from '@/types/detection';

export const exportToJson = (predictions: DetectionItem[]) => {
  const data = JSON.stringify(predictions, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'detection-results.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportToCsv = (predictions: DetectionItem[]) => {
  const headers = ['Item', 'Quantity', 'Confidence'];
  const rows = predictions.map(p => [
    p.name,
    p.quantity.toString(),
    (p.confidence * 100).toFixed(1) + '%'
  ]);
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'detection-results.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}; 