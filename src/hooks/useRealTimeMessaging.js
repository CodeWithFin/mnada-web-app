import { useState, useEffect, useCallback, useRef } from 'react'
import wsService from '../services/websocketService'

export const useRealTimeMessaging = (currentUserId, activeConversationId = null) => {
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const [typingUsers, setTypingUsers] = useState(new Map()) // conversationId -> Set of userIds
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [messages, setMessages] = useState([])
  const [conversations, setConversations] = useState([])
  const typingTimeoutRef = useRef(null)

  // Connection management
  useEffect(() => {
    if (currentUserId) {
      setConnectionStatus('connecting')
      wsService.connect(currentUserId)

      const handleConnected = () => {
        setConnectionStatus('connected')
        console.log('✅ Real-time messaging connected')
      }

      const handleDisconnected = () => {
        setConnectionStatus('disconnected')
        console.log('❌ Real-time messaging disconnected')
      }

      wsService.on('connected', handleConnected)
      wsService.on('disconnected', handleDisconnected)

      return () => {
        wsService.off('connected', handleConnected)
        wsService.off('disconnected', handleDisconnected)
      }
    }
  }, [currentUserId])

  // Message handling
  useEffect(() => {
    const handleNewMessage = (message) => {
      console.log('📨 New message received:', message)
      
      setMessages(prevMessages => {
        // Avoid duplicates
        if (prevMessages.find(msg => msg.id === message.id)) {
          return prevMessages
        }
        return [...prevMessages, message]
      })

      // Update conversation last message
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === message.conversationId
            ? {
                ...conv,
                lastMessage: {
                  content: message.content,
                  timestamp: message.timestamp,
                  senderId: message.senderId,
                  read: message.senderId === currentUserId
                },
                unreadCount: message.senderId === currentUserId 
                  ? conv.unreadCount 
                  : conv.unreadCount + 1
              }
            : conv
        )
      )

      // Show notification if not in active conversation
      if (message.conversationId !== activeConversationId && message.senderId !== currentUserId) {
        showMessageNotification(message)
      }
    }

    const handleMessageStatus = ({ messageId, status }) => {
      console.log(`📋 Message ${messageId} status: ${status}`)
      
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId ? { ...msg, status } : msg
        )
      )
    }

    wsService.on('message', handleNewMessage)
    wsService.on('message_status', handleMessageStatus)

    return () => {
      wsService.off('message', handleNewMessage)
      wsService.off('message_status', handleMessageStatus)
    }
  }, [currentUserId, activeConversationId])

  // Typing indicators
  useEffect(() => {
    const handleUserTyping = ({ userId, conversationId, isTyping }) => {
      setTypingUsers(prevTyping => {
        const newTyping = new Map(prevTyping)
        
        if (!newTyping.has(conversationId)) {
          newTyping.set(conversationId, new Set())
        }
        
        const conversationTyping = new Set(newTyping.get(conversationId))
        
        if (isTyping) {
          conversationTyping.add(userId)
        } else {
          conversationTyping.delete(userId)
        }
        
        newTyping.set(conversationId, conversationTyping)
        return newTyping
      })
    }

    wsService.on('user_typing', handleUserTyping)

    return () => {
      wsService.off('user_typing', handleUserTyping)
    }
  }, [])

  // Online status tracking
  useEffect(() => {
    const handleUserStatus = ({ userId, isOnline }) => {
      setOnlineUsers(prevOnline => {
        const newOnline = new Set(prevOnline)
        if (isOnline) {
          newOnline.add(userId)
        } else {
          newOnline.delete(userId)
        }
        return newOnline
      })
    }

    wsService.on('user_status', handleUserStatus)

    return () => {
      wsService.off('user_status', handleUserStatus)
    }
  }, [])

  // Join/leave conversation
  useEffect(() => {
    if (activeConversationId) {
      wsService.joinConversation(activeConversationId)
      
      return () => {
        wsService.leaveConversation(activeConversationId)
      }
    }
  }, [activeConversationId])

  // Send message function
  const sendMessage = useCallback((messageData) => {
    const message = {
      ...messageData,
      id: Date.now(),
      senderId: currentUserId,
      timestamp: new Date(),
      status: 'sending'
    }

    // Optimistically add to local state
    setMessages(prevMessages => [...prevMessages, message])

    // Send via WebSocket
    const success = wsService.sendMessage(message)
    
    if (!success) {
      // Handle failure - remove from local state or mark as failed
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === message.id ? { ...msg, status: 'failed' } : msg
        )
      )
    }

    return message
  }, [currentUserId])

  // Typing indicator functions
  const startTyping = useCallback((conversationId) => {
    wsService.sendTypingIndicator(conversationId, true)
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    // Auto-stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      wsService.sendTypingIndicator(conversationId, false)
    }, 3000)
  }, [])

  const stopTyping = useCallback((conversationId) => {
    wsService.sendTypingIndicator(conversationId, false)
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
  }, [])

  // Mark messages as read
  const markAsRead = useCallback((conversationId) => {
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    )
    
    // In real implementation, send read receipt to server
    console.log(`📖 Marked conversation ${conversationId} as read`)
  }, [])

  // Notification helper
  const showMessageNotification = useCallback((message) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New Message', {
        body: message.content,
        icon: '/favicon.ico',
        tag: `message-${message.id}`
      })
    }
  }, [])

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return Notification.permission === 'granted'
  }, [])

  // Update online status
  const updateOnlineStatus = useCallback((isOnline) => {
    wsService.updateOnlineStatus(isOnline)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  return {
    // Connection state
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    
    // Messages and conversations
    messages,
    conversations,
    setMessages,
    setConversations,
    
    // Online status
    onlineUsers,
    isUserOnline: (userId) => onlineUsers.has(userId),
    
    // Typing indicators
    typingUsers,
    isUserTyping: (userId, conversationId) => 
      typingUsers.get(conversationId)?.has(userId) || false,
    getTypingUsers: (conversationId) => 
      Array.from(typingUsers.get(conversationId) || []),
    
    // Actions
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
    updateOnlineStatus,
    requestNotificationPermission
  }
}

export default useRealTimeMessaging
