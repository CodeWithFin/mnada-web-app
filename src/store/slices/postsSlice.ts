import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Post {
  id: string
  userId: string
  images: string[]
  caption: string
  hashtags: string[]
  category: 'casual' | 'formal' | 'street' | 'vintage' | 'traditional' | 'other'
  location?: string
  likesCount: number
  commentsCount: number
  isLiked: boolean
  isSaved: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: string
    username: string
    fullName: string
    profileImage?: string
    verificationStatus: string
  }
}

export interface Comment {
  id: string
  userId: string
  postId: string
  content: string
  createdAt: string
  user: {
    id: string
    username: string
    fullName: string
    profileImage?: string
  }
}

interface PostsState {
  feed: Post[]
  userPosts: Post[]
  savedPosts: Post[]
  currentPost: Post | null
  comments: { [postId: string]: Comment[] }
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  error: string | null
}

const initialState: PostsState = {
  feed: [],
  userPosts: [],
  savedPosts: [],
  currentPost: null,
  comments: {},
  isLoading: false,
  isLoadingMore: false,
  hasMore: true,
  error: null,
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setLoadingMore: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMore = action.payload
    },
    setFeed: (state, action: PayloadAction<Post[]>) => {
      state.feed = action.payload
      state.hasMore = action.payload.length === 20 // Assuming page size of 20
    },
    appendToFeed: (state, action: PayloadAction<Post[]>) => {
      state.feed.push(...action.payload)
      state.hasMore = action.payload.length === 20
    },
    setUserPosts: (state, action: PayloadAction<Post[]>) => {
      state.userPosts = action.payload
    },
    setSavedPosts: (state, action: PayloadAction<Post[]>) => {
      state.savedPosts = action.payload
    },
    setCurrentPost: (state, action: PayloadAction<Post | null>) => {
      state.currentPost = action.payload
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.feed.unshift(action.payload)
      state.userPosts.unshift(action.payload)
    },
    updatePost: (state, action: PayloadAction<{ id: string; updates: Partial<Post> }>) => {
      const updatePostInArray = (posts: Post[]) => {
        const index = posts.findIndex(post => post.id === action.payload.id)
        if (index !== -1) {
          posts[index] = { ...posts[index], ...action.payload.updates }
        }
      }
      
      updatePostInArray(state.feed)
      updatePostInArray(state.userPosts)
      updatePostInArray(state.savedPosts)
      
      if (state.currentPost?.id === action.payload.id) {
        state.currentPost = { ...state.currentPost, ...action.payload.updates }
      }
    },
    toggleLike: (state, action: PayloadAction<string>) => {
      const toggleLikeInArray = (posts: Post[]) => {
        const post = posts.find(p => p.id === action.payload)
        if (post) {
          post.isLiked = !post.isLiked
          post.likesCount += post.isLiked ? 1 : -1
        }
      }
      
      toggleLikeInArray(state.feed)
      toggleLikeInArray(state.userPosts)
      toggleLikeInArray(state.savedPosts)
      
      if (state.currentPost?.id === action.payload) {
        state.currentPost.isLiked = !state.currentPost.isLiked
        state.currentPost.likesCount += state.currentPost.isLiked ? 1 : -1
      }
    },
    toggleSave: (state, action: PayloadAction<string>) => {
      const toggleSaveInArray = (posts: Post[]) => {
        const post = posts.find(p => p.id === action.payload)
        if (post) {
          post.isSaved = !post.isSaved
        }
      }
      
      toggleSaveInArray(state.feed)
      toggleSaveInArray(state.userPosts)
      
      if (state.currentPost?.id === action.payload) {
        state.currentPost.isSaved = !state.currentPost.isSaved
      }
    },
    setComments: (state, action: PayloadAction<{ postId: string; comments: Comment[] }>) => {
      state.comments[action.payload.postId] = action.payload.comments
    },
    addComment: (state, action: PayloadAction<Comment>) => {
      const postId = action.payload.postId
      if (!state.comments[postId]) {
        state.comments[postId] = []
      }
      state.comments[postId].unshift(action.payload)
      
      // Update comments count in posts
      const updateCommentsCount = (posts: Post[]) => {
        const post = posts.find(p => p.id === postId)
        if (post) {
          post.commentsCount += 1
        }
      }
      
      updateCommentsCount(state.feed)
      updateCommentsCount(state.userPosts)
      updateCommentsCount(state.savedPosts)
      
      if (state.currentPost?.id === postId) {
        state.currentPost.commentsCount += 1
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setLoading,
  setLoadingMore,
  setFeed,
  appendToFeed,
  setUserPosts,
  setSavedPosts,
  setCurrentPost,
  addPost,
  updatePost,
  toggleLike,
  toggleSave,
  setComments,
  addComment,
  setError,
  clearError,
} = postsSlice.actions

export default postsSlice.reducer
