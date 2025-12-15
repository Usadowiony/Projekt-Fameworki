export default function Home() {
  return (
    <div className="bg-white dark:bg-[#1b1d1f]">
      {/* Hero Section */}
      <section className="bg-white dark:bg-[#1b1d1f]">
        <div className="container px-6 py-16 mx-auto text-center">
          <div className="max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">
              Projekt Scrabble Game
            </h1>
            <p className="mt-6 text-gray-500 dark:text-gray-300">
              Aplikacja webowa do gry w Scrabble z zarządzaniem profilem gracza, zarządzaniem swoimi grami oraz automatycznym testowaniem E2E.
            </p>
            
          </div>

          <div className="flex justify-center mt-10">
            <img className="object-cover w-full h-96 rounded-xl lg:w-1/2" src="https://media.istockphoto.com/id/487051045/pl/zdj%C4%99cie/scrabble-board-game.jpg?s=612x612&w=0&k=20&c=zZl0V3aUd4JKZoxrVd1-wtOinZ1BW8NOe6Kfrup84qI=" alt="Scrabble game board" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white dark:bg-[#1b1d1f]">
        <div className="container px-6 py-10 mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl dark:text-white">
            Jak działa projekt?
          </h2>

          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 md:grid-cols-2 xl:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-8 space-y-3 border-2 border-blue-400 dark:border-blue-300 rounded-xl">
              <span className="inline-block text-blue-500 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
              </span>

              <h3 className="text-xl font-semibold text-gray-700 capitalize dark:text-white">Autoryzacja Firebase</h3>

              <p className="text-gray-500 dark:text-gray-300">
                System logowania i rejestracji z weryfikacją email. Chronione ścieżki wymagają uwierzytelnienia użytkownika.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 space-y-3 border-2 border-blue-400 dark:border-blue-300 rounded-xl">
              <span className="inline-block text-blue-500 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </span>

              <h3 className="text-xl font-semibold text-gray-700 capitalize dark:text-white">Gra Scrabble</h3>

              <p className="text-gray-500 dark:text-gray-300">
                Interaktywna plansza 15x15 z systemem własnej punktacji, losowymi literkami i turami dla 2-4 graczy.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 space-y-3 border-2 border-blue-400 dark:border-blue-300 rounded-xl">
              <span className="inline-block text-blue-500 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </span>

              <h3 className="text-xl font-semibold text-gray-700 capitalize dark:text-white">Firestore Database</h3>

              <p className="text-gray-500 dark:text-gray-300">
                Przechowywanie gier, stanów rozgrywek, profili użytkowników w czasie rzeczywistym z synchronizacją.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testing Section */}
      <section className="bg-white dark:bg-[#1b1d1f]">
        <div className="container px-6 py-10 mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl dark:text-white">
            Testowanie E2E z Playwright
          </h2>

          <div className="max-w-3xl mx-auto mt-8">
            <div className="bg-blue-50 dark:bg-[#121212] rounded-lg p-6">
              <div className="flex items-start">
                <div className="shrink-0">
                  <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Automatyczne testy E2E
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 font-semibold">Uruchomienie testów:</p>
                      <pre className="mt-2 p-4 dark:bg-[#1b1d1f] text-gray-100 rounded-lg overflow-x-auto">
                        <code>npx playwright test</code>
                      </pre>
                    </div>
                    
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 font-semibold">Testy w trybie UI:</p>
                      <pre className="mt-2 p-4 dark:bg-[#1b1d1f] text-gray-100 rounded-lg overflow-x-auto">
                        <code>npx playwright test --ui</code>
                      </pre>
                    </div>

                    <div className="mt-4">
                      <p className="text-gray-700 dark:text-gray-300 mb-2">Zakres testów:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                        <li>Test nawigacji i przekierowań</li>
                        <li>Test procesu logowania i autoryzacji</li>
                        <li>Test dostępu do chronionych stron</li>
                        <li>Weryfikacja elementów UI po zalogowaniu</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-gray-50 dark:bg-[#121212]">
        <div className="container px-6 py-10 mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl dark:text-white">
            Technologie
          </h2>

          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 sm:grid-cols-2 xl:grid-cols-4">
            <div className="p-6 bg-white dark:bg-[#1b1d1f] rounded-lg shadow-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">Next.js 16</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-300 text-sm">React framework z App Router i Server Components</p>
            </div>

            <div className="p-6 bg-white dark:bg-[#1b1d1f] rounded-lg shadow-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">Firebase</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-300 text-sm">Authentication, Firestore Database, Hosting</p>
            </div>

            <div className="p-6 bg-white dark:bg-[#1b1d1f] rounded-lg shadow-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-900">
                <span className="text-2xl">💨</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">Tailwind CSS</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-300 text-sm">Utility-first CSS framework z Meraki UI</p>
            </div>

            <div className="p-6 bg-white dark:bg-[#1b1d1f] rounded-lg shadow-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900">
                <span className="text-2xl">🎭</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">Playwright</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-300 text-sm">End-to-end testing framework</p>
            </div>
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section className="bg-white dark:bg-[#1b1d1f]">
        <div className="container px-6 py-10 mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl dark:text-white">
            O autorze
          </h2>

          <div className="flex justify-center mt-8">
            <div className="max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-[#121212] dark:border-gray-700">
              <div className="flex items-center">
                <img className="object-cover w-16 h-16 rounded-full" src="https://avatars.githubusercontent.com/Usadowiony" alt="Wojciech Pietrzak" />
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Wojciech Pietrzak</h3>
                  <p className="text-gray-600 dark:text-gray-400">Nr albumu: 14998</p>
                </div>
              </div>

              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Student informatyki. Projekt realizowany w ramach zajęć z Frameworków Webowych.
              </p>

              <div className="flex mt-6 space-x-4">
                <a href="https://github.com/Usadowiony" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 text-gray-700 transition-colors duration-300 transform rounded-md dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#232323]">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.026 2C7.13295 1.99937 2.96183 5.54799 2.17842 10.3779C1.395 15.2079 4.23061 19.893 8.87302 21.439C9.37302 21.529 9.55202 21.222 9.55202 20.958C9.55202 20.721 9.54402 20.093 9.54102 19.258C6.76602 19.858 6.18002 17.92 6.18002 17.92C5.99733 17.317 5.60459 16.7993 5.07302 16.461C4.17302 15.842 5.14202 15.856 5.14202 15.856C5.78269 15.9438 6.34657 16.3235 6.66902 16.884C6.94195 17.3803 7.40177 17.747 7.94632 17.9026C8.49087 18.0583 9.07503 17.99 9.56902 17.713C9.61544 17.207 9.84055 16.7341 10.204 16.379C7.99002 16.128 5.66202 15.272 5.66202 11.449C5.64973 10.4602 6.01691 9.5043 6.68802 8.778C6.38437 7.91731 6.42013 6.97325 6.78802 6.138C6.78802 6.138 7.62502 5.869 9.53002 7.159C11.1639 6.71101 12.8882 6.71101 14.522 7.159C16.428 5.868 17.264 6.138 17.264 6.138C17.6336 6.97286 17.6694 7.91757 17.364 8.778C18.0376 9.50423 18.4045 10.4626 18.388 11.453C18.388 15.286 16.058 16.128 13.836 16.375C14.3153 16.8651 14.5612 17.5373 14.511 18.221C14.511 19.555 14.499 20.631 14.499 20.958C14.499 21.225 14.677 21.535 15.186 21.437C19.8265 19.8884 22.6591 15.203 21.874 10.3743C21.089 5.54565 16.9181 1.99888 12.026 2Z"/>
                  </svg>
                  <span className="mx-2">GitHub Profile</span>
                </a>

                <a href="https://github.com/Usadowiony/Projekt-Fameworki" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 text-gray-700 transition-colors duration-300 transform rounded-md dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#232323]">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  <span className="mx-2">Repository</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
