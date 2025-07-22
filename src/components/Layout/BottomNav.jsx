import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Camera, ShoppingBag, User, MessageCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const BottomNav = () => {
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'SnapFit', href: '/snapfit', icon: Camera },
    { name: 'ThreadBoard', href: '/threadboard', icon: ShoppingBag },
    { name: 'Messages', href: '/messages', icon: MessageCircle },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const isActiveRoute = (path) => {
    if (path === '/profile') {
      return location.pathname.startsWith('/profile')
    }
    return location.pathname === path
  }

  // Hide on desktop and when not authenticated (except for main pages)
  const shouldShow = window.innerWidth < 768 || !isAuthenticated

  if (!shouldShow && !['/', '/snapfit', '/threadboard'].includes(location.pathname)) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-light-background/90 dark:bg-dark-background/90 backdrop-blur-md border-t border-light-border dark:border-dark-border">
      <div className="flex items-center justify-around py-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = isActiveRoute(item.href)
          
          // Don't show profile for unauthenticated users
          if (item.name === 'Profile' && !isAuthenticated) {
            return null
          }

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-brand-orange-light dark:text-brand-orange-dark'
                  : 'text-light-text-secondary dark:text-dark-text-secondary'
              }`}
            >
              <Icon 
                size={20} 
                className={`mb-1 ${isActive ? 'text-brand-orange-light dark:text-brand-orange-dark' : ''}`}
              />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
