import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDy9_Ubttrb-ti0WQQka2_xX2PKMUnFG0g",
  authDomain: "crave-9c52d.firebaseapp.com",
  databaseURL: "https://crave-9c52d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "crave-9c52d",
  storageBucket: "crave-9c52d.firebasestorage.app",
  messagingSenderId: "197151046367",
  appId: "1:197151046367:web:7dbc8a5df4058fd25f076a",
  measurementId: "G-RQZBTN2QQX"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };