import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Chrome, Github, CheckCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { firestoreService } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';

const RegisterModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Auth choice, 2: Email, 3: Password, 4: Email sent, 5: Verified
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState(null); // 'email', 'google', 'github'
  const [emailVerified, setEmailVerified] = useState(false);
  const { setUserProfile } = useAuth();

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError('');
      setAuthMethod(null);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setEmailVerified(false);
    }
  }, [isOpen]);

  const handleEmailNext = () => {
    if (!email || email.trim() === '') {
      setError('Please enter an email address');
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email (e.g., user@example.com)');
      return;
    }
    setError('');
    setStep(3); // Go to password step
  };

  const handlePasswordNext = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setStep(4); // Go to send verification email
  };

  const handleSendVerificationEmail = async () => {
    setError('');
    setLoading(true);
    try {
      // Send verification email (creates user)
      await authService.sendVerificationEmail(email, password);
      
      // Show success message
      setError(`Verification link sent to ${email}. Check your inbox!`);
      
      // Move to waiting for verification step
      setStep(5);
      
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
        setEmailVerified(true);
        
        // Create user profile in Firestore
        const user = authService.getCurrentUser();
        await firestoreService.createUserProfile(user.uid, {
          email,
          displayName: '',
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

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const user = await authService.loginWithGoogle();
      await firestoreService.createUserProfile(user.uid, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
      const profile = await firestoreService.getUserProfile(user.uid);
      setUserProfile(profile);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignUp = async () => {
    console.log('GitHub sign-up button clicked');
    setError(''); // Clear previous errors
    setLoading(true);
    try {
      console.log('Calling loginWithGithub...');
      const user = await authService.loginWithGithub();
      console.log('User logged in:', user);
      
      await firestoreService.createUserProfile(user.uid, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
      const profile = await firestoreService.getUserProfile(user.uid);
      setUserProfile(profile);
      onClose();
    } catch (err) {
      console.error('GitHub sign-up error:', err);
      const errorMessage = err.message || err.toString() || 'GitHub sign-in failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUpStart = () => {
    setAuthMethod('email');
    setStep(2);
    setError('');
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Create user account
      const user = await authService.registerWithEmail(email, password);
      
      // Create user profile in Firestore
      await firestoreService.createUserProfile(user.uid, {
        email,
        displayName: '',
        bio: ''
      });

      const profile = await firestoreService.getUserProfile(user.uid);
      setUserProfile(profile);

      setError('');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div id="recaptcha-container" />
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create Account</h2>

        {/* Auth Method Selection */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface2 transition disabled:opacity-50"
              >
                <Chrome size={20} className="text-red-500" />
                <span className="text-sm font-medium dark:text-white">Google</span>
              </button>
              <button
                onClick={handleGithubSignUp}
                disabled={loading}
                className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface2 transition disabled:opacity-50"
              >
                <Github size={20} className="dark:text-white" />
                <span className="text-sm font-medium dark:text-white">GitHub</span>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleEmailSignUpStart}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface2 transition disabled:opacity-50"
            >
              <Mail size={20} className="text-purple-500" />
              <span className="text-sm font-medium dark:text-white">Email</span>
            </button>
          </>
        )}

        {/* Email Signup Flow - Step 1 */}
        {step === 2 && authMethod === 'email' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleEmailNext}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition"
            >
              Next
            </button>
            <button
              onClick={() => setStep(1)}
              className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-dark-surface2 transition"
            >
              Back
            </button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                onClick={() => {
                  onClose();
                }}
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        )}

        {/* Password Setup Step */}
        {step === 3 && authMethod === 'email' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white"
                  placeholder="Minimum 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={handlePasswordNext}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition"
            >
              Next
            </button>

            <button
              onClick={() => setStep(2)}
              className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-dark-surface2 transition"
            >
              Back
            </button>
          </div>
        )}

        {/* Verification Email Sent Step */}
        {step === 4 && authMethod === 'email' && (
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Check Your Email</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We've sent a verification link to:
                <br />
                <strong className="text-primary-600">{email}</strong>
              </p>
            </div>
            
            {error && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <p className="text-green-700 dark:text-green-300 text-sm">{error}</p>
              </div>
            )}
            
            <button
              onClick={handleCheckVerification}
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium transition"
            >
              {loading ? 'Checking...' : 'I Verified My Email'}
            </button>
            
            <button
              onClick={() => setStep(3)}
              className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-dark-surface2 transition"
            >
              Back
            </button>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Didn't receive it? Check spam folder or{' '}
              <button
                onClick={handleSendVerificationEmail}
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                resend
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;
