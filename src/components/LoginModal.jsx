import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import { firestoreService } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { setUserProfile } = useAuth();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await authService.loginWithEmail(email, password);
      const profile = await firestoreService.getUserProfile(authService.getCurrentUser().uid);
      setUserProfile(profile);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const user = await authService.loginWithGoogle();
      
      // Try to get existing profile, create if doesn't exist
      try {
        const profile = await firestoreService.getUserProfile(user.uid);
        setUserProfile(profile);
      } catch (error) {
        // Profile doesn't exist, create it
        await firestoreService.createUserProfile(user.uid, {
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          photoURL: user.photoURL || ''
        });
        const newProfile = await firestoreService.getUserProfile(user.uid);
        setUserProfile(newProfile);
      }
      
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    try {
      const user = await authService.loginWithGithub();
      
      // Try to get existing profile, create if doesn't exist
      try {
        const profile = await firestoreService.getUserProfile(user.uid);
        setUserProfile(profile);
      } catch (error) {
        // Profile doesn't exist, create it
        await firestoreService.createUserProfile(user.uid, {
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          photoURL: user.photoURL || ''
        });
        const newProfile = await firestoreService.getUserProfile(user.uid);
        setUserProfile(newProfile);
      }
      
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authService.resetPassword(resetEmail);
      setSuccess(`Password reset email sent to ${resetEmail}. Check your inbox!`);
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white dark:bg-dark-bg flex items-center justify-center z-50 overflow-y-auto">
      <div className="w-full max-w-xl px-6 py-12">
        {/* Toggle Pills */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-full border-2 border-gray-200 dark:border-gray-700 p-1 bg-white dark:bg-dark-surface">
            <button
              onClick={onSwitchToRegister}
              className="px-8 py-2.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            >
              Sign up
            </button>
            <button
              className="px-8 py-2.5 rounded-full text-sm font-medium bg-blue-600 text-white shadow-sm"
            >
              Login
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-md mx-auto">
          {!showForgotPassword ? (
            <>
              <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
                Log in to your existing profile
              </h1>

              {/* Social Sign In Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-4 rounded-xl font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  onClick={handleGithubLogin}
                  disabled={loading}
                  className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white py-4 rounded-xl font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                  </svg>
                  GitHub
                </button>
              </div>

              {/* OR Divider */}
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white dark:bg-dark-bg text-gray-400 text-sm">OR</span>
                </div>
              </div>

              {/* Email Login Form */}
              <form onSubmit={handleEmailLogin} className="space-y-6">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-blue-200 dark:border-blue-800 rounded-xl focus:outline-none focus:border-blue-500 dark:bg-dark-surface dark:text-white text-gray-700 placeholder-gray-400"
                    placeholder="Username or Email"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 dark:bg-dark-surface dark:text-white text-gray-700 placeholder-gray-400"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold text-lg transition shadow-sm"
                >
                  {loading ? 'LOGGING IN...' : 'LOGIN'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>

              {/* Footer */}
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
                If something is not right, email us at{' '}
                <a href="mailto:help@example.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  help@example.com
                </a>
              </p>
            </>
          ) : (
            /* Forgot Password Form */
            <>
              <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
                Reset your password
              </h1>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-10">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-blue-200 dark:border-blue-800 rounded-xl focus:outline-none focus:border-blue-500 dark:bg-dark-surface dark:text-white text-gray-700 placeholder-gray-400"
                    placeholder="Email address"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-green-600 dark:text-green-400 text-sm text-center">{success}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold text-lg transition shadow-sm"
                >
                  {loading ? 'SENDING...' : 'SEND RESET LINK'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                    setError('');
                    setSuccess('');
                  }}
                  className="w-full border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-dark-surface2 transition"
                >
                  Back to Login
                </button>
              </form>

              {/* Footer */}
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
                If something is not right, email us at{' '}
                <a href="mailto:help@example.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  help@example.com
                </a>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container" />
    </div>
  );
};

export default LoginModal;
