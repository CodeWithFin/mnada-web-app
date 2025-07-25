import React, { useState, useEffect } from 'react'
import { Bookmark, Grid, Heart, MessageCircle, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import API from '../services/api'

const SavedPosts = () => {
  const { isAuthenticated } = useAuth()
  const [savedPosts, setSavedPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      loadSavedPosts()
    }
  }, [isAuthenticated])

  const loadSavedPosts = async (pageNum = 1) => {
    setIsLoading(true)
    
    try {
      const response = await API.social.getSavedPosts(pageNum)
      
      if (pageNum === 1) {
        setSavedPosts(response.posts)
      } else {
        setSavedPosts(prev => [...prev, ...response.posts])
      }
      
      setHasMore(response.hasMore)
      setPage(pageNum)
    } catch (error) {
      console.error('Failed to load saved posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Bookmark size={64} className="mx-auto mb-4 text-light-text-secondary dark:text-dark-text-secondary" />
        <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          Sign in to view saved posts
        </h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
          Save your favorite fashion posts to view them later
        </p>
        <Link
          to="/login"
          className="px-6 py-3 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-apple font-medium hover:opacity-90 transition-opacity btn-hover"
        >
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Bookmark size={24} className="text-brand-orange-light dark:text-brand-orange-dark" />
          <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
            Saved Posts
          </h1>
        </div>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Your collection of saved fashion inspiration
        </p>
      </div>

      {/* Loading State */}
      {isLoading && savedPosts.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-light-surface dark:bg-dark-surface rounded-apple-lg animate-pulse" />
          ))}
        </div>
      ) : savedPosts.length > 0 ? (
        <>
          {/* Posts Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {savedPosts.map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="group relative aspect-[4/5] bg-light-surface dark:bg-dark-surface rounded-apple-lg overflow-hidden hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={post.images[0]}
                  alt="Saved post"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay with engagement stats */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center space-x-4 text-white">
                    <div className="flex items-center space-x-1">
                      <Heart size={16} className="fill-current" />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle size={16} />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </div>
                  </div>
                </div>

                {/* Saved indicator */}
                <div className="absolute top-2 right-2">
                  <div className="bg-brand-orange-light dark:bg-brand-orange-dark text-white p-1.5 rounded-full">
                    <Bookmark size={12} className="fill-current" />
                  </div>
                </div>

                {/* User info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-brand-orange-light to-brand-blue-light rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {post.user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-white text-sm font-medium">
                      {post.user.username}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={() => loadSavedPosts(page + 1)}
                disabled={isLoading}
                className="px-8 py-3 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-apple font-medium hover:bg-light-surface dark:hover:bg-dark-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <Bookmark size={64} className="mx-auto mb-4 text-light-text-secondary dark:text-dark-text-secondary" />
          <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
            No saved posts yet
          </h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6 max-w-md mx-auto">
            Start saving posts you love to build your personal fashion inspiration collection
          </p>
          <Link
            to="/snapfit"
            className="px-6 py-3 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-apple font-medium hover:opacity-90 transition-opacity btn-hover"
          >
            Explore Fashion Posts
          </Link>
        </div>
      )}
    </div>
  )
}

export default SavedPosts
