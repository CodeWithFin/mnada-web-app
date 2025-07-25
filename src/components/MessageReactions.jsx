import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import EmojiPicker from './EmojiPicker';

const MessageReactions = ({ 
  reactions = {}, 
  onAddReaction, 
  onRemoveReaction, 
  currentUserId,
  messageId 
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleReactionClick = (emoji) => {
    const userReactions = reactions[emoji] || [];
    const hasReacted = userReactions.includes(currentUserId);
    
    if (hasReacted) {
      onRemoveReaction(messageId, emoji, currentUserId);
    } else {
      onAddReaction(messageId, emoji, currentUserId);
    }
  };

  const handleEmojiSelect = (emoji) => {
    onAddReaction(messageId, emoji, currentUserId);
    setShowEmojiPicker(false);
  };

  const getReactionCount = (emoji) => {
    return reactions[emoji]?.length || 0;
  };

  const hasUserReacted = (emoji) => {
    return reactions[emoji]?.includes(currentUserId) || false;
  };

  const reactionEntries = Object.entries(reactions).filter(([_, users]) => users.length > 0);

  if (reactionEntries.length === 0 && !showEmojiPicker) {
    return null;
  }

  return (
    <div className="flex items-center space-x-1 mt-1 flex-wrap gap-1">
      {reactionEntries.map(([emoji, users]) => (
        <button
          key={emoji}
          onClick={() => handleReactionClick(emoji)}
          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-colors ${
            hasUserReacted(emoji)
              ? 'bg-brand-orange-light/20 dark:bg-brand-orange-dark/20 border border-brand-orange-light dark:border-brand-orange-dark'
              : 'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover'
          }`}
        >
          <span>{emoji}</span>
          <span className={`text-xs ${
            hasUserReacted(emoji)
              ? 'text-brand-orange-light dark:text-brand-orange-dark font-medium'
              : 'text-light-text-secondary dark:text-dark-text-secondary'
          }`}>
            {users.length}
          </span>
        </button>
      ))}
      
      <div className="relative">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
        >
          <Plus size={12} className="text-light-text-secondary dark:text-dark-text-secondary" />
        </button>
        
        <EmojiPicker
          isOpen={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onEmojiSelect={handleEmojiSelect}
          position="top-left"
        />
      </div>
    </div>
  );
};

export default MessageReactions;
