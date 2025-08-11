# Mnada Web App – TASKS.md

## [TASK 0] Project Setup
- [ ] Create React + TypeScript project: `npx create-react-app mnada-web --template typescript`
- [ ] Install dependencies:
  - UI: `tailwindcss`, `postcss`, `autoprefixer`, `react-router-dom`, `@headlessui/react`
  - Firebase: `firebase`
  - API Client: `axios`
  - Dev: `eslint`, `prettier`, `typescript`, `@types/react`, `@types/node`
- [ ] Tailwind setup:
  - Add `tailwind.config.js`, `postcss.config.js`
  - Enable class-based dark mode:
    ```js
    module.exports = {
      darkMode: 'class',
      content: ['./src/**/*.{js,ts,jsx,tsx}'],
      theme: { extend: {} },
      plugins: [],
    }
    ```
- [ ] Set up CSS variables in `index.css` for light/dark mode.

---

## [TASK 1] Landing Page (`/`)
### 1.1 Hero Section
- [ ] Add full-screen hero with headline: "Fashion with a Soul"
- [ ] Add CTA buttons: "Shop Now", "Join Community"
- [ ] Add background image (Kenyan street art)
- [ ] Add dark mode styles: `bg-white` → `bg-gray-900`, `text-gray-800` → `text-gray-100`

### 1.2 Trending Items
- [ ] Fetch from `GET /api/trending`
- [ ] Display 3-column responsive grid
- [ ] Show: item image, name, price, rating
- [ ] Add skeleton loader for async state

### 1.3 Dark Mode Toggle
- [ ] Add toggle button (top-right corner)
- [ ] Toggle `document.documentElement.classList.toggle('dark')`
- [ ] Persist mode in `localStorage`

---

## [TASK 2] Auth System (`/auth`)
### 2.1 Firebase Setup
- [ ] Initialize Firebase SDK
- [ ] Set up Firestore & Auth modules
- [ ] Create .env file with Firebase keys

### 2.2 Auth Pages
- [ ] `/auth/login`: Email/password + Google sign-in
- [ ] `/auth/register`: Create account form
- [ ] `/auth/reset`: Reset password

### 2.3 Auth Context
- [ ] Create `useAuth` hook
- [ ] Provide auth state to app

---

## [TASK 3] Home Screen (`/home`)
### 3.1 Navbar
- [ ] Logo + link to `/home`
- [ ] Search bar (autocomplete via `GET /api/search`)
- [ ] User avatar dropdown (logout, profile)

### 3.2 SnapFit Feed
- [ ] Fetch OOTD feed from `GET /api/feed?page=1`
- [ ] Show post cards: image, hashtags, likes
- [ ] Animate on hover: `hover:scale-105 transition-transform`

### 3.3 Streak Counter
- [ ] Track daily visits via `localStorage`
- [ ] Display user’s current streak

---

## [TASK 4] Marketplace (`/marketplace`)
### 4.1 Filters
- [ ] Dropdowns: Category, Price, Size, Gender
- [ ] Store filter values in local state
- [ ] Debounced fetch: `GET /api/items?filters`

### 4.2 ThreadBoard Grid
- [ ] Display items in cards (image, name, tags, price)
- [ ] Pagination or infinite scroll
- [ ] Dark mode border: `border-gray-700`

---

## [TASK 5] User Profile (`/profile`)
- [ ] Show username, streak, items uploaded
- [ ] Tabs: My Items, Wishlist, SnapFits
- [ ] Edit Profile modal
- [ ] Logout button (clears auth state)

---

## [TASK 6] Upload Outfit (`/upload`)
- [ ] Image uploader (drag and drop)
- [ ] Hashtag input with autosuggest
- [ ] Submit button: `POST /api/feed`

---

## [TASK 7] API Stubs (Node.js + Firebase)
- [ ] `/api/trending` → Fetch trending items
- [ ] `/api/items` → Query Firestore by filters
- [ ] `/api/feed` → SnapFit posts
- [ ] `/api/search` → Full-text search index
- [ ] Use Firebase Admin SDK with Express.js functions

---

## [TASK 8] Dark Mode Polish
- [ ] Add smooth toggle animation
- [ ] Improve card shadows + contrast (WCAG AA)
- [ ] Respect system preference via `matchMedia`
