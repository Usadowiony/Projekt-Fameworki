'use client'
import { useAuth } from "@/app/lib/AuthContext";
import { useState, useEffect } from "react";
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs, doc, addDoc } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GamesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState(["", ""]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      if (!user?.uid) return;
      
      setLoading(true);
      try {
        const userRef = doc(db, "users", user.uid);
        const q = query(
          collection(db, "games"), 
          where("user", "==", userRef)
        );
        
        const querySnapshot = await getDocs(q);
        const gamesData = [];
        
        querySnapshot.forEach((doc) => {
          gamesData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setGames(gamesData);
      } catch (error) {
        console.error("Błąd podczas pobierania gier:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [user?.uid]);

  const handleNumPlayersChange = (num) => {
    setNumPlayers(num);
    setPlayerNames(Array(num).fill(""));
  };

  const handlePlayerNameChange = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const createNewGame = async () => {
    if (playerNames.some(name => !name.trim())) {
      alert("Wypełnij wszystkie imiona graczy");
      return;
    }

    setCreating(true);
    try {
      const userRef = doc(db, "users", user.uid);
      
      const newGame = {
        user: userRef,
        createdAt: new Date(),
        status: "active",
        currentPlayer: 1,
        players: playerNames.map((name, index) => ({
          id: index + 1,
          name: name.trim(),
          score: 0
        })),
        board: [],
        currentMove: []
      };

      const docRef = await addDoc(collection(db, "games"), newGame);
      router.push(`/games/${docRef.id}`);
    } catch (error) {
      console.error("Błąd podczas tworzenia gry:", error);
      alert("Nie udało się utworzyć gry");
      setCreating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Ładowanie...</p>
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="container px-6 py-12 mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
            Moje gry Scrabble
          </h1>
          
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-4 text-lg font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          >
            + Rozpocznij nową grę
          </button>
        </div>

        {/* Modal nowej gry */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                Utwórz nową grę
              </h2>

              {/* Liczba graczy */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Liczba graczy
                </label>
                <div className="flex gap-2">
                  {[2, 3, 4].map(num => (
                    <button
                      key={num}
                      onClick={() => handleNumPlayersChange(num)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        numPlayers === num
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Imiona graczy */}
              <div className="mb-6 space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Imiona graczy
                </label>
                {playerNames.map((name, index) => (
                  <input
                    key={index}
                    type="text"
                    value={name}
                    onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                    placeholder={`Gracz ${index + 1}`}
                    className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                  />
                ))}
              </div>

              {/* Przyciski */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={creating}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Anuluj
                </button>
                <button
                  onClick={createNewGame}
                  disabled={creating}
                  className="flex-1 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-400 transition-colors disabled:opacity-50"
                >
                  {creating ? 'Tworzenie...' : 'Rozpocznij'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista gier */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Twoje poprzednie gry
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Ładowanie gier...</p>
              </div>
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Brak gier</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Rozpocznij nową grę, aby zobaczyć ją tutaj
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {games.map((game) => (
                <div 
                  key={game.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Gra #{game.id.substring(0, 8)}
                      </h3>
                      
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        game.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {game.status === 'active' ? 'Aktywna' : 'Zakończona'}
                      </span>
                    </div>

                    {/* Gracze i wyniki */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {game.players?.map((player) => (
                        <div 
                          key={player.id} 
                          className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {player.name}
                            </span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              {player.score} pkt
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Przycisk Wznów (tylko dla aktywnych gier) */}
                    {game.status === 'active' && (
                      <Link 
                        href={`/games/${game.id}`}
                        className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-400 transition-colors duration-300"
                      >
                        Wznów grę
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
