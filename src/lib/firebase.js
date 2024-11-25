import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatbot-c70d6.firebaseapp.com",
  projectId: "chatbot-c70d6",
  storageBucket: "chatbot-c70d6.firebasestorage.app",
  messagingSenderId: "738179520665",
  appId: "1:738179520665:web:7a9dd4e66b0420d2ba4008"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()