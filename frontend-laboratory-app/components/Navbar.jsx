'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/lib/AuthContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();

  return (
    <nav className="relative bg-white shadow dark:bg-[#121212]">
      <div className="container px-6 py-4 mx-auto">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center justify-between">
            <Link href="/">
              <img className="w-auto h-6 sm:h-7" src="https://merakiui.com/images/full-logo.svg" alt="Logo" />
            </Link>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
                aria-label="toggle menu"
              >
                {!isOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-[#121212] lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center ${
              isOpen ? 'translate-x-0 opacity-100' : 'opacity-0 -translate-x-full'
            }`}
          >
            <div className="flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8">
              <Link href="/" className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#232323]">
                Strona główna
              </Link>
              
              {user && (
                <Link href="/games" className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#232323]">
                  Moje gry
                </Link>
              )}
            </div>

            <div className="flex items-center mt-4 lg:mt-0">
              {loading ? (
                // Stan ładowania - pokazuj placeholder
                <div className="px-3 py-2 mx-3 mt-2 text-gray-400 lg:mt-0">
                  Ładowanie...
                </div>
              ) : user ? (
                // WIDOK 1: Użytkownik ZALOGOWANY
                <div className="flex items-center gap-3">
                  <Link 
                    href="/user/profile"
                    className="flex items-center gap-2 px-3 py-2 transition-colors duration-300 transform rounded-md hover:bg-gray-100 dark:hover:bg-[#232323]"
                  >
                    <img 
                      src={user.photoURL || "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-200 font-medium hidden sm:block">
                      {user.displayName || user.email?.split('@')[0] || 'Użytkownik'}
                    </span>
                  </Link>

                  {/* Przycisk Wyloguj */}
                  <Link 
                    href="/user/signout"
                    className="px-3 py-2 text-white bg-red-500 transition-colors duration-300 transform rounded-md hover:bg-red-600"
                  >
                    Wyloguj
                  </Link>
                </div>
              ) : (
                // WIDOK 2: Użytkownik WYLOGOWANY
                <>
                  <Link 
                    href="/user/signin"
                    className="px-3 py-2 mx-3 mt-2 text-white bg-blue-500 transition-colors duration-300 transform rounded-md lg:mt-0 hover:bg-blue-600"
                  >
                    Zaloguj
                  </Link>
                  <Link 
                    href="/user/register"
                    className="px-3 py-2 mx-3 mt-2 text-white bg-green-500 transition-colors duration-300 transform rounded-md lg:mt-0 hover:bg-green-600"
                  >
                    Zarejestruj
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;