import React from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import MobileBottomNav from './MobileBottomNav'
import { RootState } from '../../store/store'

const Layout: React.FC = () => {
  const { mobileMenuOpen } = useSelector((state: RootState) => state.ui)

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Navbar />
      </div>

      <div className="flex h-screen lg:pt-0 pt-16">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" />
            <div className="fixed top-0 left-0 h-full w-64 bg-card-light dark:bg-card-dark">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <Navbar />
          </div>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-surface-light dark:bg-surface-dark">
            <div className="lg:pb-0 pb-16">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <MobileBottomNav />
      </div>
    </div>
  )
}

export default Layout
