import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

const MediaViewer = ({ media, isOpen, onClose, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen || !media || media.length === 0) return null;

  const currentMedia = media[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    resetTransforms();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    resetTransforms();
  };

  const resetTransforms = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentMedia.url;
    link.download = currentMedia.name || 'download';
    link.click();
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        goToPrevious();
        break;
      case 'ArrowRight':
        goToNext();
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h3 className="font-medium">{currentMedia.name}</h3>
            <p className="text-sm opacity-75">
              {currentIndex + 1} of {media.length}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentMedia.type === 'image' && (
              <>
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <ZoomOut size={20} className="text-white" />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <ZoomIn size={20} className="text-white" />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <RotateCw size={20} className="text-white" />
                </button>
              </>
            )}
            <button
              onClick={handleDownload}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <Download size={20} className="text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {media.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-10"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-10"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </>
      )}

      {/* Media Content */}
      <div className="flex items-center justify-center w-full h-full p-16">
        {currentMedia.type === 'image' && (
          <img
            src={currentMedia.url}
            alt={currentMedia.name}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
          />
        )}

        {currentMedia.type === 'video' && (
          <video
            key={currentMedia.id}
            controls
            autoPlay
            className="max-w-full max-h-full"
            style={{ transform: `scale(${zoom})` }}
          >
            <source src={currentMedia.url} type={currentMedia.mimeType} />
            Your browser does not support the video tag.
          </video>
        )}

        {currentMedia.type === 'audio' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="text-white font-medium">{currentMedia.name}</h3>
            </div>
            <audio
              key={currentMedia.id}
              controls
              autoPlay
              className="w-full"
            >
              <source src={currentMedia.url} type={currentMedia.mimeType} />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {media.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <div className="flex items-center justify-center space-x-2 overflow-x-auto">
            {media.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentIndex(index);
                  resetTransforms();
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-white'
                    : 'border-transparent opacity-60 hover:opacity-80'
                }`}
              >
                {item.type === 'image' && (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {item.type === 'video' && (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-white text-xs">🎥</span>
                  </div>
                )}
                {item.type === 'audio' && (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-white text-xs">🎵</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaViewer;
