import { NextResponse } from 'next/server';

interface RequestData {
  images: string[];
}

interface DetectionDetails {
  name: string;
  quantity: number;
  confidence: number;
}

interface PredictionResult {
  label: string;
  count: number;
  confidence: number;
}

interface ApiResponse {
  results: Record<string, DetectionDetails>[];
}

export async function POST(req: Request) {
  try {
    const text = await req.text();
    
    let data: RequestData;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    if (!data.images || !Array.isArray(data.images)) {
      return NextResponse.json(
        { error: 'Invalid request format: images array is required' },
        { status: 400 }
      );
    }

    const { images } = data;
    
    if (images.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    if (images.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 images allowed' },
        { status: 400 }
      );
    }

    const formData = new FormData();
    images.forEach((base64Image: string, index: number) => {
      const base64Data = base64Image.includes('base64,') 
        ? base64Image.split('base64,')[1] 
        : base64Image;

      const buffer = Buffer.from(base64Data, 'base64');
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      formData.append('files', blob, `image${index}.jpg`);
    });

    const apiUrl = process.env.PYTHON_API_URL;
    if (!apiUrl) {
      throw new Error('PYTHON_API_URL environment variable is not set');
    }

    const response = await fetch(`${apiUrl}/detect`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Python API error: ${response.statusText}`);
    }

    const result = await response.json() as ApiResponse;
    
    const predictions: PredictionResult[] = result.results[0] 
      ? Object.entries(result.results[0]).map(([_, details]) => ({
          label: details.name,
          count: details.quantity,
          confidence: details.confidence / 100
        })) 
      : [];

    return NextResponse.json({ predictions });

  } catch (error) {
    console.error('API route error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}