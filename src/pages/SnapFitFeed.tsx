import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../hooks/useDatabase';
import { commentService, type Comment } from '../services/database';
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const SnapFitFeed: React.FC = () => {
  const { user } = useAuth();
  const { posts, loading, likePost, unlikePost } = usePosts(1, 20);
  const [userStreak, setUserStreak] = useState(0);
  const [openCommentsFor, setOpenCommentsFor] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const streak = Math.floor(Math.random() * 30) + 1;
    setUserStreak(streak);
  }, []);

  const handleToggleLike = async (postId: string, isLiked?: boolean) => {
    if (!user) return;
    if (isLiked) await unlikePost(postId);
    else await likePost(postId);
  };

  const loadComments = async (postId: string) => {
    try {
      const list = await commentService.listForPost(postId, 20);
      setComments((prev) => ({ ...prev, [postId]: list }));
    } catch (e) {
      console.error('Failed to load comments', e);
    }
  };

  const submitComment = async (postId: string) => {
    if (!user || !newComment.trim()) return;
    try {
      const created = await commentService.add(postId, user.id, newComment.trim());
      setComments(prev => ({
        ...prev,
        [postId]: [created, ...(prev[postId] || [])]
      }));
      setNewComment('');
    } catch (e) {
      console.error('Failed to add comment', e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6 animate-pulse">
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                </div>
                <div className="h-80 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <SparklesIcon className="h-8 w-8 text-purple-600 mr-2" />
                SnapFit Feed
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Share your style, inspire the community
              </p>
            </div>
            <Link
              to="/"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>

          {/* Streak Counter */}
          {user && (
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg p-4 text-white mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FireIcon className="h-8 w-8 mr-3" />
                  <div>
                    <h3 className="font-semibold text-lg">{userStreak} Day Streak!</h3>
                    <p className="text-sm opacity-90">Keep sharing your style daily</p>
                  </div>
                </div>
                <Link
                  to="/upload"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  Share Today's Look
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {post.user?.avatar_url ? (
                    <img src={post.user.avatar_url} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
                  )}
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {post.user?.display_name || 'User'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(post.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleToggleLike(post.id, post.is_liked)}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    {post.is_liked ? (
                      <HeartSolidIcon className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartIcon className="h-6 w-6" />
                    )}
                    <span className="font-medium">{post.likes_count}</span>
                  </button>
                  <button
                    onClick={async () => {
                      setOpenCommentsFor((prev) => (prev === post.id ? null : post.id));
                      if (!comments[post.id]) await loadComments(post.id);
                    }}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200"
                  >
                    <ChatBubbleLeftIcon className="h-6 w-6" />
                    <span className="font-medium">{post.comments_count}</span>
                  </button>
                </div>
              </div>

              {/* Post Image */}
              <div className="relative">
                <img
                  src={post.image_url}
                  alt="SnapFit post"
                  className="w-full h-96 object-cover"
                  loading="lazy"
                />
              </div>

              {/* Post Body */}
              <div className="p-4">
                {/* Caption */}
                <div className="mb-3">
                  <p className="text-gray-900 dark:text-white mb-2">
                    <span className="font-semibold">{post.user?.display_name || 'User'}</span>{' '}
                    {post.caption}
                  </p>
                </div>

                {/* Comments Panel */}
                {openCommentsFor === post.id && (
                  <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {(comments[post.id] || []).map((c) => (
                        <div key={c.id} className="flex items-start gap-3">
                          {c.user?.avatar_url ? (
                            <img src={c.user.avatar_url} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700" />
                          )}
                          <div>
                            <p className="text-sm text-gray-900 dark:text-white">
                              <span className="font-medium">{c.user?.display_name || 'User'}:</span> {c.content}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(c.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {user && (
                      <div className="mt-3 flex gap-2">
                        <input
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment"
                          className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() => submitComment(post.id)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                          Post
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Upload Prompt */}
        {user && (
          <div className="mt-12 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
              <SparklesIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Share Your Style
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Upload your outfit and inspire the Mnada community
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Upload Your SnapFit
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnapFitFeed;
