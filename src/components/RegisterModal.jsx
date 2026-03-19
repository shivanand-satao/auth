import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { firestoreService } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [step, setStep] = useState(1); // 1: Register form, 2: Email verification
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUserProfile } = useAuth();

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setFullName('');
      setEmail('');
      setPassword('');
      setAgreeTerms(false);
      setError('');
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the terms and privacy policy');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      // Send verification email immediately
      await authService.sendVerificationEmail(email, password);
      
      // Show success message and move to verification step
      setError(`Verification link sent to ${email}. Check your inbox!`);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setError('');
    setLoading(true);
    try {
      // Check if email is verified
      const isVerified = await authService.checkEmailVerified();
      
      if (isVerified) {
        // Create user profile in Firestore
        const user = authService.getCurrentUser();
        await firestoreService.createUserProfile(user.uid, {
          email,
          displayName: fullName,
          bio: ''
        });

        const profile = await firestoreService.getUserProfile(user.uid);
        setUserProfile(profile);
        
        setError('');
        onClose();
      } else {
        setError('Email not verified yet. Please click the link in your email!');
      }
    } catch (err) {
      setError(err.message || 'Failed to check verification. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setError('');
    setLoading(true);
    try {
      await authService.sendVerificationEmail(email, password);
      setError(`Verification link sent to ${email}. Check your inbox!`);
    } catch (err) {
      setError(err.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
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
          photoURL: user.photoURL || '',
          bio: ''
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

  const handleGithubSignUp = async () => {
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
          photoURL: user.photoURL || '',
          bio: ''
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white dark:bg-dark-bg flex items-center justify-center z-50 overflow-y-auto">
      <div id="recaptcha-container" />
      <div className="w-full max-w-xl px-6 py-12">
        {/* Toggle Pills */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-full border-2 border-gray-200 dark:border-gray-700 p-1 bg-white dark:bg-dark-surface">
            <button
              className="px-8 py-2.5 rounded-full text-sm font-medium bg-blue-600 text-white shadow-sm"
            >
              Sign up
            </button>
            <button
              onClick={onSwitchToLogin}
              className="px-8 py-2.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            >
              Login
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-md mx-auto">
          {step === 1 ? (
            <>
              <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
                Join FireAuth to start coding
              </h1>

              {/* Social Sign Up Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  onClick={handleGoogleSignUp}
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
                  onClick={handleGithubSignUp}
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

              {/* Registration Form */}
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 dark:bg-dark-surface dark:text-white text-gray-700 placeholder-gray-400"
                    placeholder="Full Name"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 dark:bg-dark-surface dark:text-white text-gray-700 placeholder-gray-400"
                    placeholder="Email"
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

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to{' '}
                    <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                      FireAuth's Terms
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>

                {error && !error.includes('Verification link sent') && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold text-lg transition shadow-sm"
                >
                  {loading ? 'CREATING ACCOUNT...' : 'REGISTER'}
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
          ) : (
            /* Email Verification Step */
            <div className="text-center">
              <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Check Your Email
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                We've sent a verification link to:
              </p>
              <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-8">
                {email}
              </p>

              {error && (
                <div className={`${error.includes('Verification link sent') ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'} border rounded-lg p-3 mb-6`}>
                  <p className={`${error.includes('Verification link sent') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} text-sm`}>
                    {error}
                  </p>
                </div>
              )}

              <button
                onClick={handleCheckVerification}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold text-lg transition shadow-sm mb-4"
              >
                {loading ? 'CHECKING...' : 'I VERIFIED MY EMAIL'}
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-dark-surface2 transition mb-6"
              >
                Back
              </button>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Didn't receive it? Check spam folder or{' '}
                <button
                  onClick={handleResendEmail}
                  disabled={loading}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  resend
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
