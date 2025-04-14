import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  GoogleAuthProvider 
} from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator
} from "firebase/firestore";
import {
  getStorage,
  connectStorageEmulator
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAkebmRtxMc4bSbvPBdmC493xz5URJ3PG0",
  authDomain: "internshiptracker-344f5.firebaseapp.com",
  projectId: "internshiptracker-344f5",
  storageBucket: "internshiptracker-344f5.appspot.com",
  messagingSenderId: "230970171771",
  appId: "1:230970171771:web:1cd9330a1fbc380d591dde",
  measurementId: "G-BFTG8WSTGJ"
};

let app, auth, db, storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  console.log("Firebase initialized successfully");

  if (
    process.env.NODE_ENV === "development" &&
    process.env.REACT_APP_USE_FIREBASE_EMULATORS
  ) {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
    connectStorageEmulator(storage, "localhost", 9199);
    console.log("Connected to Firebase emulators");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export const handleFirebaseError = (error) => {
  const errorCode = error.code;
  const errorMessage = error.message;

  const errorMessages = {
    "auth/user-not-found": "No account found with this email address",
    "auth/wrong-password": "Incorrect password",
    "auth/email-already-in-use": "This email is already registered",
    "auth/weak-password": "Password should be at least 6 characters",
    "auth/invalid-email": "Please enter a valid email address",
    "auth/network-request-failed":
      "Network error. Please check your connection",
    "permission-denied": "You don't have permission to perform this action"
  };

  console.error(`Firebase Error (${errorCode}):`, errorMessage);

  return errorMessages[errorCode] || errorMessage || "An unexpected error occurred";
};

const googleProvider = new GoogleAuthProvider();
export { auth, db, storage, googleProvider };
export default app;
export { firebaseConfig };