import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Camera, Filter, Plus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import PostCreation from '../components/PostCreation'
import SearchComponent from '../components/SearchComponent'
import LikeButton from '../components/LikeButton'
import CommentsSection from '../components/CommentsSection'
import ShareButton from '../components/ShareButton'
import SaveButton from '../components/SaveButton'
import FollowButton from '../components/FollowButton'

const SnapFit = () => {
  const { isAuthenticated } = useAuth()
  const [filter, setFilter] = useState('all')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [searchResults, setSearchResults] = useState(null)

  // Mock data for posts
  const posts = [
    {
      id: 1,
      user: {
        username: 'amara_style',
        avatar: null,
        verified: true
      },
      images: ['https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop'],
      caption: 'Casual Friday vibes with this vintage denim jacket I found at Toi Market! 💫 #ThriftFind #NairobiStyle',
      category: 'casual',
      location: 'Nairobi, Kenya',
      likes: 124,
      comments: 18,
      timeAgo: '2h',
      isLiked: false
    },
    {
      id: 2,
      user: {
        username: 'kevin_threads',
        avatar: null,
        verified: false
      },
      images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop'],
      caption: 'Sunday best for church service. Clean lines, simple elegance 🙏 #SundayBest #MensFashion',
      category: 'formal',
      location: 'Mombasa, Kenya',
      likes: 89,
      comments: 12,
      timeAgo: '4h',
      isLiked: true
    },
    {
      id: 3,
      user: {
        username: 'zara_vintage',
        avatar: null,
        verified: true
      },
      images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop'],
      caption: 'Mixing patterns and textures today! This ankara print with denim never fails ✨ #AnkaraStyle #PatternMixing',
      category: 'street',
      location: 'Kisumu, Kenya',
      likes: 203,
      comments: 31,
      timeAgo: '6h',
      isLiked: false
    }
  ]

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'casual', name: 'Casual' },
    { id: 'formal', name: 'Formal' },
    { id: 'street', name: 'Street' },
    { id: 'vintage', name: 'Vintage' }
  ]

  const filteredPosts = filter === 'all' ? posts : posts.filter(post => post.category === filter)

  const PostCard = ({ post }) => (
    <div className="bg-light-card dark:bg-dark-card rounded-apple-lg border border-light-border dark:border-dark-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* User Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.user.username}`} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-orange-light to-brand-blue-light rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {post.user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-medium text-light-text-primary dark:text-dark-text-primary hover:underline">
                  {post.user.username}
                </span>
                {post.user.verified && (
                  <div className="w-4 h-4 bg-brand-blue-light dark:bg-brand-blue-dark rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {post.location} • {post.timeAgo}
              </p>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Follow Button */}
          <FollowButton
            userId={post.user.id}
            username={post.user.username}
            variant="secondary"
            size="small"
            showIcon={false}
          />
          
          {/* Menu Button */}
          <button className="p-1 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-[4/5] bg-light-surface dark:bg-dark-surface">
        <img
          src={post.images[0]}
          alt="Fashion post"
          className="w-full h-full object-cover"
        />
        
        {/* Save button overlay */}
        <div className="absolute top-3 right-3">
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
            <SaveButton
              postId={post.id}
              size={16}
              className="text-white hover:text-brand-orange-light"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <LikeButton
              postId={post.id}
              initialLikes={post.likes}
              initialIsLiked={post.isLiked}
            />
            <CommentsSection
              postId={post.id}
              initialCommentCount={post.comments}
            />
            <ShareButton
              postId={post.id}
              postTitle={`Check out this outfit from ${post.user.username}`}
            />
          </div>
        </div>

        {/* Caption */}
        <div className="text-sm text-light-text-primary dark:text-dark-text-primary">
          <Link 
            to={`/profile/${post.user.username}`}
            className="font-medium hover:underline"
          >
            {post.user.username}
          </Link>{' '}
          {post.caption}
        </div>
        
        {/* View all comments link if there are many comments */}
        {post.comments > 3 && (
          <button className="text-sm text-light-text-secondary dark:text-dark-text-secondary hover:underline mt-1">
            View all {post.comments} comments
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
            SnapFit Feed
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Daily fashion inspiration from the Kenyan community
          </p>
        </div>
        
        {isAuthenticated && (
          <button
            onClick={() => setShowCreatePost(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-apple font-medium hover:opacity-90 transition-opacity btn-hover"
          >
            <Plus size={16} />
            <span>Post</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-4 mb-8 overflow-x-auto pb-2">
        <Filter size={16} className="text-light-text-secondary dark:text-dark-text-secondary flex-shrink-0" />
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setFilter(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filter === category.id
                ? 'bg-brand-orange-light dark:bg-brand-orange-dark text-white'
                : 'bg-light-surface dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Search Component */}
      <div className="mb-8">
        <SearchComponent 
          onSearchResults={setSearchResults}
          onFilterChange={(filters) => console.log('Filters:', filters)}
        />
      </div>

      {/* Posts Grid */}
      {!isAuthenticated && (
        <div className="bg-light-card dark:bg-dark-card rounded-apple-lg border border-light-border dark:border-dark-border p-8 text-center mb-8">
          <Camera size={48} className="mx-auto mb-4 text-light-text-secondary dark:text-dark-text-secondary" />
          <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
            Join the Fashion Community
          </h3>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
            Sign up to share your style, follow other fashion enthusiasts, and engage with posts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-6 py-2 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-apple font-medium hover:opacity-90 transition-opacity btn-hover"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="px-6 py-2 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-apple font-medium hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <button className="px-8 py-3 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-apple font-medium hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
          Load More Posts
        </button>
      </div>

      {/* Post Creation Modal */}
      <PostCreation
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={(postData) => {
          console.log('New SnapFit post:', postData)
          setShowCreatePost(false)
        }}
        type="snapfit"
      />
    </div>
  )
}

export default SnapFit
