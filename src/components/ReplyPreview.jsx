import React from 'react';
import { X, User } from 'lucide-react';

const ReplyPreview = ({ 
  replyingTo, 
  onCancel, 
  className = '' 
}) => {
  if (!replyingTo) return null;

  const formatPreviewText = (message) => {
    switch (message.type) {
      case 'text':
        return message.content;
      case 'voice':
        return '🎵 Voice message';
      case 'image':
        return '📷 Image';
      case 'file':
        return '📎 File attachment';
      default:
        return message.content || 'Message';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSenderName = (message) => {
    return message.senderName || `User ${message.senderId}`;
  };

  const previewText = formatPreviewText(replyingTo);
  const truncatedText = previewText.length > 80 
    ? previewText.substring(0, 80) + '...' 
    : previewText;

  return (
    <div className={`reply-preview ${className}`}>
      <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
        {/* Reply indicator line */}
        <div className="flex-shrink-0 w-1 bg-blue-500 rounded-full self-stretch"></div>
        
        {/* Reply content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <User className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
              Replying to {getSenderName(replyingTo)}
            </span>
            <span className="text-xs text-blue-500 dark:text-blue-400">
              {formatTime(replyingTo.timestamp)}
            </span>
          </div>
          
          <div className="text-sm text-blue-800 dark:text-blue-200 break-words">
            {truncatedText}
          </div>
        </div>
        
        {/* Cancel button */}
        <button
          onClick={onCancel}
          className="flex-shrink-0 p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors"
          title="Cancel reply"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ReplyPreview;
