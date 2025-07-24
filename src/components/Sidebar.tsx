import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Utensils,
  Dumbbell,
  Scale,
  Droplet,
  Target,
  Bot,
  User,
  Settings,
  LogOut,
  Zap,
  ChevronLeft
} from 'lucide-react';

// Components
import { Button } from './ui/Button';

// Hooks
import { useAuth } from '../hooks';

// Store
import { useAppStore } from '../store';

// Utils
import { cn } from '../utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navigation: NavigationItem[] = [
  { name: 'Дашборд', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Питание', href: '/nutrition', icon: Utensils },
  { name: 'Тренировки', href: '/workouts', icon: Dumbbell },
  { name: 'Измерения', href: '/measurements', icon: Scale },
  { name: 'Вода', href: '/water', icon: Droplet },
  { name: 'Цели', href: '/goals', icon: Target },
  { name: 'AI Тренер', href: '/ai-coach', icon: Bot, badge: 'AI' },
];

const bottomNavigation: NavigationItem[] = [
  { name: 'Профиль', href: '/profile', icon: User },
  { name: 'Настройки', href: '/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const location = useLocation();

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const NavItem: React.FC<{ item: NavigationItem; onClick?: () => void }> = ({ 
    item, 
    onClick 
  }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <NavLink
        to={item.href}
        onClick={onClick}
        className={cn(
          'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
          isActive
            ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
        )}
      >
        <item.icon
          className={cn(
            'mr-3 h-5 w-5 transition-colors',
            isActive
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
          )}
        />
        <span className="flex-1">{item.name}</span>
        {item.badge && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    SparkyFit
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Фитнес платформа
                  </p>
                </div>
              </div>
            </div>

            {/* User Info */}
            {user && (
              <div className="flex items-center px-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full">
                    <span className="text-sm font-medium text-gray-700">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
              
              <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                {bottomNavigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </div>
            </nav>

            {/* Logout Button */}
            <div className="flex-shrink-0 px-3 pb-4">
              <Button
                variant="ghost"
                onClick={logout}
                leftIcon={LogOut}
                fullWidth
                className="justify-start text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
              >
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
          >
            <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    SparkyFit
                  </h1>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={toggleSidebar}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </div>

              {/* User Info */}
              {user && (
                <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full">
                      <span className="text-sm font-medium text-gray-700">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navigation.map((item) => (
                  <NavItem 
                    key={item.name} 
                    item={item} 
                    onClick={() => toggleSidebar()} 
                  />
                ))}
                
                <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                  {bottomNavigation.map((item) => (
                    <NavItem 
                      key={item.name} 
                      item={item} 
                      onClick={() => toggleSidebar()} 
                    />
                  ))}
                </div>
              </nav>

              {/* Logout Button */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  onClick={() => {
                    logout();
                    toggleSidebar();
                  }}
                  leftIcon={LogOut}
                  fullWidth
                  className="justify-start text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                >
                  Выйти
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;