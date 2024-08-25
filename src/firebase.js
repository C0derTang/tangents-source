// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDoYyGn5-3xNy-6SbJnQimj0Yi7jl5h_iQ",
  authDomain: "myblog-87776.firebaseapp.com",
  projectId: "myblog-87776",
  storageBucket: "myblog-87776.appspot.com",
  messagingSenderId: "159272585333",
  appId: "1:159272585333:web:ebe8758141bd3c9eded03c",
  measurementId: "G-MRYCR3T2DN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// Set persistence to SESSION
setPersistence(auth, browserSessionPersistence);

export { auth, googleProvider, db };
