import React, { useState } from 'react';
import { Mail, Lock, Phone, Eye, EyeOff, Chrome, Github } from 'lucide-react';
import { authService } from '../services/authService';
import { firestoreService } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const [variant, setVariant] = useState('email'); // email, phone
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
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
      const profile = await firestoreService.getUserProfile(user.uid);
      if (!profile) {
        await firestoreService.createUserProfile(user.uid, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      }
      const newProfile = await firestoreService.getUserProfile(user.uid);
      setUserProfile(newProfile);
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
      const profile = await firestoreService.getUserProfile(user.uid);
      if (!profile) {
        await firestoreService.createUserProfile(user.uid, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      }
      const newProfile = await firestoreService.getUserProfile(user.uid);
      setUserProfile(newProfile);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phone.match(/^\+?[1-9]\d{1,14}$/)) {
      setError('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    try {
      await authService.sendPhoneOTP(phone);
      setOtpSent(true);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter OTP');
      return;
    }
    setLoading(true);
    try {
      const user = await authService.verifyPhoneOTP(otp);
      const profile = await firestoreService.getUserProfile(user.uid);
      if (!profile) {
        await firestoreService.createUserProfile(user.uid, {
          phoneNumber: phone
        });
      }
      const newProfile = await firestoreService.getUserProfile(user.uid);
      setUserProfile(newProfile);
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
      <div className="bg-white dark:bg-dark-surface rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Welcome Back</h2>

        {/* Social Login Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface2 transition disabled:opacity-50"
          >
            <Chrome size={20} className="text-red-500" />
            <span className="text-sm font-medium dark:text-white">Google</span>
          </button>
          <button
            onClick={handleGithubLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface2 transition disabled:opacity-50"
          >
            <Github size={20} className="dark:text-white" />
            <span className="text-sm font-medium dark:text-white">GitHub</span>
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-dark-surface text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        {/* Login Variant Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setVariant('email');
              setOtpSent(false);
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              variant === 'email'
                ? 'bg-primary-600 text-white'
                : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface2'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => {
              setVariant('phone');
              setOtpSent(false);
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              variant === 'phone'
                ? 'bg-primary-600 text-white'
                : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-surface2'
            }`}
          >
            Phone
          </button>
        </div>

        {/* Email Login Form */}
        {variant === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
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
                  placeholder="Your password"
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium transition"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        {/* Phone OTP Form */}
        {variant === 'phone' && (
          <form
            onSubmit={otpSent ? handleVerifyOTP : (e) => { e.preventDefault(); handleSendOTP(); }}
            className="space-y-4"
          >
            {!otpSent ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Include country code (e.g., +1)</p>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium transition"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-surface2 dark:text-white text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength="6"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Check your phone for the OTP</p>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium transition"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                  }}
                  className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-dark-surface2 transition"
                >
                  Change Number
                </button>
              </>
            )}
          </form>
        )}

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => onClose()}
            className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>

      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container" />
    </div>
  );
};

export default LoginModal;
