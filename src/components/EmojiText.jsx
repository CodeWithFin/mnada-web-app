import React from 'react';
import { useEmoji } from '../hooks/useEmoji';

const EmojiText = ({ text, className = "" }) => {
  const { parseEmojis, isEmojiOnly, countEmojis } = useEmoji();
  
  const segments = parseEmojis(text);
  const emojiOnly = isEmojiOnly(text);
  const emojiCount = countEmojis(text);
  
  // Large emojis for emoji-only messages (max 3 emojis)
  const shouldShowLargeEmojis = emojiOnly && emojiCount <= 3;
  
  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.type === 'emoji') {
          return (
            <span
              key={index}
              className={shouldShowLargeEmojis ? 'text-4xl' : 'text-base'}
              style={{ 
                display: 'inline-block',
                margin: shouldShowLargeEmojis ? '0 2px' : '0'
              }}
            >
              {segment.content}
            </span>
          );
        } else {
          return <span key={index}>{segment.content}</span>;
        }
      })}
    </span>
  );
};

export default EmojiText;
