# Mnada Web App - Product Requirements Document (PRD)

## 1. Executive Summary

**Product Name:** Mnada Web Application  
**Version:** 1.0 (MVP)  
**Target Launch:** Phase 1 - Single Town Launch  
**Product Type:** Social Commerce Web Application  

Mnada is a social-commerce web platform that combines fashion sharing, thrift marketplace, and community building for Kenyan youth. The platform enables users to showcase daily outfits (SnapFit), buy/sell fashion items (ThreadBoard), and participate in sustainable fashion initiatives (Museum Mnada).

## 2. Product Overview

### 2.1 Core Value Proposition
- Trusted marketplace for thrift and fashion items in Kenya
- Social platform for fashion inspiration and community building
- Sustainable fashion ecosystem through resale and donation programs

### 2.2 Target Users
- **Primary:** Fashion-forward Kenyan youth (18-30 years)
- **Secondary:** Verified fashion merchants and thrift sellers
- **Tertiary:** Fashion enthusiasts looking for inspiration

## 3. Functional Requirements

### 3.1 User Authentication & Profile Management

#### 3.1.1 User Registration
- Email/phone number registration
- Basic KYC verification for sellers (ID upload, phone verification)
- Profile creation with bio, location, fashion interests
- Profile photo upload capability

#### 3.1.2 User Profiles
- Public profile with user stats (posts, followers, following)
- Private settings for contact information
- Fashion preference tags/categories
- User verification badges (verified seller, active community member)

### 3.2 SnapFit Feed (Social Fashion Diary)

#### 3.2.1 Content Creation
- Photo upload functionality (drag-and-drop, file browser)
- Caption and hashtag support
- Outfit categorization (casual, formal, street, vintage, etc.)
- Location tagging (optional)
- OOTD streak tracking system

#### 3.2.2 Feed Display
- Vintage album layout design
- Infinite scroll functionality
- Like and comment interactions
- Share functionality
- Filter options (category, location, trending)

#### 3.2.3 Social Interactions
- Follow/unfollow users
- Like and comment on posts
- Share posts to other platforms
- Save posts to personal collections
- User mention functionality (@username)

### 3.3 ThreadBoard (Marketplace)

#### 3.3.1 Product Listings
- Multi-photo product upload (up to 8 images)
- Product details form:
  - Title, description
  - Category (clothing type, accessories, shoes)
  - Size, color, brand
  - Condition rating (1-10)
  - Price setting
- Product visibility settings (public, followers only)

#### 3.3.2 Browse & Search
- Category-based filtering
- Search functionality (text-based)
- Price range filters
- Size filters
- Condition filters
- Location-based sorting
- Recently added/trending items

#### 3.3.3 Product Interaction
- Product detail page with full gallery
- Seller profile integration
- Interest/inquiry system (replace direct payment for now)
- Product sharing functionality
- Save to wishlist/favorites

### 3.4 Merchant Module

#### 3.4.1 Merchant Registration
- Enhanced KYC verification
- Business information collection
- Star rating system (out of 9) display
- Merchant badge assignment

#### 3.4.2 Merchant Dashboard
- Inventory management
- Order inquiry management
- Performance analytics (views, inquiries, ratings)
- Bulk upload functionality for multiple items

#### 3.4.3 Rating & Review System
- Customer rating submission (1-9 stars)
- Written review capability
- Response system for merchants
- Rating aggregation and display

### 3.5 Museum Mnada (Donation Program)

#### 3.5.1 Donation Process
- Donation item submission form
- Photo upload for donated items
- Pickup location selection
- Digital credit tracking system

#### 3.5.2 Refined Item Resale
- Admin interface for item refinement
- Refined item listing creation
- Credit allocation to donors
- Refined items showcase section

### 3.6 Pickup Locations System

#### 3.6.1 Location Management
- Pickup location database
- Location display with maps integration
- Operating hours and contact information
- Location-based item filtering

#### 3.6.2 User Interface
- Interactive map view
- Location search and filters
- Distance calculation from user location
- Location details and directions

## 4. Design System & Visual Guidelines

