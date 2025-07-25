import React, { useRef, useEffect } from 'react';
import { X, ArrowLeft, Reply, Send } from 'lucide-react';
import MessageReply from './MessageReply';
import ThreadIndicator from './ThreadIndicator';
import EmojiText from './EmojiText';
import VoiceMessage from './VoiceMessage';
import MessageReactions from './MessageReactions';

const ThreadView = ({ 
  isOpen,
  onClose,
  rootMessage,
  threadMessages,
  currentUserId,
  onSendReply,
  onAddReaction,
  onRemoveReaction,
  className = ''
}) => {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [replyText, setReplyText] = React.useState('');

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, threadMessages]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendReply = () => {
    if (replyText.trim() && onSendReply) {
      onSendReply(replyText.trim(), rootMessage);
      setReplyText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  if (!isOpen || !rootMessage) return null;

  const allMessages = [rootMessage, ...threadMessages].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  return (
    <div className={`thread-view-overlay fixed inset-0 z-50 ${className}`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Thread
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {threadMessages.length + 1} messages
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {allMessages.map((message, index) => (
            <div key={message.id} className="space-y-2">
              {/* Original message indicator */}
              {index === 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Original message
                </div>
              )}
              
              {/* Message */}
              <div className={`flex ${
                message.senderId === currentUserId ? 'justify-end' : 'justify-start'
              }`}>
                <div className={`
                  max-w-xs px-3 py-2 rounded-lg
                  ${message.senderId === currentUserId
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }
                  ${index === 0 ? 'border-2 border-blue-200 dark:border-blue-700' : ''}
                `}>
                  {/* Reply context for non-root messages */}
                  {message.parentMessageId && message.replyTo && (
                    <MessageReply
                      replyTo={message.replyTo}
                      compact={true}
                      showSender={false}
                      className="mb-2"
                    />
                  )}
                  
                  {/* Message content */}
                  {message.type === 'text' && (
                    <div className="text-sm">
                      <EmojiText text={message.content} />
                    </div>
                  )}
                  
                  {message.type === 'voice' && (
                    <VoiceMessage
                      message={message}
                      isOwn={message.senderId === currentUserId}
                    />
                  )}
                  
                  {/* Timestamp */}
                  <div className="text-xs opacity-70 mt-1">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
              
              {/* Message reactions */}
              <MessageReactions
                reactions={message.reactions || {}}
                onAddReaction={onAddReaction}
                onRemoveReaction={onRemoveReaction}
                currentUserId={currentUserId}
                messageId={message.id}
              />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <div className="flex items-center space-x-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
                <Reply className="w-4 h-4" />
                <span>Reply in thread</span>
              </div>
              
              <textarea
                ref={inputRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Reply to thread..."
                rows={2}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            
            <button
              onClick={handleSendReply}
              disabled={!replyText.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadView;
