'use client'
import { updateProfile } from "firebase/auth";
import { useAuth } from "@/app/lib/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Ładowanie...</p>
      </div>
    );
  }

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const data = {
      displayName: e.target["displayName"].value,
      photoURL: e.target["photoURL"].value,
    };

    updateProfile(user, {
      displayName: data.displayName,
      photoURL: data.photoURL,
    })
      .then(() => {
        console.log("Profile updated");
        setSuccess("Profil został zaktualizowany pomyślnie!");
        setLoading(false);
        
        setTimeout(() => {
          router.refresh();
        }, 1500);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <section className="bg-white dark:bg-gray-900 h-full">
      <div className="container flex items-center justify-center h-full px-6 py-12 mx-auto">
        <form onSubmit={onSubmit} className="w-full max-w-md">
          <div className="flex justify-center mx-auto mb-6">
            <img className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt="" />
          </div>

          <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
            Edytuj profil
          </h2>

          {/* Alert sukcesu */}
          {success && (
            <div className="flex w-full mt-6 overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
              <div className="flex items-center justify-center w-12 bg-green-500">
                <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
                </svg>
              </div>
              <div className="px-4 py-2 -mx-3">
                <div className="mx-3">
                  <span className="font-semibold text-green-500 dark:text-green-400">Sukces</span>
                  <p className="text-sm text-gray-600 dark:text-gray-200">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Alert błędu */}
          {error && (
            <div className="flex w-full mt-6 overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
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

          {/* Podgląd zdjęcia profilowego */}
          <div className="flex justify-center mt-6 mb-4">
            <img 
              src={user.photoURL || "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
            />
          </div>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
            Aktualne zdjęcie profilowe
          </p>

          {/* Pole: displayName */}
          <div className="relative flex items-center mt-6">
            <span className="absolute">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>

            <input 
              type="text" 
              id="displayName"
              name="displayName"
              defaultValue={user.displayName || ""}
              placeholder="Nazwa użytkownika"
              className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" 
            />
          </div>

          {/* Pole: email (tylko do odczytu) */}
          <div className="relative flex items-center mt-4">
            <span className="absolute">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>

            <input 
              type="email" 
              id="email"
              name="email"
              value={user.email || ""}
              readOnly
              disabled
              className="block w-full py-3 text-gray-500 bg-gray-100 border rounded-lg px-11 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 cursor-not-allowed" 
            />
          </div>

          {/* Pole: photoURL */}
          <div className="relative flex items-center mt-4">
            <span className="absolute">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>

            <input 
              type="url" 
              id="photoURL"
              name="photoURL"
              defaultValue={user.photoURL || ""}
              placeholder="https://example.com/photo.jpg"
              className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" 
            />
          </div>

          <div className="mt-6">
            <button 
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </button>
          </div>

          {/* Informacje o koncie */}
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Informacje o koncie</h3>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>UID:</strong> {user.uid}</p>
              <p><strong>Email zweryfikowany:</strong> {user.emailVerified ? '✅ Tak' : '❌ Nie'}</p>
              <p><strong>Utworzono:</strong> {new Date(user.metadata.creationTime).toLocaleDateString('pl-PL')}</p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}