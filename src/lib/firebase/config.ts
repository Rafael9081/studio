import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "new-prototype-totdc",
  "appId": "1:13417956393:web:7962e44176d073bfb1c838",
  "storageBucket": "new-prototype-totdc.appspot.com",
  "apiKey": "AIzaSyA8YhC-pC4c-9fW3wQjSg3qZ7oY4xR-dE4",
  "authDomain": "new-prototype-totdc.firebaseapp.com",
  "messagingSenderId": "13417956393"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
