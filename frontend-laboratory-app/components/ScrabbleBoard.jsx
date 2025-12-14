'use client'

export default function ScrabbleBoard({ game }) {
  // TODO: Komponent planszy Scrabble
  // Będzie wyświetlał:
  // - Planszę 15x15
  // - Ułożone litery (game.board)
  // - Aktualny ruch (game.currentMove) - wyróżniony kolorem
  // - Wyniki graczy (game.players)
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Plansza Scrabble
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Tu zrobie komponent
      </p>
    </div>
  );
}
