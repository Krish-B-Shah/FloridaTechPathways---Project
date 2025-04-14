import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth, db, googleProvider } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function signup(email, password, username) {
    try {
      setError(null);
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with username
      await updateProfile(user, { displayName: username });
      
      // Create a user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        displayName: username,
        createdAt: serverTimestamp()
      });
      
      return userCredential;
    } catch (error) {
      console.error("Error in signup:", error);
      setError(error.message);
      throw error;
    }
  }

  async function loginWithGoogle() {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user document exists, if not create it
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        // Create a new user document for Google users
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          provider: 'google'
        });
      }
      
      return result;
    } catch (error) {
      console.error("Error in Google sign-in:", error);
      setError(error.message);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      setError(null);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error in login:", error);
      setError(error.message);
      throw error;
    }
  }

  async function logout() {
    try {
      setError(null);
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error("Error in logout:", error);
      setError(error.message);
      throw error;
    }
  }

  async function getUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const profile = userDoc.data();
        setUserProfile(profile);
        return profile;
      }
      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      setError(error.message);
      return null;
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      try {
        if (user) {
          setCurrentUser(user);
          // Get user profile from Firestore
          await getUserProfile(user.uid);
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
      } catch (err) {
        console.error("Error in auth state change:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    login,
    signup,
    logout,
    loginWithGoogle,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;