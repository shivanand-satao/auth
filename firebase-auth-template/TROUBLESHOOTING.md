# Firebase Auth Template - Troubleshooting Guide

## 🚨 Common Issues & Solutions

### ❌ Installation Issues

#### Problem: "npm: command not found"
**Solution**:
- Node.js is not installed
- Download from [nodejs.org](https://nodejs.org) (LTS version)
- Restart terminal after installation
- Verify: `node --version` and `npm --version`

#### Problem: "package.json not found"
**Solution**:
- Make sure you're in the correct directory
- Run: `cd c:\Users\shiva\Desktop\temp\firebase-auth-template`
- Check: `ls` or `dir` to see files

#### Problem: "npm ERR! 403 Forbidden"
**Solution**:
- Clear npm cache: `npm cache clean --force`
- Try again: `npm install`
- Check internet connection

---

### ❌ Firebase Configuration Issues

#### Problem: "Firebase app not initialized"
**Code error**: `Uncaught Error: Firebase app not initialized`

**Solution**:
1. Check `src/firebase/config.js` exists
2. Check it has all credentials
3. Verify credentials match Firebase Console exactly
4. Example correct config:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDLB2jdB1c3Z9x8Q1K5L7M9N2P3Q4R5S6",
  authDomain: "my-app-12345.firebaseapp.com",
  projectId: "my-app-12345",
  storageBucket: "my-app-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789"
};
```

#### Problem: "Credentials are missing"
**Solution**:
1. Go to Firebase Console
2. Project Settings (⚙️ icon)
3. Under "Your apps" find your web app
4. Copy entire config
5. Paste in `src/firebase/config.js`

---

### ❌ Authentication Issues

#### Problem: "Email/Password login not working"
**Symptoms**:
- Button doesn't respond
- No error message
- Browser console is silent

**Solution**:
1. Check email/password auth is enabled:
   - Firebase Console > Auth > Sign-in method
   - Email/Password should say "Enabled"
2. Check database exists:
   - Firebase Console > Firestore Database
   - Should see "Database ID"
3. Test with valid email:
   - Use format: `test@example.com`
4. Check browser console for errors:
   - Press F12 > Console tab
   - Look for red error messages

#### Problem: "Google sign-in not working"
**Symptoms**:
- Click Google button, nothing happens
- Error: "popup_closed_by_user"

**Solution**:
1. Enable Google in Firebase:
   - Auth > Sign-in method > Google
   - Toggle should be "Enabled"
2. For development:
   - Add your email to authorized users
   - Or test in authorized domain
3. For production:
   - Domain must be verified
   - Add reCAPTCHA credentials

#### Problem: "GitHub sign-in not working"
**Solution**:
1. You need GitHub OAuth credentials:
   - GitHub Settings > Developer settings > OAuth Apps
   - Create new OAuth App
   - Get Client ID and Client Secret
2. Add to Firebase:
   - Auth > Sign-in method > GitHub
   - Paste Client ID and Secret
   - Copy the "Authorization callback URL"
3. Go back to GitHub OAuth app:
   - Set Authorization callback URL to the URL from Firebase
   - Save

#### Problem: "Phone OTP not sending"
**Symptoms**:
- Click "Send OTP", nothing happens
- No SMS received

**Solution**:
1. Enable Phone auth:
   - Auth > Sign-in method > Phone
   - Toggle "Enabled"
2. Enable reCAPTCHA v3:
   - Click phone auth
   - Look for reCAPTCHA option
   - Click "Enable reCAPTCHA" button
3. Use correct phone format:
   - Must include country code
   - Format: `+1234567890` (not `1234567890`)
   - Examples: `+1 (555) 123-4567`, `+44 7911 123456`
4. For testing:
   - Use your real phone number
   - Check spam folder for SMS
5. Check limits:
   - Firebase has limits on free tier
   - Check documentation

#### Problem: "Recaptcha container not found"
**Error**: `Recaptcha container not found`

**Solution**:
- This error appears if reCAPTCHA script isn't loaded
- In `LoginModal.jsx`, make sure this exists:
```javascript
// Hidden reCAPTCHA container
<div id="recaptcha-container" />
```

---

### ❌ Database Issues

#### Problem: "Permission denied" when reading user profile
**Error**: `PERMISSION_DENIED: Missing or insufficient permissions`

**Solution**:
1. Check Firestore rules:
   - Firestore > Rules tab
   - Default rules only allow read/write by authenticated users
   - For testing use:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
   - ⚠️ This is for testing only! Use proper rules before production.

2. Create Firestore database if it doesn't exist:
   - Firestore > Create Database
   - Start in "Test mode"

#### Problem: "User profile not found"
**Error**: `User profile not found`

**Solution**:
1. Check Firestore Database:
   - Should have a "users" collection
   - Should have documents with uid as ID
2. If missing:
   - ProfilePage.jsx should create it automatically
   - Manual creation:
     1. Firestore > Create collection "users"
     2. Create document with ID = your user's UID
     3. Add fields: email, displayName, phoneNumber, bio
3. To find your UID:
   - After login, check Auth > Users
   - Copy the UID from there

---

### ❌ Storage Issues

#### Problem: "Profile picture upload fails"
**Error**: `PERMISSION_DENIED` or upload freezes

**Solution**:
1. Create Cloud Storage bucket:
   - Storage > Create bucket
   - Use default region
   - Use "Test mode" for development
2. Fix storage rules:
   - Storage > Rules tab
   - Use these for testing:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
3. Check file:
   - Must be less than 5MB
   - Must be image file (.jpg, .png, etc)
4. Check path:
   - Upload path is: `profile-pictures/{userId}-{timestamp}.jpg`
   - Should create folder automatically

#### Problem: "File size too large"
**Solution**:
- compress image before uploading
- Maximum allowed: 5MB
- Recommended: < 1MB

---

### ❌ Development Issues

#### Problem: "Port 5173 already in use"
**Error**: `EADDRINUSE: address already in use :::5173`

**Solution**:
1. Kill the existing process:
   - Windows: `netstat -ano | findstr :5173`
   - Find PID and run: `taskkill /PID yourPID /F`
2. Or use different port:
   - In `vite.config.js`:
   ```javascript
   server: {
     port: 5174  // Change to different port
   }
   ```
3. Or restart computer (simple fix)

#### Problem: "Module not found" errors
**Error**: `SyntaxError: The requested module does not exist`

**Solution**:
1. Check file exists:
   - Example: `src/firebase/config.js`
   - Check spelling and path
2. Reinstall dependencies:
   - Delete `node_modules/` folder
   - Delete `package-lock.json`
   - Run `npm install` again
3. Check imports:
   - All imports should use `.js` extension OR no extension
   - Example: `import { useAuth } from './context/AuthContext'` (no .jsx)

#### Problem: "Tailwind CSS not working"
**Symptoms**:
- Colors not showing
- Styling not applied
- Everything looks unstyled

**Solution**:
1. Check `index.css` exists
2. Check `src/main.jsx` imports it:
   ```javascript
   import './index.css'
   ```
3. Reinstall Tailwind:
   ```bash
   npm install tailwindcss postcss autoprefixer
   npm run dev
   ```
4. Clear browser cache:
   - F12 > Application > Clear storage
   - Refresh page

#### Problem: "Dark mode not working"
**Symptoms**:
- Toggle doesn't switch theme
- Dark class not applied

**Solution**:
1. Check `ThemeToggle.jsx`:
   - Should add/remove `dark` class on HTML
   - Check: `document.documentElement.classList.add('dark')`
2. Check localStorage:
   - Browser DevTools > Application > LocalStorage
   - Should have key: `theme` with value: `dark` or `light`
3. Check tailwind config:
   - Should have: `darkMode: 'class'`
4. Hard refresh:
   - Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

### ❌ Deployment Issues

#### Problem: "npm run build fails"
**Solution**:
1. Check for syntax errors:
   - `npm run dev` works but build fails?
   - Developer mode is more forgiving
2. Run build again with verbose output:
   ```bash
   npm run build -- --debug
   ```
3. Check for console errors:
   - Fix all red errors in console
4. Delete build cache:
   ```bash
   rm -rf dist/
   npm run build
   ```

#### Problem: "Firebase deployment fails"
**Error**: `Error: You do not have permission to access the deployment`

**Solution**:
1. Reinstall Firebase CLI:
   ```bash
   npm uninstall -g firebase-tools
   npm install -g firebase-tools
   ```
2. Login again:
   ```bash
   firebase login
   ```
3. Select correct project:
   ```bash
   firebase use --add
   ```
4. Deploy:
   ```bash
   firebase deploy
   ```

---

### ❌ Runtime Issues

#### Problem: "Infinite loading after login"
**Symptoms**:
- Login succeeds but page stays loading
- Can't navigate

**Solution**:
1. Check AuthContext is working:
   - Open DevTools Console
   - Run: `firebase.auth().currentUser`
   - Should show user object
2. Reload page:
   - Hard refresh: Ctrl+Shift+R
   - Should load correctly now
3. Clear localStorage:
   - DevTools > Application > LocalStorage > Clear All
   - Refresh

#### Problem: "Cannot read property 'email' of undefined"
**Error**: `TypeError: Cannot read property 'email' of undefined`

**Solution**:
1. Add null check:
   ```javascript
   // ❌ WRONG
   <p>{user.email}</p>
   
   // ✅ RIGHT
   <p>{user?.email || 'Not set'}</p>
   ```
2. Use loading state:
   ```javascript
   if (!user) return <div>Loading...</div>;
   <p>{user.email}</p>
   ```

---

## ✅ Verification Checklist

After setup, verify everything works:

```
[ ] npm install completes without errors
[ ] Firebase config credentials added
[ ] npm run dev starts without errors
[ ] App opens at http://localhost:5173
[ ] Navigation bar displays correctly
[ ] Dark mode toggle works
[ ] Email registration works
[ ] Email login works
[ ] Google login works (redirects correctly)
[ ] GitHub login works (redirects correctly)
[ ] Phone OTP flows works (sends & verifies)
[ ] Profile page loads after login
[ ] Can edit profile
[ ] Can upload profile picture
[ ] Logout button works
[ ] Firestore has user data
[ ] Cloud Storage has profile pictures
[ ] npm run build completes successfully
[ ] Build folder created with no errors
```

---

## 🔍 Debugging Tips

### Enable Verbose Logging

```javascript
// In src/firebase/config.js
import { enableLogging } from 'firebase/app';
enableLogging(true);
```

### Check Firebase Console

1. Open Firebase Console in separate tab
2. Make actions in your app
3. Watch data appear in real-time

### Use Browser DevTools

- **Console**: Check for errors
- **Network**: See API calls
- **Application > LocalStorage**: Check theme preference
- **Application > Cookies**: Check Firebase tokens

### Check Firebase Auth Logs

```javascript
import { auth } from './firebase/config';

// Log all auth changes
auth.onAuthStateChanged(user => {
  console.log('Auth state changed:', user);
});
```

---

## 🆘 If All Else Fails

1. **Check Documentation**:
   - README.md
   - SETUP.md
   - GUIDE.md

2. **Check Firebase Console**:
   - Verify auth methods enabled
   - Verify database exists
   - Verify storage exists

3. **Restart Everything**:
   ```bash
   # Kill dev server (Ctrl+C)
   # Delete node_modules
   rm -rf node_modules
   # Reinstall
   npm install
   # Start again
   npm run dev
   ```

4. **Search Firebase Docs**:
   - Very comprehensive
   - Most issues are covered

5. **Check Code Syntax**:
   - Use VS Code Prettier extension
   - Format on save

---

## 📞 Getting Help

- **Firebase Issues**: https://firebase.google.com/docs
- **React Issues**: https://react.dev (great docs!)
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Stack Overflow**: Search error message

---

**Most issues are related to Firebase config. Triple-check your credentials!** ✓

Good luck! You've got this! 🚀
