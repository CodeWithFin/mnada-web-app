# Mnada Database Schema

This document outlines the PostgreSQL database schema for the Mnada social commerce platform.

## Core Tables

### Users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    location VARCHAR(100),
    website VARCHAR(255),
    phone_number VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    privacy_level VARCHAR(20) DEFAULT 'public', -- public, friends, private
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    
    -- Profile stats (denormalized for performance)
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    
    -- Additional fields
    push_notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    timezone VARCHAR(50) DEFAULT 'Africa/Nairobi'
);

-- Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### Posts
```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- 'snapfit', 'threadboard'
    title VARCHAR(255), -- Required for threadboard posts
    content TEXT,
    images JSONB, -- Array of image URLs and metadata
    location VARCHAR(100),
    tags JSONB, -- Array of tags
    visibility VARCHAR(20) DEFAULT 'public', -- public, followers, private
    
    -- ThreadBoard specific fields
    price DECIMAL(10,2),
    original_price DECIMAL(10,2),
    condition VARCHAR(20), -- new, excellent, good, fair
    category VARCHAR(50),
    subcategory VARCHAR(50),
    size VARCHAR(20),
    brand VARCHAR(100),
    color VARCHAR(50),
    material VARCHAR(100),
    is_negotiable BOOLEAN DEFAULT TRUE,
    shipping_options JSONB, -- Array of shipping options
    status VARCHAR(20) DEFAULT 'available', -- available, sold, reserved, hidden
    
    -- Engagement metrics (denormalized)
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    bookmarks_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sold_at TIMESTAMP,
    
    -- Search and ranking
    search_vector TSVECTOR,
    boost_score DECIMAL(5,2) DEFAULT 1.0, -- For promoted posts
    
    CONSTRAINT valid_post_type CHECK (type IN ('snapfit', 'threadboard')),
    CONSTRAINT threadboard_required_fields CHECK (
        (type != 'threadboard') OR 
        (title IS NOT NULL AND price IS NOT NULL)
    )
);

-- Indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_price ON posts(price);
CREATE INDEX idx_posts_location ON posts(location);
CREATE INDEX idx_posts_search_vector ON posts USING GIN(search_vector);

-- Trigger to update search vector
CREATE OR REPLACE FUNCTION update_post_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        COALESCE(NEW.title, '') || ' ' ||
        COALESCE(NEW.content, '') || ' ' ||
        COALESCE(NEW.brand, '') || ' ' ||
        COALESCE(NEW.category, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_search_vector_trigger
    BEFORE INSERT OR UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_post_search_vector();
```

### User Relationships
```sql
CREATE TABLE user_follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(follower_id, following_id),
    CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);
```

### Post Interactions
```sql
CREATE TABLE post_likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, post_id)
);

CREATE TABLE post_bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, post_id)
);

CREATE TABLE post_shares (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    platform VARCHAR(50), -- internal, whatsapp, instagram, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post_views (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for interactions
CREATE INDEX idx_post_likes_user_post ON post_likes(user_id, post_id);
CREATE INDEX idx_post_likes_post ON post_likes(post_id);
CREATE INDEX idx_post_bookmarks_user ON post_bookmarks(user_id);
CREATE INDEX idx_post_views_post ON post_views(post_id);
```

### Comments
```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE, -- For nested comments
    content TEXT NOT NULL,
    images JSONB, -- Optional images in comments
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
```

### Messaging System
```sql
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) DEFAULT 'direct', -- direct, group
    name VARCHAR(100), -- For group conversations
    image_url VARCHAR(500), -- For group conversations
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Denormalized fields for performance
    last_message_id INTEGER,
    last_message_at TIMESTAMP,
    participants_count INTEGER DEFAULT 0
);

CREATE TABLE conversation_participants (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- admin, member
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    is_muted BOOLEAN DEFAULT FALSE,
    
    UNIQUE(conversation_id, user_id)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    content TEXT,
    message_type VARCHAR(20) DEFAULT 'text', -- text, image, file, system
    metadata JSONB, -- For storing file info, reactions, etc.
    reply_to_id INTEGER REFERENCES messages(id),
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE message_reads (
    id SERIAL PRIMARY KEY,
    message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(message_id, user_id)
);

-- Message indexes
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);
```

### Museum Mnada
```sql
CREATE TABLE museum_pieces (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    era VARCHAR(100),
    category VARCHAR(50), -- traditional, colonial, modern, ceremonial
    cultural_significance TEXT,
    story TEXT,
    images JSONB NOT NULL,
    
    -- Donor information
    donor_name VARCHAR(100),
    donor_contact VARCHAR(255),
    donated_by_user_id INTEGER REFERENCES users(id),
    
    -- Item details
    condition VARCHAR(20), -- excellent, good, fair, needs-restoration
    materials JSONB, -- Array of materials
    colors JSONB, -- Array of colors
    dimensions JSONB, -- {height, width, length, weight}
    origin_location VARCHAR(100),
    estimated_year INTEGER,
    
    -- Museum metadata
    acquisition_date DATE,
    catalog_number VARCHAR(50) UNIQUE,
    current_location VARCHAR(100),
    is_on_display BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_notes TEXT,
    verified_by INTEGER REFERENCES users(id),
    verified_at TIMESTAMP,
    
    -- Engagement
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    
    -- Search
    search_vector TSVECTOR,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_museum_pieces_category ON museum_pieces(category);
CREATE INDEX idx_museum_pieces_era ON museum_pieces(era);
CREATE INDEX idx_museum_pieces_verified ON museum_pieces(is_verified);
CREATE INDEX idx_museum_pieces_display ON museum_pieces(is_on_display);
CREATE INDEX idx_museum_pieces_search_vector ON museum_pieces USING GIN(search_vector);
```

