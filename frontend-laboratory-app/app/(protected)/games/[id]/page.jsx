'use client'
import { useAuth } from "@/app/lib/AuthContext";
import { useState, useEffect, use } from "react";
import { db } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from "next/link";
import ScrabbleBoard from '@/components/ScrabbleBoard';

export default function GameDetailPage({ params }) {
  const { user } = useAuth();
  const resolvedParams = use(params);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGame = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const gameDoc = await getDoc(doc(db, "games", resolvedParams.id));
      
      if (gameDoc.exists()) {
        setGame({ id: gameDoc.id, ...gameDoc.data() });
      } else {
        setError("Gra nie istnieje");
      }
    } catch (error) {
      console.error("Błąd podczas pobierania gry:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGame();
  }, [user?.uid, resolvedParams.id]);

  const refreshGame = () => {
    fetchGame();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#1b1d1f]">
        <p className="text-gray-600 dark:text-gray-400">Ładowanie...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#1b1d1f]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Ładowanie gry...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#1b1d1f]">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">{error || "Gra nie została znaleziona"}</p>
          <Link href="/games" className="text-blue-500 hover:underline">
            Powrót do listy gier
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-[#1b1d1f] min-h-screen">
      <div className="container px-6 py-12 mx-auto">
        <Link href="/games" className="text-blue-500 hover:underline mb-4 inline-block">
          ← Powrót do listy gier
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
            Gra Scrabble #{game.id.substring(0, 8)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Status: <span className={game.status === 'active' ? 'text-green-500' : 'text-gray-500'}>
              {game.status === 'active' ? 'Aktywna' : 'Zakończona'}
            </span>
          </p>
        </div>

        {/* Komponent Scrabble */}
        <ScrabbleBoard game={game} gameId={resolvedParams.id} onGameUpdate={refreshGame} />
      </div>
    </section>
  );
}
