-- MNADA Database Seed Data
-- Run this after mnada_schema_supabase.sql
-- This script is idempotent (safe to run multiple times)

-- Clear existing data (be careful in production!)
TRUNCATE TABLE 
  sponsored_streaks, events, notifications, transactions, wallets, 
  foundation_projects, foundation_donations, credit_transactions, credits, 
  donations, orders, products, merchant_ratings, merchants, 
  outfit_comments, outfit_likes, outfits, streaks, media, users 
CASCADE;

---------------------------------------------------------
-- 1. SEED USERS
---------------------------------------------------------
INSERT INTO users (user_id, name, username, email, phone, password_hash, bio, location, role) VALUES
-- Regular buyers
('550e8400-e29b-41d4-a716-446655440001', 'Aisha Kimani', 'aisha_k', 'aisha@example.com', '+254700000001', '$2b$10$hashedpassword1', 'Fashion enthusiast from Nairobi', 'Nairobi', 'buyer'),
('550e8400-e29b-41d4-a716-446655440002', 'James Mwangi', 'james_m', 'james@example.com', '+254700000002', '$2b$10$hashedpassword2', 'Love streetwear and local brands', 'Kisumu', 'buyer'),
('550e8400-e29b-41d4-a716-446655440003', 'Grace Wanjiku', 'grace_w', 'grace@example.com', '+254700000003', '$2b$10$hashedpassword3', 'Sustainable fashion advocate', 'Mombasa', 'buyer'),
('550e8400-e29b-41d4-a716-446655440004', 'David Ochieng', 'david_o', 'david@example.com', '+254700000004', '$2b$10$hashedpassword4', 'Designer and fashion blogger', 'Nakuru', 'buyer'),
('550e8400-e29b-41d4-a716-446655440005', 'Mercy Njeri', 'mercy_n', 'mercy@example.com', '+254700000005', '$2b$10$hashedpassword5', 'Vintage fashion collector', 'Eldoret', 'buyer'),

-- Merchants
('550e8400-e29b-41d4-a716-446655440006', 'Sarah Mutisya', 'sarah_designs', 'sarah@sarahdesigns.co.ke', '+254700000006', '$2b$10$hashedpassword6', 'Founder of Sarah Designs - Contemporary African wear', 'Nairobi', 'merchant'),
('550e8400-e29b-41d4-a716-446655440007', 'Peter Kamau', 'kamau_fashion', 'peter@kamaufashion.co.ke', '+254700000007', '$2b$10$hashedpassword7', 'Traditional meets modern fashion', 'Nairobi', 'merchant'),
('550e8400-e29b-41d4-a716-446655440008', 'Linda Atieno', 'linda_styles', 'linda@lindastyles.co.ke', '+254700000008', '$2b$10$hashedpassword8', 'Handmade accessories and jewelry', 'Kisumu', 'merchant'),

-- Admins
('550e8400-e29b-41d4-a716-446655440009', 'Admin User', 'admin', 'admin@mnada.app', '+254700000009', '$2b$10$hashedpassword9', 'MNADA Platform Administrator', 'Nairobi', 'admin'),
('550e8400-e29b-41d4-a716-446655440010', 'Test User', 'testuser', 'test@mnada.app', '+254700000010', '$2b$10$hashedpassword10', 'Test account for development', 'Nairobi', 'buyer');

---------------------------------------------------------
-- 2. SEED MERCHANTS
---------------------------------------------------------
INSERT INTO merchants (merchant_id, user_id, business_name, kyc_status, rating, total_sales) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'Sarah Designs', 'verified', 4.8, 45),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440007', 'Kamau Fashion House', 'verified', 4.5, 32),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440008', 'Linda Styles', 'pending', 0.0, 0),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'David O Designs', 'verified', 4.2, 18),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Mercy Vintage', 'rejected', 0.0, 0);

