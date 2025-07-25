import React, { useState, useRef } from 'react';
import { X, Upload, File, Image, Video, Music, FileText, Download, Eye } from 'lucide-react';

const FilePreview = ({ file, onRemove, showRemove = true, onClick }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  const getFileIcon = () => {
    switch (file.type) {
      case 'image':
        return <Image size={20} className="text-blue-500" />;
      case 'video':
        return <Video size={20} className="text-purple-500" />;
      case 'audio':
        return <Music size={20} className="text-green-500" />;
      case 'document':
        return <FileText size={20} className="text-red-500" />;
      default:
        return <File size={20} className="text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (file.type === 'image' && !imageError) {
    return (
      <div 
        className="relative group cursor-pointer" 
        onClick={() => onClick && onClick()}
      >
        <img
          src={file.url}
          alt={file.name}
          className="max-w-xs max-h-48 rounded-lg object-cover"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
            >
              <Download size={16} className="text-gray-700" />
            </button>
            {showRemove && (
              <button
                onClick={() => onRemove(file.id)}
                className="p-2 bg-red-500 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
              >
                <X size={16} className="text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (file.type === 'video') {
    return (
      <div 
        className="relative group max-w-xs cursor-pointer" 
        onClick={() => onClick && onClick()}
      >
        <video
          src={file.url}
          controls
          className="max-h-48 rounded-lg"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
        {showRemove && (
          <button
            onClick={() => onRemove(file.id)}
            className="absolute top-2 right-2 p-1 bg-red-500 bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
          >
            <X size={14} className="text-white" />
          </button>
        )}
      </div>
    );
  }

  if (file.type === 'audio') {
    return (
      <div className="flex items-center space-x-3 p-3 bg-light-surface dark:bg-dark-surface rounded-lg max-w-xs">
        {getFileIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
            {file.name}
          </p>
          <audio controls className="w-full mt-2">
            <source src={file.url} type={file.mimeType} />
            Your browser does not support the audio element.
          </audio>
        </div>
        {showRemove && (
          <button
            onClick={() => onRemove(file.id)}
            className="p-1 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full"
          >
            <X size={16} className="text-light-text-secondary dark:text-dark-text-secondary" />
          </button>
        )}
      </div>
    );
  }

  // Document/other file types
  return (
    <div className="flex items-center space-x-3 p-3 bg-light-surface dark:bg-dark-surface rounded-lg border border-light-border dark:border-dark-border max-w-xs">
      {getFileIcon()}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
          {file.name}
        </p>
        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
          {formatFileSize(file.size)}
        </p>
      </div>
      <div className="flex items-center space-x-1">
        <button
          onClick={handleDownload}
          className="p-1 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full"
        >
          <Download size={16} className="text-light-text-secondary dark:text-dark-text-secondary" />
        </button>
        {showRemove && (
          <button
            onClick={() => onRemove(file.id)}
            className="p-1 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full"
          >
            <X size={16} className="text-light-text-secondary dark:text-dark-text-secondary" />
          </button>
        )}
      </div>
    </div>
  );
};

const FileUploadArea = ({ onFilesSelect, uploadErrors = {}, className = "" }) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    onFilesSelect(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    onFilesSelect(files);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-brand-orange-light dark:border-brand-orange-dark bg-brand-orange-light/5 dark:bg-brand-orange-dark/5'
            : 'border-light-border dark:border-dark-border hover:border-brand-orange-light dark:hover:border-brand-orange-dark'
        }`}
      >
        <Upload size={32} className="mx-auto mb-3 text-light-text-secondary dark:text-dark-text-secondary" />
        <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-1">
          Drop files here or click to browse
        </p>
        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
          Images, videos, audio, and documents up to 50MB
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInput}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
      />

      {/* Upload Errors */}
      {Object.keys(uploadErrors).length > 0 && (
        <div className="mt-3 space-y-2">
          {Object.entries(uploadErrors).map(([fileId, errors]) => (
            <div key={fileId} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start">
                <X size={16} className="text-red-500 mt-0.5 mr-2" />
                <div>
                  {errors.map((error, index) => (
                    <p key={index} className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const UploadProgress = ({ progress, fileName }) => {
  return (
    <div className="p-3 bg-light-surface dark:bg-dark-surface rounded-lg border border-light-border dark:border-dark-border">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
          {fileName}
        </p>
        <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full bg-light-border dark:bg-dark-border rounded-full h-2">
        <div
          className="bg-brand-orange-light dark:bg-brand-orange-dark h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export { FilePreview, FileUploadArea, UploadProgress };
