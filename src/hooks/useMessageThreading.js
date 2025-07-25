import { useState, useCallback } from 'react';

export const useMessageThreading = () => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [showThreadView, setShowThreadView] = useState(false);
  const [activeThread, setActiveThread] = useState(null);

  // Start replying to a message
  const startReply = useCallback((message) => {
    setReplyingTo(message);
  }, []);

  // Cancel reply
  const cancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  // Open thread view for a message
  const openThread = useCallback((message) => {
    setActiveThread(message);
    setShowThreadView(true);
  }, []);

  // Close thread view
  const closeThread = useCallback(() => {
    setActiveThread(null);
    setShowThreadView(false);
  }, []);

  // Get thread messages for a parent message
  const getThreadMessages = useCallback((parentMessageId, allMessages) => {
    return allMessages.filter(msg => msg.parentMessageId === parentMessageId);
  }, []);

  // Get thread count for a message
  const getThreadCount = useCallback((messageId, allMessages) => {
    return allMessages.filter(msg => msg.parentMessageId === messageId).length;
  }, []);

  // Check if a message has replies
  const hasReplies = useCallback((messageId, allMessages) => {
    return allMessages.some(msg => msg.parentMessageId === messageId);
  }, []);

  // Get the root message of a thread
  const getRootMessage = useCallback((message, allMessages) => {
    if (!message.parentMessageId) {
      return message;
    }
    
    const parentMessage = allMessages.find(msg => msg.id === message.parentMessageId);
    if (parentMessage) {
      return getRootMessage(parentMessage, allMessages);
    }
    
    return message;
  }, []);

  // Create a reply message structure
  const createReplyMessage = useCallback((content, parentMessage, type = 'text', additionalData = {}) => {
    return {
      content,
      type,
      parentMessageId: parentMessage.id,
      replyTo: {
        id: parentMessage.id,
        content: parentMessage.content,
        senderId: parentMessage.senderId,
        senderName: parentMessage.senderName || 'User',
        type: parentMessage.type,
        timestamp: parentMessage.timestamp
      },
      timestamp: new Date(),
      ...additionalData
    };
  }, []);

  // Format reply preview text
  const formatReplyPreview = useCallback((message, maxLength = 100) => {
    if (!message) return '';
    
    let preview = '';
    
    switch (message.type) {
      case 'text':
        preview = message.content;
        break;
      case 'voice':
        preview = '🎵 Voice message';
        break;
      case 'image':
        preview = '📷 Image';
        break;
      case 'file':
        preview = '📎 File';
        break;
      default:
        preview = message.content || 'Message';
    }
    
    if (preview.length > maxLength) {
      preview = preview.substring(0, maxLength) + '...';
    }
    
    return preview;
  }, []);

  // Group messages into threads
  const groupMessagesIntoThreads = useCallback((messages) => {
    const messageMap = new Map();
    const threads = [];
    
    // First pass: create map of all messages
    messages.forEach(msg => {
      messageMap.set(msg.id, { ...msg, replies: [] });
    });
    
    // Second pass: organize into threads
    messages.forEach(msg => {
      if (msg.parentMessageId) {
        const parent = messageMap.get(msg.parentMessageId);
        if (parent) {
          parent.replies.push(messageMap.get(msg.id));
        }
      } else {
        threads.push(messageMap.get(msg.id));
      }
    });
    
    return threads;
  }, []);

  return {
    // State
    replyingTo,
    showThreadView,
    activeThread,
    
    // Actions
    startReply,
    cancelReply,
    openThread,
    closeThread,
    
    // Utilities
    getThreadMessages,
    getThreadCount,
    hasReplies,
    getRootMessage,
    createReplyMessage,
    formatReplyPreview,
    groupMessagesIntoThreads
  };
};
