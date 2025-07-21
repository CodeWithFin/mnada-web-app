import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Camera, ShoppingBag } from 'lucide-react'

const Dashboard: React.FC = () => {
  // Mock data - in real app, this would come from API
  const stats = {
    posts: 24,
    followers: 156,
    following: 89,
    likes: 1240
  }

  const recentActivity = [
    { type: 'like', message: 'Sarah liked your outfit post', time: '2 min ago' },
    { type: 'follow', message: 'James started following you', time: '1 hour ago' },
    { type: 'comment', message: 'New comment on your vintage jacket post', time: '3 hours ago' },
    { type: 'sale', message: 'Your denim jacket listing got an inquiry', time: '5 hours ago' },
  ]

  const trendingItems = [
    { name: 'Vintage Denim', price: 'KSh 2,500', image: '/api/placeholder/150/150' },
    { name: 'Ankara Dress', price: 'KSh 3,200', image: '/api/placeholder/150/150' },
    { name: 'Leather Boots', price: 'KSh 4,800', image: '/api/placeholder/150/150' },
    { name: 'Cotton Shirt', price: 'KSh 1,800', image: '/api/placeholder/150/150' },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's what's happening in your fashion world today.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="card-apple p-6 text-center">
          <Camera className="h-8 w-8 text-primary-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.posts}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Posts</p>
        </div>
        
        <div className="card-apple p-6 text-center">
          <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.followers}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
        </div>
        
        <div className="card-apple p-6 text-center">
          <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.following}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
        </div>
        
        <div className="card-apple p-6 text-center">
          <ShoppingBag className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.likes}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="card-apple p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'like' ? 'bg-red-500' :
                    activity.type === 'follow' ? 'bg-blue-500' :
                    activity.type === 'comment' ? 'bg-green-500' :
                    'bg-purple-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white text-sm">
                      {activity.message}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trending Items */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="card-apple p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Trending Now
            </h2>
            <div className="space-y-4">
              {trendingItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold">
                      {item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8"
      >
        <div className="card-apple p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-primary-500 dark:hover:border-primary-400 transition-colors text-center">
              <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Post Outfit</p>
            </button>
            
            <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-primary-500 dark:hover:border-primary-400 transition-colors text-center">
              <ShoppingBag className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">List Item</p>
            </button>
            
            <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-primary-500 dark:hover:border-primary-400 transition-colors text-center">
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Find Friends</p>
            </button>
            
            <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-primary-500 dark:hover:border-primary-400 transition-colors text-center">
              <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">View Trends</p>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
