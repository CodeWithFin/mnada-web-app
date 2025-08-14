-- Mnada Web App Database Schema v2.0
-- Clean, optimized database schema for the Mnada fashion platform
-- Run this in your Supabase SQL editor to set up all tables, functions, and policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing functions and triggers if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- ===========================================
-- CORE TABLES
-- ===========================================

-- Categories table (create first as it's referenced by products)
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  image_url TEXT NOT NULL,
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table (for SnapFit social feed)
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  caption TEXT,
  image_url TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0 CHECK (likes_count >= 0),
  comments_count INTEGER DEFAULT 0 CHECK (comments_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table
CREATE TABLE likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Comments table
CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Follows table
CREATE TABLE follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shopping cart table
CREATE TABLE cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_available ON products(is_available);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
-- Accelerate ILIKE searches on name/description
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_description_trgm ON products USING GIN (description gin_trgm_ops);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- ===========================================
-- FUNCTIONS AND TRIGGERS
-- ===========================================

-- Function to automatically create user profile when auth user is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO users (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
EXCEPTION 
  WHEN OTHERS THEN
    -- Log error but don't fail auth
    RAISE LOG 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updating timestamps
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at 
  BEFORE UPDATE ON cart_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Maintain posts counters
CREATE OR REPLACE FUNCTION handle_like_change()
RETURNS TRIGGER 
LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END; $$;

CREATE OR REPLACE FUNCTION handle_comment_change()
RETURNS TRIGGER 
LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END; $$;

DROP TRIGGER IF EXISTS likes_counter_ins ON likes;
DROP TRIGGER IF EXISTS likes_counter_del ON likes;
CREATE TRIGGER likes_counter_ins AFTER INSERT ON likes FOR EACH ROW EXECUTE FUNCTION handle_like_change();
CREATE TRIGGER likes_counter_del AFTER DELETE ON likes FOR EACH ROW EXECUTE FUNCTION handle_like_change();

DROP TRIGGER IF EXISTS comments_counter_ins ON comments;
DROP TRIGGER IF EXISTS comments_counter_del ON comments;
CREATE TRIGGER comments_counter_ins AFTER INSERT ON comments FOR EACH ROW EXECUTE FUNCTION handle_comment_change();
CREATE TRIGGER comments_counter_del AFTER DELETE ON comments FOR EACH ROW EXECUTE FUNCTION handle_comment_change();

-- ===========================================
-- ROW LEVEL SECURITY POLICIES
-- ===========================================

-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view user profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Categories table policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- Products table policies  
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available products" ON products
  FOR SELECT USING (is_available = true);

CREATE POLICY "Sellers can manage their products" ON products
  FOR ALL USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can insert products" ON products
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Posts table policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view posts" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- Likes table policies
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their likes" ON likes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can insert likes" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Comments table policies
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their comments" ON comments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can insert comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Follows table policies
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view follows" ON follows
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their follows" ON follows
  FOR ALL USING (auth.uid() = follower_id);

CREATE POLICY "Users can insert follows" ON follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

-- Orders table policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Order items table policies
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view order items for their orders" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Cart items table policies
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can insert cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ===========================================
-- STORAGE BUCKETS AND POLICIES
-- ===========================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('products', 'products', true),
  ('posts', 'posts', true)
ON CONFLICT (id) DO NOTHING;

-- Avatar storage policies
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Product image storage policies
CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'products' 
    AND auth.role() = 'authenticated'
  );

-- Post image storage policies
CREATE POLICY "Anyone can view post images" ON storage.objects
  FOR SELECT USING (bucket_id = 'posts');

CREATE POLICY "Users can upload post images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'posts' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own post images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'posts' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own post images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'posts' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ===========================================
-- INITIAL DATA
-- ===========================================

-- Insert default categories
INSERT INTO categories (name, description) VALUES
  ('Traditional Wear', 'Authentic African traditional clothing and accessories'),
  ('Modern African', 'Contemporary African-inspired fashion'),
  ('Accessories', 'Jewelry, bags, and other fashion accessories'),
  ('Men''s Fashion', 'Clothing and accessories for men'),
  ('Women''s Fashion', 'Clothing and accessories for women'),
  ('Children''s Wear', 'African fashion for kids and babies'),
  ('Textiles', 'African fabrics and textiles'),
  ('Footwear', 'Traditional and modern African-inspired shoes');

-- ===========================================
-- SEED SAMPLE DATA (Demo users, products, and posts)
-- Run this section once in the Supabase SQL editor after schema setup
-- Safe to re-run: guarded by email/name existence checks
-- ===========================================

-- Create two demo auth users (this will auto-create user profiles via trigger)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'seller1@demo.mnada') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
    VALUES (
      gen_random_uuid(),
      'seller1@demo.mnada',
      crypt('Password123!', gen_salt('bf')),
      NOW(),
      jsonb_build_object('display_name','Amina Styles','avatar_url','https://i.pravatar.cc/150?img=5')
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'seller2@demo.mnada') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
    VALUES (
      gen_random_uuid(),
      'seller2@demo.mnada',
      crypt('Password123!', gen_salt('bf')),
      NOW(),
      jsonb_build_object('display_name','Kwame Tailor','avatar_url','https://i.pravatar.cc/150?img=12')
    );
  END IF;
END$$;

-- Resolve demo user ids
WITH u1 AS (
  SELECT id AS user_id FROM auth.users WHERE email = 'seller1@demo.mnada'
), u2 AS (
  SELECT id AS user_id FROM auth.users WHERE email = 'seller2@demo.mnada'
), c AS (
  SELECT name, id FROM categories
)
-- Insert demo products (idempotent on name + seller)
INSERT INTO products (seller_id, category_id, name, description, price, image_url, stock_quantity, is_available)
SELECT u.user_id,
       (SELECT id FROM c WHERE name = p.category_name),
       p.name,
       p.description,
       p.price,
       p.image_url,
       p.stock_quantity,
       true
FROM (
  VALUES
    ((SELECT user_id FROM u1), 'Traditional Wear', 'Kitenge Maxi Dress', 'Vibrant Ankara maxi dress with bold prints', 79.99, 'https://via.placeholder.com/640x480?text=Kitenge+Maxi+Dress', 12),
    ((SELECT user_id FROM u1), 'Modern African', 'Dashiki Hoodie', 'Comfortable hoodie with African-inspired patterns', 59.99, 'https://via.placeholder.com/640x480?text=Dashiki+Hoodie', 20),
    ((SELECT user_id FROM u1), 'Accessories', 'Beaded Maasai Necklace', 'Handmade multicolor beaded necklace', 24.50, 'https://via.placeholder.com/640x480?text=Maasai+Necklace', 50),
    ((SELECT user_id FROM u2), 'Men''s Fashion', 'Agbada Set', 'Elegant agbada with intricate embroidery', 149.00, 'https://via.placeholder.com/640x480?text=Agbada+Set', 5),
    ((SELECT user_id FROM u2), 'Women''s Fashion', 'Headwrap Collection', 'Set of 3 African print headwraps', 29.99, 'https://via.placeholder.com/640x480?text=Headwrap+Collection', 30),
    ((SELECT user_id FROM u2), 'Footwear', 'Leather Sandals', 'Handcrafted leather sandals with beadwork', 39.95, 'https://via.placeholder.com/640x480?text=Leather+Sandals', 18),
    ((SELECT user_id FROM u1), 'Textiles', 'Wax Print Fabric (5 yards)', 'High-quality wax print fabric', 34.00, 'https://via.placeholder.com/640x480?text=Wax+Print+Fabric', 40),
    ((SELECT user_id FROM u2), 'Children''s Wear', 'Baby Ankara Romper', 'Cute Ankara romper for babies', 22.00, 'https://via.placeholder.com/640x480?text=Baby+Ankara+Romper', 25)
) AS p (seller_id, category_name, name, description, price, image_url, stock_quantity)
JOIN (SELECT user_id FROM u1 UNION ALL SELECT user_id FROM u2) u ON u.user_id = p.seller_id
WHERE NOT EXISTS (
  SELECT 1 FROM products pr
  WHERE pr.name = p.name AND pr.seller_id = p.seller_id
);

-- Insert demo SnapFit posts
WITH u1 AS (
  SELECT id AS user_id FROM auth.users WHERE email = 'seller1@demo.mnada'
), u2 AS (
  SELECT id AS user_id FROM auth.users WHERE email = 'seller2@demo.mnada'
)
INSERT INTO posts (user_id, caption, image_url, created_at)
SELECT p.user_id, p.caption, p.image_url, NOW() - (p.offset_days || ' days')::interval
FROM (
  VALUES
    ((SELECT user_id FROM u1), 'Today''s Ankara vibes ✨', 'https://via.placeholder.com/1080x1080?text=SnapFit+Look+1', 1),
    ((SELECT user_id FROM u1), 'Weekend dashiki fit 🔥', 'https://via.placeholder.com/1080x1080?text=SnapFit+Look+2', 2),
    ((SELECT user_id FROM u2), 'Classic agbada drip 💫', 'https://via.placeholder.com/1080x1080?text=SnapFit+Look+3', 3),
    ((SELECT user_id FROM u2), 'Beaded accessories for the win 💎', 'https://via.placeholder.com/1080x1080?text=SnapFit+Look+4', 4)
) AS p (user_id, caption, image_url, offset_days)
WHERE NOT EXISTS (
  SELECT 1 FROM posts po
  WHERE po.user_id = p.user_id AND po.caption = p.caption
);

-- ===========================================
-- DATABASE COMMENTS
-- ===========================================

COMMENT ON TABLE users IS 'User profiles extending Supabase auth';
COMMENT ON TABLE categories IS 'Product categories for marketplace';
COMMENT ON TABLE products IS 'Marketplace products for sale';
COMMENT ON TABLE posts IS 'Social media posts for SnapFit feed';
COMMENT ON TABLE likes IS 'User likes on posts';
COMMENT ON TABLE comments IS 'Comments on posts';
COMMENT ON TABLE follows IS 'User follow relationships';
COMMENT ON TABLE orders IS 'E-commerce orders';
COMMENT ON TABLE order_items IS 'Items within orders';
COMMENT ON TABLE cart_items IS 'Shopping cart items';
