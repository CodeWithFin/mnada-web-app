import React, { useState, useEffect } from 'react'
import { MessageCircle, Send, Heart, Loader2, User } from 'lucide-react'
import API from '../services/api'
import LikeButton from './LikeButton'
import UserMention from './UserMention'

const CommentsSection = ({ 
  postId, 
  initialCommentCount = 0,
  className = ''
}) => {
  const [comments, setComments] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [commentCount, setCommentCount] = useState(initialCommentCount)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  // Load comments when section is opened
  useEffect(() => {
    if (isOpen && comments.length === 0) {
      loadComments()
    }
  }, [isOpen])

  const loadComments = async (pageNum = 1) => {
    setIsLoading(true)
    
    try {
      const response = await API.social.getComments(postId, pageNum)
      
      if (pageNum === 1) {
        setComments(response.comments)
      } else {
        setComments(prev => [...prev, ...response.comments])
      }
      
      setHasMore(response.hasMore)
      setPage(pageNum)
      setCommentCount(response.total)
    } catch (error) {
      console.error('Failed to load comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      // Extract mentions from comment
      const mentionRegex = /@(\w+)/g
      const mentions = []
      let match
      while ((match = mentionRegex.exec(newComment)) !== null) {
        mentions.push(match[1])
      }

      const comment = await API.social.addComment(postId, newComment, mentions)
      
      // Add new comment to the top of the list
      setComments(prev => [comment, ...prev])
      setCommentCount(prev => prev + 1)
      setNewComment('')
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAddComment()
    }
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const commentTime = new Date(timestamp)
    const diffMs = now - commentTime
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'now'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    return `${diffDays}d`
  }

  const CommentItem = ({ comment }) => (
    <div className="flex space-x-3 p-3 hover:bg-light-surface/50 dark:hover:bg-dark-surface/50 transition-colors">
      <div className="w-8 h-8 bg-gradient-to-br from-brand-orange-light to-brand-blue-light rounded-full flex items-center justify-center flex-shrink-0">
        {comment.avatar ? (
          <img 
            src={comment.avatar} 
            alt={comment.username}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <User size={14} className="text-white" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-light-text-primary dark:text-dark-text-primary text-sm">
            {comment.username}
          </span>
          <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            {formatTimeAgo(comment.timestamp)}
          </span>
        </div>
        
        <div className="text-sm text-light-text-primary dark:text-dark-text-primary mb-2">
          {comment.content}
        </div>
        
        <div className="flex items-center space-x-4">
          <LikeButton
            postId={`comment-${comment.id}`}
            initialLikes={comment.likes}
            initialIsLiked={comment.isLiked}
            size={14}
            showCount={comment.likes > 0}
          />
          <button className="text-xs text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors">
            Reply
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className={className}>
      {/* Comments Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
      >
        <MessageCircle size={20} />
        <span className="text-sm font-medium">{commentCount}</span>
      </button>

      {/* Comments Panel */}
      {isOpen && (
        <div className="mt-4 border-t border-light-border dark:border-dark-border">
          {/* Add Comment Form */}
          <div className="p-4 border-b border-light-border dark:border-dark-border">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-orange-light to-brand-blue-light rounded-full flex items-center justify-center flex-shrink-0">
                <User size={14} className="text-white" />
              </div>
              
              <div className="flex-1">
                <UserMention
                  value={newComment}
                  onChange={setNewComment}
                  placeholder="Add a comment..."
                  className="min-h-[80px]"
                />
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                    Press Enter to post, Shift+Enter for new line
                  </span>
                  
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isSubmitting}
                    className="flex items-center space-x-2 px-4 py-2 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-apple font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading && comments.length === 0 ? (
              <div className="p-8 text-center">
                <Loader2 size={24} className="animate-spin mx-auto text-light-text-secondary dark:text-dark-text-secondary" />
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2">
                  Loading comments...
                </p>
              </div>
            ) : comments.length > 0 ? (
              <>
                {comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
                
                {/* Load More Button */}
                {hasMore && (
                  <div className="p-4 text-center border-t border-light-border dark:border-dark-border">
                    <button
                      onClick={() => loadComments(page + 1)}
                      disabled={isLoading}
                      className="text-sm text-brand-orange-light dark:text-brand-orange-dark hover:underline disabled:opacity-50"
                    >
                      {isLoading ? 'Loading...' : 'Load more comments'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center">
                <MessageCircle size={32} className="mx-auto text-light-text-secondary dark:text-dark-text-secondary mb-2" />
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CommentsSection
