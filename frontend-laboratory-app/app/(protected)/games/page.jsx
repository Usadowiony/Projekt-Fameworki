'use client'
import { useAuth } from "@/app/lib/AuthContext";
import { useState, useEffect } from "react";
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import Link from "next/link";

const SCRABBLE_TILES = {
  'A': 9, 'Ą': 1, 'B': 2, 'C': 3, 'Ć': 1, 'D': 3, 'E': 7, 'Ę': 1,
  'F': 1, 'G': 2, 'H': 2, 'I': 8, 'J': 2, 'K': 3, 'L': 3, 'Ł': 2,
  'M': 3, 'N': 5, 'Ń': 1, 'O': 6, 'Ó': 1, 'P': 3, 'R': 4, 'S': 4,
  'Ś': 1, 'T': 3, 'U': 2, 'W': 4, 'Y': 4, 'Z': 5, 'Ź': 1, 'Ż': 1
};

const PLAYER_COLORS = [
  { id: 'teal', name: 'Morski', bg: 'bg-[#264653]', bgLight: 'bg-[#3d6b7a]', bgDark: 'bg-[#1a3139]', text: 'text-white', border: 'border-[#264653]', tile: 'bg-[#264653] border-[#1a3139]' },
  { id: 'yellow', name: 'Żółty', bg: 'bg-[#e9c46a]', bgLight: 'bg-[#f0d794]', bgDark: 'bg-[#d4b04f]', text: 'text-gray-900', border: 'border-[#e9c46a]', tile: 'bg-[#e9c46a] border-[#d4b04f]' },
  { id: 'orange', name: 'Pomarańczowy', bg: 'bg-[#e76f51]', bgLight: 'bg-[#ed8f7a]', bgDark: 'bg-[#d45a3d]', text: 'text-white', border: 'border-[#e76f51]', tile: 'bg-[#e76f51] border-[#d45a3d]' },
  { id: 'magenta', name: 'Magenta', bg: 'bg-[#b5179e]', bgLight: 'bg-[#ca3fb4]', bgDark: 'bg-[#8e1279]', text: 'text-white', border: 'border-[#b5179e]', tile: 'bg-[#b5179e] border-[#8e1279]' }
];

function createTileDeck() {
  const deck = [];
  for (const [letter, count] of Object.entries(SCRABBLE_TILES)) {
    for (let i = 0; i < count; i++) {
      deck.push(letter);
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function drawTiles(deck, count) {
  return deck.splice(0, Math.min(count, deck.length));
}

// === Komponenty renderujące ===

function DeleteConfirmModal({ isOpen, gameToDelete, deleting, onCancel, onConfirm }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Usuń grę?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Czy na pewno chcesz usunąć grę <strong>#{gameToDelete?.id.substring(0, 8)}</strong>? Ta operacja jest nieodwracalna.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Anuluj
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {deleting ? 'Usuwanie...' : 'Usuń'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ColorPickerInline({ colors, selectedColorId, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {colors.map((color) => {
        const isSelected = selectedColorId === color.id;
        
        return (
          <button
            key={color.id}
            type="button"
            onClick={() => onSelect(color.id)}
            className={`w-8 h-8 rounded-md ${color.bg} border-2 transition-all hover:scale-105 ${
              isSelected 
                ? 'border-gray-900 dark:border-white scale-110' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            title={color.name}
          />
        );
      })}
    </div>
  );
}

function CreateGameModal({
  isOpen,
  numPlayers,
  playerNames,
  playerColors,
  creating,
  onClose,
  onNumPlayersChange,
  onPlayerNameChange,
  onColorSelect,
  onCreate
}) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Utwórz nową grę
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Liczba graczy
          </label>
          <div className="flex gap-2">
            {[2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => onNumPlayersChange(num)}
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

        <div className="mb-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Gracze
          </label>
          {playerNames.map((name, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => onPlayerNameChange(index, e.target.value)}
                placeholder={`Imię gracza ${index + 1}`}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              />
              
              <ColorPickerInline
                colors={PLAYER_COLORS}
                selectedColorId={playerColors[index]}
                onSelect={(colorId) => onColorSelect(index, colorId)}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={creating}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Anuluj
          </button>
          <button
            onClick={onCreate}
            disabled={creating}
            className="flex-1 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-400 transition-colors disabled:opacity-50"
          >
            {creating ? 'Tworzenie...' : 'Rozpocznij'}
          </button>
        </div>
      </div>
    </div>
  );
}

function GameCard({ game, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Gra #{game.id.substring(0, 8)}
          </h3>
          
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              game.status === 'active' 
                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {game.status === 'active' ? 'Aktywna' : 'Zakończona'}
            </span>
            
            <button
              onClick={() => onDelete(game)}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Usuń grę"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {game.players?.map((player) => (
            <div key={player.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
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
  );
}

// === Główny komponent ===

export default function GamesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerNames, setPlayerNames] = useState(["", ""]);
  const [playerColors, setPlayerColors] = useState([PLAYER_COLORS[0].id, PLAYER_COLORS[1].id]);
  const [creating, setCreating] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
    const defaultColors = Array(num).fill(null).map((_, idx) => PLAYER_COLORS[idx % PLAYER_COLORS.length].id);
    setPlayerColors(defaultColors);
  };

  const handlePlayerNameChange = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handlePlayerColorChange = (index, colorId) => {
    const newColors = [...playerColors];
    
    const otherPlayerIndex = playerColors.findIndex((c, i) => i !== index && c === colorId);
    
    if (otherPlayerIndex !== -1) {
      newColors[otherPlayerIndex] = playerColors[index];
    }
    
    newColors[index] = colorId;
    setPlayerColors(newColors);
  };

  const handleDeleteClick = (game) => {
    setGameToDelete(game);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!gameToDelete) return;
    
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "games", gameToDelete.id));
      
      setGames(games.filter(g => g.id !== gameToDelete.id));
      
      setDeleteModal(false);
      setGameToDelete(null);
    } catch (error) {
      console.error("Błąd podczas usuwania gry:", error);
      alert("Nie udało się usunąć gry");
    } finally {
      setDeleting(false);
    }
  };

  const createNewGame = async () => {
    if (playerNames.some(name => !name.trim())) {
      alert("Wypełnij wszystkie imiona graczy");
      return;
    }

    setCreating(true);
    try {
      const userRef = doc(db, "users", user.uid);
      
      const deck = createTileDeck();
      const playersWithTiles = playerNames.map((name, index) => ({
        id: index + 1,
        name: name.trim(),
        score: 0,
        color: playerColors[index],
        tiles: drawTiles(deck, 7)
      }));
      
      const newGame = {
        user: userRef,
        createdAt: new Date(),
        status: "active",
        currentPlayer: 1,
        players: playersWithTiles,
        availableTiles: deck,
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

        <DeleteConfirmModal
          isOpen={deleteModal}
          gameToDelete={gameToDelete}
          deleting={deleting}
          onCancel={() => {
            setDeleteModal(false);
            setGameToDelete(null);
          }}
          onConfirm={confirmDelete}
        />

        <CreateGameModal
          isOpen={showModal}
          numPlayers={numPlayers}
          playerNames={playerNames}
          playerColors={playerColors}
          creating={creating}
          onClose={() => setShowModal(false)}
          onNumPlayersChange={handleNumPlayersChange}
          onPlayerNameChange={handlePlayerNameChange}
          onColorSelect={handlePlayerColorChange}
          onCreate={createNewGame}
        />

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
                <GameCard 
                  key={game.id} 
                  game={game} 
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
