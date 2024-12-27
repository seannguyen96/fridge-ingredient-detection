from PIL import Image
import io
from PIL import ExifTags

async def process_image_file(file: UploadFile):
    contents = await file.read()
    
    # Convert the image and handle EXIF orientation
    image = Image.open(io.BytesIO(contents))
    
    # Handle EXIF orientation
    try:
        for orientation in ExifTags.TAGS.keys():
            if ExifTags.TAGS[orientation] == 'Orientation':
                break
        exif = dict(image._getexif().items())

        if exif[orientation] == 3:
            image = image.rotate(180, expand=True)
        elif exif[orientation] == 6:
            image = image.rotate(270, expand=True)
        elif exif[orientation] == 8:
            image = image.rotate(90, expand=True)
    except (AttributeError, KeyError, IndexError):
        # No EXIF data or no orientation info
        pass

    # Convert to RGB if needed
    if image.mode not in ('RGB', 'L'):
        image = image.convert('RGB')
    
    # Save to bytes
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()
    
    # Continue with your existing processing...
    return img_byte_arr 