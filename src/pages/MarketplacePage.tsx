import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { 
  StarIcon, 
  HeartIcon, 
  ShoppingBagIcon, 
  FunnelIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  tags: string[];
  designer: string;
  isLiked: boolean;
  inStock: boolean;
}

const MarketplacePage: React.FC = () => {
  const { isDark } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());

  const categories = ['All', 'Dresses', 'Tops', 'Bottoms', 'Accessories', 'Shoes', 'Bags'];
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  useEffect(() => {
    // Mock product data
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Ankara Print Maxi Dress',
        price: 3500,
        originalPrice: 4200,
        rating: 4.8,
        reviewCount: 124,
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop',
        category: 'Dresses',
        tags: ['Ankara', 'Maxi', 'Traditional'],
        designer: 'Amara Designs',
        isLiked: false,
        inStock: true
      },
      {
        id: '2',
        name: 'Beaded Kiondo Handbag',
        price: 1800,
        rating: 4.6,
        reviewCount: 89,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=600&fit=crop',
        category: 'Bags',
        tags: ['Beaded', 'Traditional', 'Handmade'],
        designer: 'Nairobi Crafts',
        isLiked: false,
        inStock: true
      },
      {
        id: '3',
        name: 'Kitenge Off-Shoulder Top',
        price: 2200,
        rating: 4.7,
        reviewCount: 156,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop',
        category: 'Tops',
        tags: ['Kitenge', 'Off-shoulder', 'Casual'],
        designer: 'Ubuntu Fashion',
        isLiked: false,
        inStock: true
      },
      {
        id: '4',
        name: 'Maasai Leather Sandals',
        price: 1500,
        originalPrice: 1800,
        rating: 4.5,
        reviewCount: 78,
        image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&h=600&fit=crop',
        category: 'Shoes',
        tags: ['Leather', 'Sandals', 'Maasai'],
        designer: 'Savanna Footwear',
        isLiked: false,
        inStock: true
      },
      {
        id: '5',
        name: 'Kente Print Blazer',
        price: 4500,
        rating: 4.9,
        reviewCount: 203,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        category: 'Tops',
        tags: ['Kente', 'Blazer', 'Professional'],
        designer: 'Royal Threads',
        isLiked: false,
        inStock: true
      },
      {
        id: '6',
        name: 'Cowrie Shell Necklace',
        price: 800,
        rating: 4.4,
        reviewCount: 67,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=600&fit=crop',
        category: 'Accessories',
        tags: ['Cowrie', 'Shell', 'Traditional'],
        designer: 'Coastal Creations',
        isLiked: false,
        inStock: false
      }
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLike = (productId: string) => {
    const newLiked = new Set(likedProducts);
    if (newLiked.has(productId)) {
      newLiked.delete(productId);
    } else {
      newLiked.add(productId);
    }
    setLikedProducts(newLiked);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return parseInt(b.id) - parseInt(a.id);
      default:
        return b.reviewCount - a.reviewCount;
    }
  });

  const formatPrice = (price: number) => `KSh ${price.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Fashion Marketplace
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Discover authentic African fashion from local designers
              </p>
            </div>
            <Link 
              to="/"
              className="mt-4 md:mt-0 text-fashion-purple hover:text-purple-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-fashion-purple focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-fashion-purple focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-fashion-purple focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                  )}
                  {product.originalPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Sale
                    </div>
                  )}
                  <button
                    onClick={() => handleLike(product.id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-200"
                  >
                    {likedProducts.has(product.id) ? (
                      <HeartSolidIcon className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      ({product.reviewCount})
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    by {product.designer}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-fashion-purple text-lg">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    
                    <button 
                      disabled={!product.inStock}
                      className="bg-fashion-purple hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                    >
                      <ShoppingBagIcon className="h-4 w-4 mr-1" />
                      {product.inStock ? 'Add' : 'Sold'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <FunnelIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No products found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
