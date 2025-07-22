import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, MapPin, Clock, Heart, Share, ArrowLeft, Eye, MessageCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const ProductDetail = () => {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  // Mock product data - in real app, fetch based on id
  const product = {
    id: parseInt(id),
    title: 'Vintage Denim Jacket',
    price: 1500,
    condition: 8,
    size: 'M',
    category: 'jackets',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=800&fit=crop'
    ],
    seller: {
      id: 1,
      username: 'vintage_ke',
      fullName: 'Vintage Kenya',
      profileImage: null,
      rating: 4.8,
      totalRatings: 156,
      verified: true,
      responseTime: '1 hour',
      location: 'Nairobi, Kenya'
    },
    location: 'Nairobi, Kenya',
    timePosted: '2 days ago',
    brand: 'Levi\'s',
    color: 'Blue',
    material: 'Denim',
    description: `Classic vintage Levi's denim jacket in excellent condition. This piece has been well-maintained and shows minimal signs of wear. Perfect for layering and adding a vintage touch to any outfit.

Features:
- Authentic Levi's vintage piece
- Classic blue denim wash
- All original buttons and hardware
- Comfortable medium fit
- No stains or major damage

Ideal for anyone looking to add a timeless piece to their wardrobe. The jacket has that perfect broken-in feel that only comes with age.`,
    views: 234,
    likes: 18,
    isAvailable: true
  }

  const relatedProducts = [
    {
      id: 2,
      title: 'Vintage Leather Jacket',
      price: 2800,
      image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=300&h=400&fit=crop'
    },
    {
      id: 3,
      title: 'Denim Shirt',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop'
    },
    {
      id: 4,
      title: 'Blue Jacket',
      price: 1800,
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=400&fit=crop'
    }
  ]

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      // Redirect to login
      return
    }
    // Open contact modal or redirect to chat
    alert('Contact functionality would be implemented here')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        to="/threadboard"
        className="inline-flex items-center space-x-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        <span>Back to ThreadBoard</span>
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-[4/5] bg-light-surface dark:bg-dark-surface rounded-apple-lg overflow-hidden">
            <img
              src={product.images[currentImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
            >
              <Heart size={20} className={isLiked ? 'fill-current text-red-500' : ''} />
            </button>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-brand-orange-light dark:bg-brand-orange-dark text-white text-sm font-medium rounded-full">
                {product.condition}/10 Condition
              </span>
            </div>
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-apple overflow-hidden border-2 transition-colors ${
                    currentImageIndex === index
                      ? 'border-brand-orange-light dark:border-brand-orange-dark'
                      : 'border-light-border dark:border-dark-border'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
              {product.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
              <div className="flex items-center space-x-1">
                <Eye size={14} />
                <span>{product.views} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart size={14} />
                <span>{product.likes} likes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{product.timePosted}</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-brand-orange-light dark:text-brand-orange-dark">
              KSh {product.price.toLocaleString()}
            </span>
            <span className="text-light-text-secondary dark:text-dark-text-secondary line-through">
              KSh {(product.price * 1.3).toLocaleString()}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-light-card dark:bg-dark-card p-4 rounded-apple border border-light-border dark:border-dark-border">
              <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Size</div>
              <div className="font-semibold text-light-text-primary dark:text-dark-text-primary">{product.size}</div>
            </div>
            <div className="bg-light-card dark:bg-dark-card p-4 rounded-apple border border-light-border dark:border-dark-border">
              <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Brand</div>
              <div className="font-semibold text-light-text-primary dark:text-dark-text-primary">{product.brand}</div>
            </div>
            <div className="bg-light-card dark:bg-dark-card p-4 rounded-apple border border-light-border dark:border-dark-border">
              <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Color</div>
              <div className="font-semibold text-light-text-primary dark:text-dark-text-primary">{product.color}</div>
            </div>
            <div className="bg-light-card dark:bg-dark-card p-4 rounded-apple border border-light-border dark:border-dark-border">
              <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Material</div>
              <div className="font-semibold text-light-text-primary dark:text-dark-text-primary">{product.material}</div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-light-card dark:bg-dark-card p-6 rounded-apple-lg border border-light-border dark:border-dark-border">
            <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">Seller Information</h3>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-orange-light to-brand-blue-light rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {product.seller.fullName.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-light-text-primary dark:text-dark-text-primary">
                    {product.seller.fullName}
                  </span>
                  {product.seller.verified && (
                    <div className="w-4 h-4 bg-brand-blue-light dark:bg-brand-blue-dark rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  @{product.seller.username}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="font-medium text-light-text-primary dark:text-dark-text-primary">
                    {product.seller.rating}
                  </span>
                </div>
                <div className="text-light-text-secondary dark:text-dark-text-secondary">
                  {product.seller.totalRatings} ratings
                </div>
              </div>
              <div>
                <div className="font-medium text-light-text-primary dark:text-dark-text-primary mb-1">
                  Response time
                </div>
                <div className="text-light-text-secondary dark:text-dark-text-secondary">
                  {product.seller.responseTime}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1 mt-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
              <MapPin size={14} />
              <span>{product.seller.location}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleContactSeller}
                  className="w-full py-3 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-apple font-medium hover:opacity-90 transition-opacity btn-hover flex items-center justify-center space-x-2"
                >
                  <MessageCircle size={16} />
                  <span>Contact Seller</span>
                </button>
                <button className="w-full py-3 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-apple font-medium hover:bg-light-surface dark:hover:bg-dark-surface transition-colors flex items-center justify-center space-x-2">
                  <Share size={16} />
                  <span>Share Product</span>
                </button>
              </>
            ) : (
              <div className="bg-light-surface dark:bg-dark-surface p-4 rounded-apple text-center">
                <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                  Sign in to contact the seller
                </p>
                <div className="flex space-x-2">
                  <Link
                    to="/login"
                    className="flex-1 py-2 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-apple font-medium hover:opacity-90 transition-opacity text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 py-2 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary rounded-apple font-medium hover:bg-light-surface dark:hover:bg-dark-surface transition-colors text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">Description</h3>
            <div className="text-light-text-secondary dark:text-dark-text-secondary whitespace-pre-line">
              {product.description}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2 text-light-text-secondary dark:text-dark-text-secondary">
            <MapPin size={16} />
            <span>{product.location}</span>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-8">
          Related Items
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <Link
              key={relatedProduct.id}
              to={`/product/${relatedProduct.id}`}
              className="group bg-light-card dark:bg-dark-card rounded-apple-lg border border-light-border dark:border-dark-border overflow-hidden hover:shadow-lg transition-all duration-300 btn-hover"
            >
              <div className="aspect-[3/4] bg-light-surface dark:bg-dark-surface">
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-light-text-primary dark:text-dark-text-primary mb-1 line-clamp-1">
                  {relatedProduct.title}
                </h3>
                <p className="text-brand-orange-light dark:text-brand-orange-dark font-semibold">
                  KSh {relatedProduct.price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
