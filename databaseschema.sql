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
