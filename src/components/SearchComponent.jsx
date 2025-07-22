import { useState, useEffect, useRef } from 'react'
import { Search, X, Filter, MapPin, Star, Clock, TrendingUp } from 'lucide-react'

const SearchComponent = ({ onSearchResults, onFilterChange }) => {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const [trendingSearches] = useState([
    'vintage dresses', 'african prints', 'streetwear', 'sustainable fashion', 'thrift finds'
  ])
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    location: '',
    condition: '',
    size: '',
    brand: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  
  const searchInputRef = useRef(null)
  const suggestionTimeoutRef = useRef(null)

  // Mock data for search suggestions
  const mockSuggestions = [
    { type: 'product', text: 'Vintage Denim Jacket', category: 'Outerwear' },
    { type: 'user', text: '@fashionista_ke', followers: '2.3k' },
    { type: 'brand', text: 'African Heritage Co.', verified: true },
    { type: 'category', text: 'Sustainable Fashion' },
    { type: 'location', text: 'Nairobi, Kenya' }
  ]

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mnada_recent_searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Generate search suggestions
  useEffect(() => {
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current)
    }

    if (query.length > 0) {
      suggestionTimeoutRef.current = setTimeout(() => {
        // Filter suggestions based on query
        const filtered = mockSuggestions.filter(item =>
          item.text.toLowerCase().includes(query.toLowerCase())
        )
        setSuggestions(filtered)
        setShowSuggestions(true)
      }, 150)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }

    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current)
      }
    }
  }, [query])

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setShowSuggestions(false)

    try {
      // Save to recent searches
      const updatedRecent = [
        searchQuery,
        ...recentSearches.filter(term => term !== searchQuery)
      ].slice(0, 5)
      
      setRecentSearches(updatedRecent)
      localStorage.setItem('mnada_recent_searches', JSON.stringify(updatedRecent))

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))

      // Mock search results
      const mockResults = {
        products: [
          {
            id: 1,
            title: 'Vintage Leather Jacket',
            price: 3500,
            image: '/api/placeholder/300/400',
            seller: 'Fashion Forward',
            location: 'Westlands, Nairobi',
            rating: 4.8,
            condition: 'Good'
          },
          {
            id: 2,
            title: 'African Print Dress',
            price: 2200,
            image: '/api/placeholder/300/400',
            seller: 'Heritage Styles',
            location: 'Karen, Nairobi',
            rating: 4.9,
            condition: 'Excellent'
          }
        ],
        users: [
          {
            id: 1,
            username: 'fashionista_ke',
            name: 'Sarah Mwangi',
            avatar: '/api/placeholder/80/80',
            followers: 2300,
            verified: true
          }
        ],
        total: 47
      }

      onSearchResults?.(mockResults)

    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text)
    handleSearch(suggestion.text)
  }

  const handleRecentSearch = (term) => {
    setQuery(term)
    handleSearch(term)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('mnada_recent_searches')
  }

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      location: '',
      condition: '',
      size: '',
      brand: ''
    })
    onFilterChange?.({})
  }

  const getFilterCount = () => {
    return Object.values(filters).filter(value => value !== '').length
  }

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search 
            size={20} 
            className="absolute left-4 text-light-text-secondary dark:text-dark-text-secondary z-10" 
          />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search products, brands, or users..."
            className="w-full pl-12 pr-20 py-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple-lg focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark transition-all"
            onFocus={() => query.length === 0 && setShowSuggestions(true)}
          />
          
          {/* Clear button */}
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setSuggestions([])
                setShowSuggestions(false)
              }}
              className="absolute right-12 p-1 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors"
            >
              <X size={16} className="text-light-text-secondary dark:text-dark-text-secondary" />
            </button>
          )}
          
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-4 p-1 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors"
          >
            <div className="relative">
              <Filter size={16} className="text-light-text-secondary dark:text-dark-text-secondary" />
              {getFilterCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-orange-light dark:bg-brand-orange-dark rounded-full"></span>
              )}
            </div>
          </button>
        </div>

        {/* Search button */}
        <button
          onClick={() => handleSearch()}
          disabled={isSearching || !query.trim()}
          className="mt-3 w-full py-3 bg-brand-orange-light dark:bg-brand-orange-dark text-white rounded-apple-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-orange-light/90 dark:hover:bg-brand-orange-dark/90 transition-colors"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (query.length > 0 || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-apple-lg shadow-apple z-50 max-h-96 overflow-y-auto">
          
          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-4 border-b border-light-border dark:border-dark-border">
              <h4 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-3">
                Suggestions
              </h4>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center space-x-3 p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-apple text-left transition-colors"
                  >
                    <div className="w-8 h-8 bg-light-surface dark:bg-dark-surface rounded-full flex items-center justify-center">
                      {suggestion.type === 'user' && <span className="text-xs font-bold">@</span>}
                      {suggestion.type === 'location' && <MapPin size={14} />}
                      {suggestion.type === 'product' && <Search size={14} />}
                      {suggestion.type === 'brand' && <Star size={14} />}
                      {suggestion.type === 'category' && <Filter size={14} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        {suggestion.text}
                      </p>
                      {suggestion.category && (
                        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                          in {suggestion.category}
                        </p>
                      )}
                      {suggestion.followers && (
                        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                          {suggestion.followers} followers
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && query.length === 0 && (
            <div className="p-4 border-b border-light-border dark:border-dark-border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary flex items-center">
                  <Clock size={14} className="mr-2" />
                  Recent
                </h4>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-brand-orange-light dark:text-brand-orange-dark hover:underline"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearch(term)}
                    className="w-full text-left p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-apple transition-colors"
                  >
                    <p className="text-sm text-light-text-primary dark:text-dark-text-primary">
                      {term}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          {query.length === 0 && (
            <div className="p-4">
              <h4 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-3 flex items-center">
                <TrendingUp size={14} className="mr-2" />
                Trending
              </h4>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearch(term)}
                    className="px-3 py-1 bg-light-surface dark:bg-dark-surface text-sm text-light-text-primary dark:text-dark-text-primary rounded-full hover:bg-brand-orange-light/10 dark:hover:bg-brand-orange-dark/10 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-apple-lg shadow-apple z-40 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary">
              Filters
            </h3>
            <div className="flex items-center space-x-2">
              {getFilterCount() > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-brand-orange-light dark:text-brand-orange-dark hover:underline"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
              >
                <option value="">All Categories</option>
                <option value="clothing">Clothing</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
                <option value="bags">Bags</option>
                <option value="jewelry">Jewelry</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
              >
                <option value="">Any Price</option>
                <option value="0-1000">Under KSh 1,000</option>
                <option value="1000-5000">KSh 1,000 - 5,000</option>
                <option value="5000-10000">KSh 5,000 - 10,000</option>
                <option value="10000+">Over KSh 10,000</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
              >
                <option value="">All Locations</option>
                <option value="nairobi">Nairobi</option>
                <option value="mombasa">Mombasa</option>
                <option value="kisumu">Kisumu</option>
                <option value="nakuru">Nakuru</option>
                <option value="eldoret">Eldoret</option>
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2">
                Condition
              </label>
              <select
                value={filters.condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="w-full p-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-apple focus:outline-none focus:ring-2 focus:ring-brand-orange-light dark:focus:ring-brand-orange-dark"
              >
                <option value="">Any Condition</option>
                <option value="new">New with tags</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchComponent
