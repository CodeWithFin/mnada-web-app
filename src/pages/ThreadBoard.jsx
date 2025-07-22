import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Grid, List, Star, MapPin, Plus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const ThreadBoard = () => {
  const { isAuthenticated } = useAuth()
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    condition: 'all',
    size: 'all'
  })

  // Mock data for products
  const products = [
    {
      id: 1,
      title: 'Vintage Denim Jacket',
      price: 1500,
      condition: 8,
      size: 'M',
      category: 'jackets',
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop'],
      seller: {
        username: 'vintage_ke',
        rating: 4.8,
        verified: true
      },
      location: 'Nairobi, Kenya',
      timePosted: '2 days ago',
      brand: 'Levi\'s',
      description: 'Classic vintage Levi\'s denim jacket in excellent condition.',
      isLiked: false
    },
    {
      id: 2,
      title: 'African Print Dress',
      price: 2200,
      condition: 9,
      size: 'L',
      category: 'dresses',
      images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop'],
      seller: {
        username: 'ankara_queen',
        rating: 4.9,
        verified: true
      },
      location: 'Mombasa, Kenya',
      timePosted: '1 day ago',
      brand: 'Custom',
      description: 'Beautiful handmade ankara dress, perfect for special occasions.',
      isLiked: true
    },
    {
      id: 3,
      title: 'Leather Boots',
      price: 3500,
      condition: 7,
      size: '42',
      category: 'shoes',
      images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=300&h=400&fit=crop'],
      seller: {
        username: 'leather_craft',
        rating: 4.6,
        verified: false
      },
      location: 'Kisumu, Kenya',
      timePosted: '3 days ago',
      brand: 'Timberland',
      description: 'Genuine leather boots, well-maintained with minor wear.',
      isLiked: false
    },
    {
      id: 4,
      title: 'Cotton Shirt',
      price: 800,
      condition: 8,
      size: 'S',
      category: 'shirts',
      images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop'],
      seller: {
        username: 'casual_fits',
        rating: 4.7,
        verified: true
      },
      location: 'Eldoret, Kenya',
      timePosted: '5 days ago',
      brand: 'H&M',
      description: 'Soft cotton shirt in excellent condition, barely worn.',
      isLiked: false
    }
  ]

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'shirts', name: 'Shirts' },
    { id: 'dresses', name: 'Dresses' },
    { id: 'jackets', name: 'Jackets' },
    { id: 'shoes', name: 'Shoes' },
    { id: 'accessories', name: 'Accessories' }
  ]

  const ProductCard = ({ product, isGridView }) => (
    <Link
      to={`/product/${product.id}`}
      className={`group bg-light-card dark:bg-dark-card rounded-apple-lg border border-light-border dark:border-dark-border overflow-hidden hover:shadow-lg transition-all duration-300 btn-hover ${
        isGridView ? '' : 'flex'
      }`}
    >
      <div className={`relative bg-light-surface dark:bg-dark-surface ${
        isGridView ? 'aspect-[3/4]' : 'w-32 h-32 flex-shrink-0'
      }`}>
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <button className="w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors">
            <svg className="w-4 h-4" fill={product.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-brand-orange-light dark:bg-brand-orange-dark text-white text-xs font-medium rounded">
            {product.condition}/10
          </span>
        </div>
      </div>

      <div className={`p-4 ${isGridView ? '' : 'flex-1'}`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary group-hover:text-brand-orange-light dark:group-hover:text-brand-orange-dark transition-colors line-clamp-1">
            {product.title}
          </h3>
          <span className="text-lg font-bold text-brand-orange-light dark:text-brand-orange-dark ml-2">
            KSh {product.price.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center space-x-4 text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
          <span>Size {product.size}</span>
          <span>•</span>
          <span>{product.brand}</span>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            <Star size={14} className="text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
              {product.seller.rating}
            </span>
          </div>
          <span className="text-light-text-secondary dark:text-dark-text-secondary">•</span>
          <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {product.seller.username}
          </span>
          {product.seller.verified && (
            <div className="w-3 h-3 bg-brand-blue-light dark:bg-brand-blue-dark rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
          <MapPin size={12} />
          <span>{product.location}</span>
          <span>•</span>
          <span>{product.timePosted}</span>
        </div>
      </div>
    </Link>
  )

  const filteredProducts = products.filter(product => {
    if (filters.category !== 'all' && product.category !== filters.category) return false
    // Add more filter logic as needed
    return true
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
            ThreadBoard
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Discover amazing fashion finds from verified sellers across Kenya
          </p>
        </div>
        
        {isAuthenticated && (
          <Link
            to="/sell"
            className="flex items-center space-x-2 px-4 py-2 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-apple font-medium hover:opacity-90 transition-opacity btn-hover mt-4 md:mt-0"
          >
            <Plus size={16} />
            <span>Sell Item</span>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-light-card dark:bg-dark-card rounded-apple-lg border border-light-border dark:border-dark-border p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary" />
            <input
              type="text"
              placeholder="Search for fashion items..."
              className="w-full pl-10 pr-4 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="px-4 py-2 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-light-surface dark:bg-dark-surface rounded-apple p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-dark-card shadow-sm' : ''}`}
            >
              <Grid size={16} className="text-light-text-secondary dark:text-dark-text-secondary" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-dark-card shadow-sm' : ''}`}
            >
              <List size={16} className="text-light-text-secondary dark:text-dark-text-secondary" />
            </button>
          </div>
        </div>
      </div>

      {/* Auth CTA */}
      {!isAuthenticated && (
        <div className="bg-light-card dark:bg-dark-card rounded-apple-lg border border-light-border dark:border-dark-border p-8 text-center mb-8">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
              Join ThreadBoard
            </h3>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
              Sign up to contact sellers, save favorites, and start selling your own items
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
        </div>
      )}

      {/* Products Grid/List */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
      }`}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} isGridView={viewMode === 'grid'} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <button className="px-8 py-3 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-apple font-medium hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
          Load More Items
        </button>
      </div>
    </div>
  )
}

export default ThreadBoard
