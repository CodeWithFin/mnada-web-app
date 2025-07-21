import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Product {
  id: string
  sellerId: string
  title: string
  description: string
  category: 'clothing' | 'accessories' | 'shoes' | 'bags' | 'jewelry' | 'other'
  subCategory?: string
  images: string[]
  price: number
  size?: string
  color?: string
  brand?: string
  condition: number // 1-10 rating
  status: 'active' | 'sold' | 'inactive'
  location: string
  viewsCount: number
  isWishlisted: boolean
  createdAt: string
  updatedAt: string
  seller: {
    id: string
    username: string
    fullName: string
    profileImage?: string
    verificationStatus: string
    rating?: number
    isMerchant: boolean
  }
}

export interface ProductFilters {
  category?: string
  subCategory?: string
  minPrice?: number
  maxPrice?: number
  size?: string
  color?: string
  condition?: number
  location?: string
  sortBy: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'most-viewed'
}

interface ProductsState {
  products: Product[]
  userProducts: Product[]
  wishlist: Product[]
  currentProduct: Product | null
  filters: ProductFilters
  searchQuery: string
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  error: string | null
}

const initialState: ProductsState = {
  products: [],
  userProducts: [],
  wishlist: [],
  currentProduct: null,
  filters: {
    sortBy: 'newest',
  },
  searchQuery: '',
  isLoading: false,
  isLoadingMore: false,
  hasMore: true,
  error: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setLoadingMore: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMore = action.payload
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload
      state.hasMore = action.payload.length === 20
    },
    appendToProducts: (state, action: PayloadAction<Product[]>) => {
      state.products.push(...action.payload)
      state.hasMore = action.payload.length === 20
    },
    setUserProducts: (state, action: PayloadAction<Product[]>) => {
      state.userProducts = action.payload
    },
    setWishlist: (state, action: PayloadAction<Product[]>) => {
      state.wishlist = action.payload
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.unshift(action.payload)
      state.userProducts.unshift(action.payload)
    },
    updateProduct: (state, action: PayloadAction<{ id: string; updates: Partial<Product> }>) => {
      const updateProductInArray = (products: Product[]) => {
        const index = products.findIndex(product => product.id === action.payload.id)
        if (index !== -1) {
          products[index] = { ...products[index], ...action.payload.updates }
        }
      }
      
      updateProductInArray(state.products)
      updateProductInArray(state.userProducts)
      updateProductInArray(state.wishlist)
      
      if (state.currentProduct?.id === action.payload.id) {
        state.currentProduct = { ...state.currentProduct, ...action.payload.updates }
      }
    },
    toggleWishlist: (state, action: PayloadAction<string>) => {
      const toggleWishlistInArray = (products: Product[]) => {
        const product = products.find(p => p.id === action.payload)
        if (product) {
          product.isWishlisted = !product.isWishlisted
        }
      }
      
      toggleWishlistInArray(state.products)
      toggleWishlistInArray(state.userProducts)
      
      if (state.currentProduct?.id === action.payload) {
        state.currentProduct.isWishlisted = !state.currentProduct.isWishlisted
      }
      
      // Add/remove from wishlist array
      const productIndex = state.wishlist.findIndex(p => p.id === action.payload)
      if (productIndex !== -1) {
        state.wishlist.splice(productIndex, 1)
      } else {
        const product = state.products.find(p => p.id === action.payload) || 
                        state.userProducts.find(p => p.id === action.payload) ||
                        state.currentProduct
        if (product) {
          state.wishlist.unshift(product)
        }
      }
    },
    incrementViews: (state, action: PayloadAction<string>) => {
      const incrementViewsInArray = (products: Product[]) => {
        const product = products.find(p => p.id === action.payload)
        if (product) {
          product.viewsCount += 1
        }
      }
      
      incrementViewsInArray(state.products)
      incrementViewsInArray(state.userProducts)
      incrementViewsInArray(state.wishlist)
      
      if (state.currentProduct?.id === action.payload) {
        state.currentProduct.viewsCount += 1
      }
    },
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = { sortBy: 'newest' }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setLoading,
  setLoadingMore,
  setProducts,
  appendToProducts,
  setUserProducts,
  setWishlist,
  setCurrentProduct,
  addProduct,
  updateProduct,
  toggleWishlist,
  incrementViews,
  setFilters,
  clearFilters,
  setSearchQuery,
  setError,
  clearError,
} = productsSlice.actions

export default productsSlice.reducer