---------------------------------------------------------
-- 3. SEED PRODUCTS
---------------------------------------------------------
INSERT INTO products (product_id, merchant_id, name, description, category, tags, price, stock, status) VALUES
-- Sarah Designs products
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'Ankara Midi Dress', 'Beautiful ankara print midi dress with modern cut', 'Dresses', ARRAY['ankara', 'midi', 'african-print', 'contemporary'], 3500.00, 5, 'available'),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'Kente Blazer', 'Professional blazer with kente trim details', 'Blazers', ARRAY['kente', 'professional', 'blazer', 'office-wear'], 6500.00, 3, 'available'),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', 'Kitenge Jumpsuit', 'Elegant jumpsuit in vibrant kitenge fabric', 'Jumpsuits', ARRAY['kitenge', 'jumpsuit', 'elegant', 'african-print'], 4200.00, 2, 'available'),

-- Kamau Fashion House products
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440002', 'Maasai Shuka Wrap', 'Traditional Maasai shuka in modern wrap style', 'Traditional', ARRAY['maasai', 'shuka', 'traditional', 'wrap'], 2800.00, 8, 'available'),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440002', 'Kikuyu Traditional Set', 'Complete traditional Kikuyu outfit for ceremonies', 'Traditional', ARRAY['kikuyu', 'traditional', 'ceremony', 'complete-set'], 8500.00, 2, 'available'),
('750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440002', 'Modern Kanzu', 'Contemporary take on the traditional kanzu', 'Traditional', ARRAY['kanzu', 'modern', 'traditional', 'mens-wear'], 4500.00, 4, 'available'),

-- David O Designs products
('750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440004', 'Urban Street Tee', 'Locally designed streetwear tee with Nairobi graphics', 'T-Shirts', ARRAY['streetwear', 'urban', 'nairobi', 'graphics'], 1200.00, 15, 'available'),
('750e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440004', 'Safari Cargo Pants', 'Utility cargo pants inspired by Kenyan safari', 'Pants', ARRAY['cargo', 'safari', 'utility', 'outdoor'], 2500.00, 10, 'available'),
('750e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440004', 'Kikoy Beach Shorts', 'Beach shorts made from traditional kikoy fabric', 'Shorts', ARRAY['kikoy', 'beach', 'traditional', 'summer'], 1800.00, 12, 'available'),

-- Additional products
('750e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440001', 'Casual Ankara Top', 'Casual everyday top in ankara print', 'Tops', ARRAY['ankara', 'casual', 'everyday', 'top'], 2200.00, 6, 'available'),
('750e8400-e29b-41d4-a716-446655440011', '650e8400-e29b-41d4-a716-446655440002', 'Ceremony Headwrap', 'Elegant headwrap for special occasions', 'Accessories', ARRAY['headwrap', 'ceremony', 'elegant', 'accessories'], 800.00, 20, 'available'),
('750e8400-e29b-41d4-a716-446655440012', '650e8400-e29b-41d4-a716-446655440004', 'Logo Hoodie', 'Comfortable hoodie with local artist collaboration', 'Hoodies', ARRAY['hoodie', 'comfortable', 'local-artist', 'streetwear'], 3200.00, 8, 'available'),
('750e8400-e29b-41d4-a716-446655440013', '650e8400-e29b-41d4-a716-446655440001', 'Evening Gown', 'Stunning evening gown with beadwork details', 'Dresses', ARRAY['evening', 'gown', 'beadwork', 'formal'], 12500.00, 1, 'available'),
('750e8400-e29b-41d4-a716-446655440014', '650e8400-e29b-41d4-a716-446655440002', 'Mens Dashiki', 'Classic mens dashiki in earth tones', 'Traditional', ARRAY['dashiki', 'mens', 'earth-tones', 'classic'], 2800.00, 6, 'available'),
('750e8400-e29b-41d4-a716-446655440015', '650e8400-e29b-41d4-a716-446655440004', 'Denim Jacket', 'Upcycled denim jacket with African patch details', 'Jackets', ARRAY['denim', 'upcycled', 'african-patches', 'sustainable'], 4800.00, 3, 'available');

