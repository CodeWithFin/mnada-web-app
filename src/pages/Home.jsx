import React from 'react'
import { Link } from 'react-router-dom'
import { Camera, ShoppingBag, Users, Sparkles, ArrowRight, Star } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: Camera,
      title: 'SnapFit Feed',
      description: 'Share your daily outfits and get inspired by the Kenyan fashion community',
      link: '/snapfit',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: ShoppingBag,
      title: 'ThreadBoard',
      description: 'Discover and sell amazing thrift finds and fashion pieces',
      link: '/threadboard',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Fashion Community',
      description: 'Connect with like-minded fashion enthusiasts across Kenya',
      link: '/snapfit',
      color: 'from-green-500 to-emerald-500'
    }
  ]

  const stats = [
    { value: '10K+', label: 'Fashion Posts' },
    { value: '5K+', label: 'Active Users' },
    { value: '2K+', label: 'Items Sold' },
    { value: '4.8', label: 'User Rating', icon: Star }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-orange-light/10 to-brand-blue-light/10 dark:from-brand-orange-dark/20 dark:to-brand-blue-dark/20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-brand-orange-light/10 dark:bg-brand-orange-dark/20 rounded-full text-brand-orange-light dark:text-brand-orange-dark text-sm font-medium mb-6">
              <Sparkles size={16} className="mr-2" />
              Welcome to Kenya's Fashion Community
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-light-text-primary dark:text-dark-text-primary mb-6">
              Share Your Style,
              <br />
              <span className="text-brand-orange-light dark:text-brand-orange-dark">
                Discover Fashion
              </span>
            </h1>
            
            <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-2xl mx-auto">
              Join Mnada - where Kenyan youth showcase daily outfits, discover thrift treasures, 
              and build a sustainable fashion community together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-3 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-apple font-medium hover:opacity-90 transition-opacity btn-hover inline-flex items-center justify-center"
                  >
                    Get Started
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                  <Link
                    to="/snapfit"
                    className="px-8 py-3 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-apple font-medium hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
                  >
                    Explore Fashion
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/snapfit"
                    className="px-8 py-3 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-apple font-medium hover:opacity-90 transition-opacity btn-hover inline-flex items-center justify-center"
                  >
                    Share Your Style
                    <Camera size={16} className="ml-2" />
                  </Link>
                  <Link
                    to="/threadboard"
                    className="px-8 py-3 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-apple font-medium hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
                  >
                    Shop ThreadBoard
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-3xl md:text-4xl font-bold text-light-text-primary dark:text-dark-text-primary">
                  {stat.value}
                </span>
                {stat.icon && (
                  <stat.icon size={20} className="ml-1 text-yellow-500" />
                )}
              </div>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
            Everything You Need for Fashion
          </h2>
          <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            From sharing your daily outfits to discovering unique pieces, 
            Mnada has everything you need to express your style.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Link
                key={index}
                to={feature.link}
                className="group p-6 bg-light-card dark:bg-dark-card rounded-apple-lg border border-light-border dark:border-dark-border hover:shadow-lg transition-all duration-300 btn-hover"
              >
                <div className={`inline-flex p-3 rounded-apple-lg bg-gradient-to-r ${feature.color} mb-4`}>
                  <Icon size={24} className="text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary transition-colors">
                  {feature.description}
                </p>
                
                <div className="flex items-center mt-4 text-brand-orange-light dark:text-brand-orange-dark group-hover:translate-x-1 transition-transform">
                  <span className="text-sm font-medium">Explore</span>
                  <ArrowRight size={16} className="ml-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-brand-orange-light to-brand-blue-light dark:from-brand-orange-dark dark:to-brand-blue-dark rounded-apple-lg p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join the Community?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Start sharing your style, discover amazing fashion finds, 
            and connect with Kenya's most vibrant fashion community.
          </p>
          
          {!isAuthenticated ? (
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-3 bg-white text-brand-orange-light font-medium rounded-apple hover:bg-gray-100 transition-colors btn-hover"
            >
              Sign Up for Free
              <ArrowRight size={16} className="ml-2" />
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/snapfit"
                className="inline-flex items-center px-8 py-3 bg-white text-brand-orange-light font-medium rounded-apple hover:bg-gray-100 transition-colors btn-hover"
              >
                Share Your First Post
                <Camera size={16} className="ml-2" />
              </Link>
              <Link
                to="/threadboard"
                className="inline-flex items-center px-8 py-3 bg-white/20 text-white font-medium rounded-apple hover:bg-white/30 transition-colors btn-hover"
              >
                Browse ThreadBoard
                <ShoppingBag size={16} className="ml-2" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
