# Setup Instructions for Firebase Auth Template

## 📋 Complete Setup Checklist

### 1️⃣ Firebase Console Setup (5 minutes)

#### Create Firebase Project
- [ ] Go to [Firebase Console](https://console.firebase.google.com)
- [ ] Click "Create a project" or select existing project
- [ ] Enter project name (e.g., "my-app-auth")
- [ ] Click "Continue"

#### Get Your Config Credentials
- [ ] In Firebase Console, go to **Project Settings** (⚙️ icon)
- [ ] Select **"General"** tab
- [ ] Scroll to **"Your apps"** section
- [ ] Click **"Web"** (</> icon)
- [ ] Register app (give it a name like "Web App")
- [ ] Copy the entire `firebaseConfig` object
- [ ] Paste into `src/firebase/config.js`

#### Enable Authentication Methods
Go to **Authentication** > **Sign-in method** and enable:

- [ ] **Email/Password**
  - Click "Email/Password"
  - Toggle "Enable"
  - Click "Save"

- [ ] **Google**
  - Click "Google"
  - Toggle "Enable"
  - Select a support email
  - Click "Save"
  - ⚠️ Note: Google sign-in might require verification. You can test with your own Google account.

- [ ] **GitHub**
  - Click "GitHub"
  - You need GitHub OAuth credentials:
    1. Go to GitHub Settings > Developer settings > OAuth Apps
    2. Click "New OAuth App"
    3. Fill in:
       - Application name: Your app name
       - Authorization callback URL: `https://YOUR-FIREBASE-PROJECT-ID.firebaseapp.com/__/auth/handler`
       - Get Client ID and Secret
    4. Paste Client ID and Secret into Firebase GitHub setup
  - Click "Save"

- [ ] **Phone**
  - Click "Phone"
  - Toggle "Enable"
  - For testing: You can use your own phone number
  - For production: Configure reCAPTCHA v3
  - Click "Save"

#### Setup Firestore Database
- [ ] Go to **Firestore Database** (in left sidebar)
- [ ] Click **"Create Database"**
- [ ] Choose **"Start in test mode"** (for development)
- [ ] Click **"Create"**

#### Setup Cloud Storage
- [ ] Go to **Cloud Storage** (in left sidebar)
- [ ] Click **"Create bucket"**
- [ ] Accept default name
- [ ] Choose location closest to you
- [ ] Choose **"Public"** access for testing
- [ ] Click **"Create"**

---

### 2️⃣ Update Firebase Config File

Open `src/firebase/config.js` and replace:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",           // ← From Firebase
  authDomain: "YOUR_AUTH_DOMAIN",   // ← FROM Firebase
  projectId: "YOUR_PROJECT_ID",     // ← From Firebase
  storageBucket: "YOUR_STORAGE_BUCKET",      // ← From Firebase
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // ← From Firebase
  appId: "YOUR_APP_ID"              // ← From Firebase
};
```

✅ **Copy from Firebase Console**:
- Project Settings > General > Your apps > Web > firebaseConfig

---

### 3️⃣ Local Development Setup

#### Install Dependencies
```bash
cd firebase-auth-template
npm install
```

This will install:
- React 18
- Firebase 10
- Vite
- Tailwind CSS
- Lucide Icons

#### Start Development Server
```bash
npm run dev
```

✅ Should see: `Local: http://localhost:5173`

---

### 4️⃣ Test Authentication

#### 📧 Email/Password
1. Click "Sign Up"
2. Enter email and password
3. Check Firestore: Collections > users > your-uid

#### 🔵 Google Sign-In
1. Click "Login"
2. Click "Google"
3. Select your Google account
4. Should create user in Firestore automatically

#### 🐙 GitHub Sign-In
1. Click "Login"
2. Click "GitHub"
3. Authorize the app
4. Should redirect back and log you in

#### 📱 Phone Number (SMS)
1. Click "Login" > "Phone"
2. Enter your phone number (with country code like +1)
3. Click "Send OTP"
4. Enter the OTP you receive
5. Should log you in

---

### 5️⃣ Test Profile Features

#### Upload Profile Picture
1. After login, click your avatar in navbar
2. Click "View Profile"
3. Click camera icon on profile picture
4. Select an image (less than 5MB)
5. Picture should appear and be saved to Cloud Storage

#### Edit Profile
1. On profile page, click "Edit"
2. Update: Name, Phone, Bio
3. Click "Save Changes"
4. Check Firestore to verify data

---

### 6️⃣ Environment Variables (Optional but Recommended)

Create `.env.local` file in project root:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
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

---

### 7️⃣ (Optional) Setup Security Rules for Production

#### Firestore Rules
Go to Firestore > Rules tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

#### Storage Rules
Go to Cloud Storage > Rules tab:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-pictures/{uid}-{fileName} {
      allow read: if true;
      allow write: if request.auth.uid == uid && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

---

### 8️⃣ Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` folder.

---

### 9️⃣ Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login (opens browser)
firebase login

# Initialize Firebase hosting
firebase init hosting

# Deploy
firebase deploy
```

---

## 🎯 Common Issues & Solutions

### ❌ Problem: "Firebase app not initialized"
**Solution**: 
- Check `src/firebase/config.js` has correct credentials
- Values must match Firebase Console exactly (copy-paste!)

### ❌ Problem: "Phone OTP not sending"
**Solution**:
- Phone auth must be **enabled** in Firebase Console
- reCAPTCHA v3 must be **enabled**
- Phone must be in international format (+Country-Code-Number)
- Example: +1234567890 (not 234567890)

### ❌ Problem: "Profile picture upload fails"
**Solution**:
- Cloud Storage bucket must exist
- Security rules might be blocking uploads
- File must be less than 5MB
- File must be an image (jpg, png, etc.)

### ❌ Problem: "Google sign-in not working"
**Solution**:
- Google sign-in method must be enabled
- For production, ensure domain is verified
- For testing, use your own Google account

### ❌ Problem: "Dark mode not working"
**Solution**:
- Check browser allows localStorage
- Clear browser cache
- Check `ThemeToggle.jsx` is rendering

---

## 🚀 Ready for Your Hackathon!

Now you have a fully working authentication system. You can:

1. ✅ Add login/register to any page
2. ✅ Protect routes (check if user is logged in)
3. ✅ Store user data in Firestore
4. ✅ Let users upload profile pictures
5. ✅ Deploy to Firebase instantly

---

## 📚 Next Steps

1. **Customize Design**: Edit colors in `tailwind.config.js`
2. **Add Features**: Use `authService` and `firestoreService` as examples
3. **Extend User Data**: Add more fields to Firestore
4. **Create Protected Routes**: Use `useAuth()` hook to check if user is logged in
5. **Deploy**: Use Firebase Hosting or Vercel

---

## 💡 Pro Tips for Hackathons

✅ **Before Hackathon**:
- Create Firebase project
- Generate credentials
- Test locally
- Note down your Firebase project ID

✅ **During Hackathon**:
- Paste credentials into a fresh copy
- Run `npm install` and `npm run dev`
- Focus on your app logic, not auth!

✅ **Before Submission**:
- Test all auth methods
- Deploy to Firebase Hosting
- Share the live URL

---

**You're all set! 🎉 Start building!**
