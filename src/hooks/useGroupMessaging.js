import { useState, useCallback } from 'react';

export const useGroupMessaging = () => {
  const [activeGroup, setActiveGroup] = useState(null);
  const [showGroupCreator, setShowGroupCreator] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [showMembersList, setShowMembersList] = useState(false);
  const [groups, setGroups] = useState([]);

  // Create a new group
  const createGroup = useCallback(async (groupData) => {
    try {
      const newGroup = {
        id: Date.now(),
        name: groupData.name,
        description: groupData.description || '',
        avatar: groupData.avatar || null,
        type: groupData.type || 'private', // private, public
        createdBy: groupData.createdBy,
        createdAt: new Date(),
        members: groupData.members || [],
        admins: [groupData.createdBy],
        settings: {
          allowMemberInvites: groupData.allowMemberInvites || false,
          requireAdminApproval: groupData.requireAdminApproval || true,
          messagingPermissions: groupData.messagingPermissions || 'all', // all, admins, restricted
          mediaPermissions: groupData.mediaPermissions || 'all'
        },
        lastActivity: new Date(),
        unreadCount: 0
      };

      setGroups(prev => [...prev, newGroup]);
      return newGroup;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  }, []);

  // Add member to group
  const addMember = useCallback(async (groupId, userId, role = 'member') => {
    try {
      setGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          const newMember = {
            id: userId,
            role,
            joinedAt: new Date(),
            addedBy: 'current-user-id' // In real app, get from auth context
          };
          
          return {
            ...group,
            members: [...group.members, newMember],
            lastActivity: new Date()
          };
        }
        return group;
      }));

      return true;
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  }, []);

  // Remove member from group
  const removeMember = useCallback(async (groupId, userId) => {
    try {
      setGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            members: group.members.filter(member => member.id !== userId),
            admins: group.admins.filter(adminId => adminId !== userId),
            lastActivity: new Date()
          };
        }
        return group;
      }));

      return true;
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  }, []);

  // Update member role
  const updateMemberRole = useCallback(async (groupId, userId, newRole) => {
    try {
      setGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          const updatedMembers = group.members.map(member => 
            member.id === userId ? { ...member, role: newRole } : member
          );
          
          let updatedAdmins = [...group.admins];
          if (newRole === 'admin' && !updatedAdmins.includes(userId)) {
            updatedAdmins.push(userId);
          } else if (newRole !== 'admin') {
            updatedAdmins = updatedAdmins.filter(adminId => adminId !== userId);
          }
          
          return {
            ...group,
            members: updatedMembers,
            admins: updatedAdmins,
            lastActivity: new Date()
          };
        }
        return group;
      }));

      return true;
    } catch (error) {
      console.error('Error updating member role:', error);
      throw error;
    }
  }, []);

  // Leave group
  const leaveGroup = useCallback(async (groupId, userId) => {
    try {
      await removeMember(groupId, userId);
      
      // If this was the active group, clear it
      if (activeGroup?.id === groupId) {
        setActiveGroup(null);
      }
      
      return true;
    } catch (error) {
      console.error('Error leaving group:', error);
      throw error;
    }
  }, [removeMember, activeGroup]);

  // Update group settings
  const updateGroupSettings = useCallback(async (groupId, newSettings) => {
    try {
      setGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            ...newSettings,
            lastActivity: new Date()
          };
        }
        return group;
      }));

      return true;
    } catch (error) {
      console.error('Error updating group settings:', error);
      throw error;
    }
  }, []);

  // Get group members with user details
  const getGroupMembers = useCallback((groupId, allUsers = []) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return [];

    return group.members.map(member => {
      const userDetails = allUsers.find(user => user.id === member.id) || {
        id: member.id,
        name: `User ${member.id}`,
        username: `user${member.id}`,
        avatar: null
      };
      
      return {
        ...userDetails,
        role: member.role,
        joinedAt: member.joinedAt,
        addedBy: member.addedBy,
        isAdmin: group.admins.includes(member.id)
      };
    });
  }, [groups]);

  // Check if user is admin
  const isUserAdmin = useCallback((groupId, userId) => {
    const group = groups.find(g => g.id === groupId);
    return group?.admins.includes(userId) || false;
  }, [groups]);

  // Check if user can perform action
  const canUserPerformAction = useCallback((groupId, userId, action) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return false;

    const isAdmin = group.admins.includes(userId);
    const isMember = group.members.some(member => member.id === userId);

    switch (action) {
      case 'send_message':
        if (group.settings.messagingPermissions === 'admins') return isAdmin;
        return isMember;
      
      case 'send_media':
        if (group.settings.mediaPermissions === 'admins') return isAdmin;
        return isMember;
      
      case 'add_member':
        if (!group.settings.allowMemberInvites) return isAdmin;
        return isMember;
      
      case 'remove_member':
      case 'change_settings':
      case 'delete_group':
        return isAdmin;
      
      default:
        return isMember;
    }
  }, [groups]);

  // Get group statistics
  const getGroupStats = useCallback((groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return null;

    return {
      memberCount: group.members.length,
      adminCount: group.admins.length,
      createdDaysAgo: Math.floor((new Date() - group.createdAt) / (1000 * 60 * 60 * 24)),
      lastActivity: group.lastActivity
    };
  }, [groups]);

  // Filter groups
  const filterGroups = useCallback((searchTerm = '', filterType = 'all') => {
    let filtered = groups;

    if (searchTerm) {
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(group => group.type === filterType);
    }

    return filtered.sort((a, b) => b.lastActivity - a.lastActivity);
  }, [groups]);

  return {
    // State
    activeGroup,
    showGroupCreator,
    showGroupSettings,
    showMembersList,
    groups,

    // Actions
    setActiveGroup,
    setShowGroupCreator,
    setShowGroupSettings,
    setShowMembersList,
    setGroups,

    // Group management
    createGroup,
    addMember,
    removeMember,
    updateMemberRole,
    leaveGroup,
    updateGroupSettings,

    // Utilities
    getGroupMembers,
    isUserAdmin,
    canUserPerformAction,
    getGroupStats,
    filterGroups
  };
};
