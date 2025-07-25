import React, { useState } from 'react';
import { X, Users, Shield, Crown, MoreVertical, UserPlus, UserMinus, Settings } from 'lucide-react';

const GroupMembersPanel = ({ 
  isOpen, 
  onClose, 
  group, 
  members = [], 
  currentUserId,
  onAddMember,
  onRemoveMember,
  onUpdateRole,
  onShowSettings,
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberActions, setShowMemberActions] = useState(null);

  const isCurrentUserAdmin = group?.admins.includes(currentUserId);
  
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMemberAction = async (action, memberId) => {
    try {
      switch (action) {
        case 'remove':
          await onRemoveMember(group.id, memberId);
          break;
        case 'makeAdmin':
          await onUpdateRole(group.id, memberId, 'admin');
          break;
        case 'removeAdmin':
          await onUpdateRole(group.id, memberId, 'member');
          break;
        default:
          break;
      }
      setShowMemberActions(null);
    } catch (error) {
      console.error('Error performing member action:', error);
    }
  };

  const getRoleDisplay = (member) => {
    if (member.isAdmin) {
      return (
        <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
          <Crown className="w-3 h-3" />
          <span className="text-xs font-medium">Admin</span>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
        <Users className="w-3 h-3" />
        <span className="text-xs">Member</span>
      </div>
    );
  };

  const formatJoinDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!isOpen || !group) return null;

  return (
    <div className={`group-members-overlay fixed inset-0 z-50 ${className}`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              {group.avatar ? (
                <img src={group.avatar} alt={group.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {group.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {members.length} members
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isCurrentUserAdmin && (
              <>
                <button
                  onClick={() => setShowAddMember(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  title="Add member"
                >
                  <UserPlus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => onShowSettings(group)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  title="Group settings"
                >
                  <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search members..."
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {filteredMembers.map((member) => (
              <div key={member.id} className="relative">
                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    {member.avatar ? (
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-full h-full rounded-full object-cover" 
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {member.name}
                        {member.id === currentUserId && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">(You)</span>
                        )}
                      </p>
                      {getRoleDisplay(member)}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      @{member.username}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Joined {formatJoinDate(member.joinedAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  {isCurrentUserAdmin && member.id !== currentUserId && (
                    <div className="relative">
                      <button
                        onClick={() => setShowMemberActions(showMemberActions === member.id ? null : member.id)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>

                      {showMemberActions === member.id && (
                        <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-[150px]">
                          {!member.isAdmin ? (
                            <button
                              onClick={() => handleMemberAction('makeAdmin', member.id)}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
                            >
                              <div className="flex items-center space-x-2">
                                <Crown className="w-3 h-3" />
                                <span>Make Admin</span>
                              </div>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMemberAction('removeAdmin', member.id)}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
                            >
                              <div className="flex items-center space-x-2">
                                <Shield className="w-3 h-3" />
                                <span>Remove Admin</span>
                              </div>
                            </button>
                          )}
                          <button
                            onClick={() => handleMemberAction('remove', member.id)}
                            className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg"
                          >
                            <div className="flex items-center space-x-2">
                              <UserMinus className="w-3 h-3" />
                              <span>Remove Member</span>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredMembers.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'No members found' : 'No members yet'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Group Stats */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {members.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Members</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {members.filter(m => m.isAdmin).length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close actions menu */}
      {showMemberActions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMemberActions(null)}
        />
      )}
    </div>
  );
};

export default GroupMembersPanel;
