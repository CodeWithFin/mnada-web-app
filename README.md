# Mnada Web App

A social commerce web platform for Kenyan fashion community, combining fashion sharing, thrift marketplace, and community building.

## Features

### 🌟 Core Features
- **SnapFit Feed**: Social fashion diary for sharing daily outfits
- **ThreadBoard**: Marketplace for thrift and fashion items
- **User Profiles**: Comprehensive user profiles with social features
- **Authentication**: Secure user registration and login
- **Dark/Light Mode**: Apple-inspired theme switching
- **Responsive Design**: Mobile-first, works on all devices

### 🎨 Design System
- Apple-inspired design philosophy with Liquid Glass elements
- Comprehensive dark and light mode support
- Smooth animations and micro-interactions
- Mobile-first responsive design
- Accessible UI components (WCAG 2.1 AA compliant)

### 🛠 Tech Stack
- **Frontend**: React 18, React Router, Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **Development**: Hot reload, ESLint

## Deployment

### GitHub Pages (Enabled)
Your app will automatically deploy to GitHub Pages when you push to the main branch.

**Setup Steps:**
1. Go to your GitHub repository settings
2. Navigate to "Pages" section  
3. Set source to "Deploy from a branch"
4. Choose "gh-pages" branch
5. Your app will be available at: `https://codewithfin.github.io/mnada-web-app/`

### Other Deployment Options

**Vercel** (Recommended for React apps):
- Connect your GitHub repo to Vercel
- Automatic deployments on every push
- Custom domain support

**Netlify**:
- Drag and drop the `dist/` folder after running `npm run build`
- Or connect your GitHub repository

**Traditional Hosting**:
- Run `npm run build`
- Upload contents of `dist/` folder to your web server

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout/         # Layout components (Navbar, BottomNav)
├── contexts/           # React Context providers
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── pages/              # Page components
│   ├── Home.jsx
│   ├── SnapFit.jsx
│   ├── ThreadBoard.jsx
│   ├── Profile.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── ProductDetail.jsx
├── App.jsx             # Main App component
├── main.jsx           # React entry point
└── index.css          # Global styles
```

## Features Overview

### SnapFit Feed
- Share daily outfit photos
- Social interactions (likes, comments)
- Category filtering
- User following system
- Vintage album-style layout

### ThreadBoard Marketplace
- Browse and search fashion items
- Product listings with detailed information
- Seller profiles and ratings
- Inquiry system for buyer-seller communication
- Location-based filtering

### User System
- Comprehensive user profiles
- Profile customization
- Social stats (followers, following, posts)
- Verification badges
- Account settings

### Theme System
- Automatic system theme detection
- Manual theme toggle
- Smooth transitions between themes
- Persistent user preferences
- Apple-style design adaptation

## Design Philosophy

Mnada follows Apple's design excellence principles:

- **Simplicity & Clarity**: Clean, uncluttered interfaces
- **Spatial Awareness**: Generous whitespace and content hierarchy
- **Premium Feel**: High-quality visuals and smooth interactions
- **Purposeful Animation**: Meaningful transitions that guide attention

## Responsive Design

- **Mobile First**: Designed for mobile, enhanced for larger screens
- **Breakpoints**: 
  - Mobile: 375px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+
- **Touch Friendly**: 44px minimum touch targets
- **Progressive Enhancement**: Core functionality works everywhere

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

### Phase 2 Features
- Payment integration with M-Pesa
- Museum Mnada donation program
- Advanced messaging system
- Mobile app development
- Enhanced analytics

### Long-term Vision
- AI-powered fashion recommendations
- Virtual try-on features
- Pan-African expansion
- Brand partnership integrations
- Advanced seller tools

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Project Lead**: CodeWithFin
- **Repository**: [mnada-web-app](https://github.com/CodeWithFin/mnada-web-app)
- **Issues**: [GitHub Issues](https://github.com/CodeWithFin/mnada-web-app/issues)

---

Built with ❤️ for the Kenyan fashion community
