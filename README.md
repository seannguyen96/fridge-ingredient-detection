# Fridge Ingredient Detection

An AI-powered web application for detecting and counting ingredients in images. Simply upload images of your fridge or food items, and the system will identify and quantify the ingredients present.

## Features
- Drag-and-drop or click-to-upload image functionality
- Real-time ingredient detection and counting
- Confidence score toggles
- Animation controls
- Export results to CSV or JSON
- Rate limiting: 30 requests per minute per IP

## Tech Stack
- Frontend: Next.js + TypeScript + TailwindCSS
- Backend: Python FastAPI
- AI Model: YOLOv8

## Getting Started

1. Clone the repository
```bash
git clone [your-repo-url]
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## API Rate Limits
- 30 requests per minute per IP
- Maximum file size: 10MB per image
- Supported formats: .jpg, .jpeg, .png, webp

## Credits
This project uses YOLOv8 by Ultralytics:
```bibtex
@software{yolov8_ultralytics,
  author = {Glenn Jocher and Ayush Chaurasia and Jing Qiu},
  title = {Ultralytics YOLOv8},
  version = {8.0.0},
  year = {2023},
  url = {https://github.com/ultralytics/ultralytics},
  license = {AGPL-3.0}
}
```
