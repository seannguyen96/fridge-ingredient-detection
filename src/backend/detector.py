from ultralytics import YOLO
from fastapi import HTTPException
import os

# Define allowed classes (COCO dataset class names)
ALLOWED_CLASSES = {
    # Foods
    'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza',
    'donut', 'cake', 'bowl', 'fruit', 'bread', 'vegetables',
    
    # Kitchen items
    'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl',
    'microwave', 'toaster', 
    
    # Containers
    'bowl', 'cup', 'bottle', 'container', 'plate'
}

# Lower confidence threshold (default is usually 0.25 or 25%)
CONFIDENCE_THRESHOLD = 0.15  # 15% confidence threshold

# Model is in the same directory as detector.py
MODEL_PATH = os.getenv("MODEL_PATH", os.path.join(os.path.dirname(__file__), "yolov8n.pt"))

def process_fridge_image(image_path):
    model = YOLO(MODEL_PATH)
    # Set the confidence threshold in the model prediction
    results = model(image_path, conf=CONFIDENCE_THRESHOLD)
    
    detections = {}
    
    for r in results:
        boxes = r.boxes
        for box in boxes:
            class_name = model.names[int(box.cls)]
            
            if class_name.lower() in ALLOWED_CLASSES:
                confidence = float(box.conf) * 100
                
                if class_name in detections:
                    detections[class_name]['quantity'] += 1
                    if confidence > detections[class_name]['confidence']:
                        detections[class_name]['confidence'] = confidence
                else:
                    detections[class_name] = {
                        'name': class_name,
                        'quantity': 1,
                        'confidence': confidence
                    }
    
    if not detections:
        raise HTTPException(
            status_code=404,
            detail="No food items detected in the image"
        )
            
    return detections