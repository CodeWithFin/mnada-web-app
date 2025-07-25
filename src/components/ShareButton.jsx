import React, { useState, useRef, useEffect } from 'react'
import { Share, Copy, Twitter, Facebook, Instagram, Check, Loader2 } from 'lucide-react'
import API from '../services/api'

const ShareButton = ({ 
  postId,
  postTitle = '',
  size = 20,
  showText = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleShare = async (platform) => {
    setIsLoading(true)
    
    try {
      const response = await API.social.sharePost(postId, platform)
      
      if (platform === 'copy') {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        // Open share URL in new window for social platforms
        const shareUrls = {
          twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(response.shareUrl)}&text=${encodeURIComponent(postTitle)}`,
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(response.shareUrl)}`,
          instagram: response.shareUrl // Instagram doesn't support direct URL sharing
        }
        
        if (shareUrls[platform]) {
          window.open(shareUrls[platform], '_blank', 'width=600,height=400')
        }
      }
      
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to share post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const shareOptions = [
    {
      id: 'copy',
      label: 'Copy Link',
      icon: copied ? Check : Copy,
      className: copied ? 'text-green-500' : 'text-light-text-primary dark:text-dark-text-primary'
    },
    {
      id: 'twitter',
      label: 'Twitter',
      icon: Twitter,
      className: 'text-blue-400'
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      className: 'text-blue-600'
    },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      className: 'text-pink-500'
    }
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`
          flex items-center space-x-2 transition-colors
          text-light-text-secondary dark:text-dark-text-secondary 
          hover:text-light-text-primary dark:hover:text-dark-text-primary
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        aria-label="Share post"
      >
        {isLoading ? (
          <Loader2 size={size} className="animate-spin" />
        ) : (
          <Share size={size} />
        )}
        {showText && (
          <span className="text-sm font-medium">Share</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-light-card dark:bg-dark-card rounded-apple-lg border border-light-border dark:border-dark-border shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2 px-2">
              Share this post
            </div>
            
            {shareOptions.map((option) => {
              const IconComponent = option.icon
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleShare(option.id)}
                  disabled={isLoading}
                  className="w-full flex items-center space-x-3 px-2 py-2 text-sm rounded-apple hover:bg-light-surface dark:hover:bg-dark-surface transition-colors disabled:opacity-50"
                >
                  <IconComponent size={16} className={option.className} />
                  <span className="text-light-text-primary dark:text-dark-text-primary">
                    {option.label}
                  </span>
                  {option.id === 'copy' && copied && (
                    <span className="text-xs text-green-500 ml-auto">Copied!</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ShareButton
