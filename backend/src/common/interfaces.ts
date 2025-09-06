export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface User {
  user_id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  bio?: string;
  profile_pic_url?: string;
  location?: string;
  role: 'buyer' | 'merchant' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface Merchant {
  merchant_id: string;
  user_id: string;
  business_name?: string;
  kyc_doc_url?: string;
  kyc_status: 'pending' | 'verified' | 'rejected';
  rating: number;
  total_sales: number;
  created_at: Date;
}

export interface Product {
  product_id: string;
  merchant_id: string;
  name: string;
  description?: string;
  category?: string;
  tags: string[];
  price: number;
  stock: number;
  image_url?: string;
  status: 'available' | 'sold' | 'reserved';
  created_at: Date;
}

export interface Outfit {
  outfit_id: string;
  user_id: string;
  image_url: string;
  caption?: string;
  likes_count: number;
  comments_count: number;
  created_at: Date;
}

export interface Order {
  order_id: string;
  product_id: string;
  buyer_id: string;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  payment_method: 'mpesa' | 'card' | 'wallet';
  total_amount: number;
  shipping_address?: string;
  pickup_location?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Donation {
  donation_id: string;
  donor_id: string;
  item_name?: string;
  description?: string;
  image_url?: string;
  status: 'pending' | 'refined' | 'listed';
  created_at: Date;
}

export interface CreditTransaction {
  txn_id: string;
  user_id: string;
  amount: number;
  type: 'earned' | 'spent' | 'donation_reward';
  created_at: Date;
}

export interface Media {
  media_id: string;
  ref_type: 'outfit' | 'product' | 'donation' | 'profile' | 'kyc';
  ref_id: string;
  url: string;
  alt_text?: string;
  file_size?: number;
  mime_type?: string;
  is_primary: boolean;
  created_at: Date;
}
