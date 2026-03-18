import React, { useState } from 'react';
import { LogOut, User } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ onLoginClick, onRegisterClick, onProfileClick }) => {
  const { user, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setShowDropdown(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">FA</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">FireAuth</h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {!isAuthenticated ? (
            <div className="flex gap-3">
              <button
                onClick={onLoginClick}
                className="px-6 py-2 border border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg font-medium hover:bg-primary-50 dark:hover:bg-dark-surface2 transition"
              >
                Login
              </button>
              <button
                onClick={onRegisterClick}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface2 transition"
              >
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.displayName || user?.email?.split('@')[0]}
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-surface2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-2 z-50">
                  <button
                    onClick={() => {
                      onProfileClick();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-surface flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <User size={18} />
                    View Profile
                  </button>
                  <hr className="border-gray-200 dark:border-gray-600 my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-600 dark:text-red-400"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
