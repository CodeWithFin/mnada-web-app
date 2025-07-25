import React, { useState, useEffect } from 'react'
import { UserPlus, UserMinus, Loader2 } from 'lucide-react'
import API from '../services/api'

const FollowButton = ({ 
  userId, 
  username,
  variant = 'primary', // 'primary', 'secondary', 'minimal'
  size = 'default', // 'small', 'default', 'large'
  showIcon = true,
  className = '',
  onFollowChange = () => {}
}) => {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Load initial follow status
  useEffect(() => {
    const loadFollowStatus = async () => {
      try {
        const response = await API.social.getFollowStatus(userId)
        setIsFollowing(response.isFollowing)
      } catch (error) {
        console.error('Failed to load follow status:', error)
      } finally {
        setInitialLoading(false)
      }
    }

    if (userId) {
      loadFollowStatus()
    }
  }, [userId])

  const handleFollowToggle = async () => {
    setIsLoading(true)
    
    try {
      let response
      if (isFollowing) {
        response = await API.social.unfollowUser(userId)
      } else {
        response = await API.social.followUser(userId)
      }

      setIsFollowing(response.isFollowing)
      onFollowChange(response.isFollowing, userId)

      // Show success message
      if (response.message) {
        // You could integrate with a toast system here
        console.log(response.message)
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error)
      // You could show an error toast here
    } finally {
      setIsLoading(false)
    }
  }

  // Size variants
  const sizeClasses = {
    small: 'px-3 py-1.5 text-xs',
    default: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  }

  const iconSizes = {
    small: 14,
    default: 16,
    large: 18
  }

  // Style variants
  const getVariantClasses = () => {
    if (isFollowing) {
      // Following state styles
      switch (variant) {
        case 'primary':
          return 'bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary border border-light-border dark:border-dark-border hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800'
        case 'secondary':
          return 'bg-transparent text-light-text-secondary dark:text-dark-text-secondary border border-light-border dark:border-dark-border hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400'
        case 'minimal':
          return 'bg-transparent text-light-text-secondary dark:text-dark-text-secondary hover:text-red-600 dark:hover:text-red-400'
        default:
          return 'bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary'
      }
    } else {
      // Not following state styles
      switch (variant) {
        case 'primary':
          return 'bg-brand-orange-light dark:bg-brand-orange-dark text-white hover:opacity-90'
        case 'secondary':
          return 'bg-transparent text-brand-orange-light dark:text-brand-orange-dark border border-brand-orange-light dark:border-brand-orange-dark hover:bg-brand-orange-light/10 dark:hover:bg-brand-orange-dark/10'
        case 'minimal':
          return 'bg-transparent text-brand-orange-light dark:text-brand-orange-dark hover:bg-brand-orange-light/10 dark:hover:bg-brand-orange-dark/10'
        default:
          return 'bg-brand-orange-light dark:bg-brand-orange-dark text-white'
      }
    }
  }

  // Show loading skeleton during initial load
  if (initialLoading) {
    return (
      <div className={`${sizeClasses[size]} bg-light-surface dark:bg-dark-surface rounded-apple animate-pulse ${className}`}>
        <div className="w-16 h-4 bg-light-border dark:bg-dark-border rounded"></div>
      </div>
    )
  }

  return (
    <button
      onClick={handleFollowToggle}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        ${getVariantClasses()}
        rounded-apple font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center space-x-2
        btn-hover
        ${className}
      `}
      aria-label={isFollowing ? `Unfollow ${username}` : `Follow ${username}`}
    >
      {isLoading ? (
        <Loader2 size={iconSizes[size]} className="animate-spin" />
      ) : (
        <>
          {showIcon && (
            <span className="flex-shrink-0">
              {isFollowing ? (
                <UserMinus size={iconSizes[size]} />
              ) : (
                <UserPlus size={iconSizes[size]} />
              )}
            </span>
          )}
          <span className="hidden sm:inline">
            {isFollowing ? 'Following' : 'Follow'}
          </span>
          <span className="sm:hidden">
            {isFollowing ? 'Following' : 'Follow'}
          </span>
        </>
      )}
    </button>
  )
}

export default FollowButton
