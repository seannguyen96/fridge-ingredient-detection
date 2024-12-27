# Fridge Ingredient Detection

An AI-powered web application that detects ingredients in your fridge using computer vision.

Try it out: [Live Demo](https://fridge-ingredient-detection-umber.vercel.app/)


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

### Local Development

1. Clone the repository
```bash
git clone [your-repo-url]
```

2. Install dependencies
```bash
npm install
python -m venv venv
source venv/bin/activate  
# On Windows: venv\Scripts\activate
pip install -r src/backend/requirements.txt
```

3. Start the servers
```bash
# Terminal 1 - Backend
uvicorn src.backend.main:app --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
# For local access only:
npm run dev
# For mobile device access on same network:
npm run dev -- --hostname YOUR_LOCAL_IP
```

4. Access the application
- Local access:
  - Frontend: http://localhost:3000
  - Backend API: http://localhost:8000

- Mobile device access (optional):
  - Replace YOUR_LOCAL_IP with your machine's IP address
  - Frontend: http://YOUR_LOCAL_IP:3000
  - Backend API: http://YOUR_LOCAL_IP:8000

Note: To enable mobile access, find your local IP address:
- On Windows: Run `ipconfig` in Command Prompt
- On Mac/Linux: Run `ifconfig` or `ip addr` in Terminal

### Quick Start
Visit [https://fridge-ingredient-detection-umber.vercel.app/]to try the application without local setup.

## API Rate Limits
- 30 requests per minute per IP
- Maximum file size: 10MB per image
- Supported formats: .jpg, .jpeg, .png, webp

## Next Steps
- Fine-tune the model with a larger, more diverse dataset
- Explore real-time detection on a mobile platform
- Add support for more objects 
- Implement recipe suggestions based on detected ingredients

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
