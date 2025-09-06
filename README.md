# MNADA - Kenyan Fashion Social-Commerce PWA

[![Build Status](https://github.com/CodeWithFin/mnada-web-app/workflows/CI/badge.svg)](https://github.com/CodeWithFin/mnada-web-app/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MNADA is a comprehensive fashion social-commerce platform that combines social fashion content (SnapFit feed), marketplace (ThreadBoard), donation platform (Museum Mnada), and social impact features (Foundation Mode) - all designed specifically for the Kenyan fashion ecosystem.

## 🌟 Features

### SnapFit Feed
- Social fashion content sharing
- Outfit photo uploads with captions
- Like, comment, and engagement system
- Streak tracking for daily posts
- Infinite scroll feed with optimized images

### ThreadBoard Marketplace
- Product listing and management
- Advanced search and filtering
- Merchant verification (KYC)
- Order management and tracking
- Rating and review system

### Museum Mnada
- Fashion item donation platform
- Item refinement and listing process
- Credit rewards for donors
- Circular fashion economy

### Foundation Mode
- Social impact donations
- Community project funding
- Transparent fund tracking
- Impact reporting

## 🚀 Tech Stack

- **Frontend**: Next.js 14+, React 18, TypeScript, TailwindCSS, shadcn/ui, Framer Motion
- **Backend**: NestJS, TypeScript, Express.js
- **Database**: Supabase (PostgreSQL), pgcrypto extension
- **Authentication**: Supabase Auth (JWT)
- **Search**: Meilisearch
- **Payments**: M-Pesa Daraja API, Stripe
- **Storage**: Supabase Storage
- **Notifications**: Firebase Cloud Messaging
- **PWA**: next-pwa, Service Workers
- **Hosting**: Vercel (Frontend), Supabase (Backend/Database)
- **CI/CD**: GitHub Actions

## 📱 Progressive Web App (PWA)

MNADA is built as a PWA with:
- ✅ Offline functionality
- ✅ Push notifications
- ✅ App installation on mobile devices
- ✅ Optimized for mobile-first experience
- ✅ Service worker caching

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CodeWithFin/mnada-web-app.git
   cd mnada-web-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Docker services** (Database + Meilisearch)
   ```bash
   npm run docker:up
   ```

5. **Initialize database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

6. **Start development servers**
   ```bash
   npm run dev
   ```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Database: PostgreSQL on port 5432
- Search: Meilisearch on port 7700

## 📁 Project Structure

```
mnada-web-app/
├── frontend/                 # Next.js PWA application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities and configurations
│   └── public/              # Static assets
├── backend/                 # NestJS API server
│   ├── src/                 # Source code
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── merchants/      # Merchant & KYC
│   │   ├── products/       # Product management
│   │   ├── outfits/        # Social feed
│   │   ├── orders/         # Order processing
│   │   ├── donations/      # Museum donations
│   │   ├── credits/        # Credit system
│   │   └── payments/       # Payment processing
│   └── test/               # Backend tests
├── db/                     # Database migrations and seeds
│   ├── migrations/         # SQL migration files
│   └── seeds/              # Sample data
├── infra/                  # Infrastructure configuration
│   ├── docker-compose.yml  # Local development services
│   └── github/             # CI/CD workflows
├── scripts/                # Development helper scripts
├── tests/                  # E2E and integration tests
└── docs/                   # Documentation
```

## 🧪 Testing

### Run all tests
```bash
npm run test
```

### Run E2E tests
```bash
npm run test:e2e
```

### Test coverage
```bash
npm run test:coverage
```

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev servers
npm run build           # Build for production
npm run start           # Start production build

# Database
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with sample data

# Docker
npm run docker:up       # Start Docker services
npm run docker:down     # Stop Docker services

# Code Quality
npm run lint            # Run linting
npm run format          # Format code
```

## 🌍 Environment Configuration

Key environment variables (see `.env.example`):

- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **M-Pesa**: `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`
- **Stripe**: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Search**: `MEILISEARCH_HOST`, `MEILISEARCH_MASTER_KEY`

## 📚 API Documentation

- **OpenAPI/Swagger**: http://localhost:4000/api/docs
- **Postman Collection**: [docs/mnada-api.postman_collection.json](docs/mnada-api.postman_collection.json)

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Deploy to Vercel
npm run build
vercel --prod
```

### Backend (Supabase Functions or Node.js hosting)
See [docs/deployment.md](docs/deployment.md) for detailed deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Kenyan fashion community for inspiration
- Open source contributors
- Supabase for backend infrastructure
- Vercel for hosting platform

## 📞 Support

For support, email support@mnada.app or join our Slack channel.

---

**Built with ❤️ for the Kenyan fashion community**
