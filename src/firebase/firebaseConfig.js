// /src/firebase/firebaseConfig.js

// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC69UD3EYIXXeF3797LDz4bzlqoeEdtgxk",
  authDomain: "portfolio-e85da.firebaseapp.com",
  projectId: "portfolio-e85da",
  storageBucket: "portfolio-e85da.appspot.com",
  messagingSenderId: "1075567184407",
  appId: "1:1075567184407:web:61f6293264763ed6d5aa52",
  measurementId: "G-1TC6K9DGDL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = getAnalytics(app);   // Optional
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the services for use in your dashboard
export { app, analytics, auth, db, storage };
