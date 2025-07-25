import React from 'react';
import { Reply, User, Clock } from 'lucide-react';

const MessageReply = ({ 
  replyTo, 
  className = '',
  onClick = null,
  showSender = true,
  compact = false
}) => {
  if (!replyTo) return null;

  const formatReplyText = (message) => {
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

  const replyText = formatReplyText(replyTo);
  const truncatedText = compact && replyText.length > 60 
    ? replyText.substring(0, 60) + '...' 
    : replyText.length > 120 
    ? replyText.substring(0, 120) + '...'
    : replyText;

  return (
    <div 
      className={`message-reply ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className={`
        flex items-start space-x-2 p-2 rounded-lg border-l-2 border-gray-300 dark:border-gray-600
        bg-gray-50 dark:bg-gray-800/50 mb-2
        ${onClick ? 'hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors' : ''}
        ${compact ? 'p-1.5' : 'p-2'}
      `}>
        {/* Reply icon */}
        <Reply className={`text-gray-500 dark:text-gray-400 flex-shrink-0 ${
          compact ? 'w-3 h-3 mt-0.5' : 'w-4 h-4 mt-0.5'
        }`} />
        
        {/* Reply content */}
        <div className="flex-1 min-w-0">
          {showSender && (
            <div className="flex items-center space-x-1 mb-1">
              <User className={`text-gray-500 dark:text-gray-400 ${
                compact ? 'w-2.5 h-2.5' : 'w-3 h-3'
              }`} />
              <span className={`font-medium text-gray-700 dark:text-gray-300 ${
                compact ? 'text-xs' : 'text-sm'
              }`}>
                {getSenderName(replyTo)}
              </span>
              <Clock className={`text-gray-400 dark:text-gray-500 ${
                compact ? 'w-2.5 h-2.5' : 'w-3 h-3'
              }`} />
              <span className={`text-gray-500 dark:text-gray-400 ${
                compact ? 'text-xs' : 'text-xs'
              }`}>
                {formatTime(replyTo.timestamp)}
              </span>
            </div>
          )}
          
          <div className={`text-gray-600 dark:text-gray-300 break-words ${
            compact ? 'text-xs' : 'text-sm'
          }`}>
            {truncatedText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageReply;
