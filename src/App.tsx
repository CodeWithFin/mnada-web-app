import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// Layout Components
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Page Components
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import Dashboard from './pages/Dashboard'
import SnapFitFeed from './pages/snapfit/SnapFitFeed'
import CreatePost from './pages/snapfit/CreatePost'
import PostDetail from './pages/snapfit/PostDetail'
import ThreadBoard from './pages/threadboard/ThreadBoard'
import CreateProduct from './pages/threadboard/CreateProduct'
import ProductDetail from './pages/threadboard/ProductDetail'
import Profile from './pages/profile/Profile'
import EditProfile from './pages/profile/EditProfile'
import MerchantDashboard from './pages/merchant/MerchantDashboard'
import PickupLocations from './pages/locations/PickupLocations'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* SnapFit Routes */}
          <Route path="snapfit" element={<SnapFitFeed />} />
          <Route path="snapfit/create" element={<CreatePost />} />
          <Route path="snapfit/:postId" element={<PostDetail />} />
          
          {/* ThreadBoard Routes */}
          <Route path="threadboard" element={<ThreadBoard />} />
          <Route path="threadboard/create" element={<CreateProduct />} />
          <Route path="threadboard/:productId" element={<ProductDetail />} />
          
          {/* Profile Routes */}
          <Route path="profile/:username" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          
          {/* Merchant Routes */}
          <Route path="merchant" element={<MerchantDashboard />} />
          
          {/* Other Routes */}
          <Route path="locations" element={<PickupLocations />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
