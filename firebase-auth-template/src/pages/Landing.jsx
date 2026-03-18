import React, { useState } from 'react';
import { Zap, Shield, Users, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import ProfilePage from '../components/ProfilePage';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { isAuthenticated } = useAuth();

  if (showProfile && isAuthenticated) {
    return (
      <ProfilePage onBack={() => setShowProfile(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-white">
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
        onProfileClick={() => setShowProfile(true)}
      />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          Modern Authentication Made Simple
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          A professional, reusable Firebase authentication template for your next project. Supports email, Google, GitHub, and phone authentication.
        </p>

        {!isAuthenticated && (
          <div className="flex gap-4 justify-center items-center flex-wrap">
            <button
              onClick={() => setShowRegister(true)}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition text-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="px-8 py-3 border-2 border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-dark-surface rounded-lg font-medium transition text-lg"
            >
              Login
            </button>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gray-50 dark:bg-dark-surface p-6 rounded-lg text-center">
            <Lock className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h4 className="font-bold mb-2">Secure Auth</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Firebase authentication for maximum security
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-dark-surface p-6 rounded-lg text-center">
            <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h4 className="font-bold mb-2">Multiple Methods</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Email, Google, GitHub, and Phone authentication
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-dark-surface p-6 rounded-lg text-center">
            <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h4 className="font-bold mb-2">User Profiles</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Firestore integration with profile pictures
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-dark-surface p-6 rounded-lg text-center">
            <Zap className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h4 className="font-bold mb-2">Fast & Modern</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built with React, Vite, and Tailwind CSS
            </p>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="bg-gray-50 dark:bg-dark-surface/50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12">Quick Start Guide</h3>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Setup Firebase</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Create a Firebase project and get your config credentials. Update <code className="bg-gray-200 dark:bg-dark-surface2 px-2 py-1 rounded">src/firebase/config.js</code> with your credentials.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Install Dependencies</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Run <code className="bg-gray-200 dark:bg-dark-surface2 px-2 py-1 rounded">npm install</code> to install all required packages.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Enable Auth Methods</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  In Firebase Console, enable Email/Password, Google, GitHub, and Phone authentication methods.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Start Development</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Run <code className="bg-gray-200 dark:bg-dark-surface2 px-2 py-1 rounded">npm run dev</code> to start the development server.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 text-center py-8">
        <p>© 2024 FireAuth - Your Perfect Authentication Template</p>
      </footer>
    </div>
  );
};

export default Landing;