---------------------------------------------------------
-- 4. SEED OUTFITS (SNAPFIT FEED)
---------------------------------------------------------
INSERT INTO outfits (outfit_id, user_id, caption, likes_count, comments_count) VALUES
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Loving this new ankara dress from @sarah_designs! Perfect for Sunday brunch 💕 #AnkaraStyle #SundayVibes', 23, 5),
('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Street style in Kisumu. Rocking local brands! 🔥 #StreetStyle #LocalBrands', 45, 8),
('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Sustainable fashion is the future! This vintage piece tells a story 🌱 #SustainableFashion #Vintage', 67, 12),
('850e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440006', 'Behind the scenes at Sarah Designs studio. New collection coming soon! ✨ #BehindTheScenes #NewCollection', 89, 15),
('850e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 'Mixing traditional and modern elements. What do you think? 🤔 #TraditionalModern #Fashion', 34, 7),
('850e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440005', 'Found this amazing vintage piece at the market! One persons trash... 💎 #VintageFind #TreasureHunt', 56, 9),
('850e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440007', 'Embracing our heritage with this beautiful kente piece 🇰🇪 #Heritage #Kente #Proud', 78, 11),
('850e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440008', 'Handmade jewelry from the heart ❤️ Each piece tells a story #Handmade #Jewelry #Story', 42, 6),
('850e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440001', 'Office look on point! Blazer game strong 💪 #OfficeStyle #BlazerGame', 29, 4),
('850e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 'Weekend vibes in my favorite cargo pants 😎 #WeekendVibes #Cargo', 38, 6),
('850e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', 'Color blocking with African prints! Bold choices 🌈 #ColorBlocking #AfricanPrint', 52, 8),
('850e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440006', 'Evening wear for the MNADA launch event! ✨ #EveningWear #MNADALaunch', 95, 18);

---------------------------------------------------------
-- 5. SEED STREAKS
---------------------------------------------------------
INSERT INTO streaks (user_id, current_streak, last_post_date) VALUES
('550e8400-e29b-41d4-a716-446655440001', 7, CURRENT_DATE),
('550e8400-e29b-41d4-a716-446655440002', 12, CURRENT_DATE - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440003', 3, CURRENT_DATE),
('550e8400-e29b-41d4-a716-446655440004', 5, CURRENT_DATE - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440005', 1, CURRENT_DATE),
('550e8400-e29b-41d4-a716-446655440006', 15, CURRENT_DATE),
('550e8400-e29b-41d4-a716-446655440007', 8, CURRENT_DATE - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440008', 4, CURRENT_DATE);

---------------------------------------------------------
-- 6. SEED DONATIONS (MUSEUM MNADA)
---------------------------------------------------------
INSERT INTO donations (donation_id, donor_id, item_name, description, status) VALUES
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Vintage Kikoy Dress', '1980s kikoy dress in excellent condition', 'refined'),
('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'Traditional Beaded Necklace', 'Handmade beaded necklace from grandmother', 'pending'),
('950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 'Vintage Safari Jacket', 'Classic 1970s safari jacket', 'listed'),
('950e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Old Kanga Collection', '5 vintage kanga with historical significance', 'refined'),
('950e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 'Ceremonial Headpiece', 'Traditional ceremonial headpiece', 'pending');

---------------------------------------------------------
-- 7. SEED CREDITS AND TRANSACTIONS
---------------------------------------------------------
INSERT INTO credits (user_id, balance) VALUES
('550e8400-e29b-41d4-a716-446655440001', 350.00),
('550e8400-e29b-41d4-a716-446655440002', 120.00),
('550e8400-e29b-41d4-a716-446655440003', 280.00),
('550e8400-e29b-41d4-a716-446655440004', 450.00),
('550e8400-e29b-41d4-a716-446655440005', 200.00),
('550e8400-e29b-41d4-a716-446655440006', 800.00),
('550e8400-e29b-41d4-a716-446655440007', 150.00),
('550e8400-e29b-41d4-a716-446655440008', 90.00);

INSERT INTO credit_transactions (user_id, amount, type) VALUES
('550e8400-e29b-41d4-a716-446655440001', 250.00, 'donation_reward'),
('550e8400-e29b-41d4-a716-446655440001', 100.00, 'earned'),
('550e8400-e29b-41d4-a716-446655440003', 180.00, 'donation_reward'),
('550e8400-e29b-41d4-a716-446655440003', 100.00, 'earned'),
('550e8400-e29b-41d4-a716-446655440005', 200.00, 'donation_reward');

---------------------------------------------------------
-- 8. SEED WALLETS
---------------------------------------------------------
INSERT INTO wallets (user_id, balance) VALUES
('550e8400-e29b-41d4-a716-446655440001', 2500.00),
('550e8400-e29b-41d4-a716-446655440002', 1800.00),
('550e8400-e29b-41d4-a716-446655440003', 3200.00),
('550e8400-e29b-41d4-a716-446655440004', 1500.00),
('550e8400-e29b-41d4-a716-446655440005', 900.00),
('550e8400-e29b-41d4-a716-446655440006', 5400.00),
('550e8400-e29b-41d4-a716-446655440007', 2100.00),
('550e8400-e29b-41d4-a716-446655440008', 800.00);

---------------------------------------------------------
-- 9. SEED ORDERS
---------------------------------------------------------
INSERT INTO orders (order_id, product_id, buyer_id, status, payment_method, total_amount, shipping_address) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'completed', 'mpesa', 3500.00, '123 Kenyatta Ave, Kisumu'),
('a50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'shipped', 'card', 1200.00, '456 Moi Ave, Mombasa'),
('a50e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'paid', 'wallet', 2800.00, '789 Uhuru Highway, Nairobi'),
('a50e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440005', 'pending', 'mpesa', 2200.00, '321 Oginga Odinga St, Eldoret'),
('a50e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440004', 'completed', 'card', 3200.00, '654 Kenyatta St, Nakuru');

---------------------------------------------------------
-- 10. SEED FOUNDATION PROJECTS
---------------------------------------------------------
INSERT INTO foundation_projects (project_id, title, description, total_raised) VALUES
('b50e8400-e29b-41d4-a716-446655440001', 'Kibera Fashion Training Program', 'Providing sewing and fashion design training to youth in Kibera', 45000.00),
('b50e8400-e29b-41d4-a716-446655440002', 'Sustainable Fashion Initiative', 'Promoting eco-friendly fashion practices across Kenya', 28500.00),
('b50e8400-e29b-41d4-a716-446655440003', 'Rural Artisan Support', 'Supporting traditional craftspeople in rural areas', 19200.00),
('b50e8400-e29b-41d4-a716-446655440004', 'Women Entrepreneur Fund', 'Microloans for women starting fashion businesses', 67800.00),
('b50e8400-e29b-41d4-a716-446655440005', 'School Uniform Project', 'Providing school uniforms to underprivileged children', 15600.00);

---------------------------------------------------------
-- 11. SEED FOUNDATION DONATIONS
---------------------------------------------------------
INSERT INTO foundation_donations (user_id, amount, method, purpose) VALUES
('550e8400-e29b-41d4-a716-446655440001', 500.00, 'mpesa', 'Kibera Fashion Training Program'),
('550e8400-e29b-41d4-a716-446655440003', 1000.00, 'card', 'Sustainable Fashion Initiative'),
('550e8400-e29b-41d4-a716-446655440006', 2500.00, 'wallet', 'Women Entrepreneur Fund'),
('550e8400-e29b-41d4-a716-446655440002', 300.00, 'mpesa', 'School Uniform Project'),
('550e8400-e29b-41d4-a716-446655440004', 750.00, 'card', 'Rural Artisan Support');

---------------------------------------------------------
-- 12. SEED EVENTS
---------------------------------------------------------
INSERT INTO events (event_id, title, description, sponsor, start_date, end_date) VALUES
('c50e8400-e29b-41d4-a716-446655440001', 'Nairobi Fashion Week 2025', 'Annual showcase of Kenyan fashion talent', 'Kenya Fashion Council', '2025-10-15', '2025-10-22'),
('c50e8400-e29b-41d4-a716-446655440002', 'MNADA Launch Party', 'Official launch celebration for MNADA platform', 'MNADA Team', '2025-09-20', '2025-09-20'),
('c50e8400-e29b-41d4-a716-446655440003', 'Sustainable Fashion Summit', 'Conference on sustainable fashion practices', 'Green Fashion Kenya', '2025-11-05', '2025-11-07'),
('c50e8400-e29b-41d4-a716-446655440004', 'Youth Fashion Challenge', 'Design competition for young fashion designers', 'Youth Fashion Alliance', '2025-12-01', '2025-12-15'),
('c50e8400-e29b-41d4-a716-446655440005', 'Heritage Fashion Exhibition', 'Celebrating traditional Kenyan fashion', 'National Museums of Kenya', '2025-09-30', '2025-10-31');

---------------------------------------------------------
-- 13. SEED MEDIA (SAMPLE IMAGES)
---------------------------------------------------------
INSERT INTO media (ref_type, ref_id, url, alt_text, is_primary) VALUES
-- Product images
('product', '750e8400-e29b-41d4-a716-446655440001', 'https://example.com/images/ankara-midi-dress-1.jpg', 'Ankara Midi Dress - Front View', true),
('product', '750e8400-e29b-41d4-a716-446655440001', 'https://example.com/images/ankara-midi-dress-2.jpg', 'Ankara Midi Dress - Side View', false),
('product', '750e8400-e29b-41d4-a716-446655440002', 'https://example.com/images/kente-blazer-1.jpg', 'Kente Blazer - Professional Look', true),
('product', '750e8400-e29b-41d4-a716-446655440004', 'https://example.com/images/maasai-shuka-wrap-1.jpg', 'Maasai Shuka Wrap - Traditional Style', true),
('product', '750e8400-e29b-41d4-a716-446655440007', 'https://example.com/images/urban-street-tee-1.jpg', 'Urban Street Tee - Nairobi Graphics', true),

-- Outfit images
('outfit', '850e8400-e29b-41d4-a716-446655440001', 'https://example.com/images/outfit-1.jpg', 'Sunday brunch outfit in ankara dress', true),
('outfit', '850e8400-e29b-41d4-a716-446655440002', 'https://example.com/images/outfit-2.jpg', 'Street style look in Kisumu', true),
('outfit', '850e8400-e29b-41d4-a716-446655440003', 'https://example.com/images/outfit-3.jpg', 'Sustainable vintage fashion piece', true),
('outfit', '850e8400-e29b-41d4-a716-446655440004', 'https://example.com/images/outfit-4.jpg', 'Behind the scenes at Sarah Designs', true),

-- Profile pictures
('profile', '550e8400-e29b-41d4-a716-446655440001', 'https://example.com/images/profile-aisha.jpg', 'Aisha Kimani profile picture', true),
('profile', '550e8400-e29b-41d4-a716-446655440006', 'https://example.com/images/profile-sarah.jpg', 'Sarah Mutisya profile picture', true),

-- Donation images
('donation', '950e8400-e29b-41d4-a716-446655440001', 'https://example.com/images/vintage-kikoy-dress.jpg', 'Vintage Kikoy Dress for donation', true),
('donation', '950e8400-e29b-41d4-a716-446655440003', 'https://example.com/images/vintage-safari-jacket.jpg', 'Vintage Safari Jacket for donation', true);

---------------------------------------------------------
-- 14. SEED NOTIFICATIONS
---------------------------------------------------------
INSERT INTO notifications (user_id, title, message, type, read_status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Order Shipped!', 'Your Maasai Shuka Wrap has been shipped and is on its way!', 'order', false),
('550e8400-e29b-41d4-a716-446655440002', 'New Like!', 'aisha_k liked your street style post', 'like', true),
('550e8400-e29b-41d4-a716-446655440003', 'Streak Achievement!', 'Congratulations! You''ve maintained a 7-day posting streak!', 'streak', false),
('550e8400-e29b-41d4-a716-446655440006', 'New Order!', 'You have a new order for your Ankara Midi Dress', 'order', false),
('550e8400-e29b-41d4-a716-446655440004', 'Welcome to MNADA!', 'Welcome to the MNADA community! Start exploring fashion from across Kenya.', 'system', true);

-- Update sequences to ensure future inserts work properly
SELECT setval('users_user_id_seq', (SELECT MAX(user_id::text)::int FROM users WHERE user_id::text ~ '^[0-9]+$'), true);

-- Seed data insertion complete!
-- Total: 10 users, 5 merchants, 15 products, 12 outfits, 5 donations, 5 foundation projects
ANALYZE; -- Update table statistics for better query performance
