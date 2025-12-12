'use client'
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function LogoutForm() {
  const router = useRouter();

  const onSubmit = (e) => {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error("Błąd wylogowania:", error);
      });
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
        <div className="w-full max-w-md">
          <div className="flex justify-center mx-auto">
            <img className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt="" />
          </div>

          <h2 className="mt-6 text-2xl font-semibold text-gray-800 dark:text-white text-center">
            Wylogowanie
          </h2>

          <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">
            Czy na pewno chcesz się wylogować?
          </p>

          <form onSubmit={onSubmit} className="mt-6">
            <button
              type="submit"
              className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-500 rounded-lg hover:bg-red-400 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50"
            >
              Wyloguj się
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full mt-4 px-6 py-3 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Anuluj
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}