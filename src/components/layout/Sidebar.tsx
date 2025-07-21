import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Camera, 
  ShoppingBag, 
  MapPin, 
  Settings,
  Store,
  User,
  PlusCircle
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import { openModal } from '../../store/slices/uiSlice'

const Sidebar: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)

  const handleCreatePost = () => {
    dispatch(openModal('createPost'))
  }

  const handleCreateProduct = () => {
    dispatch(openModal('createProduct'))
  }

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: Home },
    { name: 'SnapFit', path: '/app/snapfit', icon: Camera },
    { name: 'ThreadBoard', path: '/app/threadboard', icon: ShoppingBag },
    { name: 'Locations', path: '/app/locations', icon: MapPin },
  ]

  const bottomNavItems = [
    { name: 'Profile', path: `/app/profile/${user?.username}`, icon: User },
    { name: 'Settings', path: '/app/settings', icon: Settings },
  ]

  if (user?.isMerchant) {
    navItems.splice(3, 0, { 
      name: 'Merchant', 
      path: '/app/merchant', 
      icon: Store 
    })
  }

  return (
    <div className="w-64 bg-card-light dark:bg-card-dark border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">Mnada</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Fashion Community</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 space-y-2">
        <button
          onClick={handleCreatePost}
          className="w-full flex items-center space-x-3 px-4 py-3 bg-primary-500 hover:bg-primary-600 rounded-xl text-white font-medium transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Create Post</span>
        </button>
        
        <button
          onClick={handleCreateProduct}
          className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-medium transition-colors"
        >
          <ShoppingBag className="h-5 w-5" />
          <span>List Item</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.fullName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {user.fullName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                @{user.username}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar
