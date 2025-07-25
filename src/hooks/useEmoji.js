import { useState, useCallback } from 'react';

export const useEmoji = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const insertEmoji = useCallback((emoji, text, cursorPosition) => {
    const beforeText = text.slice(0, cursorPosition);
    const afterText = text.slice(cursorPosition);
    const newText = beforeText + emoji + afterText;
    const newCursorPosition = cursorPosition + emoji.length;
    
    return {
      newText,
      newCursorPosition
    };
  }, []);

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker(prev => !prev);
  }, []);

  const closeEmojiPicker = useCallback(() => {
    setShowEmojiPicker(false);
  }, []);

  const openEmojiPicker = useCallback(() => {
    setShowEmojiPicker(true);
  }, []);

  // Parse text to detect emojis and return segments
  const parseEmojis = useCallback((text) => {
    // Simple emoji regex - in a real app, you'd use a more comprehensive one
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
    const segments = [];
    let lastIndex = 0;
    let match;

    while ((match = emojiRegex.exec(text)) !== null) {
      // Add text before emoji
      if (match.index > lastIndex) {
        segments.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }
      
      // Add emoji
      segments.push({
        type: 'emoji',
        content: match[0]
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }
    
    return segments.length > 0 ? segments : [{ type: 'text', content: text }];
  }, []);

  // Check if text contains only emojis
  const isEmojiOnly = useCallback((text) => {
    const trimmedText = text.trim();
    if (!trimmedText) return false;
    
    // Remove all emojis and check if anything remains
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
    const textWithoutEmojis = trimmedText.replace(emojiRegex, '').trim();
    return textWithoutEmojis.length === 0;
  }, []);

  // Count emojis in text
  const countEmojis = useCallback((text) => {
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
    const matches = text.match(emojiRegex);
    return matches ? matches.length : 0;
  }, []);

  return {
    showEmojiPicker,
    insertEmoji,
    toggleEmojiPicker,
    closeEmojiPicker,
    openEmojiPicker,
    parseEmojis,
    isEmojiOnly,
    countEmojis
  };
};
