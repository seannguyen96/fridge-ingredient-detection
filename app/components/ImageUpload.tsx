const processImage = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set proper dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw and normalize the image
        ctx?.drawImage(img, 0, 0);
        
        // Convert to blob with specific format
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/png' }));
          } else {
            reject(new Error('Failed to process image'));
          }
        }, 'image/png', 1.0);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

// In your upload handler:
const handleUpload = async (file: File) => {
  try {
    const processedFile = await processImage(file);
    // Continue with your existing upload logic using processedFile
  } catch (error) {
    console.error('Error processing image:', error);
  }
}; 