import React, { useState, useEffect, useRef } from 'react'
import { Search, User } from 'lucide-react'
import API from '../services/api'

const UserMention = ({ 
  value, 
  onChange, 
  placeholder = "What's on your mind?",
  className = '',
  maxHeight = '120px'
}) => {
  const [text, setText] = useState(value || '')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  
  const textareaRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Sync with external value changes
  useEffect(() => {
    if (value !== text) {
      setText(value || '')
    }
  }, [value])

  // Handle text changes and detect mentions
  const handleTextChange = (e) => {
    const newText = e.target.value
    const cursorPos = e.target.selectionStart
    
    setText(newText)
    setCursorPosition(cursorPos)
    onChange?.(newText)

    // Check for mention trigger (@)
    const textBeforeCursor = newText.slice(0, cursorPos)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/)
    
    if (mentionMatch) {
      const query = mentionMatch[1]
      setMentionQuery(query)
      searchUsers(query)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
      setSuggestions([])
    }
  }

  // Search for users to mention
  const searchUsers = async (query) => {
    if (query.length < 1) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    
    try {
      const response = await API.social.searchUsers(query)
      setSuggestions(response.users)
    } catch (error) {
      console.error('Failed to search users:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  // Insert mention into text
  const insertMention = (user) => {
    const textBeforeCursor = text.slice(0, cursorPosition)
    const textAfterCursor = text.slice(cursorPosition)
    
    // Replace the partial mention with the full username
    const mentionText = `@${user.username} `
    const newTextBefore = textBeforeCursor.replace(/@\w*$/, mentionText)
    const newText = newTextBefore + textAfterCursor
    
    setText(newText)
    onChange?.(newText)
    setShowSuggestions(false)
    
    // Focus back to textarea and set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        const newCursorPos = newTextBefore.length
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
      }
    }, 0)
  }

  // Handle keyboard navigation in suggestions
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
    // You could add arrow key navigation here
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        !textareaRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSuggestions])

  // Render text with highlighted mentions
  const renderTextWithMentions = (text) => {
    const mentionRegex = /@(\w+)/g
    const parts = text.split(mentionRegex)
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is a username part
        return (
          <span 
            key={index} 
            className="text-brand-orange-light dark:text-brand-orange-dark font-medium"
          >
            @{part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <div className="relative">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            w-full p-3 border border-light-border dark:border-dark-border 
            rounded-apple-lg bg-light-surface dark:bg-dark-surface
            text-light-text-primary dark:text-dark-text-primary
            placeholder-light-text-secondary dark:placeholder-dark-text-secondary
            focus:outline-none focus:ring-2 focus:ring-brand-orange-light/20 dark:focus:ring-brand-orange-dark/20
            focus:border-brand-orange-light dark:focus:border-brand-orange-dark
            resize-none transition-colors
            ${className}
          `}
          style={{ maxHeight }}
          rows={3}
        />
      </div>

      {/* Mention Suggestions */}
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-light-card dark:bg-dark-card rounded-apple-lg border border-light-border dark:border-dark-border shadow-lg max-h-48 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-3 text-center">
              <Search size={16} className="animate-spin mx-auto text-light-text-secondary dark:text-dark-text-secondary" />
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
                Searching...
              </span>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="p-1">
              {suggestions.map((user) => (
                <button
                  key={user.id}
                  onClick={() => insertMention(user)}
                  className="w-full flex items-center space-x-3 p-2 hover:bg-light-surface dark:hover:bg-dark-surface rounded-apple transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-orange-light to-brand-blue-light rounded-full flex items-center justify-center flex-shrink-0">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User size={14} className="text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center space-x-1">
                      <span className="font-medium text-light-text-primary dark:text-dark-text-primary text-sm">
                        @{user.username}
                      </span>
                      {user.verified && (
                        <div className="w-3 h-3 bg-brand-blue-light dark:bg-brand-blue-dark rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      {user.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : mentionQuery && (
            <div className="p-3 text-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
              No users found for "{mentionQuery}"
            </div>
          )}
        </div>
      )}
      
      {/* Helper text */}
      <div className="mt-1 text-xs text-light-text-secondary dark:text-dark-text-secondary">
        Type @ to mention users
      </div>
    </div>
  )
}

export default UserMention
