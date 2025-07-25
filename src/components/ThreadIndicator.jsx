import React from 'react';
import { MessageCircle, ChevronRight } from 'lucide-react';

const ThreadIndicator = ({ 
  threadCount, 
  onOpenThread, 
  className = '',
  compact = false
}) => {
  if (!threadCount || threadCount === 0) return null;

  return (
    <button
      onClick={onOpenThread}
      className={`
        thread-indicator flex items-center space-x-1 mt-1 px-2 py-1 
        bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50
        border border-blue-200 dark:border-blue-700 rounded-full
        text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300
        transition-colors cursor-pointer text-xs
        ${compact ? 'px-1.5 py-0.5' : 'px-2 py-1'}
        ${className}
      `}
      title={`View ${threadCount} ${threadCount === 1 ? 'reply' : 'replies'}`}
    >
      <MessageCircle className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span className="font-medium">
        {threadCount} {threadCount === 1 ? 'reply' : 'replies'}
      </span>
      <ChevronRight className={compact ? 'w-3 h-3' : 'w-3 h-3'} />
    </button>
  );
};

export default ThreadIndicator;
