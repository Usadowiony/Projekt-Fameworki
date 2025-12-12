// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBP3oJoyOkQVM5b1a68J6Xng9f3N0QaLbs",
  authDomain: "frontend-laboratory-app-bd2e2.firebaseapp.com",
  projectId: "frontend-laboratory-app-bd2e2",
  storageBucket: "frontend-laboratory-app-bd2e2.firebasestorage.app",
  messagingSenderId: "243122291558",
  appId: "1:243122291558:web:33072a985093d6d4a47ea7",
  measurementId: "G-7VX4MX9CPB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);