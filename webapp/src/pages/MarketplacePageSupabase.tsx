import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { productService, categoryService, cartService, type Product, type Category } from '../services/database';
import { 
  HeartIcon, 
  ShoppingBagIcon, 
  FunnelIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const MarketplacePage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'latest' | 'price_low' | 'price_high'>('latest');
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, debouncedSearch, sortBy]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { products: data } = await productService.getAll(
        1, 
        20, 
        selectedCategory || undefined, 
        debouncedSearch || undefined
      );
      
      // Sort products based on selected sort option
      let sortedProducts = [...data];
      switch (sortBy) {
        case 'price_low':
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          sortedProducts.sort((a, b) => b.price - a.price);
          break;
        case 'latest':
        default:
          sortedProducts.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          break;
      }
      
      setProducts(sortedProducts);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  const toggleLike = (productId: string) => {
    if (!user) {
      // Could show login modal here
      return;
    }

    setLikedProducts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(productId)) {
        newLiked.delete(productId);
      } else {
        newLiked.add(productId);
      }
      return newLiked;
    });
  };

  const addToCart = async (productId: string) => {
    if (!user) return;
    try {
      await cartService.add(user.id, productId, 1);
      console.log('Added to cart:', productId);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Products
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadProducts}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Gradient background accent */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-gradient-to-br from-purple-400/30 via-pink-300/20 to-yellow-200/20 blur-3xl z-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
            African Fashion <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400">Marketplace</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover authentic African fashion from talented designers.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="flex-1 relative w-full max-w-md">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <FunnelIcon className="h-5 w-5" />
              Filters
            </button>
          </form>

          {showFilters && (
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white/90 dark:bg-gray-900/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white/90 dark:bg-gray-900/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="latest">Latest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSearchTerm('');
                      setSortBy('latest');
                    }}
                    className="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col">
                {/* Product Image */}
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x200?text=Product+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <button
                      onClick={() => toggleLike(product.id)}
                      className="p-2 bg-white/90 dark:bg-gray-900/80 rounded-full shadow hover:shadow-md transition-shadow"
                    >
                      {likedProducts.has(product.id) ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                  {!product.is_available && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>
                {/* Product Info */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-2">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                      {product.name}
                    </h3>
                    {product.seller && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        by {product.seller.display_name}
                      </p>
                    )}
                  </div>
                  {product.category && (
                    <span className="inline-block px-2 py-1 text-xs bg-purple-600/10 text-purple-700 dark:text-purple-400 rounded-full mb-2">
                      {product.category.name}
                    </span>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatPrice(product.price)}
                    </span>
                    <button
                      onClick={() => addToCart(product.id)}
                      disabled={!product.is_available || !user}
                      className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingBagIcon className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                  {product.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State when no products */}
        {!loading && products.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No products available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Be the first to add products to the marketplace! 
                {user ? '' : ' Please log in to start selling.'}
              </p>
              {user && (
                <Link
                  to="/upload"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add Your First Product
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
