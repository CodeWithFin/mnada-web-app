import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { productService, postService, userService, categoryService } from '../services/database';
import type { Product, Post, User, Category } from '../services/database';

// Hook for fetching products
export const useProducts = (page = 1, limit = 20, category?: string, search?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await productService.getAll(page, limit, category, search);
      setProducts(result.products);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [page, limit, category, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, total, refetch: fetchProducts };
};

// Hook for fetching posts (social feed)
export const usePosts = (page = 1, limit = 20) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await postService.getFeed(page, limit, user?.id);
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [page, limit, user?.id]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const likePost = async (postId: string) => {
    if (!user) return;

    try {
      await postService.like(postId, user.id);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, is_liked: true, likes_count: post.likes_count + 1 }
          : post
      ));
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const unlikePost = async (postId: string) => {
    if (!user) return;

    try {
      await postService.unlike(postId, user.id);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, is_liked: false, likes_count: Math.max(post.likes_count - 1, 0) }
          : post
      ));
    } catch (err) {
      console.error('Failed to unlike post:', err);
    }
  };

  return { 
    posts, 
    loading, 
    error, 
    likePost, 
    unlikePost,
    refetch: fetchPosts 
  };
};

// Hook for fetching categories
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
};

// Hook for user profile
export const useUserProfile = (userId?: string) => {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || currentUser?.id;

  const fetchUser = useCallback(async () => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await userService.getProfile(targetUserId);
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const updateProfile = async (updates: Partial<User>) => {
    if (!targetUserId) return;

    try {
      const updatedUser = await userService.updateProfile(targetUserId, updates);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  return { 
    user, 
    loading, 
    error, 
    updateProfile,
    refetch: fetchUser 
  };
};

// Hook for uploading files
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (
    bucket: string, 
    file: File, 
    path?: string
  ): Promise<{ path: string; publicUrl: string } | null> => {
    try {
      setUploading(true);
      setError(null);

      // Generate path if not provided
      const filePath = path || `${Date.now()}-${file.name}`;

      const { storageService } = await import('../services/database');
      const result = await storageService.uploadFile(bucket, filePath, file);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error };
};

// Hook for managing likes (generic)
export const useLikes = () => {
  const { user } = useAuth();
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const toggleLike = (itemId: string) => {
    if (!user) return false;

    setLikedItems(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(itemId)) {
        newLiked.delete(itemId);
        return newLiked;
      } else {
        newLiked.add(itemId);
        return newLiked;
      }
    });

    return !likedItems.has(itemId);
  };

  const isLiked = (itemId: string) => likedItems.has(itemId);

  return { toggleLike, isLiked, likedItems };
};

// Hook for pagination
export const usePagination = (totalItems: number, itemsPerPage: number = 20) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const reset = () => setCurrentPage(1);

  return {
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    reset
  };
};
