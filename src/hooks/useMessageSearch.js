import { useState, useEffect, useMemo } from 'react';

export const useMessageSearch = (conversations, messages) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    dateRange: 'all', // 'today', 'week', 'month', 'all'
    messageType: 'all', // 'text', 'image', 'all'
    sender: 'all', // 'me', 'others', 'all'
    conversationId: 'all' // specific conversation or 'all'
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchFilters, conversations, messages]);

  const performSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = [];

    // Search through all conversations and their messages
    conversations.forEach(conversation => {
      const conversationMessages = messages[conversation.id] || [];
      
      conversationMessages.forEach(message => {
        // Apply filters
        if (!matchesFilters(message, conversation)) return;
        
        // Search in message content
        if (message.content && message.content.toLowerCase().includes(query)) {
          results.push({
            ...message,
            conversationId: conversation.id,
            conversationName: conversation.user.name,
            conversationAvatar: conversation.user.avatar,
            matchType: 'content',
            highlightedContent: highlightText(message.content, query)
          });
        }
        
        // Search in image alt text or captions if available
        if (message.type === 'image' && message.images) {
          message.images.forEach((image, index) => {
            if (image.caption && image.caption.toLowerCase().includes(query)) {
              results.push({
                ...message,
                conversationId: conversation.id,
                conversationName: conversation.user.name,
                conversationAvatar: conversation.user.avatar,
                matchType: 'image_caption',
                highlightedContent: highlightText(image.caption, query),
                matchedImageIndex: index
              });
            }
          });
        }
      });
    });

    // Sort results by relevance and date
    results.sort((a, b) => {
      // First by relevance (exact matches first)
      const aExact = a.content.toLowerCase().indexOf(query) === 0;
      const bExact = b.content.toLowerCase().indexOf(query) === 0;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Then by date (newest first)
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    setSearchResults(results);
    setIsSearching(false);
  };

  const matchesFilters = (message, conversation) => {
    // Date filter
    if (searchFilters.dateRange !== 'all') {
      const messageDate = new Date(message.timestamp);
      const now = new Date();
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (searchFilters.dateRange) {
        case 'today':
          if (messageDate < dayStart) return false;
          break;
        case 'week':
          const weekStart = new Date(dayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (messageDate < weekStart) return false;
          break;
        case 'month':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          if (messageDate < monthStart) return false;
          break;
      }
    }

    // Message type filter
    if (searchFilters.messageType !== 'all' && message.type !== searchFilters.messageType) {
      return false;
    }

    // Sender filter
    if (searchFilters.sender !== 'all') {
      const isFromMe = message.senderId === 'me';
      if (searchFilters.sender === 'me' && !isFromMe) return false;
      if (searchFilters.sender === 'others' && isFromMe) return false;
    }

    // Conversation filter
    if (searchFilters.conversationId !== 'all' && conversation.id !== searchFilters.conversationId) {
      return false;
    }

    return true;
  };

  const highlightText = (text, query) => {
    if (!text || !query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600 px-1 rounded">$1</mark>');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const updateFilter = (filterName, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const getSearchStats = () => {
    const totalMessages = Object.values(messages).flat().length;
    const resultsCount = searchResults.length;
    const conversationsWithResults = new Set(searchResults.map(r => r.conversationId)).size;
    
    return {
      totalMessages,
      resultsCount,
      conversationsWithResults,
      hasResults: resultsCount > 0
    };
  };

  return {
    searchQuery,
    setSearchQuery,
    searchFilters,
    updateFilter,
    searchResults,
    isSearching,
    clearSearch,
    getSearchStats
  };
};
