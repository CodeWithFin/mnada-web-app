import { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  Image as ImageIcon, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical,
  ArrowLeft,
  Check,
  CheckCheck,
  Search,
  Users
} from 'lucide-react'
import useRealTimeMessaging from '../hooks/useRealTimeMessaging'
import TypingIndicator from './TypingIndicator'
import ConnectionStatus from './ConnectionStatus'
import MessageSearch from './MessageSearch'
import { useFileUpload } from '../hooks/useFileUpload'
import { FilePreview, FileUploadArea, UploadProgress } from './FileUpload'
import MediaViewer from './MediaViewer'
import { useEmoji } from '../hooks/useEmoji'
import EmojiPicker from './EmojiPicker'
import EmojiText from './EmojiText'
import MessageReactions from './MessageReactions'
import VoiceRecorder from './VoiceRecorder'
import VoiceMessage from './VoiceMessage'
import { useMessageThreading } from '../hooks/useMessageThreading'
import ReplyPreview from './ReplyPreview'
import MessageReply from './MessageReply'
import ThreadIndicator from './ThreadIndicator'
import ThreadView from './ThreadView'
import { useGroupMessaging } from '../hooks/useGroupMessaging'
import GroupCreator from './GroupCreator'
import GroupMembersPanel from './GroupMembersPanel'
import GroupCard from './GroupCard'

// Mock data for conversations
const mockConversations = [
  {
    id: 1,
    user: {
      id: 2,
      name: 'Sarah Mwangi',
      username: 'fashionista_ke',
      avatar: '/api/placeholder/80/80',
      online: true,
      lastSeen: null
    },
    lastMessage: {
      content: 'Hi! Is this jacket still available?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      senderId: 2,
      read: false
    },
    unreadCount: 2
  },
  {
    id: 2,
    user: {
      id: 3,
      name: 'James Kimani',
      username: 'sneaker_head',
      avatar: '/api/placeholder/80/80',
      online: false,
      lastSeen: new Date(Date.now() - 30 * 60 * 1000)
    },
    lastMessage: {
      content: 'Item received! Everything looks great, thank you!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      senderId: 3,
      read: true
    },
    unreadCount: 0
  }
]

// Mock available users for group creation
const mockUsers = [
  {
    id: 2,
    name: 'Sarah Mwangi',
    username: 'fashionista_ke',
    avatar: '/api/placeholder/80/80'
  },
  {
    id: 3,
    name: 'James Kimani',
    username: 'sneaker_head',
    avatar: '/api/placeholder/80/80'
  },
  {
    id: 4,
    name: 'Grace Wanjiku',
    username: 'vintage_lover',
    avatar: '/api/placeholder/80/80'
  },
  {
    id: 5,
    name: 'Peter Ochieng',
    username: 'tech_fashion',
    avatar: '/api/placeholder/80/80'
  }
]

// Mock groups data
const mockGroups = [
  {
    id: 101,
    name: 'Nairobi Fashion Enthusiasts',
    description: 'Connect with fashion lovers in Nairobi',
    type: 'public',
    avatar: null,
    createdBy: 1,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    members: [
      { id: 1, role: 'admin', joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), addedBy: 1 },
      { id: 2, role: 'member', joinedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), addedBy: 1 },
      { id: 3, role: 'member', joinedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), addedBy: 1 },
      { id: 4, role: 'admin', joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), addedBy: 1 }
    ],
    admins: [1, 4],
    settings: {
      allowMemberInvites: true,
      requireAdminApproval: false,
      messagingPermissions: 'all',
      mediaPermissions: 'all'
    },
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 3
  },
  {
    id: 102,
    name: 'Vintage Collectors',
    description: 'For lovers of vintage and retro fashion',
    type: 'private',
    avatar: null,
    createdBy: 4,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    members: [
      { id: 1, role: 'member', joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), addedBy: 4 },
      { id: 4, role: 'admin', joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), addedBy: 4 },
      { id: 5, role: 'member', joinedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), addedBy: 4 }
    ],
    admins: [4],
    settings: {
      allowMemberInvites: false,
      requireAdminApproval: true,
      messagingPermissions: 'all',
      mediaPermissions: 'admins'
    },
    lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000),
    unreadCount: 0
  }
]

