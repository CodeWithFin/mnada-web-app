// Mock API services for Mnada Web App
// In a real application, these would make actual HTTP requests to your backend

// Base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const API_DELAY = 800 // Simulate network delay

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Error simulation (10% chance)
const shouldSimulateError = () => Math.random() < 0.1

// Mock data
const mockUsers = [
  {
    id: 1,
    username: 'fashion_jane',
    email: 'jane@example.com',
    name: 'Jane Wanjiku',
    avatar: '/api/placeholder/80/80',
    bio: 'Fashion enthusiast & sustainable style advocate 🌿',
    location: 'Nairobi, Kenya',
    followers: 2340,
    following: 890,
    posts: 156,
    verified: true,
    joinedDate: '2023-06-15',
    website: 'https://janestyle.co.ke'
  },
  {
    id: 2,
    username: 'vintage_hunter',
    email: 'james@example.com',
    name: 'James Kiprotich',
    avatar: '/api/placeholder/80/80',
    bio: 'Vintage collector | Thrift finder | Fashion history buff',
    location: 'Kisumu, Kenya',
    followers: 1560,
    following: 420,
    posts: 89,
    verified: false,
    joinedDate: '2023-08-22'
  }
]

const mockPosts = [
  {
    id: 1,
    type: 'snapfit',
    user: mockUsers[0],
    content: 'Loving this vintage-inspired look! Found this amazing blazer at the local market 💫',
    images: ['/api/placeholder/400/600', '/api/placeholder/400/600'],
    likes: 234,
    comments: 45,
    shares: 12,
    bookmarks: 67,
    tags: ['vintage', 'blazer', 'ootd'],
    location: 'Westlands, Nairobi',
    createdAt: '2024-01-20T10:30:00Z',
    isLiked: false,
    isBookmarked: false
  },
  {
    id: 2,
    type: 'threadboard',
    user: mockUsers[1],
    title: 'Authentic Vintage Leather Jacket',
    content: 'Genuine leather jacket from the 80s. Perfect condition, barely worn. Size M fits true to size.',
    images: ['/api/placeholder/400/500', '/api/placeholder/400/500'],
    price: 3500,
    originalPrice: 5000,
    condition: 'excellent',
    category: 'outerwear',
    size: 'M',
    brand: 'Unknown Vintage',
    isNegotiable: true,
    shippingOptions: ['pickup', 'local'],
    likes: 89,
    comments: 23,
    tags: ['vintage', 'leather', 'jacket'],
    location: 'Kisumu, Kenya',
    createdAt: '2024-01-19T14:20:00Z',
    isLiked: false,
    isBookmarked: true,
    status: 'available' // available, sold, reserved
  }
]

// Authentication API
export const authAPI = {
  async login(credentials) {
    await delay(API_DELAY)
    
    if (shouldSimulateError()) {
      throw new Error('Login failed. Please try again.')
    }

    // Mock authentication logic
    if (credentials.email === 'demo@mnada.com' && credentials.password === 'demo123') {
      const user = {
        ...mockUsers[0],
        email: credentials.email,
        token: 'mock-jwt-token-' + Date.now()
      }
      
      localStorage.setItem('mnada_token', user.token)
      localStorage.setItem('mnada_user', JSON.stringify(user))
      
      return { user, token: user.token }
    }
    
    throw new Error('Invalid email or password')
  },

  async register(userData) {
    await delay(API_DELAY)
    
    if (shouldSimulateError()) {
      throw new Error('Registration failed. Please try again.')
    }

    // Check if user already exists
    if (userData.email === 'demo@mnada.com') {
      throw new Error('User with this email already exists')
    }

    const newUser = {
      id: Date.now(),
      username: userData.username,
      email: userData.email,
      name: userData.name,
      avatar: '/api/placeholder/80/80',
      bio: '',
      location: '',
      followers: 0,
      following: 0,
      posts: 0,
      verified: false,
      joinedDate: new Date().toISOString(),
      token: 'mock-jwt-token-' + Date.now()
    }

    localStorage.setItem('mnada_token', newUser.token)
    localStorage.setItem('mnada_user', JSON.stringify(newUser))

    return { user: newUser, token: newUser.token }
  },

  async logout() {
    await delay(200)
    localStorage.removeItem('mnada_token')
    localStorage.removeItem('mnada_user')
    return { success: true }
  },

  async getCurrentUser() {
    const token = localStorage.getItem('mnada_token')
    const userStr = localStorage.getItem('mnada_user')
    
    if (!token || !userStr) {
      return null
    }

    await delay(300)
    return JSON.parse(userStr)
  },

  async refreshToken() {
    await delay(API_DELAY)
    const newToken = 'mock-jwt-token-' + Date.now()
    localStorage.setItem('mnada_token', newToken)
    return { token: newToken }
  }
}

