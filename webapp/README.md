# Mnada Web App - Supabase Integration

A modern African fashion platform built with React, TypeScript, and Supabase. This application provides a marketplace for African fashion, a social feed for outfit sharing, and a complete e-commerce experience.

## 🚀 Features

### ✅ Implemented (Frontend)
- **User Authentication** - Login, register, password reset with Supabase Auth
- **Marketplace** - Product browsing, search, filtering, and categorization
- **Social Feed** - Instagram-style feed for outfit sharing
- **Image Upload** - Drag-and-drop image uploads to Supabase Storage
- **Dark/Light Theme** - Complete theme switching with persistence
- **Responsive Design** - Mobile-first responsive layout
- **Real-time Data** - Connected to Supabase for live data

## 🛠 Technology Stack

- **Frontend**: React 19.1.1 + TypeScript
- **Styling**: Tailwind CSS 3.3.0
- **Routing**: React Router 7.7.1
- **Icons**: Heroicons 2.2.0
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: React Context API

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 16+ and npm
- Supabase account ([supabase.com](https://supabase.com))

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

Follow the detailed instructions in `SUPABASE_SETUP.md`:

1. Create a new Supabase project
2. Copy your project URL and anon key
3. Create `.env` file with your credentials
4. Run the database schema in Supabase SQL editor
5. Configure authentication and storage

### 4. Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your Supabase credentials
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Run Development Server
```bash

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
