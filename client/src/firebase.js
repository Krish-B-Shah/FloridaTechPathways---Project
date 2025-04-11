// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "internshiptracker-344f5.firebaseapp.com",
  projectId: "internshiptracker-344f5",
  storageBucket: "internshiptracker-344f5.firebasestorage.app",
  messagingSenderId: "230970171771",
  appId: "1:230970171771:web:1cd9330a1fbc380d591dde",
  measurementId: "G-BFTG8WSTGJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exports for use in your app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;