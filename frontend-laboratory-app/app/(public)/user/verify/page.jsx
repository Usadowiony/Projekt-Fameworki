'use client'
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function VerifyEmail() {
  const router = useRouter();

  // Automatyczne wylogowanie po rejestracji
  useEffect(() => {
    signOut(auth);
  }, []);

  return (
    <section className="bg-white dark:bg-[#1b1d1f] h-full">
      <div className="container flex items-center justify-center h-full px-6 py-12 mx-auto">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mx-auto mb-8">
            <svg className="w-20 h-20 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
            Sprawdź swoją skrzynkę email
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Twój email wymaga weryfikacji.
          </p>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Wysłaliśmy email weryfikacyjny na podany adres. Kliknij w link w emailu, aby aktywować swoje konto i móc się zalogować.
          </p>

          <div className="space-y-4">
            <Link 
              href="/user/signin"
              className="block w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
              Przejdź do logowania
            </Link>

            <Link 
              href="/"
              className="block w-full px-6 py-3 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Powrót do strony głównej
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            Nie otrzymałeś emaila? Sprawdź folder spam lub spróbuj ponownie za kilka minut.
          </p>
        </div>
      </div>
    </section>
  );
}