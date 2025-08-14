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
import MarketplacePage from './pages/MarketplacePage';
import SnapFitFeed from './pages/SnapFitFeed';
import UploadPage from './pages/UploadPage';
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
                  <>
                    <Navbar />
                    <div className="pt-16">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                          Welcome to Mnada Home
                        </h1>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">
                          Your personalized fashion dashboard. Coming soon: personalized recommendations and style insights!
                        </p>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Marketplace
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              Shop authentic African fashion
                            </p>
                            <a href="/marketplace" className="text-fashion-purple hover:text-purple-700 font-medium">
                              Browse Products →
                            </a>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              SnapFit Feed
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              Share and discover style inspiration
                            </p>
                            <a href="/feed" className="text-fashion-purple hover:text-purple-700 font-medium">
                              View Feed →
                            </a>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              Upload Style
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              Share your outfit with the community
                            </p>
                            <a href="/upload" className="text-fashion-purple hover:text-purple-700 font-medium">
                              Upload Now →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
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
                  <>
                    <Navbar />
                    <div className="pt-16">
                      <UploadPage />
                    </div>
                  </>
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
