# MNADA Development Task Flow

**Project**: MNADA - Kenyan Fashion Social-Commerce PWA (SnapFit + ThreadBoard + Museum + Foundation)
**Created**: September 6, 2025
**Status**: In Progress

## Overview
MNADA is a mobile-first PWA combining social fashion content (SnapFit feed), marketplace (ThreadBoard), donation platform (Museum Mnada), and social impact features (Foundation Mode).

## Project Structure

```
mnada-web-app/
├── frontend/           # Next.js PWA (TypeScript + TailwindCSS + shadcn/ui)
├── backend/            # NestJS API (TypeScript)
├── db/                 # Postgres migrations & seed data
├── infra/              # Docker compose + CI/CD configs
├── scripts/            # Development helper scripts
├── tests/              # E2E and integration tests
├── docs/               # Architecture & API documentation
├── .env.example        # Environment variables template
├── README.md           # Setup instructions
└── package.json        # Root package.json for workspace management
```

---

## PHASE 1: PROJECT FOUNDATION (Days 1-2)

### ✅ Task 1.1: Repository Structure Setup
- [x] Create root folder structure
- [x] Initialize package.json with workspace configuration
- [x] Setup .gitignore and .env.example
- [x] Create README.md with project overview

### ✅ Task 1.2: Database Foundation
- [x] Review and validate databaseschema.sql
- [x] Create db/migrations/ folder
- [x] Split schema into versioned migration files
- [x] Create seed data file (seed_mnada.sql)
- [x] Add media table for multi-image support

### ✅ Task 1.3: Infrastructure Setup
- [x] Create docker-compose.yml (Postgres + Meilisearch + Supabase emulator)
- [x] Setup GitHub Actions workflow
- [x] Create development scripts (dev.sh, migrate.sh, seed.sh)

---

## PHASE 2: BACKEND DEVELOPMENT (Days 3-5)

### 🔄 Task 2.1: NestJS API Foundation
- [x] Initialize NestJS project in backend/
- [x] Setup TypeScript configuration
- [x] Configure Supabase client and JWT validation
- [x] Create base modules: auth, users, merchants, products, outfits, orders, donations

### 🔄 Task 2.2: Authentication & User Management
- [ ] Implement auth module (Supabase JWT wrapper)
- [ ] Create user CRUD endpoints
- [ ] Add profile management endpoints
- [ ] Implement role-based access control (buyer/merchant/admin)

### 🔄 Task 2.3: Core API Modules
- [ ] **Users Module**: Profile management, streak tracking
- [ ] **Merchants Module**: KYC workflow, verification endpoints
- [ ] **Products Module**: CRUD, search, filtering
- [ ] **Outfits Module**: Feed endpoints, likes, comments
- [ ] **Orders Module**: Order flow, status transitions
- [ ] **Donations Module**: Museum workflow
- [ ] **Credits Module**: Wallet transactions (atomic updates)
- [ ] **Notifications Module**: Push notification system

### 🔄 Task 2.4: Payment Integration
- [ ] M-Pesa Daraja API wrapper (with mock server for dev)
- [ ] Stripe integration for card payments
- [ ] Wallet transaction endpoints
- [ ] Payment status webhooks

### 🔄 Task 2.5: Search & Recommendations
- [ ] Meilisearch integration
- [ ] Product/outfit indexing
- [ ] Search endpoints
- [ ] Basic recommendation algorithm

---

## PHASE 3: FRONTEND DEVELOPMENT (Days 6-9)

### 🔄 Task 3.1: Next.js App Foundation
- [ ] Initialize Next.js project with app router
- [ ] Setup TailwindCSS + shadcn/ui
- [ ] Configure PWA (next-pwa)
- [ ] Setup Framer Motion for animations
- [ ] Configure Supabase client

### 🔄 Task 3.2: Authentication & User Interface
- [ ] Login/signup pages
- [ ] Profile management
- [ ] Protected route middleware
- [ ] User dashboard

### 🔄 Task 3.3: Core Pages & Features
- [ ] **Landing Page** (`/`): Hero, features, onboarding
- [ ] **SnapFit Feed** (`/feed`): Infinite scroll, image optimization, likes/comments
- [ ] **ThreadBoard Marketplace** (`/market`): Product grid, filters, search
- [ ] **Product Detail** (`/product/[id]`): Product view, purchase flow
- [ ] **Merchant Dashboard** (`/merchant/dashboard`): KYC status, products, sales
- [ ] **Museum Donations** (`/museum`): Donation flow, status tracking
- [ ] **Wallet** (`/wallet`): Credits, transactions, top-up
- [ ] **Foundation** (`/foundation`): Social impact donations

### 🔄 Task 3.4: PWA Features
- [ ] Service worker configuration
- [ ] Offline functionality
- [ ] App manifest
- [ ] Push notifications
- [ ] Install prompts

### 🔄 Task 3.5: UI/UX Polish
- [ ] Responsive design (mobile-first)
- [ ] Dark mode toggle
- [ ] Loading states and error handling
- [ ] Image optimization and lazy loading
- [ ] Streak UI components

