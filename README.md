# Firebase Auth Template

A professional, production-ready authentication template built with React, Vite, Tailwind CSS, and Firebase. Perfect for hackathons and starter projects!

## ✨ Features

- ✅ **Multiple Auth Methods**
  - Email/Password authentication
  - Google Sign-In
  - GitHub Sign-In
  - Phone Number with SMS OTP verification

- ✅ **User Profiles**
  - Firestore database integration
  - User profile pictures (uploaded to Firebase Storage)
  - Editable profile (name, phone, bio)
  - Real-time profile updates

- ✅ **Dark/Light Theme**
  - System preference detection
  - LocalStorage persistence
  - Smooth transitions

- ✅ **Modern UI**
  - Responsive design
  - Tailwind CSS styling
  - Modern components with Lucide Icons
  - Professional modals and forms

- ✅ **Developer Friendly**
  - Clean, well-organized code
  - Easy to customize
  - Reusable components
  - Firebase service layer for easy backend migrations

## 📁 Project Structure

```
firebase-auth-template/
├── src/
│   ├── components/
│   │   ├── LoginModal.jsx          # Email, Google, GitHub, Phone login
│   │   ├── RegisterModal.jsx       # Email & Phone registration
│   │   ├── Navbar.jsx              # Navigation with user dropdown
│   │   ├── ProfilePage.jsx         # User profile view/edit
│   │   └── ThemeToggle.jsx         # Dark/Light mode toggle
│   ├── pages/
│   │   └── Landing.jsx             # Main landing page
│   ├── context/
│   │   └── AuthContext.jsx         # Global auth state management
│   ├── services/
│   │   ├── authService.js          # Firebase authentication logic
│   │   └── firestoreService.js     # Firestore & Storage operations
│   ├── firebase/
│   │   └── config.js               # Firebase configuration
│   ├── App.jsx                     # Main app wrapper
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Global styles
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project (free tier works!)

### Step 1: Clone or Copy the Template

```bash
npm install
```

### Step 2: Setup Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing one
3. Get your project config:
   - Click "Project Settings" ⚙️
   - Copy the config object from "Your apps" section

### Step 3: Update Firebase Config

Replace the credentials in `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 4: Enable Authentication Methods

In Firebase Console:

1. **Email/Password**
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"

2. **Google Sign-In**
   - Enable "Google"
   - Add your domain to authorized domains

3. **GitHub Sign-In**
   - Enable "GitHub"
   - Add your GitHub OAuth app credentials
   - [GitHub OAuth Setup Guide](https://developers.google.com/identity/protocols/oauth2)

4. **Phone Number**
   - Enable "Phone"
   - Enable reCAPTCHA v3

### Step 5: Setup Firestore & Storage

1. **Firestore Database**
   - Go to Firestore Database
   - Click "Create Database"
   - Start in **Test mode** (or configure security rules)

2. **Cloud Storage**
   - Go to Cloud Storage
   - Click "Create bucket"
   - Use default settings

3. **Security Rules** (if in production)
   
   **Firestore Rules:**
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid} {
         allow read, write: if request.auth.uid == uid;
       }
     }
   }
   ```

   **Storage Rules:**
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /profile-pictures/{uid}-{fileName} {
         allow read: if true;
         allow write: if request.auth.uid == uid;
       }
     }
   }
   ```

### Step 6: Start Development

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 🔧 Configuration for Hackathons

### Environment Variables

Create a `.env.local` file for environment-specific settings:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Then update `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

### Customization Tips

1. **Change Colors**: Edit `tailwind.config.js` theme colors
2. **Modify Components**: All components are in `src/components/`
3. **Add Features**: Use `authService` and `firestoreService` as templates
4. **Extend User Data**: Add fields to Firestore in `createUserProfile()`

## 📱 Available Routes

- `/` - Landing page with authentication modals
- Profile modal opens after login
- Dark/Light theme toggle in navbar

## 🔑 Key Services

### Authentication Service (`authService.js`)

```javascript
// Register with email
await authService.registerWithEmail(email, password);

// Login with email
await authService.loginWithEmail(email, password);

// Social login
await authService.loginWithGoogle();
await authService.loginWithGithub();

// Phone OTP
await authService.sendPhoneOTP(phoneNumber);
await authService.verifyPhoneOTP(otp);

// Logout
await authService.logout();
```

### Firestore Service (`firestoreService.js`)

```javascript
// Create user profile
await firestoreService.createUserProfile(userId, userData);

// Get user profile
const profile = await firestoreService.getUserProfile(userId);

// Update profile
await firestoreService.updateUserProfile(userId, updateData);

// Upload profile picture
const photoURL = await firestoreService.uploadProfilePicture(userId, file);
```

### useAuth Hook

```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, userProfile, isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;
  
  return <div>Welcome {userProfile.displayName}</div>;
}
```

## 🚢 Deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy:
   ```bash
   firebase deploy
   ```

### Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

## 🐛 Troubleshooting

### "Firebase app not initialized"
- Check `src/firebase/config.js` has correct credentials
- Verify Firebase project is active

### "Phone OTP not working"
- Enable Phone authentication in Firebase Console
- Enable reCAPTCHA v3
- Make sure domain is in authorized list

### "Profile picture upload fails"
- Check Cloud Storage bucket exists
- Verify Storage security rules
- Check file size (max 5MB)

### "Dark mode not persisting"
- Check browser localStorage is enabled
- Clear browser cache and reload

## 📚 Documentation Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)

## 📄 License

This template is free to use for personal and commercial projects.

## 💡 Tips for Hackathons

1. **Prepare Credentials**: Have your Firebase config ready before the hackathon
2. **Save Time**: Use this template as your auth foundation
3. **Customize Quickly**: All components are modular and easy to modify
4. **Deploy Quickly**: Use Firebase Hosting or Vercel for instant deployment
5. **Scale Up**: Easy to add new features on top of this auth layer

## 🤝 Contributing

Feel free to customize and improve this template. It's meant to be forked and modified!

## ❓ Need Help?

Check the [Firebase Documentation](https://firebase.google.com/docs) or the code comments in each file.

---

**Happy Coding! 🚀**

Made for developers who value their time ⏱️
