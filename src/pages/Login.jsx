import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Mock login - in real app, this would call your API
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      // Mock user data
      const userData = {
        id: 1,
        username: 'fashionista_ke',
        email: formData.email,
        fullName: 'Fashion Enthusiast',
        profileImage: null,
        verified: false,
        bio: 'Fashion lover from Nairobi',
        location: 'Nairobi, Kenya',
        followersCount: 150,
        followingCount: 200,
        postsCount: 25
      }

      login(userData)
      navigate('/')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-orange-light to-brand-orange-dark rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-2xl font-bold text-brand-orange-light dark:text-brand-orange-dark">Mnada</span>
          </Link>
          
          <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
            Welcome back
          </h2>
          <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-apple text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-apple text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-error-light/10 dark:bg-error-dark/10 border border-error-light dark:border-error-dark rounded-apple p-3">
              <p className="text-sm text-error-light dark:text-error-dark">{error}</p>
            </div>
          )}

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-brand-orange-light dark:text-brand-orange-dark focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark border-light-border dark:border-dark-border rounded"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-brand-orange-light dark:text-brand-orange-dark hover:opacity-80"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-apple font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark focus:ring-offset-2 focus:ring-offset-light-background dark:focus:ring-offset-dark-background transition-opacity btn-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          {/* Sign up link */}
          <div className="text-center">
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-brand-orange-light dark:text-brand-orange-dark hover:opacity-80 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>

        {/* Demo Account Info */}
        <div className="bg-light-surface dark:bg-dark-surface rounded-apple p-4 mt-6">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary text-center">
            <strong>Demo:</strong> Use any email and password to sign in
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
