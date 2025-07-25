import { useState, useCallback } from 'react';

export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});

  // Supported file types
  const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
  const SUPPORTED_AUDIO_TYPES = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];
  const SUPPORTED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ];

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFile = (file) => {
    const errors = [];

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`File size exceeds 50MB limit`);
    }

    // Check image size specifically
    if (SUPPORTED_IMAGE_TYPES.includes(file.type) && file.size > MAX_IMAGE_SIZE) {
      errors.push(`Image size exceeds 10MB limit`);
    }

    // Check file type
    const allSupportedTypes = [
      ...SUPPORTED_IMAGE_TYPES,
      ...SUPPORTED_VIDEO_TYPES,
      ...SUPPORTED_AUDIO_TYPES,
      ...SUPPORTED_DOCUMENT_TYPES
    ];

    if (!allSupportedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not supported`);
    }

    return errors;
  };

  const getFileType = (file) => {
    if (SUPPORTED_IMAGE_TYPES.includes(file.type)) return 'image';
    if (SUPPORTED_VIDEO_TYPES.includes(file.type)) return 'video';
    if (SUPPORTED_AUDIO_TYPES.includes(file.type)) return 'audio';
    if (SUPPORTED_DOCUMENT_TYPES.includes(file.type)) return 'document';
    return 'unknown';
  };

  const getFileIcon = (fileType, mimeType) => {
    switch (fileType) {
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'document':
        if (mimeType.includes('pdf')) return '📄';
        if (mimeType.includes('word')) return '📝';
        if (mimeType.includes('excel') || mimeType.includes('sheet')) return '📊';
        if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📊';
        return '📄';
      default: return '📎';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const createImagePreview = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  };

  const simulateUpload = (file, onProgress) => {
    return new Promise((resolve, reject) => {
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      let progress = 0;
      
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Simulate successful upload
          setTimeout(() => {
            const uploadedFile = {
              id: fileId,
              name: file.name,
              size: file.size,
              type: getFileType(file),
              mimeType: file.type,
              url: URL.createObjectURL(file), // In real app, this would be server URL
              uploadedAt: new Date().toISOString(),
              icon: getFileIcon(getFileType(file), file.type)
            };
            resolve(uploadedFile);
          }, 200);
        } else {
          onProgress(progress);
        }
      }, 100);
    });
  };

  const uploadFiles = useCallback(async (files, conversationId) => {
    const fileArray = Array.from(files);
    const uploadPromises = [];
    const results = [];

    for (const file of fileArray) {
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Validate file
      const validationErrors = validateFile(file);
      if (validationErrors.length > 0) {
        setUploadErrors(prev => ({
          ...prev,
          [fileId]: validationErrors
        }));
        continue;
      }

      // Clear any previous errors
      setUploadErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fileId];
        return newErrors;
      });

      // Create upload promise
      const uploadPromise = simulateUpload(file, (progress) => {
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: progress
        }));
      }).then(uploadedFile => {
        // Clear progress after successful upload
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
        return uploadedFile;
      }).catch(error => {
        setUploadErrors(prev => ({
          ...prev,
          [fileId]: [error.message]
        }));
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
        return null;
      });

      uploadPromises.push(uploadPromise);
    }

    const uploadResults = await Promise.all(uploadPromises);
    return uploadResults.filter(Boolean); // Remove null results from failed uploads
  }, []);

  const clearError = (fileId) => {
    setUploadErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fileId];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setUploadErrors({});
  };

  return {
    uploadFiles,
    uploadProgress,
    uploadErrors,
    clearError,
    clearAllErrors,
    validateFile,
    getFileType,
    getFileIcon,
    formatFileSize,
    createImagePreview,
    SUPPORTED_IMAGE_TYPES,
    SUPPORTED_VIDEO_TYPES,
    SUPPORTED_AUDIO_TYPES,
    SUPPORTED_DOCUMENT_TYPES
  };
};
