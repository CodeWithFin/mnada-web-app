import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Bell, Menu, X, Sun, Moon, User } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'SnapFit', href: '/snapfit' },
    { name: 'ThreadBoard', href: '/threadboard' },
  ]

  const isActiveRoute = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-light-background/80 dark:bg-dark-background/80 backdrop-blur-md border-b border-light-border dark:border-dark-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 font-bold text-xl text-brand-orange-light dark:text-brand-orange-dark"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-brand-orange-light to-brand-orange-dark rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span>Mnada</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActiveRoute(item.href)
                    ? 'text-brand-orange-light dark:text-brand-orange-dark'
                    : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search - Desktop only */}
            <button className="hidden md:flex p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors">
              <Search size={20} />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Notifications - Authenticated users only */}
            {isAuthenticated && (
              <button className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-orange-light dark:bg-brand-orange-dark rounded-full"></span>
              </button>
            )}

            {/* User menu or auth buttons */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-orange-light to-brand-blue-light rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 py-2 bg-light-card dark:bg-dark-card rounded-apple shadow-lg border border-light-border dark:border-dark-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to={`/profile/${user?.username}`}
                    className="block px-4 py-2 text-sm text-light-text-primary dark:text-dark-text-primary hover:bg-light-surface dark:hover:bg-dark-surface"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-light-text-primary dark:text-dark-text-primary hover:bg-light-surface dark:hover:bg-dark-surface"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-apple text-sm font-medium hover:opacity-90 transition-opacity btn-hover"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-light-border dark:border-dark-border">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-base font-medium ${
                    isActiveRoute(item.href)
                      ? 'text-brand-orange-light dark:text-brand-orange-dark'
                      : 'text-light-text-secondary dark:text-dark-text-secondary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-light-border dark:border-dark-border">
                  <Link
                    to="/login"
                    className="text-base font-medium text-light-text-secondary dark:text-dark-text-secondary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-apple text-base font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
