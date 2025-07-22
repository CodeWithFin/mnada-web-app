import React from 'react'
import Navbar from './Navbar'
import BottomNav from './BottomNav'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background transition-colors duration-300">
      <Navbar />
      <main className="pt-16 pb-20 md:pb-8">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

export default Layout
