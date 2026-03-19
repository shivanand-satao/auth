# Firebase Auth Template - Quick Reference & Cheat Sheet

## 🚀 Getting Started (TL;DR)

```bash
# 1. Install dependencies
npm install

# 2. Add Firebase credentials to src/firebase/config.js

# 3. Start development
npm run dev

# 4. Build for production
npm run build
```

---

## 📝 Common Code Snippets

### 1️⃣ Check if User is Logged In

```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login first</div>;
  }
  
  return <div>Welcome, {user.email}</div>;
}
```

### 2️⃣ Get User Profile Data

```javascript
import { useAuth } from './context/AuthContext';

function ProfileInfo() {
  const { userProfile, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <p>Name: {userProfile?.displayName}</p>
      <p>Phone: {userProfile?.phoneNumber}</p>
      <p>Bio: {userProfile?.bio}</p>
    </div>
  );
}
```

### 3️⃣ Update User Profile

```javascript
import { firestoreService } from './services/firestoreService';
import { useAuth } from './context/AuthContext';

function UpdateProfile() {
  const { user, setUserProfile } = useAuth();
  
  const handleUpdate = async () => {
    const updated = await firestoreService.updateUserProfile(user.uid, {
      displayName: 'New Name',
      bio: 'New bio',
      phoneNumber: '+1234567890'
    });
    setUserProfile(updated);
  };
  
  return <button onClick={handleUpdate}>Update</button>;
}
```

### 4️⃣ Upload Profile Picture

```javascript
import { firestoreService } from './services/firestoreService';
import { useAuth } from './context/AuthContext';

function UploadPicture() {
  const { user, setUserProfile } = useAuth();
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const photoURL = await firestoreService.uploadProfilePicture(user.uid, file);
    
    // setUserProfile will be updated automatically!
  };
  
  return <input type="file" onChange={handleFileUpload} />;
}
```

### 5️⃣ Logout User

```javascript
import { authService } from './services/authService';

function LogoutButton() {
  const handleLogout = async () => {
    await authService.logout();
    // User will be logged out globally (AuthContext handles redirect)
  };
  
  return <button onClick={handleLogout}>Logout</button>;
}
```

### 6️⃣ Protect a Route

```javascript
import { useAuth } from './context/AuthContext';

function ProtectedPage() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <div>❌ You must login to access this page</div>;
  }
  
  return <div>✅ This is protected content</div>;
}
```

### 7️⃣ Create Admin User

```javascript
// In Firestore rules
match /users/{uid} {
  allow read, write: if request.auth.uid == uid || isAdmin();
}

function isAdmin() {
  return get(/databases/$(database)/documents/admins/$(request.auth.uid)).exists();
}
```

### 8️⃣ Query All Users (Admin Only)

```javascript
import { firestoreService } from './services/firestoreService';

async function getAllUsers() {
  const users = await firestoreService.getAllUsers();
  console.log(users); // Array of all user profiles
}
```

### 9️⃣ Custom User Data in Registration

```javascript
// Modify RegisterModal.jsx
const handleRegister = async () => {
  const user = await authService.registerWithEmail(email, password);
  
  // Add custom fields
  await firestoreService.createUserProfile(user.uid, {
    email,
    phoneNumber: phone,
    displayName: 'Custom Name',
    bio: 'Custom Bio',
    company: 'My Company',  // ← Custom field
    website: 'example.com'  // ← Custom field
  });
};
```

### 🔟 Send Verification Email

```javascript
import { sendEmailVerification } from 'firebase/auth';
import { auth } from './firebase/config';

export const authService = {
  registerWithEmail: async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    return userCredential.user;
  },
  
  isEmailVerified: () => {
    return auth.currentUser?.emailVerified;
  }
};
```

---

## 🎨 Customization Quick Links

| What | Where | How |
|------|-------|-----|
| Colors | `tailwind.config.js` | Change theme.colors.primary |
| Fonts | `src/index.css` | Add @font-face rules |
| Landing Hero | `src/pages/Landing.jsx` | Edit hero section |
| Logo | `src/components/Navbar.jsx` | Replace logo div |
| Icons | All components | Use lucide-react icons |
| Storage paths | `src/services/firestoreService.js` | Modify uploadProfilePicture |

