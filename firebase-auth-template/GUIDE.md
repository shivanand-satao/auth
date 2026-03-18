# Firebase Auth Template - Code Guide & Documentation

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [Folder Structure Explained](#folder-structure-explained)
3. [Component Documentation](#component-documentation)
4. [Service Layer Documentation](#service-layer-documentation)
5. [Context API Documentation](#context-api-documentation)
6. [Common Customizations](#common-customizations)
7. [Security Best Practices](#security-best-practices)

---

## 🎯 Project Overview

This template is a **production-ready authentication system** with:

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **State Management**: React Context API
- **Icons**: Lucide React

### Architecture Diagram

```
┌─────────────────────────────────────────┐
│           Landing Page (App.jsx)        │
├─────────────────────────────────────────┤
│  Navbar  ↔  Login Modal  ↔  Register Modal
│    ↓            ↓                ↓
│ Profile   AuthContext       Firestore
│ Page      (Global State)     Service
└─────────────────────────────────────────┘
         ↓
  Firebase Backend
  (Auth, Firestore, Storage)
```

---

## 📁 Folder Structure Explained

### `src/firebase/`
**Purpose**: Firebase initialization and configuration

**Files**:
- `config.js` - Initializes Firebase app with your credentials

```javascript
// ✅ DO: Use this file to configure Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  // ... other config
};
```

---

### `src/services/`
**Purpose**: Business logic layer for Firebase operations

#### `authService.js`
Handles all authentication operations:

```javascript
// Registration
await authService.registerWithEmail(email, password);

// Login
await authService.loginWithEmail(email, password);

// Social Login
await authService.loginWithGoogle();
await authService.loginWithGithub();

// Phone OTP
await authService.sendPhoneOTP(phoneNumber);
await authService.verifyPhoneOTP(otp);

// Session Management
await authService.logout();
authService.getCurrentUser(); // Returns current user
```

**Key Points**:
- All Firebase Auth methods are centralized here
- Easy to modify or extend
- Error handling included

#### `firestoreService.js`
Handles all database operations:

```javascript
// User Profile Operations
await firestoreService.createUserProfile(userId, userData);
await firestoreService.getUserProfile(userId);
await firestoreService.updateUserProfile(userId, updates);

// File Upload
await firestoreService.uploadProfilePicture(userId, file);

// Query Operations
const users = await firestoreService.getAllUsers();
```

**Database Structure**:
```
Firestore/
└── users/ (Collection)
    └── {userId}/ (Document)
        ├── uid: string
        ├── email: string
        ├── displayName: string
        ├── phoneNumber: string
        ├── bio: string
        ├── photoURL: string
        ├── createdAt: timestamp
        └── updatedAt: timestamp
```

**Storage Structure**:
```
Cloud Storage/
└── profile-pictures/
    ├── {userId}-{timestamp1}.jpg
    ├── {userId}-{timestamp2}.png
    └── ...
```

---

### `src/context/`
**Purpose**: Global state management

#### `AuthContext.jsx`
Provides authentication state to all components:

```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const {
    user,              // Firebase Auth User object
    userProfile,       // User data from Firestore
    setUserProfile,    // Update user profile
    loading,           // Loading state
    error,             // Error messages
    isAuthenticated    // Boolean: user is logged in
  } = useAuth();
}
```

**How it works**:
1. Automatically checks Firebase Auth state on mount
2. Creates Firestore user doc if doesn't exist
3. Fetches user profile data
4. Updates state when auth changes
5. All components can access via `useAuth()` hook

---

### `src/components/`
**Purpose**: Reusable React components

#### `Navbar.jsx`
Navigation bar component:
- Logo/branding
- Dark/Light theme toggle
- Login/Register buttons (not logged in)
- User dropdown (logged in)
- Logout button

**Props**:
```javascript
<Navbar
  onLoginClick={() => setShowLogin(true)}
  onRegisterClick={() => setShowRegister(true)}
  onProfileClick={() => setShowProfile(true)}
/>
```

**Features**:
- Responsive design
- Shows different UI based on auth state
- Sticky positioning
- Dark mode support

#### `LoginModal.jsx`
User login modal with multiple auth methods:
- Email/Password login
- Google sign-in
- GitHub sign-in
- Phone number with OTP

**Props**:
```javascript
<LoginModal
  isOpen={boolean}
  onClose={() => setShowLogin(false)}
/>
```

**Features**:
- Tabs for Email/Phone
- OTP verification flow
- Error messages
- Loading states
- reCAPTCHA integration

#### `RegisterModal.jsx`
User registration modal (step-by-step):
1. Email input
2. Phone number input
3. Password confirmation

**Props**:
```javascript
<RegisterModal
  isOpen={boolean}
  onClose={() => setShowRegister(false)}
/>
```

**Features**:
- Multi-step wizard
- Email validation
- Password confirmation
- Firestore profile creation
- Phone number validation

#### `ProfilePage.jsx`
User profile view and edit page:
- Profile picture upload
- Edit name, phone, bio
- View all profile data

**Props**:
```javascript
<ProfilePage onBack={() => setShowProfile(false)} />
```

**Features**:
- Image upload with validation
- Form validation
- Real-time updates
- Success/error messages
- Profile picture caching

#### `ThemeToggle.jsx`
Dark/Light mode toggle button:

**Features**:
- Toggles `dark` class on HTML element
- Persists preference to localStorage
- Detects system preference on first load
- Button in navbar

---

### `src/pages/`
**Purpose**: Full page components

#### `Landing.jsx`
Main landing/home page:
- Hero section with CTA
- Features section
- Quick start guide
- Footer

**Features**:
- Responsive layout
- Shows different content based on auth state
- Modals for login/register
- Profile access for logged-in users

---

## 🔧 Common Customizations

### 1️⃣ Change Color Scheme

**File**: `tailwind.config.js`

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#your-color-50',
        100: '#your-color-100',
        500: '#your-main-color',
        600: '#your-darker-color',
        700: '#your-darker-color',
        900: '#your-darkest-color',
      }
    }
  }
}
```

Then update HTML:
```html
<!-- Before -->
<div className="bg-primary-600 text-primary-500">

<!-- After - same, just different colors! -->
<div className="bg-primary-600 text-primary-500">
```

### 2️⃣ Add New User Profile Fields

**Files to update**:

1. **Firestore Service** (`src/services/firestoreService.js`):
```javascript
export const firestoreService = {
  createUserProfile: async (userId, userData) => {
    await setDoc(doc(db, 'users', userId), {
      // ... existing fields
      company: userData.company || '',     // NEW
      location: userData.location || '',   // NEW
    });
  }
}
```

2. **Auth Context** (`src/context/AuthContext.jsx`):
```javascript
// Update initial user profile fetch
const profile = await firestoreService.getUserProfile(authUser.uid);
setUserProfile(profile);
```

3. **Profile Page** (`src/components/ProfilePage.jsx`):
```javascript
const [formData, setFormData] = useState({
  displayName: userProfile?.displayName || '',
  // ... existing fields
  company: userProfile?.company || '',    // NEW
  location: userProfile?.location || '',  // NEW
});

// Add form inputs...
```

### 3️⃣ Add Email Verification

```javascript
// Update authService.js
import { sendEmailVerification } from 'firebase/auth';

export const authService = {
  registerWithEmail: async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Send verification email
    await sendEmailVerification(userCredential.user);
    
    return userCredential.user;
  },
  
  checkEmailVerified: () => {
    return auth.currentUser?.emailVerified;
  }
}
```

### 4️⃣ Add Password Reset

```javascript
// In authService.js
import { sendPasswordResetEmail } from 'firebase/auth';

export const authService = {
  sendPasswordReset: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
```

Then add button in LoginModal:
```javascript
<button onClick={() => authService.sendPasswordReset(email)}>
  Forgot Password?
</button>
```

### 5️⃣ Add Usage Terms Page

```
src/
└── pages/
    ├── Landing.jsx
    ├── Terms.jsx           // NEW
    └── Privacy.jsx         // NEW
```

Then link in Landing.jsx:
```javascript
<Link to="/terms">Terms of Service</Link>
<Link to="/privacy">Privacy Policy</Link>
```

---

## 🔐 Security Best Practices

### ✅ DO's

1. **Use Environment Variables**
   ```javascript
   // ✅ GOOD
   const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
   ```

2. **Validate User Input**
   ```javascript
   // ✅ GOOD
   if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
     setError('Invalid email');
   }
   ```

3. **Use Security Rules**
   ```javascript
   // ✅ Firestore rules
   match /users/{uid} {
     allow read, write: if request.auth.uid == uid;
   }
   ```

4. **Check Authentication State**
   ```javascript
   // ✅ GOOD
   if (!isAuthenticated) {
     return <Redirect to="/login" />;
   }
   ```

5. **Use HTTPS for Production**
   ```javascript
   // ✅ Always use HTTPS
   // Firebase Hosting handles this automatically
   ```

### ❌ DON'Ts

1. **Don't expose credentials**
   ```javascript
   // ❌ BAD - Never hardcode!
   const apiKey = "AIz...";
   
   // ✅ GOOD - Use env vars
   const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
   ```

2. **Don't trust client-side auth alone**
   ```javascript
   // ❌ BAD - Can be faked
   if (localStorage.getItem('isAdmin')) {
     // Grant access
   }
   
   // ✅ GOOD - Check on backend
   // Verify in Firestore rules
   ```

3. **Don't store sensitive data in localStorage**
   ```javascript
   // ❌ BAD
   localStorage.setItem('password', password);
   
   // ✅ GOOD - Firebase handles this securely
   ```

4. **Don't allow open storage access**
   ```javascript
   // ❌ BAD - Storage rules
   match /{allPaths=**} {
     allow read, write;
   }
   
   // ✅ GOOD
   match /profile-pictures/{uid}-{fileName} {
     allow read: if true;
     allow write: if request.auth.uid == uid;
   }
   ```

---

## 🧪 Testing Your Implementation

### Test Checklist

- [ ] Email registration works
- [ ] Email login works
- [ ] Google sign-in works
- [ ] GitHub sign-in works
- [ ] Phone OTP works
- [ ] Profile picture upload works
- [ ] Profile edit works
- [ ] Logout works
- [ ] Dark mode toggles
- [ ] Responsive on mobile
- [ ] Firestore has user data
- [ ] Storage has profile pics

---

## 📚 File Reference

| File | Purpose | Key Functions |
|------|---------|---|
| `config.js` | Firebase init | Initializes Firebase |
| `authService.js` | Auth logic | registerWithEmail, loginWithGoogle, etc |
| `firestoreService.js` | Database logic | CRUD operations for users |
| `AuthContext.jsx` | Global state | useAuth() hook |
| `LoginModal.jsx` | Login UI | Email, Google, GitHub, Phone auth |
| `RegisterModal.jsx` | Register UI | Email & Phone registration |
| `ProfilePage.jsx` | Profile UI | View/edit user profile |
| `Navbar.jsx` | Nav UI | Logo, theme toggle, user menu |
| `ThemeToggle.jsx` | Theme UI | Dark/Light toggle |
| `Landing.jsx` | Home page | Hero, features, CTAs |
| `App.jsx` | App root | Provider wrapper |
| `main.jsx` | Entry point | ReactDOM render |
| `index.css` | Global styles | Tailwind + custom CSS |

---

## 🚀 Advanced: Adding Backend API

To integrate with a custom API:

```javascript
// src/services/apiService.js
export const apiService = {
  validateUser: async (userId) => {
    const response = await fetch(`/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${await auth.currentUser.getIdToken()}`
      }
    });
    return response.json();
  }
}
```

---

## 💡 Tips

1. **Use React DevTools**: Debug components and state
2. **Use Firebase DevTools**: Monitor auth and database
3. **Check Console**: Look for errors
4. **Test Locally**: Before deploying
5. **Keep Services Clean**: Don't mix UI and logic

---

**Happy coding! This template is your foundation for amazing apps! 🚀**
