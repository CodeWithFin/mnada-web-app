import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { login } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Mock registration - in real app, this would call your API
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      // Mock user data
      const userData = {
        id: Date.now(),
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        profileImage: null,
        verified: false,
        bio: '',
        location: formData.location,
        followersCount: 0,
        followingCount: 0,
        postsCount: 0
      }

      login(userData)
      navigate('/')
    } catch (err) {
      setErrors({ general: 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
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
            Join the community
          </h2>
          <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">
            Create your account to start sharing your style
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-light-card dark:bg-dark-card border rounded-apple text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark focus:border-transparent ${
                    errors.fullName ? 'border-error-light dark:border-error-dark' : 'border-light-border dark:border-dark-border'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-error-light dark:text-error-dark">{errors.fullName}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary">@</span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-8 pr-4 py-3 bg-light-card dark:bg-dark-card border rounded-apple text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark focus:border-transparent ${
                    errors.username ? 'border-error-light dark:border-error-dark' : 'border-light-border dark:border-dark-border'
                  }`}
                  placeholder="Choose a username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-error-light dark:text-error-dark">{errors.username}</p>
              )}
            </div>

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
                  className={`w-full pl-10 pr-4 py-3 bg-light-card dark:bg-dark-card border rounded-apple text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark focus:border-transparent ${
                    errors.email ? 'border-error-light dark:border-error-dark' : 'border-light-border dark:border-dark-border'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-error-light dark:text-error-dark">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-light-card dark:bg-dark-card border rounded-apple text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark focus:border-transparent ${
                    errors.phone ? 'border-error-light dark:border-error-dark' : 'border-light-border dark:border-dark-border'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-error-light dark:text-error-dark">{errors.phone}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary" />
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-light-card dark:bg-dark-card border rounded-apple text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark focus:border-transparent ${
                    errors.location ? 'border-error-light dark:border-error-dark' : 'border-light-border dark:border-dark-border'
                  }`}
                  placeholder="Enter your location (e.g., Nairobi, Kenya)"
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-error-light dark:text-error-dark">{errors.location}</p>
              )}
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
                  className={`w-full pl-10 pr-12 py-3 bg-light-card dark:bg-dark-card border rounded-apple text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark focus:border-transparent ${
                    errors.password ? 'border-error-light dark:border-error-dark' : 'border-light-border dark:border-dark-border'
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error-light dark:text-error-dark">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 bg-light-card dark:bg-dark-card border rounded-apple text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark focus:border-transparent ${
                    errors.confirmPassword ? 'border-error-light dark:border-error-dark' : 'border-light-border dark:border-dark-border'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error-light dark:text-error-dark">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="bg-error-light/10 dark:bg-error-dark/10 border border-error-light dark:border-error-dark rounded-apple p-3">
              <p className="text-sm text-error-light dark:text-error-dark">{errors.general}</p>
            </div>
          )}

          {/* Terms */}
          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-brand-orange-light dark:text-brand-orange-dark focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark border-light-border dark:border-dark-border rounded mt-0.5"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
              I agree to the{' '}
              <Link to="/terms" className="text-brand-orange-light dark:text-brand-orange-dark hover:opacity-80">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-brand-orange-light dark:text-brand-orange-dark hover:opacity-80">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-apple font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark focus:ring-offset-2 focus:ring-offset-light-background dark:focus:ring-offset-dark-background transition-opacity btn-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          {/* Sign in link */}
          <div className="text-center">
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-brand-orange-light dark:text-brand-orange-dark hover:opacity-80 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