### 4.1 Apple-Inspired Design Philosophy
Drawing inspiration from Apple's design excellence and their new Liquid Glass design language, Mnada will embody:
- **Simplicity & Clarity**: Clean, uncluttered interfaces that focus user attention
- **Spatial Awareness**: Generous use of whitespace and careful content hierarchy
- **Premium Feel**: High-quality visuals and smooth interactions that feel luxurious
- **Purposeful Animation**: Subtle, meaningful transitions that guide user attention

### 4.2 Visual Design System

#### 4.2.1 Typography
- **Primary Font**: System fonts (San Francisco-inspired) for optimal readability
- **Hierarchy**: Clear typographic scale (Display, Headline, Title, Body, Caption)
- **Weight Variations**: Light, Regular, Medium, Semibold for proper emphasis
- **Line Height**: Generous spacing for enhanced readability (1.4-1.6)

#### 4.2.2 Color System (Light & Dark Mode Support)

**Light Mode Palette**:
- **Primary Colors**: 
  - Deep charcoal (#1d1d1f) - for primary text and headers
  - Pure white (#ffffff) - for backgrounds and contrast
  - System blue (#007aff) - for primary actions and links
- **Accent Colors**:
  - Warm orange (#ff6b35) - for Mnada brand elements and CTAs
  - Soft gray (#f5f5f7) - for subtle backgrounds and cards
  - Medium gray (#86868b) - for secondary text and borders
- **Semantic Colors**:
  - Success green (#30d158)
  - Warning amber (#ff9f0a)
  - Error red (#ff3b30)

**Dark Mode Palette**:
- **Primary Colors**:
  - Pure white (#ffffff) - for primary text and headers
  - Rich black (#000000) - for true dark backgrounds
  - Dark gray (#1c1c1e) - for elevated surfaces and cards
  - System blue (#0a84ff) - adjusted for dark contrast
- **Accent Colors**:
  - Bright orange (#ff7a47) - enhanced for dark visibility
  - Dark card gray (#2c2c2e) - for subtle backgrounds
  - Light gray (#8e8e93) - for secondary text
- **Semantic Colors**:
  - Success green (#32d74b) - brightened for dark mode
  - Warning amber (#ff9f0a) - maintained for visibility
  - Error red (#ff453a) - adjusted for dark contrast

**Adaptive Colors** (System-aware):
- CSS custom properties that automatically switch based on user preference
- Smooth transitions between color schemes (0.3s ease)
- Consistent contrast ratios maintained across both modes

#### 4.2.3 Layout & Spacing
- **Grid System**: 12-column responsive grid with consistent gutters
- **Spacing Scale**: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64, 96px)
- **Container Max-Width**: 1200px for desktop, full-width on mobile
- **Breakpoints**: 
  - Mobile: 375px - 767px
  - Tablet: 768px - 1023px  
  - Desktop: 1024px+

#### 4.2.4 Apple-Style Component Design

**Cards & Surfaces**:
- Subtle shadows and depth (like Apple's product cards)
- Rounded corners (8px-16px radius)
- Semi-transparent backgrounds with blur effects (Liquid Glass inspired)
- Hover states with gentle scale transforms (1.02x)

**Buttons**:
- Primary: Filled with subtle gradients and perfect corner radius
- Secondary: Outlined with precise stroke weights
- Text buttons: Clean typography with appropriate touch targets
- Loading states: Smooth spinner animations

**Navigation**:
- Clean, minimal navigation bars
- Sticky positioning with backdrop blur
- Breadcrumb navigation for deep pages
- Tab bars with smooth selection indicators

**Forms & Inputs**:
- Clean, bordered input fields with focus states
- Floating labels (Material Design meets Apple polish)
- Contextual help text and validation states
- Consistent spacing and alignment

### 4.3 Apple-Inspired Interaction Patterns

#### 4.3.1 Micro-Interactions
- **Gentle Bounces**: Subtle spring animations on button presses
- **Smooth Transitions**: 0.3s ease curves for state changes
- **Loading States**: Skeleton screens and progressive disclosure
- **Gesture Feedback**: Visual acknowledgment of user actions

#### 4.3.2 Page Transitions
- **Smooth Scrolling**: Native-feeling scroll momentum
- **Page Transitions**: Slide and fade combinations
- **Progressive Loading**: Content loads in logical order
- **Back Navigation**: Clear visual hierarchy and expected behavior

### 4.4 Fashion-Specific Visual Treatment

#### 4.4.1 Image Presentation
- **High-Quality Display**: Crisp, well-compressed images
- **Aspect Ratios**: Consistent 4:5 portrait ratios for fashion items
- **Image Grids**: Pinterest-style masonry layouts with Apple polish
- **Zoom & Gallery**: Smooth zoom interactions and swipe galleries

#### 4.4.2 Social Feed Design
- **Album Aesthetic**: Vintage photo album inspired layouts
- **Card-Based Posts**: Each post in a distinct, elevated card
- **User Avatars**: Circular with subtle ring indicators for online status
- **Engagement UI**: Heart animations and smooth comment reveals

### 4.5 Mobile-First Responsive Design

#### 4.5.1 Touch-Friendly Interface
- **Minimum Touch Targets**: 44px (Apple's recommended size)
- **Thumb-Friendly Navigation**: Bottom navigation for primary actions
- **Swipe Gestures**: Intuitive swipe-to-delete, swipe-to-save
- **Pull-to-Refresh**: Native iOS-style refresh interactions

#### 4.5.2 Progressive Enhancement
- **Mobile-First CSS**: Start with mobile styles, enhance upward
- **Responsive Images**: Appropriate sizing for different viewports
- **Flexible Layouts**: CSS Grid and Flexbox for adaptive designs
- **Performance Focus**: Optimize for mobile data constraints

### 4.6 Accessibility (Apple Standards)

#### 4.6.1 Visual Accessibility
- **Color Contrast**: WCAG AAA compliance (7:1 ratio minimum)
- **Focus Indicators**: Clear, visible focus states for keyboard navigation
- **Text Scaling**: Support for dynamic type sizes up to 200%
- **Reduced Motion**: Respect user preferences for animation

#### 4.6.2 Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Alt Text**: Descriptive image alternatives for fashion content
- **ARIA Labels**: Appropriate labeling for complex UI components
- **Keyboard Navigation**: Full functionality without mouse/touch

### 4.8 Dark Mode & Light Mode Implementation

#### 4.8.1 Theme Detection & Management
**Automatic System Detection**:
- CSS `prefers-color-scheme` media query for initial theme detection
- JavaScript detection: `window.matchMedia('(prefers-color-scheme: dark)')`
- Respect user's system preferences on first visit
- Store user's manual preference in localStorage for persistence

**Manual Theme Toggle**:
- Prominent theme switcher in user settings/profile menu
- Apple-style toggle switch with smooth animation
- Real-time theme switching without page refresh
- Toggle state persists across browser sessions

#### 4.8.2 Technical Implementation Strategy

**CSS Custom Properties Approach**:
```css
:root {
  /* Light mode variables */
  --color-background: #ffffff;
  --color-surface: #f5f5f7;
  --color-text-primary: #1d1d1f;
  --color-text-secondary: #86868b;
  --color-accent: #ff6b35;
  --color-blue: #007aff;
}

[data-theme="dark"] {
  /* Dark mode overrides */
  --color-background: #000000;
  --color-surface: #1c1c1e;
  --color-text-primary: #ffffff;
  --color-text-secondary: #8e8e93;
  --color-accent: #ff7a47;
  --color-blue: #0a84ff;
}
```

**React Context Implementation**:
- ThemeProvider context for global theme state management
- Custom hook (useTheme) for component-level theme access
- Theme persistence in localStorage
- Smooth transitions using CSS transitions on root element

#### 4.8.3 Component-Level Adaptations

**Apple-Style Dark Mode Characteristics**:
- **True Black Backgrounds**: Pure #000000 for OLED display optimization
- **Elevated Surfaces**: Dark gray (#1c1c1e) for cards and modals
- **Increased Contrast**: Brighter accent colors for better visibility
- **Soft Shadows**: Subtle light shadows instead of dark ones
- **Blur Effects**: Maintain glassmorphism with lighter overlays

**Fashion Content Considerations**:
- **Image Borders**: Subtle borders around fashion photos in dark mode
- **Product Cards**: Enhanced contrast for clothing item visibility
- **User Avatars**: Slight glow effect to maintain prominence
- **Star Ratings**: Gold/yellow colors that work in both themes

#### 4.8.4 User Experience Design

**Theme Transition Animation**:
- 300ms ease transition for all color changes
- Avoid jarring flashes during theme switches
- Smooth fade transition for background changes
- Maintain UI element positions during transitions

**Accessibility Considerations**:
- Maintain WCAG AAA contrast ratios in both themes
- Support for high contrast mode preferences
- Respect `prefers-reduced-motion` for users sensitive to animations
- Test with screen readers in both color schemes

#### 4.8.5 Development Guidelines

**CSS Organization**:
- Centralized color token system using CSS custom properties
- Avoid hardcoded colors in component styles
- Use semantic color names (primary, secondary, accent) vs literal colors
- Document color usage patterns for consistency

**Component Development**:
- All components must work flawlessly in both themes
- Test each component in light/dark mode during development
- Use theme-aware conditional rendering where needed
- Ensure icons and graphics adapt appropriately

**Performance Optimization**:
- Minimal JavaScript overhead for theme switching
- CSS-based implementation for fastest transitions
- Lazy load theme-specific assets only when needed
- Optimize for mobile performance during theme changes

#### 4.8.6 Fashion-Specific Dark Mode Features

**Photo Enhancement**:
- Subtle image masking to improve visibility on dark backgrounds
- Enhanced product photo contrast in dark theme
- Adaptive image borders that complement the dark aesthetic
- OOTD posts maintain vibrant colors while fitting dark theme

**Social Feed Optimization**:
- Dark mode card designs that make fashion content pop
- User interface elements that don't compete with fashion photography
- Comment threads and interactions optimized for dark backgrounds
- Profile layouts that showcase user style in both themes

**Brand Consistency**:
- Mnada orange accent adapts brightness for optimal dark mode visibility
- Logo variations for light and dark backgrounds
- Consistent visual hierarchy maintained across both themes
- Cultural elements (Kenyan motifs) adapted for both color schemes

#### 4.8.7 Testing & Quality Assurance

**Cross-Theme Testing**:
- Automated testing for color contrast compliance
- Visual regression testing for both theme variants
- User testing sessions in different lighting conditions
- Performance testing for theme switching speed

**Device-Specific Considerations**:
- OLED display optimization with true blacks
- Battery saving benefits on mobile devices
- Outdoor visibility testing for mobile users
- Different browser rendering consistency

This comprehensive dark/light mode implementation ensures Mnada provides a premium, Apple-level experience while maintaining the vibrant, cultural essence of Kenyan fashion in both visual themes.

### 4.9 Brand Integration
- **Logo Treatment**: Clean integration with Apple-style navigation
- **Brand Colors**: Warm orange accents that complement system colors
- **Cultural Elements**: Subtle integration of Kenyan visual motifs
- **Fashion Focus**: Maintain Apple elegance while celebrating fashion culture

#### 4.7.2 Consistency Guidelines
- **Component Library**: Reusable UI components with consistent styling
- **Style Guide**: Documented patterns for development team reference
- **Design Tokens**: Centralized values for colors, spacing, typography
- **Quality Assurance**: Regular design reviews against Apple standards

## 5. Non-Functional Requirements

### 4.1 Performance Requirements
- Page load time < 3 seconds
- Image optimization and compression
- Responsive design for mobile (320px+) and desktop
- Progressive loading for image-heavy feeds

### 4.2 Security Requirements
- HTTPS encryption for all communications
- Secure file upload validation
- Input sanitization and validation
- Rate limiting for API endpoints
- User data privacy compliance

### 4.3 Usability Requirements
- Intuitive navigation structure
- Mobile-first responsive design
- Accessibility compliance (WCAG 2.1 AA)
- Consistent UI components and styling

### 4.4 Scalability Requirements
- Database optimization for growing user base
- CDN integration for image delivery
- Caching strategy for frequently accessed data
- Horizontal scaling capability

## 5. Technical Architecture

### 5.1 Frontend Requirements
- **Framework:** React.js with modern hooks
- **State Management:** Redux Toolkit or Zustand
- **Styling:** Tailwind CSS for responsive design
- **Routing:** React Router for SPA navigation
- **Image Handling:** Lazy loading, compression, WebP format support

### 5.2 Backend Requirements
- **API:** RESTful API design
- **Database:** PostgreSQL for relational data
- **File Storage:** Cloud storage for images (AWS S3 or similar)
- **Authentication:** JWT-based authentication
- **Real-time Features:** WebSocket integration for notifications

### 5.3 Third-Party Integrations
- **Maps:** Google Maps API for location services
- **Image Processing:** ImageKit or Cloudinary for optimization
- **SMS Verification:** Africa's Talking or similar for Kenya
- **Analytics:** Google Analytics for user behavior tracking

## 6. User Experience Flow

### 6.1 New User Journey
1. Landing page introduction
2. Registration process
3. Profile setup and customization
4. Onboarding tour of features
5. First SnapFit post creation
6. Community discovery and following

### 6.2 Marketplace Flow
1. Browse or search products
2. View product details
3. Contact seller through inquiry system
4. Coordinate pickup/delivery outside platform
5. Leave rating and review post-transaction

### 6.3 Social Flow
1. Browse SnapFit feed
2. Interact with posts (like, comment, share)
3. Follow interesting users
4. Create and share own fashion content
5. Build community and followers

## 7. Data Models

### 7.1 User Model
```
User {
  id, email, phone, username, full_name, bio,
  profile_image, location, verification_status,
  created_at, updated_at, follower_count, following_count
}
```

### 7.2 Post Model (SnapFit)
```
Post {
  id, user_id, images[], caption, hashtags[],
  category, location, likes_count, comments_count,
  created_at, updated_at
}
```

### 7.3 Product Model
```
Product {
  id, seller_id, title, description, category,
  images[], price, size, color, brand, condition,
  status, location, views_count, created_at
}
```

### 7.4 Merchant Model
```
Merchant {
  id, user_id, business_name, verification_documents,
  rating_average, total_ratings, status, created_at
}
```

## 8. Success Metrics

### 8.1 User Engagement
- Daily/Monthly Active Users (DAU/MAU)
- SnapFit posts per user per week
- Average session duration
- User retention rate (7-day, 30-day)

### 8.2 Marketplace Performance
- Product listings per month
- Inquiry-to-contact conversion rate
- Average response time to inquiries
- User satisfaction ratings

### 8.3 Community Growth
- New user registration rate
- Follower growth rate
- Content engagement rate (likes, comments, shares)
- User-generated content volume

## 9. Phase 1 MVP Scope

### 9.1 Included Features
- User registration and basic profiles
- SnapFit feed with basic social interactions
- ThreadBoard marketplace with inquiry system
- Basic merchant verification
- Pickup locations display
- Responsive web design

### 9.2 Excluded from MVP
- Payment processing integration
- Museum Mnada donation program
- Advanced analytics dashboard
- Mobile app versions
- Advanced search filters
- Video content support

## 10. Future Enhancements (Post-MVP)

### 10.1 Phase 2 Features
- Payment integration with M-Pesa
- Museum Mnada full implementation
- Advanced messaging system
- Mobile app development
- Enhanced analytics

### 10.2 Long-term Vision
- AI-powered fashion recommendations
- Virtual try-on features
- Pan-African expansion
- Brand partnership integrations
- Advanced seller tools and analytics

## 11. Risk Considerations

### 11.1 Technical Risks
- Image storage and bandwidth costs
- Database performance at scale
- Third-party API dependencies
- Security vulnerabilities

### 11.2 Business Risks
- User adoption in target market
- Merchant trust and verification
- Competition from established platforms
- Regulatory changes in Kenya

## 12. Acceptance Criteria

### 12.1 Core Functionality
- [ ] Users can register, verify, and create profiles
- [ ] Users can create and share SnapFit posts
- [ ] Users can browse and search ThreadBoard marketplace
- [ ] Merchants can list products with full details
- [ ] Rating and review system functions correctly
- [ ] Responsive design works across device sizes

### 12.2 Performance Standards
- [ ] Page load times under 3 seconds
- [ ] Image uploads process without errors
- [ ] Search results return within 2 seconds
- [ ] No data loss during user interactions

This PRD serves as the foundational document for development and should be reviewed and updated as the project evolves through each phase.