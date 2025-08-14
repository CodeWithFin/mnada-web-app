import { supabase, TABLES } from '../lib/supabase';

// Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  is_available: boolean;
  stock_quantity: number;
  category?: Category;
  seller?: User;
}

export interface Post {
  id: string;
  user_id: string;
  caption: string;
  image_url: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  user?: { id: string; display_name: string; avatar_url?: string };
  is_liked?: boolean;
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  follower_count: number;
  following_count: number;
  posts_count: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  user?: { id: string; display_name: string; avatar_url?: string };
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

// Product Services
export const productService = {
  async getAll(page = 1, limit = 20, category?: string, search?: string) {
    let query = supabase
      .from(TABLES.products)
      .select(`
        id,name,price,image_url,is_available,created_at,updated_at,description,category_id,seller_id,stock_quantity,
        category:categories(id,name),
        seller:users(id,display_name,avatar_url)
      `, { count: 'exact' })
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (category) {
      query = query.eq('category_id', category);
    }

    if (search) {
      const s = search.trim();
      if (s) {
        query = query.or(`name.ilike.%${s}%,description.ilike.%${s}%`);
      }
    }

    const { data, error, count } = await query;
    if (error) throw error;

    const rows = (data || []) as any[];
    const normalized: Product[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      price: Number(r.price),
      image_url: r.image_url,
      category_id: r.category_id,
      seller_id: r.seller_id,
      created_at: r.created_at,
      updated_at: r.updated_at,
      is_available: !!r.is_available,
      stock_quantity: r.stock_quantity ?? 0,
      category: Array.isArray(r.category) ? r.category[0] : r.category,
      seller: Array.isArray(r.seller) ? r.seller[0] : r.seller,
    }));

    return { products: normalized, total: count || 0 };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from(TABLES.products)
      .select(`
  *,
  category:categories(id,name),
  seller:users(id,display_name,avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    const r = data as any;
    const normalized: Product = {
      id: r.id,
      name: r.name,
      description: r.description,
      price: Number(r.price),
      image_url: r.image_url,
      category_id: r.category_id,
      seller_id: r.seller_id,
      created_at: r.created_at,
      updated_at: r.updated_at,
      is_available: !!r.is_available,
      stock_quantity: r.stock_quantity ?? 0,
      category: Array.isArray(r.category) ? r.category[0] : r.category,
      seller: Array.isArray(r.seller) ? r.seller[0] : r.seller,
    };
    return normalized;
  },

  async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from(TABLES.products)
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from(TABLES.products)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from(TABLES.products)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Post Services
export const postService = {
  async getFeed(page = 1, limit = 20, userId?: string) {
    const { data, error } = await supabase
      .from(TABLES.posts)
      .select(`
    id,user_id,caption,image_url,created_at,likes_count,comments_count,
    user:users(id,display_name,avatar_url)
      `)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    // Check if current user liked each post
    const base = (data || []).map((r: any) => ({
      id: r.id,
      user_id: r.user_id,
      caption: r.caption,
      image_url: r.image_url,
      created_at: r.created_at,
      likes_count: r.likes_count,
      comments_count: r.comments_count,
      user: Array.isArray(r.user) ? r.user[0] : r.user,
    })) as Post[];

    if (userId && base.length) {
      const postIds = base.map(post => post.id);
      const { data: likes } = await supabase
        .from(TABLES.likes)
        .select('post_id')
        .eq('user_id', userId)
        .in('post_id', postIds);

      const likedPostIds = new Set(likes?.map(like => like.post_id) || []);
      return base.map(post => ({ ...post, is_liked: likedPostIds.has(post.id) }));
    }

    return base;
  },

  async getById(id: string, userId?: string) {
    const { data, error } = await supabase
      .from(TABLES.posts)
      .select(`
        *,
        user:users(id, display_name, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Check if current user liked this post
    if (userId) {
      const { data: like } = await supabase
        .from(TABLES.likes)
        .select('id')
        .eq('user_id', userId)
        .eq('post_id', id)
        .single();

      return { ...data, is_liked: !!like };
    }

    return data;
  },

  async create(post: Omit<Post, 'id' | 'created_at' | 'likes_count' | 'comments_count'>) {
    const { data, error } = await supabase
      .from(TABLES.posts)
      .insert({
        ...post,
        likes_count: 0,
        comments_count: 0
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async like(postId: string, userId: string) {
    const { data, error } = await supabase
      .from(TABLES.likes)
      .insert({ post_id: postId, user_id: userId })
      .select()
      .single();

    if (error) throw error;

    // Update likes count
    await supabase.rpc('increment_post_likes', { post_id: postId });

    return data;
  },

  async unlike(postId: string, userId: string) {
    const { error } = await supabase
      .from(TABLES.likes)
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) throw error;

    // Update likes count
    await supabase.rpc('decrement_post_likes', { post_id: postId });
  },

  async delete(id: string) {
    const { error } = await supabase
      .from(TABLES.posts)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Cart Services
export const cartService = {
  async list(userId: string) {
    const { data, error } = await supabase
      .from(TABLES.cart_items)
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as CartItem[];
  },

  async add(userId: string, productId: string, quantity = 1) {
    // Upsert: if exists, increase quantity
    const { data, error } = await supabase
      .from(TABLES.cart_items)
      .upsert({ user_id: userId, product_id: productId, quantity }, { onConflict: 'user_id,product_id' })
      .select()
      .single();

    if (error) throw error;
    return data as CartItem;
  },

  async updateQuantity(userId: string, productId: string, quantity: number) {
    const { data, error } = await supabase
      .from(TABLES.cart_items)
      .update({ quantity })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .select()
      .single();

    if (error) throw error;
    return data as CartItem;
  },

  async remove(userId: string, productId: string) {
    const { error } = await supabase
      .from(TABLES.cart_items)
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    if (error) throw error;
  },

  async clear(userId: string) {
    const { error } = await supabase
      .from(TABLES.cart_items)
      .delete()
      .eq('user_id', userId);
    if (error) throw error;
  }
};

// User Services
export const userService = {
  async getProfile(id: string) {
    const { data, error } = await supabase
      .from(TABLES.users)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from(TABLES.users)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async follow(followerId: string, followingId: string) {
    const { data, error } = await supabase
      .from(TABLES.follows)
      .insert({ follower_id: followerId, following_id: followingId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async unfollow(followerId: string, followingId: string) {
    const { error } = await supabase
      .from(TABLES.follows)
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) throw error;
  }
};

// Category Services
export const categoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLES.categories)
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async create(category: Omit<Category, 'id'>) {
    const { data, error } = await supabase
      .from(TABLES.categories)
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Comment Services
export const commentService = {
  async listForPost(postId: string, limit = 20) {
    const { data, error } = await supabase
      .from(TABLES.comments)
      .select(`
        *,
        user:users(id, display_name, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []) as Comment[];
  },

  async add(postId: string, userId: string, content: string) {
    const { data, error } = await supabase
      .from(TABLES.comments)
      .insert({ post_id: postId, user_id: userId, content })
      .select(`
        *,
        user:users(id, display_name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return data as Comment;
  },

  async remove(commentId: string, userId: string) {
    const { error } = await supabase
      .from(TABLES.comments)
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId);

    if (error) throw error;
  }
};

// Storage Services
export const storageService = {
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return { path: data.path, publicUrl };
  },

  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  },

  getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }
};
