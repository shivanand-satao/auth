import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ⚠️ IMPORTANT: Replace with your Firebase config
// Get your config from Firebase Console > Project Settings
const firebaseConfig = {
  apiKey: "AIzaSyCoI502WE50EGN1Pdqk7_KpxhRGxTSeYLM",
  authDomain: "temp-9e400.firebaseapp.com",
  databaseURL: "https://temp-9e400-default-rtdb.firebaseio.com",
  projectId: "temp-9e400",
  storageBucket: "temp-9e400.firebasestorage.app",
  messagingSenderId: "473979171424",
  appId: "1:473979171424:web:e8b29e796ec12f58b94905",
  measurementId: "G-5NDQGC2LVK"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore Database
export const db = getFirestore(app);

export default app;
