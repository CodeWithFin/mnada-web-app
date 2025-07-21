import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  searchModalOpen: boolean
  createPostModalOpen: boolean
  createProductModalOpen: boolean
  profileModalOpen: boolean
  currentModal: string | null
  notifications: Notification[]
  toast: {
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
    show: boolean
  }
}

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'product_inquiry'
  title: string
  message: string
  read: boolean
  createdAt: string
  data?: any
}

const initialState: UIState = {
  sidebarOpen: false,
  mobileMenuOpen: false,
  searchModalOpen: false,
  createPostModalOpen: false,
  createProductModalOpen: false,
  profileModalOpen: false,
  currentModal: null,
  notifications: [],
  toast: {
    message: '',
    type: 'info',
    show: false,
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.currentModal = action.payload
      switch (action.payload) {
        case 'search':
          state.searchModalOpen = true
          break
        case 'createPost':
          state.createPostModalOpen = true
          break
        case 'createProduct':
          state.createProductModalOpen = true
          break
        case 'profile':
          state.profileModalOpen = true
          break
      }
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.currentModal = null
      switch (action.payload) {
        case 'search':
          state.searchModalOpen = false
          break
        case 'createPost':
          state.createPostModalOpen = false
          break
        case 'createProduct':
          state.createProductModalOpen = false
          break
        case 'profile':
          state.profileModalOpen = false
          break
      }
    },
    closeAllModals: (state) => {
      state.currentModal = null
      state.searchModalOpen = false
      state.createPostModalOpen = false
      state.createProductModalOpen = false
      state.profileModalOpen = false
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload)
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true
      })
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    showToast: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' | 'warning' }>) => {
      state.toast = {
        ...action.payload,
        show: true,
      }
    },
    hideToast: (state) => {
      state.toast.show = false
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  openModal,
  closeModal,
  closeAllModals,
  setNotifications,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  showToast,
  hideToast,
} = uiSlice.actions

export default uiSlice.reducer