### Notifications
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- like, comment, follow, message, sale, etc.
    title VARCHAR(255) NOT NULL,
    content TEXT,
    data JSONB, -- Additional data specific to notification type
    
    -- Related entities
    related_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    related_post_id INTEGER REFERENCES posts(id) ON DELETE SET NULL,
    related_comment_id INTEGER REFERENCES comments(id) ON DELETE SET NULL,
    
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
```

### User Preferences & Settings
```sql
CREATE TABLE user_preferences (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    
    -- Privacy settings
    profile_visibility VARCHAR(20) DEFAULT 'public',
    show_location BOOLEAN DEFAULT TRUE,
    show_phone BOOLEAN DEFAULT FALSE,
    allow_messages_from VARCHAR(20) DEFAULT 'everyone', -- everyone, followers, none
    
    -- Notification preferences
    email_on_follow BOOLEAN DEFAULT TRUE,
    email_on_like BOOLEAN DEFAULT FALSE,
    email_on_comment BOOLEAN DEFAULT TRUE,
    email_on_message BOOLEAN DEFAULT TRUE,
    push_on_follow BOOLEAN DEFAULT TRUE,
    push_on_like BOOLEAN DEFAULT FALSE,
    push_on_comment BOOLEAN DEFAULT TRUE,
    push_on_message BOOLEAN DEFAULT TRUE,
    
    -- Feed preferences
    show_snapfit BOOLEAN DEFAULT TRUE,
    show_threadboard BOOLEAN DEFAULT TRUE,
    content_filters JSONB, -- Array of filtered keywords/categories
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Analytics & Reporting
```sql
CREATE TABLE user_analytics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Engagement metrics
    profile_views INTEGER DEFAULT 0,
    post_likes_received INTEGER DEFAULT 0,
    post_comments_received INTEGER DEFAULT 0,
    new_followers INTEGER DEFAULT 0,
    posts_created INTEGER DEFAULT 0,
    
    -- Activity metrics
    time_spent_minutes INTEGER DEFAULT 0,
    posts_viewed INTEGER DEFAULT 0,
    searches_performed INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    
    UNIQUE(user_id, date)
);

CREATE TABLE post_analytics (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    bookmarks INTEGER DEFAULT 0,
    
    -- For ThreadBoard posts
    inquiries INTEGER DEFAULT 0, -- Messages about the item
    
    UNIQUE(post_id, date)
);
```

## Triggers & Functions

### Update counters when interactions change
```sql
-- Function to update post like count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_likes_count_trigger
    AFTER INSERT OR DELETE ON post_likes
    FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- Similar triggers for comments, bookmarks, follows, etc.
```

### Search optimization
```sql
-- Function to update search vectors for museum pieces
CREATE OR REPLACE FUNCTION update_museum_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        COALESCE(NEW.title, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.story, '') || ' ' ||
        COALESCE(NEW.cultural_significance, '') || ' ' ||
        COALESCE(NEW.era, '') || ' ' ||
        COALESCE(NEW.category, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_museum_search_vector_trigger
    BEFORE INSERT OR UPDATE ON museum_pieces
    FOR EACH ROW EXECUTE FUNCTION update_museum_search_vector();
```

## Views for Common Queries

### User feed view
```sql
CREATE VIEW user_feed AS
SELECT 
    p.*,
    u.username,
    u.name,
    u.avatar_url,
    u.is_verified,
    EXISTS(SELECT 1 FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = $1) as is_liked_by_user,
    EXISTS(SELECT 1 FROM post_bookmarks pb WHERE pb.post_id = p.id AND pb.user_id = $1) as is_bookmarked_by_user
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.visibility = 'public' 
   OR (p.visibility = 'followers' AND EXISTS(
       SELECT 1 FROM user_follows uf 
       WHERE uf.following_id = p.user_id AND uf.follower_id = $1
   ))
ORDER BY p.created_at DESC;
```

### User stats view
```sql
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.username,
    u.name,
    COUNT(DISTINCT f1.follower_id) as followers_count,
    COUNT(DISTINCT f2.following_id) as following_count,
    COUNT(DISTINCT p.id) as posts_count,
    SUM(p.likes_count) as total_likes_received
FROM users u
LEFT JOIN user_follows f1 ON u.id = f1.following_id
LEFT JOIN user_follows f2 ON u.id = f2.follower_id
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id, u.username, u.name;
```

## Security Considerations

1. **Row Level Security (RLS)**: Enable RLS for sensitive tables
2. **Audit Trail**: Consider adding audit tables for important operations
3. **Data Encryption**: Encrypt sensitive fields like email, phone
4. **Rate Limiting**: Implement at application level
5. **Soft Deletes**: For user accounts and important content

## Performance Optimization

1. **Partitioning**: Consider partitioning large tables by date
2. **Connection Pooling**: Use pgBouncer or similar
3. **Read Replicas**: For read-heavy operations
4. **Caching**: Redis for sessions, frequently accessed data
5. **Background Jobs**: For heavy operations like analytics

## Backup Strategy

1. **Daily automated backups**
2. **Point-in-time recovery**
3. **Cross-region replication**
4. **Regular backup testing**
