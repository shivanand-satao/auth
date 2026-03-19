import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  collection,
  getDocs
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export const firestoreService = {
  // Create User Profile
  createUserProfile: async (userId, userData) => {
    try {
      await setDoc(doc(db, 'users', userId), {
        uid: userId,
        email: userData.email,
        displayName: userData.displayName || '',
        phoneNumber: userData.phoneNumber || '',
        bio: userData.bio || '',
        photoURL: userData.photoURL || '',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      throw new Error(`Error creating user profile: ${error.message}`);
    }
  },

  // Get User Profile
  getUserProfile: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        throw new Error('User profile not found');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Update User Profile
  updateUserProfile: async (userId, userData) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...userData,
        updatedAt: new Date()
      });
      return await firestoreService.getUserProfile(userId);
    } catch (error) {
      throw new Error(error.message);
    }
  },



  // Get All Users (for admin/demo purposes)
  getAllUsers: async () => {
    try {
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      throw new Error(error.message);
    }
  }
};
