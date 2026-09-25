/**
 * Image preprocessing service for Soil Health Card documents.
 * Optimizes photos and document scans for vision understanding while preserving
 * table structure, color coding, and decimal points.
 */

export interface PreprocessedImageResult {
  file: File;
  previewUrl: string;
  originalWidth: number;
  originalHeight: number;
  processedWidth: number;
  processedHeight: number;
  isRotated?: boolean;
}

export async function preprocessSoilCardImage(file: File): Promise<PreprocessedImageResult> {
  // If running in SSR or file is PDF, pass through
  if (typeof window === 'undefined' || file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    const previewUrl = typeof window !== 'undefined' ? URL.createObjectURL(file) : '';
    return {
      file,
      previewUrl,
      originalWidth: 0,
      originalHeight: 0,
      processedWidth: 0,
      processedHeight: 0,
    };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const originalWidth = img.width;
        const originalHeight = img.height;

        // Determine optimal target dimensions (Max 2048px on longest side for clear table legibility)
        const MAX_DIMENSION = 2048;
        let targetWidth = originalWidth;
        let targetHeight = originalHeight;

        if (originalWidth > MAX_DIMENSION || originalHeight > MAX_DIMENSION) {
          if (originalWidth > originalHeight) {
            targetWidth = MAX_DIMENSION;
            targetHeight = Math.round((originalHeight * MAX_DIMENSION) / originalWidth);
          } else {
            targetHeight = MAX_DIMENSION;
            targetWidth = Math.round((originalWidth * MAX_DIMENSION) / originalHeight);
          }
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            file,
            previewUrl: objectUrl,
            originalWidth,
            originalHeight,
            processedWidth: originalWidth,
            processedHeight: originalHeight,
          });
          return;
        }

        // Fill background with white to handle transparency
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Draw image scaled
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Subtle contrast & brightness enhancement for camera photos (mild filter, no aggressive binarization)
        // Table lines, column headers, and colored ratings are preserved.
        try {
          const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
          const data = imgData.data;
          
          // Contrast factor (1.1 = +10% contrast, safe for text and colors)
          const contrast = 1.1;
          const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

          for (let i = 0; i < data.length; i += 4) {
            // R, G, B
            data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
            data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
            data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
          }
          ctx.putImageData(imgData, 0, 0);
        } catch {
          // If cross-origin or canvas security prevents getImageData, proceed with base canvas draw
        }

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({
                file,
                previewUrl: objectUrl,
                originalWidth,
                originalHeight,
                processedWidth: targetWidth,
                processedHeight: targetHeight,
              });
              return;
            }

            const processedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '-optimized.jpg', {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            const processedUrl = URL.createObjectURL(blob);

            resolve({
              file: processedFile,
              previewUrl: processedUrl,
              originalWidth,
              originalHeight,
              processedWidth: targetWidth,
              processedHeight: targetHeight,
            });
          },
          'image/jpeg',
          0.92
        );
      } catch (err) {
        console.warn('Canvas preprocessing fallback:', err);
        resolve({
          file,
          previewUrl: objectUrl,
          originalWidth: img.width || 0,
          originalHeight: img.height || 0,
          processedWidth: img.width || 0,
          processedHeight: img.height || 0,
        });
      }
    };

    img.onerror = () => {
      resolve({
        file,
        previewUrl: objectUrl,
        originalWidth: 0,
        originalHeight: 0,
        processedWidth: 0,
        processedHeight: 0,
      });
    };

    img.src = objectUrl;
  });
}
