import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Camera, MapPin, Calendar, Edit, Settings, Grid, User, Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import FollowButton from '../components/FollowButton'

const Profile = () => {
  const { username } = useParams()
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('posts')

  // Determine if this is the current user's profile
  const isOwnProfile = isAuthenticated && (!username || username === user?.username)

  // Mock user data - in real app, fetch based on username
  const profileUser = isOwnProfile ? user : {
    id: 2,
    username: username || 'amara_style',
    fullName: 'Amara Ndung\'u',
    bio: 'Fashion enthusiast from Nairobi 🇰🇪 | Sustainable fashion advocate | Thrift lover ✨',
    location: 'Nairobi, Kenya',
    profileImage: null,
    verified: true,
    followersCount: 1250,
    followingCount: 890,
    postsCount: 47,
    joinedDate: 'March 2023'
  }

  const tabs = [
    { id: 'posts', name: 'Posts', icon: Grid },
    { id: 'liked', name: 'Liked', icon: Heart },
  ]

  // Mock posts data
  const posts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=400&fit=crop',
      likes: 124,
      comments: 18
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop',
      likes: 203,
      comments: 31
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop',
      likes: 156,
      comments: 22
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop',
      likes: 89,
      comments: 12
    }
  ]

  if (!isAuthenticated && !username) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <User size={64} className="mx-auto mb-4 text-light-text-secondary dark:text-dark-text-secondary" />
        <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          Profile Not Found
        </h2>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Please sign in to view your profile or specify a username
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header */}
      <div className="bg-light-card dark:bg-dark-card rounded-apple-lg border border-light-border dark:border-dark-border p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-brand-orange-light to-brand-blue-light rounded-full flex items-center justify-center">
              {profileUser.profileImage ? (
                <img
                  src={profileUser.profileImage}
                  alt={profileUser.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-2xl md:text-3xl">
                  {profileUser.fullName?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {isOwnProfile && (
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                <Camera size={14} />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
                  {profileUser.fullName}
                </h1>
                {profileUser.verified && (
                  <div className="w-6 h-6 bg-brand-blue-light dark:bg-brand-blue-dark rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              
              {isOwnProfile ? (
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple text-light-text-primary dark:text-dark-text-primary hover:bg-light-background dark:hover:bg-dark-background transition-colors">
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  <button className="p-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple text-light-text-primary dark:text-dark-text-primary hover:bg-light-background dark:hover:bg-dark-background transition-colors">
                    <Settings size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <FollowButton
                    userId={profileUser.id}
                    username={profileUser.username}
                    variant="primary"
                    size="default"
                    onFollowChange={(isFollowing, userId) => {
                      console.log(`${isFollowing ? 'Followed' : 'Unfollowed'} user ${userId}`)
                    }}
                  />
                  <button className="px-6 py-2 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-apple font-medium hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                    Message
                  </button>
                </div>
              )}
            </div>

            <p className="text-light-text-secondary dark:text-dark-text-secondary mb-1">
              @{profileUser.username}
            </p>

            {profileUser.bio && (
              <p className="text-light-text-primary dark:text-dark-text-primary mb-4">
                {profileUser.bio}
              </p>
            )}

            <div className="flex items-center space-x-4 text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
              {profileUser.location && (
                <div className="flex items-center space-x-1">
                  <MapPin size={14} />
                  <span>{profileUser.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>Joined {profileUser.joinedDate}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
                  {profileUser.postsCount}
                </div>
                <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Posts
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
                  {profileUser.followersCount?.toLocaleString()}
                </div>
                <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Followers
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
                  {profileUser.followingCount?.toLocaleString()}
                </div>
                <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Following
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-light-border dark:border-dark-border mb-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-orange-light dark:border-brand-orange-dark text-brand-orange-light dark:text-brand-orange-dark'
                    : 'border-transparent text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary'
                }`}
              >
                <Icon size={16} />
                <span className="font-medium">{tab.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {activeTab === 'posts' && (
          <div>
            {posts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="relative aspect-square bg-light-surface dark:bg-dark-surface rounded-apple overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex items-center space-x-4 text-white">
                        <div className="flex items-center space-x-1">
                          <Heart size={16} className="fill-current" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                          </svg>
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Camera size={64} className="mx-auto mb-4 text-light-text-secondary dark:text-dark-text-secondary" />
                <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                  No posts yet
                </h3>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  {isOwnProfile ? "Share your first fashion post!" : "This user hasn't posted anything yet."}
                </p>
                {isOwnProfile && (
                  <button className="mt-4 px-6 py-2 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-apple font-medium hover:opacity-90 transition-opacity btn-hover">
                    Create Post
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'liked' && (
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto mb-4 text-light-text-secondary dark:text-dark-text-secondary" />
            <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
              No liked posts
            </h3>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              {isOwnProfile ? "Posts you like will appear here." : "This user's liked posts are private."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