// Posts API
export const postsAPI = {
  async getFeed(page = 1, limit = 10, type = 'all') {
    await delay(API_DELAY)
    
    if (shouldSimulateError()) {
      throw new Error('Failed to load feed')
    }

    let filteredPosts = mockPosts
    if (type !== 'all') {
      filteredPosts = mockPosts.filter(post => post.type === type)
    }

    // Simulate pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

    return {
      posts: paginatedPosts,
      total: filteredPosts.length,
      page,
      totalPages: Math.ceil(filteredPosts.length / limit),
      hasMore: endIndex < filteredPosts.length
    }
  },

  async createPost(postData) {
    await delay(API_DELAY * 1.5)
    
    if (shouldSimulateError()) {
      throw new Error('Failed to create post')
    }

    const currentUser = await authAPI.getCurrentUser()
    if (!currentUser) {
      throw new Error('Authentication required')
    }

    const newPost = {
      id: Date.now(),
      ...postData,
      user: currentUser,
      likes: 0,
      comments: 0,
      shares: 0,
      bookmarks: 0,
      createdAt: new Date().toISOString(),
      isLiked: false,
      isBookmarked: false,
      status: 'available'
    }

    // Add to mock data (in real app, this would be saved to database)
    mockPosts.unshift(newPost)

    return newPost
  },

  async likePost(postId) {
    await delay(300)
    
    if (shouldSimulateError()) {
      throw new Error('Failed to like post')
    }

    // In real app, this would update the database
    const post = mockPosts.find(p => p.id === postId)
    if (post) {
      post.isLiked = !post.isLiked
      post.likes += post.isLiked ? 1 : -1
    }

    return { success: true, isLiked: post?.isLiked }
  },

  async bookmarkPost(postId) {
    await delay(300)
    
    const post = mockPosts.find(p => p.id === postId)
    if (post) {
      post.isBookmarked = !post.isBookmarked
      post.bookmarks += post.isBookmarked ? 1 : -1
    }

    return { success: true, isBookmarked: post?.isBookmarked }
  },

  async getComments(postId, page = 1, limit = 20) {
    await delay(API_DELAY)
    
    // Mock comments
    const mockComments = [
      {
        id: 1,
        user: mockUsers[1],
        content: 'Love this look! Where did you get that blazer?',
        createdAt: '2024-01-20T11:15:00Z',
        likes: 5,
        isLiked: false
      },
      {
        id: 2,
        user: mockUsers[0],
        content: 'Thank you! Found it at Gikomba market 😊',
        createdAt: '2024-01-20T11:30:00Z',
        likes: 2,
        isLiked: false
      }
    ]

    return {
      comments: mockComments,
      total: mockComments.length,
      page,
      hasMore: false
    }
  }
}

// Search API
export const searchAPI = {
  async search(query, filters = {}, page = 1, limit = 20) {
    await delay(API_DELAY)
    
    if (shouldSimulateError()) {
      throw new Error('Search failed')
    }

    // Mock search results
    const results = {
      posts: mockPosts.filter(post => 
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.title?.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ),
      users: mockUsers.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      ),
      total: 0
    }

    results.total = results.posts.length + results.users.length

    return {
      ...results,
      query,
      page,
      hasMore: false
    }
  },

  async getTrending() {
    await delay(500)
    
    return {
      hashtags: ['vintage', 'ootd', 'thrifted', 'sustainable', 'kenyanfashion'],
      users: mockUsers.slice(0, 3),
      posts: mockPosts.slice(0, 5)
    }
  }
}

