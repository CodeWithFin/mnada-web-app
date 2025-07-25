import React, { useState } from 'react';
import { Search, Filter, X, Calendar, MessageSquare, User, Hash } from 'lucide-react';
import { useMessageSearch } from '../hooks/useMessageSearch';

const SearchFilters = ({ filters, onFilterChange, conversations, onClose }) => {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-lg z-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-light-text-primary dark:text-dark-text-primary">
          Search Filters
        </h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full"
        >
          <X size={16} className="text-light-text-secondary dark:text-dark-text-secondary" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Range Filter */}
        <div>
          <label className="flex items-center text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
            <Calendar size={16} className="mr-2" />
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange('dateRange', e.target.value)}
            className="w-full p-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* Message Type Filter */}
        <div>
          <label className="flex items-center text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
            <MessageSquare size={16} className="mr-2" />
            Message Type
          </label>
          <select
            value={filters.messageType}
            onChange={(e) => onFilterChange('messageType', e.target.value)}
            className="w-full p-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
          >
            <option value="all">All Types</option>
            <option value="text">Text Messages</option>
            <option value="image">Images</option>
          </select>
        </div>

        {/* Sender Filter */}
        <div>
          <label className="flex items-center text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
            <User size={16} className="mr-2" />
            Sender
          </label>
          <select
            value={filters.sender}
            onChange={(e) => onFilterChange('sender', e.target.value)}
            className="w-full p-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
          >
            <option value="all">Everyone</option>
            <option value="me">Me</option>
            <option value="others">Others</option>
          </select>
        </div>

        {/* Conversation Filter */}
        <div>
          <label className="flex items-center text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
            <Hash size={16} className="mr-2" />
            Conversation
          </label>
          <select
            value={filters.conversationId}
            onChange={(e) => onFilterChange('conversationId', e.target.value)}
            className="w-full p-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
          >
            <option value="all">All Conversations</option>
            {conversations.map(conv => (
              <option key={conv.id} value={conv.id}>
                {conv.user.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

const SearchResults = ({ results, isSearching, onResultClick, stats }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (isSearching) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-brand-orange-light dark:border-brand-orange-dark border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Searching...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-4 text-center">
        <Search size={32} className="text-light-text-secondary dark:text-dark-text-secondary mx-auto mb-2" />
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">No messages found</p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {/* Search Stats */}
      <div className="p-3 bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border">
        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
          Found {stats.resultsCount} messages in {stats.conversationsWithResults} conversations
        </p>
      </div>

      {/* Results */}
      <div className="divide-y divide-light-border dark:divide-dark-border">
        {results.map((result, index) => (
          <div
            key={`${result.id}-${index}`}
            onClick={() => onResultClick(result)}
            className="p-3 hover:bg-light-hover dark:hover:bg-dark-hover cursor-pointer"
          >
            <div className="flex items-start space-x-3">
              <img
                src={result.conversationAvatar}
                alt={result.conversationName}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    {result.conversationName}
                  </span>
                  <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    {formatTime(result.timestamp)}
                  </span>
                </div>
                
                <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {result.matchType === 'content' && (
                    <p 
                      dangerouslySetInnerHTML={{ __html: result.highlightedContent }}
                      className="line-clamp-2"
                    />
                  )}
                  
                  {result.matchType === 'image_caption' && (
                    <div className="flex items-center space-x-2">
                      <MessageSquare size={14} />
                      <p 
                        dangerouslySetInnerHTML={{ __html: result.highlightedContent }}
                        className="line-clamp-1"
                      />
                    </div>
                  )}
                </div>
                
                {result.senderId === 'me' && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-brand-orange-light/10 dark:bg-brand-orange-dark/10 text-brand-orange-light dark:text-brand-orange-dark text-xs rounded-full">
                    You
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MessageSearch = ({ 
  conversations, 
  messages, 
  onMessageClick, 
  isOpen, 
  onClose 
}) => {
  const {
    searchQuery,
    setSearchQuery,
    searchFilters,
    updateFilter,
    searchResults,
    isSearching,
    clearSearch,
    getSearchStats
  } = useMessageSearch(conversations, messages);

  const [showFilters, setShowFilters] = useState(false);
  const stats = getSearchStats();

  const handleResultClick = (result) => {
    onMessageClick(result);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50">
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Search Header */}
        <div className="p-4 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-10 pr-10 py-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full"
                >
                  <X size={16} className="text-light-text-secondary dark:text-dark-text-secondary" />
                </button>
              )}
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-lg border transition-colors ${
                  showFilters || Object.values(searchFilters).some(v => v !== 'all')
                    ? 'bg-brand-orange-light dark:bg-brand-orange-dark text-white border-brand-orange-light dark:border-brand-orange-dark'
                    : 'bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover'
                }`}
              >
                <Filter size={20} />
              </button>
              
              {showFilters && (
                <SearchFilters
                  filters={searchFilters}
                  onFilterChange={updateFilter}
                  conversations={conversations}
                  onClose={() => setShowFilters(false)}
                />
              )}
            </div>
            
            <button
              onClick={onClose}
              className="p-3 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg"
            >
              <X size={20} className="text-light-text-secondary dark:text-dark-text-secondary" />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <SearchResults
          results={searchResults}
          isSearching={isSearching}
          onResultClick={handleResultClick}
          stats={stats}
        />
      </div>
    </div>
  );
};

export default MessageSearch;
