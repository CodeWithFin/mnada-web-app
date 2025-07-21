import React from 'react'
import { Link } from 'react-router-dom'
import { Camera, ShoppingBag, Users, Sparkles, ArrowRight, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-light to-primary-50 dark:from-surface-dark dark:to-primary-900/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gradient">Mnada</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-500 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="button-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Where{' '}
              <span className="text-gradient">Kenyan Fashion</span>
              <br />
              Meets Community
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Discover, share, and shop sustainable fashion in Kenya's most vibrant 
              style community. Connect with fellow fashion enthusiasts, showcase your 
              daily outfits, and find unique thrift treasures.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/register"
                className="button-primary flex items-center justify-center space-x-2"
              >
                <span>Join Mnada Today</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="button-secondary"
              >
                Sign In
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Three Powerful Features, One Platform
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to express your style, connect with others, and build a sustainable fashion future.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* SnapFit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="card-apple p-8 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                SnapFit Feed
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Share your daily outfits, get inspired by others, and build your fashion diary. 
                Track your style evolution with our streak system.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" /> Social Likes
                </span>
                <span className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-1" /> Style Streaks
                </span>
              </div>
            </motion.div>

            {/* ThreadBoard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card-apple p-8 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                ThreadBoard
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Discover and sell unique fashion pieces. From vintage finds to modern trends, 
                build a sustainable wardrobe while supporting local sellers.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span>Secure Trading</span>
                <span>•</span>
                <span>Local Pickup</span>
              </div>
            </motion.div>

            {/* Community */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card-apple p-8 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Fashion Community
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Connect with fellow fashion enthusiasts, follow your favorite creators, 
                and build meaningful relationships around shared style interests.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span>Follow System</span>
                <span>•</span>
                <span>Style Inspiration</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card-apple p-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Join Kenya's Fashion Revolution?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Be part of a community that celebrates sustainable fashion, 
              individual style, and authentic connections.
            </p>
            <Link
              to="/register"
              className="button-primary inline-flex items-center space-x-2"
            >
              <span>Start Your Fashion Journey</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gradient">Mnada</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              © 2024 Mnada. Empowering Kenyan fashion culture.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
