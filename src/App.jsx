import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import SnapFit from './pages/SnapFit'
import ThreadBoard from './pages/ThreadBoard'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetail from './pages/ProductDetail'
import MuseumMnada from './pages/MuseumMnada'
import Messages from './pages/Messages'
import SavedPosts from './pages/SavedPosts'
import MessagingDemo from './pages/MessagingDemo'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/snapfit" element={<SnapFit />} />
              <Route path="/threadboard" element={<ThreadBoard />} />
              <Route path="/profile/:username?" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/museum" element={<MuseumMnada />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/messaging-demo" element={<MessagingDemo />} />
              <Route path="/saved" element={<SavedPosts />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
