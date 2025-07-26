import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, CreditCard, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui';
import { ROUTES } from '../../utils/constants';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const navigation = [
    { name: 'Home', href: ROUTES.HOME, show: !isAuthenticated },
    { name: 'Dashboard', href: ROUTES.DASHBOARD, show: isAuthenticated },
    { name: 'Create Card', href: ROUTES.CARD_EDITOR, show: isAuthenticated },
    { name: 'Admin', href: ROUTES.ADMIN, show: isAuthenticated && isAdmin() },
  ].filter(item => item.show);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to={ROUTES.HOME} className="flex items-center">
                <CreditCard className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  CardBuilder
                </span>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    isActivePath(item.href)
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* User menu and mobile menu button */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:block">
                    {user?.firstName} {user?.lastName}
                  </span>
                </Button>

                {/* User dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      to={ROUTES.PROFILE}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Link>
                    {isAdmin() && (
                      <Link
                        to={ROUTES.ADMIN}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to={ROUTES.LOGIN}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${
                  isActivePath(item.href)
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {!isAuthenticated && (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="space-y-1">
                  <Link
                    to={ROUTES.LOGIN}
                    className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    className="block pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 