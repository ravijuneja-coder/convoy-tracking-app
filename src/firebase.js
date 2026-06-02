import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQWZODvzzKtV3Wyl1gRSMtPbuliDuFT8w",
  authDomain: "convoy-tracking-9f8c6.firebaseapp.com",
  projectId: "convoy-tracking-9f8c6",
  storageBucket: "convoy-tracking-9f8c6.firebasestorage.app",
  messagingSenderId: "133387226385",
  appId: "1:133387226385:web:3ca00b017df052fd3950b0",
  measurementId: "G-TMMJ84S8JZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
