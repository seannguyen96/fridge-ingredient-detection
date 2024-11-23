# Use multi-stage build
FROM python:3.11-slim as builder

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first
COPY src/backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Final stage
FROM python:3.11-slim

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/

# Copy app code
COPY . .

# Set environment variables
ENV PORT=8000

# Start command
CMD ["uvicorn", "src.backend.main:app", "--host", "0.0.0.0", "--port", "8000"] 