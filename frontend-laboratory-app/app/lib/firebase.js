import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBP3oJoyOkQVM5b1a68J6Xng9f3N0QaLbs",
  authDomain: "frontend-laboratory-app-bd2e2.firebaseapp.com",
  projectId: "frontend-laboratory-app-bd2e2",
  storageBucket: "frontend-laboratory-app-bd2e2.firebasestorage.app",
  messagingSenderId: "243122291558",
  appId: "1:243122291558:web:33072a985093d6d4a47ea7",
  measurementId: "G-7VX4MX9CPB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Analytics inicjalizujemy TYLKO w przeglądarce (nie na serwerze)
// Dzięki temu unikamy błędu "window is not defined"
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    try {
      getAnalytics(app);
    } catch (error) {
      console.warn("Nie udało się zainicjalizować Firebase Analytics:", error);
    }
  });
}