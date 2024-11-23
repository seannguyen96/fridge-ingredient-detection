FROM python:3.9-slim

WORKDIR /app

# Install all required system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy backend files including the model
COPY src/backend /app/src/backend

# Set Python path and model path
ENV PYTHONPATH=/app/src/backend
ENV MODEL_PATH=/app/src/backend/yolov8n.pt
ENV PORT=8000

# Install Python dependencies
RUN pip install -r /app/src/backend/requirements.txt

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] 