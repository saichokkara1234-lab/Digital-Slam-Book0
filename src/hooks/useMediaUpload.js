import { useState } from 'react';

export function useMediaUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (file, type) => {
    return new Promise((resolve, reject) => {
      setUploading(true);
      setError(null);

      // Validate file type
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      
      if (type === 'image' && !validImageTypes.includes(file.type)) {
        setError('Invalid image format. Please use JPG, PNG, GIF, or WebP.');
        setUploading(false);
        reject(new Error('Invalid image format'));
        return;
      }
      
      if (type === 'video' && !validVideoTypes.includes(file.type)) {
        setError('Invalid video format. Please use MP4, WebM, or OGG.');
        setUploading(false);
        reject(new Error('Invalid video format'));
        return;
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError('File size too large. Maximum size is 10MB.');
        setUploading(false);
        reject(new Error('File size too large'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        setUploading(false);
        resolve({
          type,
          url: e.target.result,
          filename: file.name
        });
      };
      
      reader.onerror = () => {
        setError('Failed to read file');
        setUploading(false);
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  return {
    handleFileUpload,
    uploading,
    error,
    clearError: () => setError(null)
  };
}


