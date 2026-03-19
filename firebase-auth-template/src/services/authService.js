import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload
} from 'firebase/auth';
import { auth } from '../firebase/config';

// Initialize providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const phoneProvider = new PhoneAuthProvider(auth);

export const authService = {
  // Email/Password Registration
  registerWithEmail: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Send Email Verification
  sendVerificationEmail: async (email, password) => {
    try {
      // Create user first
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user, {
        url: window.location.origin // Redirect URL after verification
      });

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Check if email is verified
  checkEmailVerified: async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      // Reload user to get latest verification status
      await reload(user);
      return user.emailVerified;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Email/Password Login
  loginWithEmail: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Send Password Reset Email
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin // Redirect URL after password reset
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Google Sign-In
  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // GitHub Sign-In
  loginWithGithub: async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      return result.user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Phone Sign-In - Send OTP
  sendPhoneOTP: async (phoneNumber) => {
    try {
      // Create reCAPTCHA verifier
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          'recaptcha-container',
          {
            size: 'invisible',
            callback: (response) => {
              // reCAPTCHA solved
            }
          }
        );
      }

      const verifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        verifier
      );
      
      window.confirmationResult = confirmationResult;
      return confirmationResult;
    } catch (error) {
      // Clear verifier on error
      window.recaptchaVerifier = null;
      throw new Error(error.message);
    }
  },

  // Phone Sign-In - Verify OTP
  verifyPhoneOTP: async (otp) => {
    try {
      if (!window.confirmationResult) {
        throw new Error('Please send OTP first');
      }
      const result = await window.confirmationResult.confirm(otp);
      return result.user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Update User Profile
  updateUserProfile: async (displayName, photoURL) => {
    try {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL
      });
      return auth.currentUser;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get Current User
  getCurrentUser: () => {
    return auth.currentUser;
  }
};
