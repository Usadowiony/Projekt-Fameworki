'use client'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { useAuth } from "@/app/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function RegisterForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return null;
  }

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const username = e.target["username"].value;
    const email = e.target["email"].value;
    const password = e.target["password"].value;
    const confirmPassword = e.target["confirm-password"].value;

    if (password !== confirmPassword) {
      setError("Hasła nie są identyczne");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków");
      setLoading(false);
      return;
    }
    
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User registered!");
        
        const profilePromise = username 
          ? updateProfile(userCredential.user, { displayName: username })
          : Promise.resolve();
        
        return profilePromise.then(() => {
          console.log("Wysyłam email weryfikacyjny do:", userCredential.user.email);
          return sendEmailVerification(userCredential.user);
        });
      })
      .then(() => {
        console.log("Email verification sent successfully!");
        router.push("/user/verify");
      })
      .catch((error) => {
        setLoading(false);
        
        if (error.code?.startsWith('auth/')) {
          console.error("BŁĄD:", error.code, error.message);
          
          const errorMessages = {
            'auth/email-already-in-use': 'Ten email jest już zarejestrowany',
            'auth/invalid-email': 'Nieprawidłowy format email',
            'auth/weak-password': 'Hasło jest zbyt słabe',
            'auth/operation-not-allowed': 'Rejestracja jest obecnie wyłączona'
          };
          setError(errorMessages[error.code] || error.message);
        } else {
          console.error("BŁĄD wysyłki emaila:", error);
          setError("Nie udało się wysłać emaila weryfikacyjnego: " + error.message);
        }
      });
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
        <form onSubmit={onSubmit} className="w-full max-w-md">
          <div className="flex justify-center mx-auto">
            <img className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt="" />
          </div>

          <div className="flex items-center justify-center mt-6">
            <Link href="/user/signin" className="w-1/3 pb-4 font-medium text-center text-gray-500 capitalize border-b dark:border-gray-400 dark:text-gray-300">
              Zaloguj się
            </Link>

            <a href="#" className="w-1/3 pb-4 font-medium text-center text-gray-800 capitalize border-b-2 border-blue-500 dark:border-blue-400 dark:text-white">
              Zarejestruj
            </a>
          </div>

          {error && (
            <div className="flex w-full max-w-sm mt-6 overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="flex items-center justify-center w-12 bg-red-500">
                <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
                </svg>
              </div>
              <div className="px-4 py-2 -mx-3">
                <div className="mx-3">
                  <span className="font-semibold text-red-500 dark:text-red-400">Błąd</span>
                  <p className="text-sm text-gray-600 dark:text-gray-200">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="relative flex items-center mt-8">
            <span className="absolute">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>

            <input 
              type="text" 
              id="username"
              name="username"
              className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" 
              placeholder="Nazwa użytkownika (opcjonalne)"
            />
          </div>

          <div className="relative flex items-center mt-6">
            <span className="absolute">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>

            <input 
              type="email" 
              id="email"
              name="email"
              required
              className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" 
              placeholder="Adres Email"
            />
          </div>

          <div className="relative flex items-center mt-4">
            <span className="absolute">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>

            <input 
              type="password" 
              id="password"
              name="password"
              required
              minLength={6}
              className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" 
              placeholder="Hasło"
            />
          </div>

          <div className="relative flex items-center mt-4">
            <span className="absolute">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>

            <input 
              type="password" 
              id="confirm-password"
              name="confirm-password"
              required
              minLength={6}
              className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" 
              placeholder="Potwierdź hasło"
            />
          </div>

          <div className="mt-6">
            <button 
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Rejestracja...' : 'Zarejestruj się'}
            </button>

            <div className="mt-6 text-center">
              <Link href="/user/signin" className="text-sm text-blue-500 hover:underline dark:text-blue-400">
                Masz już konto?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}