import React from 'react';
import { Users, Crown, Lock, Globe, Calendar, MessageCircle } from 'lucide-react';

const GroupCard = ({ 
  group, 
  isActive = false, 
  onClick, 
  onMembersClick,
  currentUserId,
  className = '' 
}) => {
  const isAdmin = group.admins?.includes(currentUserId);
  const memberCount = group.members?.length || 0;
  
  const formatLastActivity = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      onClick={onClick}
      className={`
        group-card cursor-pointer transition-all duration-200 
        ${isActive 
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' 
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
        }
        border rounded-lg p-4 ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start space-x-3 mb-3">
        {/* Group Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          {group.avatar ? (
            <img
              src={group.avatar}
              alt={group.name}
              className="w-full h-full rounded-lg object-cover"
            />
          ) : (
            <Users className="w-6 h-6 text-white" />
          )}
        </div>

        {/* Group Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className={`font-semibold truncate ${
              isActive 
                ? 'text-blue-900 dark:text-blue-100' 
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              {group.name}
            </h3>
            
            {/* Group Type Icon */}
            {group.type === 'private' ? (
              <Lock className="w-3 h-3 text-gray-500 dark:text-gray-400" />
            ) : (
              <Globe className="w-3 h-3 text-gray-500 dark:text-gray-400" />
            )}
            
            {/* Admin Badge */}
            {isAdmin && (
              <Crown className="w-3 h-3 text-yellow-500" title="You are an admin" />
            )}
          </div>

          {/* Description */}
          {group.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate mb-2">
              {group.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMembersClick?.(group);
              }}
              className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Users className="w-3 h-3" />
              <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
            </button>
            
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatLastActivity(group.lastActivity)}</span>
            </div>
          </div>
        </div>

        {/* Unread Count */}
        {group.unreadCount > 0 && (
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs font-medium rounded-full">
              {group.unreadCount > 99 ? '99+' : group.unreadCount}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Group Type Label */}
          <span className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${group.type === 'private' 
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' 
              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
            }
          `}>
            {group.type === 'private' ? (
              <>
                <Lock className="w-2 h-2 mr-1" />
                Private
              </>
            ) : (
              <>
                <Globe className="w-2 h-2 mr-1" />
                Public
              </>
            )}
          </span>

          {/* Admin Count */}
          {group.admins?.length > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
              <Crown className="w-2 h-2 mr-1" />
              {group.admins.length} admin{group.admins.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Message Indicator */}
        <div className="flex items-center space-x-1 text-gray-400 dark:text-gray-500">
          <MessageCircle className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
