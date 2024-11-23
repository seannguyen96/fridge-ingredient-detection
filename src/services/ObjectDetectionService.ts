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
      formData.append('image', blob);

      const response = await fetch('/api/detect', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Detection failed');
      }

      return response.json();
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }
}