class WebSocketService {
  constructor() {
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectInterval = 1000
    this.listeners = new Map()
    this.isConnected = false
    this.userId = null
    this.heartbeatInterval = null
  }

  connect(userId) {
    this.userId = userId
    
    // For development, we'll simulate WebSocket with a mock service
    // In production, replace with: new WebSocket(`ws://localhost:8080/ws?userId=${userId}`)
    this.simulateWebSocket()
    
    this.setupHeartbeat()
    this.isConnected = true
    this.emit('connected')
  }

  simulateWebSocket() {
    // Simulate WebSocket connection for development
    console.log(`🔌 WebSocket connected for user ${this.userId}`)
    
    // Simulate receiving messages from other users
    setTimeout(() => {
      this.simulateIncomingMessage()
    }, 5000)
  }

  simulateIncomingMessage() {
    const mockMessage = {
      id: Date.now(),
      conversationId: 1,
      content: "Hey! Just saw your message, the item is still available! 😊",
      senderId: 2,
      timestamp: new Date(),
      status: 'delivered',
      type: 'text'
    }
    
    this.emit('message', mockMessage)
    
    // Simulate typing indicator
    setTimeout(() => {
      this.emit('user_typing', { userId: 2, conversationId: 1, isTyping: true })
      
      setTimeout(() => {
        this.emit('user_typing', { userId: 2, conversationId: 1, isTyping: false })
        
        // Send another message
        const followUpMessage = {
          id: Date.now() + 1,
          conversationId: 1,
          content: "When would be a good time to meet?",
          senderId: 2,
          timestamp: new Date(),
          status: 'delivered',
          type: 'text'
        }
        this.emit('message', followUpMessage)
      }, 2000)
    }, 3000)
  }

  setupHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        console.log('💓 WebSocket heartbeat')
        // In real implementation: this.ws.ping()
      }
    }, 30000)
  }

  sendMessage(message) {
    if (!this.isConnected) {
      console.error('WebSocket not connected')
      return false
    }

    // Simulate sending message
    console.log('📤 Sending message:', message)
    
    // Simulate message delivery confirmation
    setTimeout(() => {
      this.emit('message_status', {
        messageId: message.id,
        status: 'delivered'
      })
    }, 1000)

    // Simulate read receipt
    setTimeout(() => {
      this.emit('message_status', {
        messageId: message.id,
        status: 'read'
      })
    }, 3000)

    return true
  }

  sendTypingIndicator(conversationId, isTyping) {
    if (!this.isConnected) return

    console.log(`⌨️ User ${this.userId} ${isTyping ? 'started' : 'stopped'} typing in conversation ${conversationId}`)
    
    // In real implementation:
    // this.ws.send(JSON.stringify({
    //   type: 'typing',
    //   conversationId,
    //   isTyping,
    //   userId: this.userId
    // }))
  }

  updateOnlineStatus(isOnline) {
    if (!this.isConnected) return

    console.log(`👤 User ${this.userId} is now ${isOnline ? 'online' : 'offline'}`)
    
    // Broadcast online status
    this.emit('user_status', {
      userId: this.userId,
      isOnline,
      lastSeen: isOnline ? null : new Date()
    })
  }

  joinConversation(conversationId) {
    if (!this.isConnected) return

    console.log(`🏠 Joined conversation ${conversationId}`)
    // In real implementation: send join room message
  }

  leaveConversation(conversationId) {
    if (!this.isConnected) return

    console.log(`🚪 Left conversation ${conversationId}`)
    // In real implementation: send leave room message
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in ${event} listener:`, error)
        }
      })
    }
  }

  disconnect() {
    this.isConnected = false
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.listeners.clear()
    console.log('🔌 WebSocket disconnected')
  }

  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}`)

    setTimeout(() => {
      this.connect(this.userId)
    }, this.reconnectInterval * this.reconnectAttempts)
  }
}

// Create singleton instance
const wsService = new WebSocketService()

export default wsService
