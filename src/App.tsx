import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import TestPage from './pages/TestPage';
import ConnectionTest from './pages/ConnectionTest';
import SimpleLanding from './pages/SimpleLanding';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MarketplacePage from './pages/MarketplacePageSupabase';
import SnapFitFeed from './pages/SnapFitFeed';
import UploadPage from './pages/UploadPageSupabase';
import CartPage from './pages/CartPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  console.log('App component rendering...');
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen bg-white dark:bg-gray-900">
            <Routes>
              {/* Landing Pages - No Navbar */}
              <Route path="/test" element={<TestPage />} />
              <Route path="/connection-test" element={<ConnectionTest />} />
              <Route path="/complex" element={<LandingPage />} />
              <Route path="/" element={<SimpleLanding />} />
              
              {/* Auth Pages - No Navbar */}
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              
              {/* App Pages - With Navbar */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <div className="pt-16 relative min-h-[calc(100vh-4rem)] overflow-x-hidden">
                        {/* Gradient background accent */}
                        <div className="pointer-events-none absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-gradient-to-br from-purple-400/30 via-pink-300/20 to-yellow-200/20 blur-3xl z-0" />
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                            Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400">Mnada</span>
                          </h1>
                          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                            Your personalized fashion dashboard. Discover, share, and create authentic African style.
                          </p>
                          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Marketplace Card */}
                            <a href="/marketplace" className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-400">
                              <svg className="h-10 w-10 mb-4 text-purple-500 group-hover:text-purple-700 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7h18M5 7V5a2 2 0 012-2h10a2 2 0 012 2v2m-1 0v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7h14z" /></svg>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Marketplace</h3>
                              <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">Shop authentic African fashion from local designers.</p>
                              <span className="inline-block mt-auto px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition-colors">Browse Products</span>
                            </a>
                            {/* SnapFit Feed Card */}
                            <a href="/feed" className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pink-400">
                              <svg className="h-10 w-10 mb-4 text-pink-500 group-hover:text-pink-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">SnapFit Feed</h3>
                              <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">Share your style and get inspired by the community.</p>
                              <span className="inline-block mt-auto px-4 py-2 rounded-lg bg-pink-500 text-white font-semibold shadow hover:bg-pink-600 transition-colors">View Feed</span>
                            </a>
                            {/* Upload Style Card */}
                            <a href="/upload" className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-yellow-300">
                              <svg className="h-10 w-10 mb-4 text-yellow-400 group-hover:text-yellow-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Upload Style</h3>
                              <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">Share your outfit and inspire others.</p>
                              <span className="inline-block mt-auto px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 font-semibold shadow hover:bg-yellow-500 transition-colors">Upload Now</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/marketplace"
                element={
                  <>
                    <Navbar />
                    <div className="pt-16">
                      <MarketplacePage />
                    </div>
                  </>
                }
              />
              
              <Route
                path="/cart"
                element={
                  <>
                    <Navbar />
                    <div className="pt-16">
                      <CartPage />
                    </div>
                  </>
                }
              />
              
              <Route
                path="/feed"
                element={
                  <>
                    <Navbar />
                    <div className="pt-16">
                      <SnapFitFeed />
                    </div>
                  </>
                }
              />
              
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <div className="pt-16">
                        <UploadPage />
                      </div>
                    </>
                  </ProtectedRoute>
                }
              />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
