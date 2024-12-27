export interface DetectionResult {
  name: string;
  quantity: number;
  confidence: number;
}

export interface DetectionResults {
  [className: string]: DetectionResult;
}

export class ObjectDetectionService {
  async initialize() {
    return Promise.resolve();
  }

  async detectObjects(image: HTMLImageElement): Promise<DetectionResults | null> {
    try {
      const blob = await fetch(image.src).then(r => r.blob());
      const formData = new FormData();
      formData.append('files', blob, 'image.jpg');

      const isProd = process.env.NODE_ENV === 'production';
      const API_URL = isProd 
        ? 'https://fridge-ingredient-detection-production.up.railway.app' 
        : (process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.198:8000');

      const response = await fetch(`${API_URL}/detect`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Detection failed');
      }

      const data = await response.json();
      return data.results[0];
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }
}