---

## 🔐 Firebase Console Quick Links

| Task | Link | Steps |
|------|------|-------|
| Get Config | Firebase Console > Settings | Copy firebaseConfig |
| Enable Auth | Firebase Console > Auth | Toggle sign-in methods |
| Create DB | Firebase Console > Firestore | Click "Create Database" |
| Create Storage | Firebase Console > Storage | Click "Create bucket" |
| Security Rules | Firebase Console > Firestore/Storage | Update rules |

---

## 📱 Form Validation Examples

```javascript
// Email validation
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Phone validation (international format)
const isValidPhone = (phone) => {
  return /^\+?[1-9]\d{1,14}$/.test(phone);
};

// Password validation (min 8 chars, 1 number, 1 uppercase)
const isStrongPassword = (password) => {
  return /^(?=.*[0-9])(?=.*[A-Z]).{8,}$/.test(password);
};

// Display name validation
const isValidName = (name) => {
  return name.trim().length >= 2;
};
```

---

## 🚀 Deployment Commands

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Firebase Hosting
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions
```

---

## 🐛 Debugging Tips

### Check Auth State
```javascript
import { auth } from './firebase/config';
auth.onAuthStateChanged(user => {
  console.log('Current user:', user);
});
```

### Check Firestore Data
```javascript
import { db } from './firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const users = await getDocs(collection(db, 'users'));
users.forEach(doc => {
  console.log(doc.id, doc.data());
});
```

### Monitor Firebase Operations
- Open Firebase Console in another tab
- Make changes in your app
- Watch updates in Console in real-time

---

## 📊 Performance Tips

1. **Lazy Load Components**
   ```javascript
   const LoginModal = lazy(() => import('./components/LoginModal'));
   ```

2. **Memoize Heavy Components**
   ```javascript
   export default memo(ProfilePage);
   ```

3. **Use Firestore Indexes**
   - Firebase suggests indexes in Console
   - Click "Create index" when prompted

4. **Optimize Images**
   - Compress before uploading
   - Use WebP format
   - Keep file size < 5MB

---

## 🆘 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "auth/config-not-found" | No Firebase config | Add credentials to config.js |
| "auth/invalid-email" | Bad email format | Use regex validation |
| "storage/unauthorized" | Bad security rules | Check Storage rules |
| "firestore/permission-denied" | Bad Firestore rules | Check Firestore rules |
| "auth/popup-closed-by-user" | User closed popup | Retry is automatic |

---

## 👥 Multi-User Example

```javascript
// Get all users except current
async function getOtherUsers(currentUserId) {
  const allUsers = await firestoreService.getAllUsers();
  return allUsers.filter(u => u.uid !== currentUserId);
}

// Display users list
function UsersList() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    getOtherUsers(user.uid).then(setUsers);
  }, [user.uid]);
  
  return users.map(u => (
    <div key={u.uid}>
      <img src={u.photoURL} alt={u.displayName} />
      <p>{u.displayName}</p>
      <p>{u.email}</p>
    </div>
  ));
}
```

---

## 🎯 Hackathon Checklist

- [ ] Firebase project created
- [ ] Credentials added to config.js
- [ ] All auth methods tested
- [ ] Profile picture upload tested
- [ ] Build runs without errors (`npm run build`)
- [ ] Deployed to Firebase Hosting
- [ ] Share live URL with judges

---

## 📚 Learn More

- [Firebase Docs](https://firebase.google.com/docs)
- [React Docs](https://react.dev)
- [Tailwind Docs](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)

---

## 💡 Pro Tips

1. **Copy credentials before hackathon** - No setup time during event
2. **Test everything locally first** - Avoid surprises
3. **Use this as a starting point** - Add your features on top
4. **Keep auth separate** - Easy to reuse in next project
5. **Document your changes** - Help future you

---

**You're ready to build! 🚀 Good luck with your project!**
