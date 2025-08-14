import { createClient } from '@supabase/supabase-js'

// These should be replaced with your actual Supabase URL and anon key
// You can find these in your Supabase dashboard under Settings > API
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  users: 'users',
  products: 'products',
  posts: 'posts',
  likes: 'likes',
  comments: 'comments',
  follows: 'follows',
  orders: 'orders',
  order_items: 'order_items',
  categories: 'categories',
  cart_items: 'cart_items'
} as const

// Storage bucket names
export const BUCKETS = {
  avatars: 'avatars',
  products: 'products',
  posts: 'posts'
} as const
