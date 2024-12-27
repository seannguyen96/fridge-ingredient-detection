from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import tempfile
import os
from .detector import process_fridge_image
from typing import List
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from os import getenv

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Debug: Print environment variables
cors_origins = getenv("CORS_ORIGINS", "https://fridge-ingredient-detection-umber.vercel.app,https://fridge-ingredient-detection-production.up.railway.app")
print(f"CORS_ORIGINS env var: {cors_origins}")

# Split and clean origins, ensure no empty strings
origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]
print(f"Parsed origins: {origins}")

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all origins for testing
    allow_credentials=False,  # Set to False when using allow_origins=["*"]
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "Fridge Ingredient Detection API is running",
        "endpoints": {
            "detect": "/detect - POST endpoint for image detection"
        }
    }

@app.post("/detect")
@limiter.limit("30/minute")
async def detect_objects(request: Request, files: List[UploadFile] = File(...)):
    print("Endpoint hit!")
    try:
        if len(files) > 5:
            return JSONResponse(
                status_code=400,
                content={"error": "Maximum 5 images allowed"}
            )

        all_results = []
        for image in files:
            print(f"Processing image: {image.filename}")
            # Read in chunks instead of all at once
            CHUNK_SIZE = 1024 * 1024  # 1MB chunks
            contents = b""
            
            while chunk := await image.read(CHUNK_SIZE):
                contents += chunk
            
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                temp_file.write(contents)
                temp_path = temp_file.name
                
                try:
                    results = process_fridge_image(temp_path)
                    all_results.append(results)
                finally:
                    # Clean up immediately
                    os.unlink(temp_path)
                    del contents  # Free memory explicitly
        
        return JSONResponse(content={"results": all_results})
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)