-- MNADA Database Schema - Complete Migration
-- Run this in Supabase SQL Editor
-- Created: September 6, 2025

-- Enable UUID generation in Supabase/Postgres
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

---------------------------------------------------------
-- 1. USERS & PROFILES
---------------------------------------------------------
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password_hash TEXT NOT NULL,
  bio TEXT,
  profile_pic_url TEXT,
  location VARCHAR(100),
  role TEXT CHECK (role IN ('buyer', 'merchant', 'admin')) DEFAULT 'buyer',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------------
-- 2. MERCHANTS & VERIFICATION
---------------------------------------------------------
CREATE TABLE merchants (
  merchant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  business_name VARCHAR(150),
  kyc_doc_url TEXT,
  kyc_status TEXT CHECK (kyc_status IN ('pending','verified','rejected')) DEFAULT 'pending',
  rating DECIMAL(2,1) DEFAULT 0,
  total_sales INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE merchant_ratings (
  rating_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(merchant_id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
  stars INT CHECK (stars >= 1 AND stars <= 9),
  review TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------------
-- 3. SOCIAL FEATURES (SNAPFIT FEED + STREAKS)
---------------------------------------------------------
CREATE TABLE outfits (
  outfit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE outfit_likes (
  like_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outfit_id UUID REFERENCES outfits(outfit_id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(outfit_id, user_id)
);

CREATE TABLE outfit_comments (
  comment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outfit_id UUID REFERENCES outfits(outfit_id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE streaks (
  streak_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  last_post_date DATE,
  updated_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------------
-- 4. MARKETPLACE (THREADBOARD)
---------------------------------------------------------
CREATE TABLE products (
  product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(merchant_id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  tags TEXT[], -- Postgres array
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 1,
  image_url TEXT,
  status TEXT CHECK (status IN ('available','sold','reserved')) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(product_id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending','paid','shipped','completed','cancelled')) DEFAULT 'pending',
  payment_method TEXT CHECK (payment_method IN ('mpesa','card','wallet')),
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address TEXT,
  pickup_location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------------
-- 5. MUSEUM MNADA (DONATIONS & CREDITS)
---------------------------------------------------------
CREATE TABLE donations (
  donation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  item_name VARCHAR(150),
  description TEXT,
  image_url TEXT,
  status TEXT CHECK (status IN ('pending','refined','listed')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE credits (
  credit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  balance DECIMAL(10,2) DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);

CREATE TABLE credit_transactions (
  txn_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT CHECK (type IN ('earned','spent','donation_reward')),
  created_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------------
-- 6. FOUNDATION MODE (SOCIAL IMPACT)
---------------------------------------------------------
CREATE TABLE foundation_donations (
  fd_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  method TEXT CHECK (method IN ('mpesa','card','wallet')),
  purpose VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE foundation_projects (
  project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(150),
  description TEXT,
  total_raised DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------------
-- 7. PAYMENTS & WALLETS
---------------------------------------------------------
CREATE TABLE wallets (
  wallet_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  balance DECIMAL(10,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
  txn_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(order_id),
  amount DECIMAL(10,2) NOT NULL,
  method TEXT CHECK (method IN ('mpesa','card','wallet')),
  status TEXT CHECK (status IN ('initiated','success','failed')) DEFAULT 'initiated',
  created_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------------
-- 8. SUPPORT MODULES (NOTIFICATIONS + EVENTS)
---------------------------------------------------------
CREATE TABLE notifications (
  notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(150),
  message TEXT,
  type TEXT CHECK (type IN ('order','like','comment','streak','system')),
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(150),
  description TEXT,
  sponsor VARCHAR(150),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sponsored_streaks (
  ss_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(event_id) ON DELETE CASCADE,
  reward DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------------
-- 9. MEDIA TABLE (MULTI-IMAGE SUPPORT)
---------------------------------------------------------
CREATE TABLE media (
  media_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_type TEXT CHECK (ref_type IN ('outfit','product','donation','profile','kyc')) NOT NULL,
  ref_id UUID NOT NULL,
  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  file_size INT,
  mime_type VARCHAR(100),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------------
-- 10. INDEXES FOR PERFORMANCE
---------------------------------------------------------

-- User indexes
CREATE UNIQUE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Product indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_merchant_id ON products(merchant_id);
CREATE INDEX idx_products_tags ON products USING gin(tags);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Outfit indexes
CREATE INDEX idx_outfits_user_id ON outfits(user_id);
CREATE INDEX idx_outfits_created_at ON outfits(created_at DESC);

-- Order indexes
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Media indexes
CREATE INDEX idx_media_ref_type_id ON media(ref_type, ref_id);
CREATE INDEX idx_media_ref_id ON media(ref_id);

-- Notification indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read_status ON notifications(read_status);

-- Transaction indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);

---------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
---------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Users can read their own data and public profiles
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for outfits (social feed)
CREATE POLICY "Outfits are publicly readable" ON outfits FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users can insert own outfits" ON outfits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own outfits" ON outfits FOR UPDATE USING (auth.uid() = user_id);

-- Products are publicly readable, merchants can manage their own
CREATE POLICY "Products are publicly readable" ON products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Merchants can manage own products" ON products FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM merchants WHERE merchant_id = products.merchant_id
  )
);

-- Orders are private to buyer and merchant
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (
  auth.uid() = buyer_id OR 
  auth.uid() IN (
    SELECT m.user_id FROM merchants m 
    JOIN products p ON p.merchant_id = m.merchant_id 
    WHERE p.product_id = orders.product_id
  )
);

-- Wallets and credits are private
CREATE POLICY "Users can view own wallet" ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own credits" ON credits FOR SELECT USING (auth.uid() = user_id);

-- Media follows the same policy as the referenced object
CREATE POLICY "Media follows ref object permissions" ON media FOR SELECT USING (
  CASE ref_type
    WHEN 'outfit' THEN true  -- Outfits are public
    WHEN 'product' THEN true  -- Products are public
    WHEN 'profile' THEN ref_id = auth.uid()  -- Profile pics are private to user
    WHEN 'kyc' THEN ref_id IN (SELECT user_id FROM merchants WHERE user_id = auth.uid())  -- KYC docs private to merchant
    WHEN 'donation' THEN ref_id IN (SELECT donation_id FROM donations WHERE donor_id = auth.uid())  -- Donations private to donor
    ELSE false
  END
);

---------------------------------------------------------
-- 12. FUNCTIONS AND TRIGGERS
---------------------------------------------------------

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update outfit counts when likes/comments change
CREATE OR REPLACE FUNCTION update_outfit_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'outfit_likes' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE outfits SET likes_count = likes_count + 1 WHERE outfit_id = NEW.outfit_id;
            RETURN NEW;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE outfits SET likes_count = likes_count - 1 WHERE outfit_id = OLD.outfit_id;
            RETURN OLD;
        END IF;
    ELSIF TG_TABLE_NAME = 'outfit_comments' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE outfits SET comments_count = comments_count + 1 WHERE outfit_id = NEW.outfit_id;
            RETURN NEW;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE outfits SET comments_count = comments_count - 1 WHERE outfit_id = OLD.outfit_id;
            RETURN OLD;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Triggers for outfit counts
CREATE TRIGGER outfit_likes_count_trigger
    AFTER INSERT OR DELETE ON outfit_likes
    FOR EACH ROW EXECUTE FUNCTION update_outfit_counts();

CREATE TRIGGER outfit_comments_count_trigger
    AFTER INSERT OR DELETE ON outfit_comments
    FOR EACH ROW EXECUTE FUNCTION update_outfit_counts();

-- Function to update streak when outfit is posted
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
    last_post DATE;
    current_streak_val INT;
BEGIN
    -- Get current streak info
    SELECT last_post_date, current_streak INTO last_post, current_streak_val
    FROM streaks WHERE user_id = NEW.user_id;
    
    -- If no streak record exists, create one
    IF NOT FOUND THEN
        INSERT INTO streaks (user_id, current_streak, last_post_date)
        VALUES (NEW.user_id, 1, CURRENT_DATE);
        RETURN NEW;
    END IF;
    
    -- Check if posting today
    IF CURRENT_DATE = last_post THEN
        -- Already posted today, no change
        RETURN NEW;
    ELSIF CURRENT_DATE = last_post + INTERVAL '1 day' THEN
        -- Posted yesterday, increment streak
        UPDATE streaks 
        SET current_streak = current_streak_val + 1, 
            last_post_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE user_id = NEW.user_id;
    ELSE
        -- Streak broken, reset to 1
        UPDATE streaks 
        SET current_streak = 1, 
            last_post_date = CURRENT_DATE,
            updated_at = NOW()
        WHERE user_id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for streak updates
CREATE TRIGGER update_streak_trigger
    AFTER INSERT ON outfits
    FOR EACH ROW EXECUTE FUNCTION update_user_streak();

-- Schema creation complete
-- Run seed_mnada.sql next to populate with sample data