// User API
export const userAPI = {
  async getProfile(username) {
    await delay(API_DELAY)
    
    const user = mockUsers.find(u => u.username === username)
    if (!user) {
      throw new Error('User not found')
    }

    return user
  },

  async updateProfile(updateData) {
    await delay(API_DELAY)
    
    if (shouldSimulateError()) {
      throw new Error('Failed to update profile')
    }

    const currentUser = await authAPI.getCurrentUser()
    const updatedUser = { ...currentUser, ...updateData }
    
    localStorage.setItem('mnada_user', JSON.stringify(updatedUser))
    
    return updatedUser
  },

  async followUser(userId) {
    await delay(500)
    
    // Mock follow logic
    const user = mockUsers.find(u => u.id === userId)
    if (user) {
      user.followers += 1
    }

    return { success: true, isFollowing: true }
  },

  async unfollowUser(userId) {
    await delay(500)
    
    const user = mockUsers.find(u => u.id === userId)
    if (user) {
      user.followers -= 1
    }

    return { success: true, isFollowing: false }
  }
}

// Upload API
export const uploadAPI = {
  async uploadImage(file) {
    await delay(API_DELAY)
    
    if (shouldSimulateError()) {
      throw new Error('Upload failed')
    }

    // Simulate cloud upload
    const mockUrl = `/api/placeholder/${Math.floor(Math.random() * 500) + 200}/${Math.floor(Math.random() * 500) + 200}`
    
    return {
      url: mockUrl,
      publicId: 'mock-public-id-' + Date.now(),
      size: file.size,
      format: file.type.split('/')[1]
    }
  },

  async uploadMultipleImages(files) {
    await delay(API_DELAY * 1.5)
    
    const uploads = []
    for (const file of files) {
      const result = await this.uploadImage(file)
      uploads.push(result)
    }
    
    return uploads
  }
}

// Museum API
export const museumAPI = {
  async getPieces(category = 'all', page = 1, limit = 12) {
    await delay(API_DELAY)
    
    // Mock museum pieces (would come from database)
    const pieces = [
      {
        id: 1,
        title: 'Traditional Kikuyu Wedding Dress',
        era: '1960s',
        category: 'traditional',
        story: 'This beautiful wedding dress was worn by Mama Grace Wanjiku...',
        images: ['/api/placeholder/400/500'],
        donor: 'Grace Wanjiku Family',
        verified: true,
        likes: 234
      }
    ]

    return {
      pieces: category === 'all' ? pieces : pieces.filter(p => p.category === category),
      total: pieces.length,
      page,
      hasMore: false
    }
  },

  async submitDonation(donationData) {
    await delay(API_DELAY * 2)
    
    if (shouldSimulateError()) {
      throw new Error('Failed to submit donation')
    }

    return {
      id: Date.now(),
      ...donationData,
      status: 'pending_review',
      submittedAt: new Date().toISOString()
    }
  }
}

// Messaging API
export const messagingAPI = {
  async getConversations() {
    await delay(API_DELAY)
    
    const conversations = [
      {
        id: 1,
        user: mockUsers[1],
        lastMessage: {
          content: 'Hi! Is this jacket still available?',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          senderId: mockUsers[1].id
        },
        unreadCount: 2
      }
    ]

    return conversations
  },

  async getMessages(conversationId, page = 1, limit = 50) {
    await delay(API_DELAY)
    
    const messages = [
      {
        id: 1,
        content: 'Hi! Is this jacket still available?',
        senderId: mockUsers[1].id,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: 'read'
      }
    ]

    return {
      messages,
      total: messages.length,
      hasMore: false
    }
  },

  async sendMessage(conversationId, content, type = 'text') {
    await delay(500)
    
    const message = {
      id: Date.now(),
      content,
      senderId: 1, // Current user
      timestamp: new Date(),
      status: 'sending',
      type
    }

    // Simulate message delivery
    setTimeout(() => {
      message.status = 'delivered'
    }, 1000)

    return message
  }
}

// Export all APIs
const API = {
  auth: authAPI,
  posts: postsAPI,
  search: searchAPI,
  user: userAPI,
  upload: uploadAPI,
  museum: museumAPI,
  messaging: messagingAPI
}

export default API
