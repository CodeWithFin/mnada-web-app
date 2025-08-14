import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { StarIcon, HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';

interface TrendingItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
}

const LandingPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call for trending items
    const fetchTrendingItems = async () => {
      setLoading(true);
      // Mock data
      const mockItems: TrendingItem[] = [
        {
          id: '1',
          name: 'Ankara Print Dress',
          price: 2500,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop',
          category: 'Dresses'
        },
        {
          id: '2',
          name: 'Beaded Sandals',
          price: 1200,
          rating: 4.6,
          image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&h=600&fit=crop',
          category: 'Shoes'
        },
        {
          id: '3',
          name: 'Maasai Jewelry Set',
          price: 800,
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=600&fit=crop',
          category: 'Accessories'
        },
        {
          id: '4',
          name: 'Kitenge Blazer',
          price: 3200,
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop',
          category: 'Outerwear'
        },
        {
          id: '5',
          name: 'Leather Handbag',
          price: 1800,
          rating: 4.5,
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=600&fit=crop',
          category: 'Bags'
        },
        {
          id: '6',
          name: 'African Print Headwrap',
          price: 600,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1531891570158-e71b35a485bc?w=400&h=600&fit=crop',
          category: 'Accessories'
        }
      ];

      setTimeout(() => {
        setTrendingItems(mockItems);
        setLoading(false);
      }, 1000);
    };

    fetchTrendingItems();
  }, []);

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Theme Toggle (Top Right) */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
        >
          {isDark ? (
            <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
          ) : (
            <div className="w-6 h-6 bg-gray-800 rounded-full"></div>
          )}
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 dark:bg-opacity-60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            Fashion with a
            <span className="block gradient-bg bg-clip-text text-transparent">
              Soul
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90 animate-slide-up">
            Discover authentic African fashion, connect with local designers, and express your unique style through our vibrant marketplace.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-bounce-in">
            <Link
              to="/marketplace"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 hover:scale-105"
            >
              <ShoppingBagIcon className="w-5 h-5 mr-2" />
              Shop Now
            </Link>
            <Link
              to="/feed"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-gray-900 transition-all duration-300 hover:scale-105"
            >
              <HeartIcon className="w-5 h-5 mr-2" />
              Join Community
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Trending Items Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trending Now
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the most popular fashion pieces loved by our community
            </p>
          </div>

          {loading ? (
            // Skeleton Loader
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-700 h-80 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden card-hover transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-kenyan-gold text-white px-2 py-1 rounded-full text-xs font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(item.rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {item.rating}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-purple-600">
                        {formatPrice(item.price)}
                      </span>
                      <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/marketplace"
              className="inline-flex items-center px-6 py-3 border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-md font-medium transition-all duration-300"
            >
              View All Items
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
