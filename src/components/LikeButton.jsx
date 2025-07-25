import React, { useState, useEffect } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import API from '../services/api'

const LikeButton = ({ 
  postId,
  initialLikes = 0,
  initialIsLiked = false,
  size = 20,
  showCount = true,
  className = '',
  onLikeChange = () => {}
}) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likesCount, setLikesCount] = useState(initialLikes)
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Sync with prop changes
  useEffect(() => {
    setIsLiked(initialIsLiked)
    setLikesCount(initialLikes)
  }, [initialIsLiked, initialLikes])

  const handleLikeToggle = async () => {
    if (isLoading) return

    // Optimistic update
    const newIsLiked = !isLiked
    const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1
    
    setIsLiked(newIsLiked)
    setLikesCount(newLikesCount)
    setIsAnimating(true)
    setIsLoading(true)

    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300)

    try {
      let response
      if (newIsLiked) {
        response = await API.social.likePost(postId)
      } else {
        response = await API.social.unlikePost(postId)
      }

      // Update with server response
      setIsLiked(response.isLiked)
      setLikesCount(response.likesCount)
      onLikeChange(response.isLiked, response.likesCount, postId)

    } catch (error) {
      console.error('Failed to toggle like:', error)
      
      // Revert optimistic update on error
      setIsLiked(!newIsLiked)
      setLikesCount(newIsLiked ? likesCount - 1 : likesCount + 1)
    } finally {
      setIsLoading(false)
    }
  }

  const formatLikesCount = (count) => {
    if (count < 1000) return count.toString()
    if (count < 1000000) return `${(count / 1000).toFixed(1)}k`
    return `${(count / 1000000).toFixed(1)}m`
  }

  return (
    <button
      onClick={handleLikeToggle}
      disabled={isLoading}
      className={`
        flex items-center space-x-2 transition-all duration-200
        ${isLiked 
          ? 'text-red-500' 
          : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-red-500'
        }
        disabled:cursor-not-allowed
        ${className}
      `}
      aria-label={isLiked ? 'Unlike post' : 'Like post'}
    >
      <div className="relative">
        {isLoading && (
          <Loader2 
            size={size} 
            className="absolute inset-0 animate-spin text-light-text-secondary dark:text-dark-text-secondary" 
          />
        )}
        <Heart 
          size={size} 
          className={`
            transition-all duration-200
            ${isLiked ? 'fill-current scale-110' : ''}
            ${isAnimating ? 'animate-pulse scale-125' : ''}
            ${isLoading ? 'opacity-0' : 'opacity-100'}
          `}
        />
      </div>
      
      {showCount && (
        <span className={`
          text-sm font-medium transition-all duration-200
          ${isAnimating ? 'scale-110' : ''}
        `}>
          {formatLikesCount(likesCount)}
        </span>
      )}
    </button>
  )
}

export default LikeButton
