// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "projects-1c8d3.firebaseapp.com",
  databaseURL: "https://projects-1c8d3-default-rtdb.firebaseio.com",
  projectId: "projects-1c8d3",
  storageBucket: "projects-1c8d3.appspot.com",
  messagingSenderId: "331689219940",
  appId: "1:331689219940:web:9b4d8ba4096b89c3f94c71",
  measurementId: "G-KC9053D999"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage(app);