const MessagingSystem = ({ 
  currentUserId = 1, 
  productContext = null,
  onClose = null 
}) => {
  const [activeConversation, setActiveConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState([])
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [showMediaViewer, setShowMediaViewer] = useState(false)
  const [mediaViewerFiles, setMediaViewerFiles] = useState([])
  const [mediaViewerIndex, setMediaViewerIndex] = useState(0)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const [activeTab, setActiveTab] = useState('conversations') // conversations, groups
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Real-time messaging hook
  const {
    connectionStatus,
    isConnected,
    messages,
    conversations,
    setMessages,
    setConversations,
    onlineUsers,
    isUserOnline,
    typingUsers,
    isUserTyping,
    getTypingUsers,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    updateOnlineStatus,
    requestNotificationPermission
  } = useRealTimeMessaging(currentUserId, activeConversation?.id)

  // File upload hook
  const {
    uploadFiles,
    uploadProgress,
    uploadErrors,
    clearError,
    clearAllErrors,
    formatFileSize
  } = useFileUpload()

  // Emoji hook
  const {
    insertEmoji,
    toggleEmojiPicker,
    closeEmojiPicker,
    parseEmojis,
    isEmojiOnly
  } = useEmoji()

  // Threading hook
  const {
    replyingTo,
    showThreadView,
    activeThread,
    startReply,
    cancelReply,
    openThread,
    closeThread,
    getThreadMessages,
    getThreadCount,
    hasReplies,
    createReplyMessage,
    formatReplyPreview
  } = useMessageThreading()

  // Group messaging hook
  const {
    activeGroup,
    showGroupCreator,
    showGroupSettings,
    showMembersList,
    groups,
    setActiveGroup,
    setShowGroupCreator,
    setShowGroupSettings,
    setShowMembersList,
    setGroups,
    createGroup,
    addMember,
    removeMember,
    updateMemberRole,
    getGroupMembers,
    isUserAdmin,
    canUserPerformAction
  } = useGroupMessaging()

  // Initialize conversations and groups with mock data
  useEffect(() => {
    setConversations(mockConversations)
    setGroups(mockGroups)
  }, [setConversations, setGroups])

  // Filter messages for active conversation or group
  const conversationMessages = messages.filter(
    msg => {
      if (activeGroup) {
        return msg.groupId === activeGroup.id;
      } else if (activeConversation) {
        return msg.conversationId === activeConversation.id;
      }
      return false;
    }
  )

  // Mock messages for active conversation
  const mockMessages = {
    1: [
      {
        id: 1,
        content: 'Hi! I\'m interested in your vintage leather jacket. Is it still available?',
        senderId: 2,
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        status: 'read',
        type: 'text'
      },
      {
        id: 2,
        content: 'Yes, it\'s still available! It\'s in excellent condition, barely worn.',
        senderId: currentUserId,
        timestamp: new Date(Date.now() - 55 * 60 * 1000),
        status: 'read',
        type: 'text'
      },
      {
        id: 3,
        content: 'Great! Could you share more photos? Especially the back and any wear marks?',
        senderId: 2,
        timestamp: new Date(Date.now() - 50 * 60 * 1000),
        status: 'read',
        type: 'text'
      },
      {
        id: 4,
        content: 'Of course! Here are some additional photos:',
        senderId: currentUserId,
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        status: 'read',
        type: 'text'
      },
      {
        id: 5,
        content: '',
        senderId: currentUserId,
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        status: 'read',
        type: 'image',
        images: ['/api/placeholder/200/200', '/api/placeholder/200/200']
      },
      {
        id: 6,
        content: 'Perfect! Can we meet in Westlands this weekend?',
        senderId: 2,
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        status: 'delivered',
        type: 'text'
      },
      {
        id: 7,
        content: '',
        senderId: currentUserId,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: 'read',
        type: 'voice',
        file: null, // Will be generated by VoiceMessage component for demo
        duration: 12.5
      },
      {
        id: 8,
        content: 'Sure! How about Saturday afternoon at 2 PM?',
        senderId: currentUserId,
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        status: 'read',
        type: 'text',
        parentMessageId: 6,
        replyTo: {
          id: 6,
          content: 'Perfect! Can we meet in Westlands this weekend?',
          senderId: 2,
          senderName: 'Sarah Mwangi',
          type: 'text',
          timestamp: new Date(Date.now() - 10 * 60 * 1000)
        }
      },
      {
        id: 9,
        content: 'That works perfectly! See you then 👍',
        senderId: 2,
        timestamp: new Date(Date.now() - 1 * 60 * 1000),
        status: 'delivered',
        type: 'text',
        parentMessageId: 6,
        replyTo: {
          id: 8,
          content: 'Sure! How about Saturday afternoon at 2 PM?',
          senderId: currentUserId,
          senderName: 'You',
          type: 'text',
          timestamp: new Date(Date.now() - 3 * 60 * 1000)
        }
      }
    ],
    2: [
      {
        id: 1,
        content: 'Item received! Everything looks great, thank you!',
        senderId: 3,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'read',
        type: 'text'
      }
    ]
  }

  // Mock group messages
  const mockGroupMessages = {
    101: [ // Nairobi Fashion Enthusiasts
      {
        id: 501,
        content: 'Welcome everyone to the group! 👋',
        senderId: 1,
        senderName: 'You',
        senderAvatar: '/api/placeholder/32/32',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
        groupId: 101
      },
      {
        id: 502,
        content: 'Thanks for creating this group! Excited to connect with fellow fashion lovers',
        senderId: 2,
        senderName: 'Sarah Mwangi',
        senderAvatar: '/api/placeholder/32/32',
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
        groupId: 101
      },
      {
        id: 503,
        content: 'Has anyone been to the new boutique in Westlands? Their collection looks amazing! 😍',
        senderId: 3,
        senderName: 'James Kimani',
        senderAvatar: '/api/placeholder/32/32',
        timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
        groupId: 101
      },
      {
        id: 504,
        content: 'Yes! I visited last week. They have some great vintage pieces',
        senderId: 4,
        senderName: 'Grace Wanjiku',
        senderAvatar: '/api/placeholder/32/32',
        timestamp: new Date(Date.now() - 21 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
        groupId: 101
      },
      {
        id: 505,
        content: 'Anyone interested in organizing a fashion meetup next weekend?',
        senderId: 1,
        senderName: 'You',
        senderAvatar: '/api/placeholder/32/32',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
        groupId: 101
      }
    ],
    102: [ // Vintage Collectors
      {
        id: 601,
        content: 'Found this amazing 80s jacket today! What do you think?',
        senderId: 4,
        senderName: 'Grace Wanjiku',
        senderAvatar: '/api/placeholder/32/32',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
        groupId: 102
      },
      {
        id: 602,
        content: 'That looks incredible! Where did you find it?',
        senderId: 1,
        senderName: 'You',
        senderAvatar: '/api/placeholder/32/32',
        timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
        groupId: 102
      },
      {
        id: 603,
        content: 'Little vintage shop in downtown. They have more pieces like this!',
        senderId: 4,
        senderName: 'Grace Wanjiku',
        senderAvatar: '/api/placeholder/32/32',
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
        status: 'read',
        type: 'text',
        groupId: 102
      }
    ]
  }

  // Combine mock messages with real-time messages
  const allMessages = [
    ...(activeGroup ? (mockGroupMessages[activeGroup.id] || []) : (mockMessages[activeConversation?.id] || [])),
    ...conversationMessages
  ].sort((a, b) => a.timestamp - b.timestamp)

  useEffect(() => {
    scrollToBottom()
  }, [allMessages])

  useEffect(() => {
    // Request notification permission on mount
    requestNotificationPermission()
    
    // Update online status
    updateOnlineStatus(true)
    
    // Set offline when page unloads
    const handleBeforeUnload = () => {
      updateOnlineStatus(false)
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [requestNotificationPermission, updateOnlineStatus])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatLastSeen = (date) => {
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 5) return 'Active now'
    if (minutes < 60) return `Active ${minutes}m ago`
    if (hours < 24) return `Active ${hours}h ago`
    return `Active ${days}d ago`
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleConversationSelect = (conversation) => {
    setActiveConversation(conversation)
    setActiveGroup(null) // Clear active group when selecting individual conversation
    markAsRead(conversation.id)
  }

  const handleSearchMessageClick = (searchResult) => {
    // Find the conversation for this message
    const conversation = conversations.find(conv => conv.id === searchResult.conversationId)
    if (conversation) {
      setActiveConversation(conversation)
      markAsRead(conversation.id)
      
      // Scroll to the specific message after a short delay to allow UI to update
      setTimeout(() => {
        const messageElement = document.getElementById(`message-${searchResult.id}`)
        if (messageElement) {
          messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          // Highlight the message briefly
          messageElement.classList.add('bg-yellow-100', 'dark:bg-yellow-900')
          setTimeout(() => {
            messageElement.classList.remove('bg-yellow-100', 'dark:bg-yellow-900')
          }, 2000)
        }
      }, 100)
    }
  }

  // File handling functions
  const handleFilesSelect = async (files) => {
    if (!activeConversation) return

    try {
      const uploadedFiles = await uploadFiles(files, activeConversation.id)
      setAttachedFiles(prev => [...prev, ...uploadedFiles])
    } catch (error) {
      console.error('File upload failed:', error)
    }
  }

  const handleRemoveFile = (fileId) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const handleSendWithFiles = () => {
    const targetId = activeGroup ? activeGroup.id : activeConversation?.id;
    if (!targetId) return

    const messageContent = newMessage.trim()
    
    if (messageContent || attachedFiles.length > 0) {
      // Create message with files
      let messageData = {
        content: messageContent,
        files: attachedFiles,
        type: attachedFiles.length > 0 ? 'mixed' : 'text'
      }

      // Add reply data if replying to a message
      if (replyingTo) {
        messageData = createReplyMessage(messageContent, replyingTo, 'mixed', {
          files: attachedFiles
        });
      }

      sendMessage(targetId, messageData)
      setNewMessage('')
      setAttachedFiles([])
      setShowFileUpload(false)
      cancelReply() // Clear reply state
    }
  }

  const handleMediaClick = (file, allFiles) => {
    const mediaFiles = allFiles.filter(f => f.type === 'image' || f.type === 'video' || f.type === 'audio')
    const startIndex = mediaFiles.findIndex(f => f.id === file.id)
    
    setMediaViewerFiles(mediaFiles)
    setMediaViewerIndex(Math.max(0, startIndex))
    setShowMediaViewer(true)
  }

  // Update the send message handler to support files and replies
  const handleSendMessage = () => {
    const targetId = activeGroup ? activeGroup.id : activeConversation?.id;
    if (!targetId) return;

    if (attachedFiles.length > 0) {
      handleSendWithFiles()
    } else if (newMessage.trim()) {
      let messageData = { content: newMessage.trim(), type: 'text' };
      
      // Add reply data if replying to a message
      if (replyingTo) {
        messageData = createReplyMessage(newMessage.trim(), replyingTo, 'text');
      }
      
      sendMessage(targetId, messageData)
      setNewMessage('')
      cancelReply() // Clear reply state
    }
  }

  // Thread reply handler
  const handleSendThreadReply = (content, parentMessage) => {
    const targetId = activeGroup ? activeGroup.id : activeConversation?.id;
    if (targetId && content.trim()) {
      const replyData = createReplyMessage(content, parentMessage, 'text');
      sendMessage(targetId, replyData);
    }
  }

  // Voice message handler
  const handleSendVoiceMessage = (audioFile, duration) => {
    const targetId = activeGroup ? activeGroup.id : activeConversation?.id;
    if (targetId && audioFile) {
      let voiceMessage = {
        content: '',
        type: 'voice',
        file: audioFile,
        duration: duration,
        timestamp: new Date()
      }
      
      // Add reply data if replying to a message
      if (replyingTo) {
        voiceMessage = createReplyMessage('', replyingTo, 'voice', {
          file: audioFile,
          duration: duration
        });
      }
      
      sendMessage(targetId, voiceMessage)
      setShowVoiceRecorder(false)
      cancelReply() // Clear reply state
    }
  }

  const handleCancelVoiceRecording = () => {
    setShowVoiceRecorder(false)
  }

  // Thread handling functions
  const handleStartReply = (message) => {
    startReply(message);
    // Focus on input after starting reply
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }

  const handleOpenThread = (message) => {
    openThread(message);
  }

  const handleCloseThread = () => {
    closeThread();
  }

  // Group handling functions
  const handleCreateGroup = async (groupData) => {
    try {
      const newGroup = await createGroup(groupData);
      setActiveConversation(null); // Clear individual conversation
      setActiveGroup(newGroup); // Set active group
      return newGroup;
    } catch (error) {
      console.error('Error creating group:', error);
    }
  }

  const handleGroupSelect = (group) => {
    setActiveConversation(null); // Clear individual conversation
    setActiveGroup(group);
  }

  const handleShowGroupMembers = (group) => {
    setActiveGroup(group);
    setShowMembersList(true);
  }

  const handleGroupMemberAction = async (action, groupId, memberId, ...args) => {
    try {
      switch (action) {
        case 'add':
          await addMember(groupId, memberId, args[0] || 'member');
          break;
        case 'remove':
          await removeMember(groupId, memberId);
          break;
        case 'updateRole':
          await updateMemberRole(groupId, memberId, args[0]);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error performing ${action} on group member:`, error);
    }
  }

  // Emoji handling functions
  const handleEmojiSelect = (emoji) => {
    const { newText, newCursorPosition } = insertEmoji(emoji, newMessage, cursorPosition);
    setNewMessage(newText);
    setCursorPosition(newCursorPosition);
    setShowEmojiPicker(false);
    
    // Focus back to input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  }

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    setCursorPosition(e.target.selectionStart);
    
    // Trigger typing indicator
    if (activeConversation) {
      startTyping(activeConversation.id);
    }
  }

  const handleInputClick = (e) => {
    setCursorPosition(e.target.selectionStart);
  }

  const handleInputKeyUp = (e) => {
    setCursorPosition(e.target.selectionStart);
  }

  // Message reaction functions
  const handleAddReaction = (messageId, emoji, userId) => {
    // In a real app, this would call an API
    console.log('Add reaction:', { messageId, emoji, userId });
    // For now, we'll simulate it by updating local state
    // You would implement this with your real-time messaging system
  }

  const handleRemoveReaction = (messageId, emoji, userId) => {
    // In a real app, this would call an API
    console.log('Remove reaction:', { messageId, emoji, userId });
    // For now, we'll simulate it by updating local state
    // You would implement this with your real-time messaging system
  }

  const startConversation = (user) => {
    const existingConv = conversations.find(conv => conv.user.id === user.id)
    if (existingConv) {
      setActiveConversation(existingConv)
    } else {
      const newConv = {
        id: Date.now(),
        user,
        lastMessage: null,
        unreadCount: 0
      }
      setConversations(prev => [newConv, ...prev])
      setActiveConversation(newConv)
      setMessages([])
    }
  }

  const MessageStatus = ({ status }) => {
    if (status === 'sending') {
      return <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
    }
    if (status === 'failed') {
      return <div className="w-3 h-3 bg-red-500 rounded-full" title="Failed to send" />
    }
    if (status === 'delivered') {
      return <Check size={14} className="text-gray-400" />
    }
    if (status === 'read') {
      return <CheckCheck size={14} className="text-brand-orange-light dark:text-brand-orange-dark" />
    }
    return null
  }

  // Get typing users for active conversation
  const activeConversationTypingUsers = activeConversation 
    ? getTypingUsers(activeConversation.id)
        .map(userId => conversations.find(conv => conv.user.id === userId)?.user)
        .filter(Boolean)
    : []

  if (!activeConversation && !activeGroup) {
    return (
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border">
          <div className="p-4 border-b border-light-border dark:border-dark-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                Messages
              </h2>
              <div className="flex items-center space-x-2">
                {activeTab === 'groups' && (
                  <button
                    onClick={() => setShowGroupCreator(true)}
                    className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full"
                    title="Create Group"
                  >
                    <Users size={20} className="text-light-text-secondary dark:text-dark-text-secondary" />
                  </button>
                )}
                {onClose && (
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex space-x-1 mb-3">
              <button
                onClick={() => setActiveTab('conversations')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'conversations'
                    ? 'bg-brand-orange-light dark:bg-brand-orange-dark text-white'
                    : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-hover dark:hover:bg-dark-hover'
                }`}
              >
                Chats
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'groups'
                    ? 'bg-brand-orange-light dark:bg-brand-orange-dark text-white'
                    : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-hover dark:hover:bg-dark-hover'
                }`}
              >
                Groups
              </button>
            </div>
            
            {/* Connection Status */}
            <ConnectionStatus status={connectionStatus} />
          </div>

          <div className="overflow-y-auto">
            {/* Conversations Tab */}
            {activeTab === 'conversations' && (
              <div>
                {conversations.map(conversation => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationSelect(conversation)}
                    className="flex items-center p-4 hover:bg-light-hover dark:hover:bg-dark-hover cursor-pointer border-b border-light-border/50 dark:border-dark-border/50"
                  >
                    <div className="relative">
                      <img
                        src={conversation.user.avatar}
                        alt={conversation.user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {isUserOnline(conversation.user.id) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-light-card dark:border-dark-card rounded-full"></div>
                      )}
                    </div>

                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                          {conversation.user.name}
                        </h3>
                        {conversation.lastMessage && (
                          <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {isUserTyping(conversation.user.id, conversation.id) ? (
                          <span className="text-sm text-brand-orange-light dark:text-brand-orange-dark italic">
                            typing...
                          </span>
                        ) : (
                          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">
                            {conversation.lastMessage?.content || 'Start a conversation...'}
                          </p>
                        )}
                        {conversation.unreadCount > 0 && (
                          <span className="ml-2 px-2 py-1 bg-brand-orange-light dark:bg-brand-orange-dark text-white text-xs rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {conversations.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-light-text-secondary dark:text-dark-text-secondary">
                      No conversations yet
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Groups Tab */}
            {activeTab === 'groups' && (
              <div className="p-4 space-y-3">
                {groups.map(group => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    isActive={activeGroup?.id === group.id}
                    onClick={() => handleGroupSelect(group)}
                    onMembersClick={handleShowGroupMembers}
                    currentUserId={currentUserId}
                  />
                ))}
                
                {groups.length === 0 && (
                  <div className="text-center py-8">
                    <Users size={48} className="mx-auto mb-3 text-light-text-secondary dark:text-dark-text-secondary" />
                    <div className="text-light-text-secondary dark:text-dark-text-secondary mb-3">
                      No groups yet
                    </div>
                    <button
                      onClick={() => setShowGroupCreator(true)}
                      className="px-4 py-2 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
                    >
                      Create Group
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-light-background dark:bg-dark-background">
          <div className="text-center">
            <div className="w-16 h-16 bg-light-surface dark:bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Send size={24} className="text-light-text-secondary dark:text-dark-text-secondary" />
            </div>
            <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
              Select a conversation
            </h3>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Choose a conversation to start messaging
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Conversations List - Hidden on mobile when chat is active */}
      <div className="hidden md:block w-1/3 bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border">
        <div className="p-4 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
              Messages
            </h2>
          </div>
          
          {/* Connection Status */}
          <ConnectionStatus status={connectionStatus} />
        </div>

        <div className="overflow-y-auto">
          {conversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => handleConversationSelect(conversation)}
              className={`flex items-center p-4 cursor-pointer border-b border-light-border/50 dark:border-dark-border/50 ${
                activeConversation.id === conversation.id
                  ? 'bg-brand-orange-light/10 dark:bg-brand-orange-dark/10'
                  : 'hover:bg-light-hover dark:hover:bg-dark-hover'
              }`}
            >
              <div className="relative">
                <img
                  src={conversation.user.avatar}
                  alt={conversation.user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {isUserOnline(conversation.user.id) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-light-card dark:border-dark-card rounded-full"></div>
                )}
              </div>

              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                    {conversation.user.name}
                  </h3>
                  {conversation.lastMessage && (
                    <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      {formatTime(conversation.lastMessage.timestamp)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  {isUserTyping(conversation.user.id, conversation.id) ? (
                    <span className="text-sm text-brand-orange-light dark:text-brand-orange-dark italic">
                      typing...
                    </span>
                  ) : (
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">
                      {conversation.lastMessage?.content || 'Start a conversation...'}
                    </p>
                  )}
                  {conversation.unreadCount > 0 && (
                    <span className="ml-2 px-2 py-1 bg-brand-orange-light dark:bg-brand-orange-dark text-white text-xs rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-light-background dark:bg-dark-background">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border">
          <div className="flex items-center">
            <button
              onClick={() => {
                setActiveConversation(null);
                setActiveGroup(null);
              }}
              className="md:hidden p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full mr-2"
            >
              <ArrowLeft size={20} />
            </button>
            
            {activeGroup ? (
              // Group Chat Header
              <>
                <div className="relative">
                  {activeGroup.avatar ? (
                    <img
                      src={activeGroup.avatar}
                      alt={activeGroup.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-orange-light to-brand-orange-dark flex items-center justify-center">
                      <Users size={20} className="text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-light-card dark:border-dark-card rounded-full"></div>
                </div>
                
                <div className="ml-3">
                  <h3 className="font-medium text-light-text-primary dark:text-dark-text-primary">
                    {activeGroup.name}
                  </h3>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {activeGroup.members.length} members
                    {activeGroup.type === 'private' && ' • Private'}
                  </p>
                </div>
              </>
            ) : (
              // Individual Chat Header
              <>
                <div className="relative">
                  <img
                    src={activeConversation.user.avatar}
                    alt={activeConversation.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {activeConversation.user.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-light-card dark:border-dark-card rounded-full"></div>
                  )}
                </div>
                
                <div className="ml-3">
                  <h3 className="font-medium text-light-text-primary dark:text-dark-text-primary">
                    {activeConversation.user.name}
                  </h3>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {activeConversation.user.online 
                      ? 'Active now' 
                      : formatLastSeen(activeConversation.user.lastSeen)
                    }
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowSearch(true)}
              className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full"
            >
              <Search size={20} className="text-light-text-secondary dark:text-dark-text-secondary" />
            </button>
            
            {activeGroup ? (
              // Group chat buttons
              <>
                <button 
                  onClick={() => setShowMembersList(true)}
                  className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full"
                  title="Group Members"
                >
                  <Users size={20} className="text-light-text-secondary dark:text-dark-text-secondary" />
                </button>
                <button className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full">
                  <Video size={20} className="text-light-text-secondary dark:text-dark-text-secondary" />
                </button>
                <button className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full">
                  <MoreVertical size={20} className="text-light-text-secondary dark:text-dark-text-secondary" />
                </button>
              </>
            ) : (
              // Individual chat buttons
              <>
                <button className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full">
                  <Phone size={20} className="text-light-text-secondary dark:text-dark-text-secondary" />
                </button>
                <button className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full">
                  <Video size={20} className="text-light-text-secondary dark:text-dark-text-secondary" />
                </button>
                <button className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full">
                  <MoreVertical size={20} className="text-light-text-secondary dark:text-dark-text-secondary" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {allMessages.map((message) => (
            <div
              key={message.id}
              id={`message-${message.id}`}
              className={`flex ${
                message.senderId === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Show avatar for other users in group chats */}
              {activeGroup && message.senderId !== currentUserId && (
                <div className="mr-2 mt-1">
                  <img
                    src={message.senderAvatar || '/api/placeholder/32/32'}
                    alt={message.senderName || 'User'}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
              )}
              
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-apple-lg ${
                  message.senderId === currentUserId
                    ? 'bg-brand-orange-light dark:bg-brand-orange-dark text-white'
                    : 'bg-light-card dark:bg-dark-card text-light-text-primary dark:text-dark-text-primary'
                } ${message.status === 'sending' ? 'opacity-70' : ''} ${
                  message.type === 'voice' ? 'p-0 overflow-hidden' : ''
                }`}
              >
                {/* Sender name for group messages */}
                {activeGroup && message.senderId !== currentUserId && (
                  <div className="text-xs font-medium mb-1 text-brand-orange-light dark:text-brand-orange-dark">
                    {message.senderName || 'Unknown User'}
                  </div>
                )}

                {/* Reply context */}
                {message.replyTo && (
                  <MessageReply
                    replyTo={message.replyTo}
                    compact={true}
                    className="mb-2"
                    onClick={() => {
                      const element = document.getElementById(`message-${message.replyTo.id}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                  />
                )}
                
                {/* Text content */}
                {(message.type === 'text' || message.type === 'mixed') && message.content && (
                  <div className="text-sm mb-2">
                    <EmojiText text={message.content} />
                  </div>
                )}
                
                {/* Files */}
                {message.files && message.files.length > 0 && (
                  <div className="space-y-2">
                    {message.files.map((file) => (
                      <FilePreview
                        key={file.id}
                        file={file}
                        onRemove={() => {}}
                        showRemove={false}
                        onClick={() => handleMediaClick(file, message.files)}
                      />
                    ))}
                  </div>
                )}
                
                {/* Legacy image support */}
                {message.type === 'image' && message.images && (
                  <div className="space-y-2">
                    {message.content && (
                      <p className="text-sm">{message.content}</p>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      {message.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt="Shared image"
                          className="rounded-apple w-full h-32 object-cover cursor-pointer"
                          onClick={() => handleMediaClick(
                            { id: `legacy-${index}`, url: image, type: 'image', name: `Image ${index + 1}` },
                            message.images.map((img, i) => ({ id: `legacy-${i}`, url: img, type: 'image', name: `Image ${i + 1}` }))
                          )}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Voice Messages */}
                {message.type === 'voice' && (
                  <div className="-m-4">
                    <VoiceMessage
                      message={message}
                      isOwn={message.senderId === currentUserId}
                    />
                  </div>
                )}
                
                {/* Show timestamp and status for non-voice messages */}
                {message.type !== 'voice' && (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-70">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.senderId === currentUserId && (
                      <MessageStatus status={message.status} />
                    )}
                  </div>
                )}
                
                {/* Message Reactions - show for all message types */}
                <MessageReactions
                  reactions={message.reactions || {}}
                  onAddReaction={handleAddReaction}
                  onRemoveReaction={handleRemoveReaction}
                  currentUserId={currentUserId}
                  messageId={message.id}
                />
              </div>
              
              {/* Thread indicator and reply button */}
              <div className={`flex items-center mt-2 space-x-2 ${
                message.senderId === currentUserId ? 'justify-end' : 'justify-start'
              }`}>
                {/* Thread indicator for messages with replies */}
                {hasReplies(message.id, allMessages) && (
                  <ThreadIndicator
                    threadCount={getThreadCount(message.id, allMessages)}
                    onOpenThread={() => handleOpenThread(message)}
                    compact={true}
                  />
                )}
                
                {/* Reply button */}
                {!message.parentMessageId && ( // Only show on root messages
                  <button
                    onClick={() => handleStartReply(message)}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
                             hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded transition-colors"
                    title="Reply to this message"
                  >
                    Reply
                  </button>
                )}
              </div>
            </div>
          ))}
          <TypingIndicator 
            typingUsers={typingUsers} 
            currentConversationId={activeConversation.id} 
          />
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-light-card dark:bg-dark-card border-t border-light-border dark:border-dark-border">
          {/* Reply Preview */}
          {replyingTo && (
            <ReplyPreview
              replyingTo={replyingTo}
              onCancel={cancelReply}
              className="mb-4"
            />
          )}
          
          {/* File Attachments Preview */}
          {attachedFiles.length > 0 && (
            <div className="mb-4 p-3 bg-light-surface dark:bg-dark-surface rounded-lg border border-light-border dark:border-dark-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  {attachedFiles.length} file{attachedFiles.length !== 1 ? 's' : ''} attached
                </span>
                <button
                  onClick={() => setAttachedFiles([])}
                  className="text-xs text-light-text-secondary dark:text-dark-text-secondary hover:text-red-500"
                >
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {attachedFiles.map((file) => (
                  <FilePreview
                    key={file.id}
                    file={file}
                    onRemove={handleRemoveFile}
                    showRemove={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="mb-4 space-y-2">
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <UploadProgress
                  key={fileId}
                  progress={progress}
                  fileName={`Uploading file...`}
                />
              ))}
            </div>
          )}

          {/* File Upload Area (when toggled) */}
          {showFileUpload && (
            <div className="mb-4">
              <FileUploadArea
                onFilesSelect={handleFilesSelect}
                uploadErrors={uploadErrors}
              />
            </div>
          )}

          {/* Voice Recorder */}
          {showVoiceRecorder && (
            <div className="mb-4">
              <VoiceRecorder
                onSendVoiceMessage={handleSendVoiceMessage}
                onCancel={handleCancelVoiceRecording}
                className="w-full"
              />
            </div>
          )}

          <div className="flex items-end space-x-3">
            <button 
              onClick={() => setShowFileUpload(!showFileUpload)}
              className={`p-2 rounded-full transition-colors ${
                showFileUpload || attachedFiles.length > 0
                  ? 'bg-brand-orange-light dark:bg-brand-orange-dark text-white'
                  : 'hover:bg-light-hover dark:hover:bg-dark-hover'
              }`}
            >
              <Paperclip size={20} className={showFileUpload || attachedFiles.length > 0 ? 'text-white' : 'text-light-text-secondary dark:text-dark-text-secondary'} />
            </button>
            
            <button 
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.multiple = true;
                input.onchange = (e) => handleFilesSelect(Array.from(e.target.files));
                input.click();
              }}
              className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full"
            >
              <ImageIcon size={20} className="text-light-text-secondary dark:text-dark-text-secondary" />
            </button>

            {!showVoiceRecorder ? (
              <button
                onClick={() => setShowVoiceRecorder(true)}
                className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                title="Record voice message"
              >
                <div className="w-5 h-5">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-2 5v6a2 2 0 1 0 4 0V6a2 2 0 1 0-4 0zm-5 6a1 1 0 0 1 1 1 8 8 0 0 0 16 0 1 1 0 0 1 2 0 10 10 0 0 1-9 9.95V20h3a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2h3v-1.05A10 10 0 0 1 2 11a1 1 0 0 1 1-1z"/>
                  </svg>
                </div>
              </button>
            ) : null}

            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={newMessage}
                onChange={handleInputChange}
                onClick={handleInputClick}
                onKeyUp={handleInputKeyUp}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows={1}
                className="w-full p-3 pr-12 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple-lg focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark resize-none"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              
              <div className="absolute right-3 bottom-3">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-1 rounded-full transition-colors ${
                    showEmojiPicker 
                      ? 'bg-brand-orange-light dark:bg-brand-orange-dark text-white' 
                      : 'hover:bg-light-hover dark:hover:bg-dark-hover'
                  }`}
                >
                  <Smile size={16} className={showEmojiPicker ? 'text-white' : 'text-light-text-secondary dark:text-dark-text-secondary'} />
                </button>
                
                <EmojiPicker
                  isOpen={showEmojiPicker}
                  onClose={() => setShowEmojiPicker(false)}
                  onEmojiSelect={handleEmojiSelect}
                  position="top-right"
                />
              </div>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() && attachedFiles.length === 0}
              className="p-3 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-orange-light/90 dark:hover:bg-brand-orange-dark/90 transition-colors"
              title={replyingTo ? 'Send reply' : 'Send message'}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Message Search Modal */}
      <MessageSearch
        conversations={conversations}
        messages={messages}
        onMessageClick={handleSearchMessageClick}
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />
      
      {/* Media Viewer */}
      <MediaViewer
        media={mediaViewerFiles}
        isOpen={showMediaViewer}
        onClose={() => setShowMediaViewer(false)}
        initialIndex={mediaViewerIndex}
      />
      
      {/* Thread View */}
      <ThreadView
        isOpen={showThreadView}
        onClose={handleCloseThread}
        rootMessage={activeThread}
        threadMessages={activeThread ? getThreadMessages(activeThread.id, allMessages) : []}
        currentUserId={currentUserId}
        onSendReply={handleSendThreadReply}
        onAddReaction={handleAddReaction}
        onRemoveReaction={handleRemoveReaction}
      />
      
      {/* Group Creator */}
      <GroupCreator
        isOpen={showGroupCreator}
        onClose={() => setShowGroupCreator(false)}
        onCreateGroup={handleCreateGroup}
        availableUsers={mockUsers}
        currentUserId={currentUserId}
      />
      
      {/* Group Members Panel */}
      <GroupMembersPanel
        isOpen={showMembersList}
        onClose={() => setShowMembersList(false)}
        group={activeGroup}
        members={activeGroup ? getGroupMembers(activeGroup.id, mockUsers) : []}
        currentUserId={currentUserId}
        onAddMember={(groupId, userId, role) => handleGroupMemberAction('add', groupId, userId, role)}
        onRemoveMember={(groupId, userId) => handleGroupMemberAction('remove', groupId, userId)}
        onUpdateRole={(groupId, userId, role) => handleGroupMemberAction('updateRole', groupId, userId, role)}
        onShowSettings={() => setShowGroupSettings(true)}
      />
    </div>
  )
}

export default MessagingSystem
