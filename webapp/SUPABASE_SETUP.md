# Supabase Setup Guide for Mnada Web App

This guide will help you set up Supabase for your Mnada fashion platform.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `mnada-web-app`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest to your users
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (looks like: `https://your-project-ref.supabase.co`)
   - **Project API keys** > **anon public** (starts with `eyJ...`)

## 3. Configure Environment Variables

1. In your webapp folder, create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and replace the placeholder values:
   ```env
   REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 4. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql` file
4. Paste it into the SQL editor
5. Click "Run" to execute the schema
6. You should see "Success. No rows returned" message

This will create:
- All necessary tables (users, products, posts, etc.)
- Row Level Security (RLS) policies
- Storage buckets for images
- Database functions and triggers
- Sample categories

## 5. Configure Authentication

1. Go to **Authentication** > **Settings**
2. Configure email templates (optional):
   - **Confirm signup**: Customize the email sent to new users
   - **Reset password**: Customize password reset emails
3. Set up providers (optional):
   - Enable social login (Google, GitHub, etc.) if desired
4. Configure redirect URLs:
   - Add your development URL: `http://localhost:3000`
   - Add your production URL when you deploy

## 6. Set Up Storage

1. Go to **Storage**
2. You should see three buckets created by the schema:
   - `avatars` - For user profile pictures
   - `products` - For product images
   - `posts` - For social media post images
3. All buckets are configured to be public for reading

## 7. Test the Connection

1. Start your development server:
   ```bash
   npm start
   ```

2. Open your browser and go to `http://localhost:3000`
3. Try to register a new account
4. Check the Supabase dashboard:
   - Go to **Authentication** > **Users** to see your new user
   - Go to **Table Editor** > **users** to see the user profile created

## 8. Switching to Supabase Implementation

To use the new Supabase-powered marketplace:

1. Update App.tsx to use the new MarketplacePageSupabase:
   ```tsx
   // Change this import
   import MarketplacePage from './pages/MarketplacePage';
   // To this
   import MarketplacePage from './pages/MarketplacePageSupabase';
   ```

## 9. Adding Sample Data (Optional)

To test the marketplace with sample data, run this SQL in the SQL Editor:

```sql
-- Insert sample categories (these are already added by schema)
-- Insert sample products
INSERT INTO products (seller_id, category_id, name, description, price, image_url, stock_quantity) 
VALUES 
  (
    (SELECT id FROM users LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Traditional Wear' LIMIT 1),
    'Elegant Ankara Dress',
    'Beautiful handcrafted Ankara dress perfect for special occasions',
    89.99,
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    5
  ),
  (
    (SELECT id FROM users LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Accessories' LIMIT 1),
    'Beaded Necklace Set',
    'Authentic African beaded necklace and earring set',
    34.99,
    'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    10
  );
```

## 10. Next Steps

With Supabase set up, you can now:

1. **Update other pages** to use real data:
   - SnapFitFeed.tsx for social posts
   - Upload functionality for products and posts
   
2. **Implement missing features**:
   - Shopping cart functionality
   - Order management
   - User profiles
   - Image upload to Supabase storage

3. **Deploy your app**:
   - Add production URL to Supabase settings
   - Set up environment variables on your hosting platform

## Troubleshooting

### Connection Issues
- Verify your environment variables are correct
- Make sure you copied the full anon key (it's very long)
- Check that your .env file is in the correct location

### Authentication Issues
- Check that RLS policies are enabled
- Verify email confirmation settings
- Look at browser console for error messages

### Database Issues
- Ensure the schema was executed completely
- Check table permissions in Table Editor
- Verify RLS policies are working

### Need Help?
- Check Supabase documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Visit Supabase Discord for community support
- Check the browser console and Supabase logs for error details

## Security Notes

- Never commit your `.env` file to git (it's already in .gitignore)
- Use environment variables for production deployment
- The anon key is safe to use in frontend code
- RLS policies protect your data even with the anon key
- Consider setting up additional security rules for production