---

## PHASE 4: INTEGRATION & TESTING (Days 10-12)

### 🔄 Task 4.1: Backend Testing
- [ ] Unit tests for critical modules (Jest)
- [ ] API integration tests (Supertest)
- [ ] Test coverage >= 70% for core modules
- [ ] Mock payment providers

### 🔄 Task 4.2: Frontend Testing
- [ ] Component unit tests (Jest + React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] PWA functionality tests
- [ ] Cross-browser testing

### 🔄 Task 4.3: End-to-End Integration
- [ ] Full user journey testing
- [ ] Payment flow testing (mock)
- [ ] Image upload/storage testing
- [ ] Search functionality testing

---

## PHASE 5: DOCUMENTATION & DEPLOYMENT (Days 13-14)

### 🔄 Task 5.1: Documentation
- [ ] Complete README.md with setup instructions
- [ ] Create architecture.md with ERD
- [ ] OpenAPI/Swagger documentation
- [ ] Postman collection
- [ ] Deployment guides

### 🔄 Task 5.2: Deployment Preparation
- [ ] Vercel deployment configuration
- [ ] Supabase production setup
- [ ] Environment variable documentation
- [ ] Production security checklist

### 🔄 Task 5.3: CI/CD Pipeline
- [ ] GitHub Actions workflow completion
- [ ] Automated testing pipeline
- [ ] Build and deployment automation
- [ ] Quality gates and checks

---

## ACCEPTANCE CRITERIA CHECKLIST

### Core Functionality
- [ ] User can sign up and authenticate
- [ ] User can upload outfit photos to SnapFit feed
- [ ] User can browse and search ThreadBoard marketplace
- [ ] Merchant can complete KYC and list products
- [ ] User can place orders and track status
- [ ] User can donate items to Museum Mnada
- [ ] Foundation donation flow works
- [ ] Wallet/credits system functions correctly

### Technical Requirements
- [ ] `./scripts/dev.sh` starts both frontend (3000) and backend (4000)
- [ ] Database schema runs without errors in Supabase
- [ ] PWA can be installed on mobile devices
- [ ] Tests pass in CI/CD pipeline
- [ ] All environment variables documented in .env.example

### Performance & Security
- [ ] Mobile-first responsive design
- [ ] Image optimization and lazy loading
- [ ] JWT authentication and authorization
- [ ] Rate limiting implemented
- [ ] Input validation and sanitization
- [ ] HTTPS in production

---

## DEVELOPMENT COMMANDS

### Local Development
```bash
# Start all services
./scripts/dev.sh

# Database operations
./scripts/migrate.sh       # Run migrations
./scripts/seed.sh         # Seed database

# Testing
npm run test              # Run all tests
npm run test:e2e         # Run E2E tests
npm run test:coverage    # Test coverage report

# Build
npm run build            # Build for production
npm run start            # Start production server
```

### Environment Setup
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start Docker services
docker-compose up -d

# Initialize database
npm run db:migrate
npm run db:seed
```

---

## CURRENT STATUS

**Active Phase**: Phase 1 - Project Foundation ✅ COMPLETED
**Current Task**: Phase 2 - Backend Development
**Next Priority**: Task 2.1 - Initialize NestJS project in backend/

**Completed Tasks**: 
- ✅ Database schema review and enhancement
- ✅ Task flow creation
- ✅ Repository structure setup
- ✅ Database foundation (schema + seed data)
- ✅ Infrastructure setup (Docker + CI/CD)
- ✅ Development scripts (dev.sh, migrate.sh, seed.sh)
- ✅ NestJS API foundation with Supabase integration
- ✅ Configuration management and validation
- ✅ API documentation setup (Swagger)
- ✅ Health check endpoints

**Blocked/Issues**: None

**Notes**: 
- Phase 1 foundation is complete and ready for development
- Database schema includes all required tables with RLS policies
- Docker compose ready for local development
- CI/CD pipeline configured for automated testing
- Ready to start backend development with NestJS

---

## TECH STACK REFERENCE

- **Frontend**: Next.js 14+ (App Router), React 18, TypeScript, TailwindCSS, shadcn/ui, Framer Motion, next-pwa
- **Backend**: NestJS, TypeScript, Express.js
- **Database**: Supabase (Postgres), pgcrypto extension
- **Search**: Meilisearch
- **Payments**: M-Pesa Daraja API, Stripe
- **Notifications**: Firebase Cloud Messaging
- **Hosting**: Vercel (frontend), Supabase (backend/database)
- **CI/CD**: GitHub Actions
- **Testing**: Jest, Playwright, Supertest, React Testing Library

---

## RESOURCES & REFERENCES

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [NestJS Documentation](https://docs.nestjs.com/)
- [M-Pesa Daraja API](https://developer.safaricom.co.ke/)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)

---

**Last Updated**: September 6, 2025
**Next Review**: After Phase 1 completion
