import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Camera, 
  ShoppingBag, 
  MapPin, 
  User
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

const MobileBottomNav: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth)

  const navItems = [
    { name: 'Home', path: '/app/dashboard', icon: Home },
    { name: 'SnapFit', path: '/app/snapfit', icon: Camera },
    { name: 'Shop', path: '/app/threadboard', icon: ShoppingBag },
    { name: 'Locations', path: '/app/locations', icon: MapPin },
    { name: 'Profile', path: `/app/profile/${user?.username}`, icon: User },
  ]

  return (
    <div className="bg-card-light dark:bg-card-dark border-t border-gray-200 dark:border-gray-700">
      <nav className="flex">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className={`h-6 w-6 mb-1 ${
                    isActive ? 'text-primary-600 dark:text-primary-400' : ''
                  }`} 
                />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default MobileBottomNav
