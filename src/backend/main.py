from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import tempfile
import os
from detector import process_fridge_image
from typing import List
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from os import getenv

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Get CORS origins from environment variable, fallback to "*" for development
origins = getenv("CORS_ORIGINS", "*").split(",")
print(f"Allowed origins: {origins}")  # Debug log

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],  # Be specific about methods
    allow_headers=["*"],
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
    print("Endpoint hit!")  # Debug log
    try:
        if len(files) > 5:
            return JSONResponse(
                status_code=400,
                content={"error": "Maximum 5 images allowed"}
            )

        all_results = []
        for image in files:
            print(f"Processing image: {image.filename}")
            contents = await image.read()
            
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                temp_file.write(contents)
                temp_path = temp_file.name
                
                try:
                    results = process_fridge_image(temp_path)
                    all_results.append(results)
                finally:
                    os.unlink(temp_path)
        
        print(f"Detection results: {all_results}")
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