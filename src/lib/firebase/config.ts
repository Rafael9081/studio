import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "new-prototype-totdc",
  "appId": "1:13417956393:web:7962e44176d073bfb1c838",
  "storageBucket": "new-prototype-totdc.firebasestorage.app",
  "apiKey": "AIzaSyBf7_6mEuT6Fq3Pzd9n74ZVxV2fpEtlNuk",
  "authDomain": "new-prototype-totdc.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "13417956393"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
