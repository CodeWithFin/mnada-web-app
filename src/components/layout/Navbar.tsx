import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Search, Menu, Bell, Sun, Moon, User } from 'lucide-react'
import { RootState } from '../../store/store'
import { toggleMobileMenu, openModal } from '../../store/slices/uiSlice'
import { useTheme } from '../../contexts/ThemeContext'

const Navbar: React.FC = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const { theme, toggleTheme } = useTheme()
  const { user } = useSelector((state: RootState) => state.auth)
  const { notifications } = useSelector((state: RootState) => state.ui)
  
  const unreadCount = notifications.filter(n => !n.read).length

  const handleSearchClick = () => {
    dispatch(openModal('search'))
  }

  const handleMenuClick = () => {
    dispatch(toggleMobileMenu())
  }

  const handleNotificationsClick = () => {
    // Open notifications panel
  }

  const handleProfileClick = () => {
    dispatch(openModal('profile'))
  }

  return (
    <nav className="bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={handleMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
            
            {/* Logo */}
            <Link to="/app/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="hidden sm:block text-xl font-bold text-gradient">
                Mnada
              </span>
            </Link>
          </div>

          {/* Center - Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <button
              onClick={handleSearchClick}
              className="w-full flex items-center space-x-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Search className="h-5 w-5 text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">
                Search posts, products, users...
              </span>
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Search button (mobile) */}
            <button
              onClick={handleSearchClick}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Search className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* Notifications */}
            <button
              onClick={handleNotificationsClick}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.fullName}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.username || 'User'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
