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
  CheckCheck
} from 'lucide-react'

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
      name: 'James Kiprotich',
      username: 'vintage_hunter',
      avatar: '/api/placeholder/80/80',
      online: false,
      lastSeen: new Date(Date.now() - 30 * 60 * 1000)
    },
    lastMessage: {
      content: 'Thanks for the quick delivery! 👍',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      senderId: 3,
      read: true
    },
    unreadCount: 0
  }
]

const MessagingSystem = ({ 
  currentUserId = 1, 
  productContext = null,
  onClose = null 
}) => {
  const [conversations, setConversations] = useState(mockConversations)
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

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

  useEffect(() => {
    if (activeConversation) {
      setMessages(mockMessages[activeConversation.id] || [])
    }
  }, [activeConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

  const sendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return

    const message = {
      id: Date.now(),
      content: newMessage,
      senderId: currentUserId,
      timestamp: new Date(),
      status: 'sending',
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'delivered' }
            : msg
        )
      )
    }, 1000)

    // Simulate read receipt
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'read' }
            : msg
        )
      )
    }, 3000)

    // Update conversation last message
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversation.id
          ? {
              ...conv,
              lastMessage: {
                content: newMessage,
                timestamp: new Date(),
                senderId: currentUserId,
                read: true
              }
            }
          : conv
      )
    )
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
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
    if (status === 'delivered') {
      return <Check size={14} className="text-gray-400" />
    }
    if (status === 'read') {
      return <CheckCheck size={14} className="text-brand-orange-light dark:text-brand-orange-dark" />
    }
    return null
  }

  if (!activeConversation) {
    return (
      <div className="flex h-full">
        {/* Conversations List */}
        <div className="w-full md:w-1/3 bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border">
          <div className="p-4 border-b border-light-border dark:border-dark-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
                Messages
              </h2>
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

          <div className="overflow-y-auto">
            {conversations.map(conversation => (
              <div
                key={conversation.id}
                onClick={() => setActiveConversation(conversation)}
                className="flex items-center p-4 hover:bg-light-hover dark:hover:bg-dark-hover cursor-pointer border-b border-light-border/50 dark:border-dark-border/50"
              >
                <div className="relative">
                  <img
                    src={conversation.user.avatar}
                    alt={conversation.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.user.online && (
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
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">
                      {conversation.lastMessage?.content || 'Start a conversation...'}
                    </p>
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
          <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">
            Messages
          </h2>
        </div>

        <div className="overflow-y-auto">
          {conversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => setActiveConversation(conversation)}
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
                {conversation.user.online && (
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
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">
                    {conversation.lastMessage?.content || 'Start a conversation...'}
                  </p>
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
              onClick={() => setActiveConversation(null)}
              className="md:hidden p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full mr-2"
            >
              <ArrowLeft size={20} />
            </button>
            
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
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full">
              <Phone size={20} className="text-light-text-secondary dark:text-dark-text-secondary" />
            </button>
            <button className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full">
              <Video size={20} className="text-light-text-secondary dark:text-dark-text-secondary" />
            </button>
            <button className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full">
              <MoreVertical size={20} className="text-light-text-secondary dark:text-dark-text-secondary" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-apple-lg ${
                  message.senderId === currentUserId
                    ? 'bg-brand-orange-light dark:bg-brand-orange-dark text-white'
                    : 'bg-light-card dark:bg-dark-card text-light-text-primary dark:text-dark-text-primary'
                }`}
              >
                {message.type === 'text' && (
                  <p className="text-sm">{message.content}</p>
                )}
                
                {message.type === 'image' && (
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
                          className="rounded-apple w-full h-32 object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs opacity-70">
                    {formatTime(message.timestamp)}
                  </span>
                  {message.senderId === currentUserId && (
                    <MessageStatus status={message.status} />
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-light-card dark:bg-dark-card border-t border-light-border dark:border-dark-border">
          <div className="flex items-end space-x-3">
            <button className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full">
              <Paperclip size={20} className="text-light-text-secondary dark:text-dark-text-secondary" />
            </button>
            
            <button className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full">
              <ImageIcon size={20} className="text-light-text-secondary dark:text-dark-text-secondary" />
            </button>

            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows={1}
                className="w-full p-3 pr-12 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple-lg focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark resize-none"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-3 bottom-3 p-1 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full"
              >
                <Smile size={16} className="text-light-text-secondary dark:text-dark-text-secondary" />
              </button>
            </div>

            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-3 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-orange-light/90 dark:hover:bg-brand-orange-dark/90 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessagingSystem
