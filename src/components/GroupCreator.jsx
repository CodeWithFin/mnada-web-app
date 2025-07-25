import React, { useState } from 'react';
import { X, Users, Lock, Globe, Upload, Camera } from 'lucide-react';

const GroupCreator = ({ 
  isOpen, 
  onClose, 
  onCreateGroup, 
  availableUsers = [],
  currentUserId,
  className = '' 
}) => {
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    type: 'private',
    avatar: null,
    allowMemberInvites: false,
    requireAdminApproval: true,
    messagingPermissions: 'all',
    mediaPermissions: 'all'
  });
  
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Basic Info, 2: Members, 3: Settings

  const filteredUsers = availableUsers.filter(user => 
    user.id !== currentUserId &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.username.toLowerCase().includes(searchTerm.toLowerCase())) &&
    !selectedMembers.find(member => member.id === user.id)
  );

  const handleInputChange = (field, value) => {
    setGroupData(prev => ({ ...prev, [field]: value }));
  };

  const handleMemberToggle = (user) => {
    setSelectedMembers(prev => {
      const exists = prev.find(member => member.id === user.id);
      if (exists) {
        return prev.filter(member => member.id !== user.id);
      } else {
        return [...prev, { ...user, role: 'member' }];
      }
    });
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGroupData(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupData.name.trim()) return;

    setIsCreating(true);
    try {
      const newGroupData = {
        ...groupData,
        createdBy: currentUserId,
        members: selectedMembers.map(member => ({
          id: member.id,
          role: member.role,
          joinedAt: new Date(),
          addedBy: currentUserId
        }))
      };

      await onCreateGroup(newGroupData);
      
      // Reset form
      setGroupData({
        name: '',
        description: '',
        type: 'private',
        avatar: null,
        allowMemberInvites: false,
        requireAdminApproval: true,
        messagingPermissions: 'all',
        mediaPermissions: 'all'
      });
      setSelectedMembers([]);
      setCurrentStep(1);
      onClose();
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return groupData.name.trim().length > 0;
      case 2:
        return true; // Can proceed without members
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`group-creator-overlay fixed inset-0 z-50 ${className}`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      
      <div className="absolute inset-x-4 top-8 bottom-8 md:inset-x-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:h-auto max-h-[90vh] bg-white dark:bg-gray-900 rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Create Group
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Step {currentStep} of 3
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full ${
                  step <= currentStep 
                    ? 'bg-blue-600' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Group Avatar */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                    {groupData.avatar ? (
                      <img 
                        src={groupData.avatar} 
                        alt="Group avatar" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="w-3 h-3" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    Group Photo
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add a photo to help members identify your group
                  </p>
                </div>
              </div>

              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={groupData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter group name"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={50}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {groupData.name.length}/50 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={groupData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="What's this group about?"
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {groupData.description.length}/200 characters
                </p>
              </div>

              {/* Group Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Group Type
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="groupType"
                      value="private"
                      checked={groupData.type === 'private'}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Private</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Only members can see and join</p>
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="groupType"
                      value="public"
                      checked={groupData.type === 'public'}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Public</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Anyone can find and join</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Add Members */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Add Members
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  You can add members now or skip and add them later
                </p>
              </div>

              {/* Search */}
              <div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Selected Members */}
              {selectedMembers.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selected ({selectedMembers.length})
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedMembers.map(member => (
                      <div key={member.id} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {member.name}
                          </span>
                        </div>
                        <button
                          onClick={() => handleMemberToggle(member)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Users */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Available Users
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => handleMemberToggle(user)}
                      className="w-full flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                      </div>
                    </button>
                  ))}
                  
                  {filteredUsers.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                      {searchTerm ? 'No users found' : 'No available users'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Group Settings
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Configure how your group operates
                </p>
              </div>

              {/* Member Invites */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Member Invites</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Allow members to invite others</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={groupData.allowMemberInvites}
                    onChange={(e) => handleInputChange('allowMemberInvites', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Admin Approval */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Admin Approval</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Require admin approval for new members</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={groupData.requireAdminApproval}
                    onChange={(e) => handleInputChange('requireAdminApproval', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Messaging Permissions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Who can send messages?
                </label>
                <select
                  value={groupData.messagingPermissions}
                  onChange={(e) => handleInputChange('messagingPermissions', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All members</option>
                  <option value="admins">Only admins</option>
                </select>
              </div>

              {/* Media Permissions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Who can send media?
                </label>
                <select
                  value={groupData.mediaPermissions}
                  onChange={(e) => handleInputChange('mediaPermissions', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All members</option>
                  <option value="admins">Only admins</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                onClose();
              }
            }}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            {currentStep > 1 ? 'Back' : 'Cancel'}
          </button>

          <div className="flex space-x-2">
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceedToNext()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleCreateGroup}
                disabled={!canProceedToNext() || isCreating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCreating ? 'Creating...' : 'Create Group'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCreator;
