import React, { useState, useEffect } from 'react'
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react'
import API from '../services/api'

const SaveButton = ({ 
  postId, 
  size = 16,
  showText = false,
  className = '',
  onSaveChange = () => {}
}) => {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check if post is already saved
  useEffect(() => {
    const checkSaveStatus = () => {
      const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]')
      setIsSaved(savedPosts.includes(postId))
    }

    checkSaveStatus()
  }, [postId])

  const handleSaveToggle = async () => {
    setIsLoading(true)
    
    try {
      let response
      if (isSaved) {
        response = await API.social.unsavePost(postId)
      } else {
        response = await API.social.savePost(postId)
      }

      setIsSaved(response.isSaved)
      onSaveChange(response.isSaved, postId)

      // Show success message (you could integrate with toast system)
      console.log(response.message)
    } catch (error) {
      console.error('Failed to toggle save:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSaveToggle}
      disabled={isLoading}
      className={`
        flex items-center space-x-2 transition-colors
        ${isSaved 
          ? 'text-brand-orange-light dark:text-brand-orange-dark' 
          : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-brand-orange-light dark:hover:text-brand-orange-dark'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      aria-label={isSaved ? 'Remove from saved' : 'Save post'}
    >
      {isLoading ? (
        <Loader2 size={size} className="animate-spin" />
      ) : (
        <>
          {isSaved ? (
            <BookmarkCheck size={size} className="fill-current" />
          ) : (
            <Bookmark size={size} />
          )}
          {showText && (
            <span className="text-sm font-medium">
              {isSaved ? 'Saved' : 'Save'}
            </span>
          )}
        </>
      )}
    </button>
  )
}

export default SaveButton
