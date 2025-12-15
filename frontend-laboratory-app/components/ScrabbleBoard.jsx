'use client'
import { useState, useEffect } from 'react';
import { db } from '@/app/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const PLAYER_COLORS = {
  'teal': { bg: 'bg-[#264653]', bgLight: 'bg-[#3d6b7a]', tile: 'bg-[#264653] border-[#1a3139]' },
  'yellow': { bg: 'bg-[#e9c46a]', bgLight: 'bg-[#f0d794]', tile: 'bg-[#e9c46a] border-[#d4b04f]' },
  'orange': { bg: 'bg-[#e76f51]', bgLight: 'bg-[#ed8f7a]', tile: 'bg-[#e76f51] border-[#d45a3d]' },
  'magenta': { bg: 'bg-[#b5179e]', bgLight: 'bg-[#ca3fb4]', tile: 'bg-[#b5179e] border-[#8e1279]' }
};

// === Komponenty renderujące ===

function PlayerCard({ player, isActive, color }) {
  return (
    <div
      className={`p-4 rounded-lg ${color.bg} ${color.text || 'text-white'} transition-opacity ${
        isActive ? 'opacity-100' : 'opacity-60'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">
          {player.name}
          {isActive && <span className="ml-2">●</span>}
        </div>
        <div className="text-lg font-bold">{player.score} pkt</div>
      </div>
      
      <div className="flex gap-1 flex-wrap">
        {player.tiles?.map((letter, index) => (
          <div
            key={`player-${player.id}-tile-${index}-${letter}`}
            className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold bg-white/30 text-white"
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
}

function BoardCell({ x, y, tile, tileColor, isTempTile, isStartTile, selectedTile, onClick }) {
  return (
    <div
      data-x={x}
      data-y={y}
      onClick={onClick}
      className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 border flex items-center justify-center font-bold transition-colors relative ${
        tile && tileColor
          ? isTempTile
            ? `${tileColor.bgLight} opacity-70 ${tileColor.text || 'text-white'} text-lg`
            : `${tileColor.tile} ${tileColor.text || 'text-white'} text-lg`
          : isStartTile
          ? 'bg-[#e9c46a] border-[#d4b04f] hover:bg-[#f0d794] text-gray-900'
          : selectedTile
          ? 'bg-[#3a3a3a] border-[#e6e2db] hover:bg-[#4a4a4a] cursor-pointer text-[#e6e2db]'
          : 'bg-[#2a2a2a] border-[#e6e2db] hover:bg-[#3a3a3a] text-[#e6e2db]'
      } text-xs`}
    >
      {tile ? tile.letter : isStartTile ? '★' : ''}
    </div>
  );
}

function PlayerTileRack({ tiles, selectedIndex, onTileClick }) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {tiles.map((letter, index) => (
        <button
          key={`current-tile-${index}-${letter}`}
          onClick={() => onTileClick(letter, index)}
          className={`w-12 h-12 rounded-lg font-bold text-lg transition-all ${
            selectedIndex === index
              ? 'bg-green-500 text-white ring-4 ring-green-300 scale-110'
              : 'bg-amber-100 dark:bg-amber-700 text-gray-900 dark:text-white hover:bg-amber-200 dark:hover:bg-amber-600'
          }`}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}

function TileBagModal({ isOpen, tiles, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-[#121212] rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Pozostałe literki w worku
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-10 gap-2">
          {tiles?.map((letter, index) => (
            <div
              key={`bag-tile-${index}`}
              className="w-10 h-10 rounded flex items-center justify-center font-bold bg-amber-100 dark:bg-amber-700 text-gray-900 dark:text-white"
            >
              {letter}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PointsModal({ isOpen, points, onPointsChange, onConfirm, onCancel }) {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onCancel}
    >
      <div 
        className="bg-white dark:bg-[#121212] rounded-lg shadow-xl p-8 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
          Przydziel punkty
        </h3>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => onPointsChange(Math.max(0, points - 1))}
            className="w-12 h-12 bg-gray-500 text-white rounded-lg font-bold text-2xl hover:bg-gray-600 transition-colors"
          >
            −
          </button>
          
          <input
            type="number"
            value={points}
            onChange={(e) => onPointsChange(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-24 h-12 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1b1d1f] text-gray-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min="0"
          />
          
          <button
            onClick={() => onPointsChange(points + 1)}
            className="w-12 h-12 bg-gray-500 text-white rounded-lg font-bold text-2xl hover:bg-gray-600 transition-colors"
          >
            +
          </button>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Anuluj
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Zatwierdź
          </button>
        </div>
      </div>
    </div>
  );
}

// === Główny komponent ===

export default function ScrabbleBoard({ game, gameId, onGameUpdate }) {
  const BOARD_SIZE = 15;
  const emptyBoard = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  const playersArray = Array.isArray(game.players) 
    ? game.players 
    : Object.values(game.players || {});
  const currentPlayer = playersArray.find(p => p.id === game.currentPlayer);
  
  // State dla aktualnego ruchu
  const [selectedTile, setSelectedTile] = useState(null); // {letter, index}
  const [placedTiles, setPlacedTiles] = useState([]); // [{x, y, letter, tileIndex}]
  const [playerTiles, setPlayerTiles] = useState(currentPlayer?.tiles || []);
  const [saving, setSaving] = useState(false);
  const [showTileBagModal, setShowTileBagModal] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [pointsToAssign, setPointsToAssign] = useState(0);
  
  // Reset state gdy zmienia się aktywny gracz
  useEffect(() => {
    if (currentPlayer?.tiles) {
      setPlayerTiles([...currentPlayer.tiles]);
      setPlacedTiles([]);
      setSelectedTile(null);
    }
  }, [game.currentPlayer, currentPlayer?.tiles?.length]);
  
  const handleTileClick = (letter, index) => {
    if (selectedTile?.index === index) {
      setSelectedTile(null);
    } else {
      setSelectedTile({ letter, index });
    }
  };
  
  const handleBoardClick = (x, y) => {
    if (!selectedTile) return;
    
    const isOccupiedByCurrentMove = placedTiles.some(tile => tile.x === x && tile.y === y);
    const isOccupiedBySaved = game.board?.some(tile => tile.x === x && tile.y === y);
    
    if (isOccupiedByCurrentMove || isOccupiedBySaved) return;
    
    setPlacedTiles([...placedTiles, {
      x,
      y,
      letter: selectedTile.letter,
      tileIndex: selectedTile.index,
      playerId: game.currentPlayer
    }]);
    
    const newTiles = playerTiles.filter((_, idx) => idx !== selectedTile.index);
    setPlayerTiles(newTiles);
    
    setSelectedTile(null);
  };
  
  const getTileAtPosition = (x, y) => {
    const currentMoveTile = placedTiles.find(tile => tile.x === x && tile.y === y);
    if (currentMoveTile) return currentMoveTile;
    
    const savedTile = game.board?.find(tile => tile.x === x && tile.y === y);
    return savedTile;
  };
  
  const handleReset = () => {
    // Przywróć wszystkie literki do ręki
    const restoredTiles = [...(currentPlayer?.tiles || [])];
    setPlayerTiles(restoredTiles);
    setPlacedTiles([]);
    setSelectedTile(null);
    setPointsToAssign(0);
    setShowPointsModal(false);
  };
  
  const handleConfirm = async () => {
    if (placedTiles.length === 0) {
      alert("Nie ułożyłeś żadnej literki!");
      return;
    }
    
    // Sprawdzenie czy literki są w jednej linii
    const allX = placedTiles.map(t => t.x);
    const allY = placedTiles.map(t => t.y);
    const isHorizontal = new Set(allY).size === 1;
    const isVertical = new Set(allX).size === 1;
    
    if (!isHorizontal && !isVertical) {
      alert("Literki muszą być ułożone w jednej linii (poziomo lub pionowo)!");
      return;
    }
    
    // Sprawdzenie ciągłości (brak luk)
    if (isHorizontal) {
      const sortedX = allX.sort((a, b) => a - b);
      const y = allY[0];
      for (let i = 0; i < sortedX.length - 1; i++) {
        const currentX = sortedX[i];
        const nextX = sortedX[i + 1];
        // Sprawdź czy między literkami jest ciągłość
        for (let x = currentX + 1; x < nextX; x++) {
          const hasLetter = game.board?.some(t => t.x === x && t.y === y);
          if (!hasLetter) {
            alert("Nie możesz tworzyć luk między literkami!");
            return;
          }
        }
      }
    } else {
      const sortedY = allY.sort((a, b) => a - b);
      const x = allX[0];
      for (let i = 0; i < sortedY.length - 1; i++) {
        const currentY = sortedY[i];
        const nextY = sortedY[i + 1];
        for (let y = currentY + 1; y < nextY; y++) {
          const hasLetter = game.board?.some(t => t.x === x && t.y === y);
          if (!hasLetter) {
            alert("Nie możesz tworzyć luk między literkami!");
            return;
          }
        }
      }
    }
    
    // Sprawdź czy pierwsze słowo przechodzi przez START (7,7)
    if (!game.board || game.board.length === 0) {
      const passesStart = placedTiles.some(t => t.x === 7 && t.y === 7);
      if (!passesStart) {
        alert("Pierwsze słowo musi przechodzić przez pole START (w środku planszy)!");
        return;
      }
    }
    
    setSaving(true);
    try {
      // Przygotuj nowe literki na planszy
      const newBoardTiles = placedTiles.map(tile => ({
        x: tile.x,
        y: tile.y,
        letter: tile.letter,
        playerId: game.currentPlayer
      }));
      
      // Oblicz ile literek użył gracz
      const usedTilesCount = placedTiles.length;
      
      // Ile literek ma dobrać (max 7, ale nie więcej niż jest w puli)
      const availableTiles = game.availableTiles || [];
      const tilesToDraw = Math.min(usedTilesCount, availableTiles.length);
      
      // Losuj nowe literki dla gracza
      const newTiles = [];
      const remainingTiles = [...availableTiles];
      for (let i = 0; i < tilesToDraw; i++) {
        const randomIndex = Math.floor(Math.random() * remainingTiles.length);
        newTiles.push(remainingTiles[randomIndex]);
        remainingTiles.splice(randomIndex, 1);
      }
      
      // Zaktualizuj tiles gracza (dodaj nowe literki)
      const playerIndex = playersArray.findIndex(p => p.id === game.currentPlayer);
      const updatedPlayerTiles = [...playerTiles, ...newTiles];
      
      // Zaktualizuj całą tablicę graczy z nowymi literkami i punktami dla aktywnego gracza
      const updatedPlayers = playersArray.map((player, idx) => {
        if (idx === playerIndex) {
          return { 
            ...player, 
            tiles: updatedPlayerTiles,
            score: player.score + pointsToAssign
          };
        }
        return player;
      });
      
      const nextPlayer = game.currentPlayer >= playersArray.length ? 1 : game.currentPlayer + 1;
      
      // Zaktualizuj dokument w Firebase
      const gameRef = doc(db, "games", gameId);
      await updateDoc(gameRef, {
        board: [...(game.board || []), ...newBoardTiles],
        players: updatedPlayers,
        availableTiles: remainingTiles,
        currentPlayer: nextPlayer,
        currentMove: []
      });
      
      // Wyczyść lokalny state i odśwież grę
      setPlacedTiles([]);
      setSelectedTile(null);
      setPointsToAssign(0);
      setShowPointsModal(false);
      
      // Odśwież dane gry z serwera
      if (onGameUpdate) {
        onGameUpdate();
      }
    } catch (error) {
      console.error("Błąd podczas zapisywania ruchu:", error);
      alert("Nie udało się zapisać ruchu: " + error.message);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-[#121212] rounded-lg shadow-lg p-6">
      {/* Gracze */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Gracze</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {playersArray.map((player) => {
            const playerColor = PLAYER_COLORS[player.color] || PLAYER_COLORS['teal'];
            const isActive = player.id === game.currentPlayer;
            
            return (
              <PlayerCard
                key={player.id}
                player={player}
                isActive={isActive}
                color={playerColor}
              />
            );
          })}
        </div>
      </div>

      {/* Plansza */}
      <div className="mb-6 flex justify-center">
        <div className="inline-grid gap-px bg-amber-700 dark:bg-amber-950 p-px rounded">
          {emptyBoard.map((row, y) => (
            <div key={`row-${y}`} className="flex gap-px">
              {row.map((cell, x) => {
                const tile = getTileAtPosition(x, y);
                const tilePlayer = tile ? playersArray.find(p => p.id === tile.playerId) : null;
                const tileColor = tilePlayer ? PLAYER_COLORS[tilePlayer.color] || PLAYER_COLORS['teal'] : null;
                const isTempTile = placedTiles.some(t => t.x === x && t.y === y);
                const isStartTile = x === 7 && y === 7 && !tile;
                
                return (
                  <BoardCell
                    key={`cell-${x}-${y}`}
                    x={x}
                    y={y}
                    tile={tile}
                    tileColor={tileColor}
                    isTempTile={isTempTile}
                    isStartTile={isStartTile}
                    selectedTile={selectedTile}
                    onClick={() => handleBoardClick(x, y)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Literki gracza */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 text-center">
          Twoje literki - {currentPlayer?.name}
        </h3>
        <PlayerTileRack
          tiles={playerTiles}
          selectedIndex={selectedTile?.index}
          onTileClick={handleTileClick}
        />
      </div>

      {/* Przyciski */}
      <div className="flex gap-1 sm:gap-2 md:gap-3 justify-center flex-wrap">
        <button
          onClick={() => setShowTileBagModal(true)}
          className="px-2 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-amber-500 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-amber-600 transition-colors flex items-center gap-1 sm:gap-2"
          title="Pokaż pozostałe literki"
        >
          Worek ({game.availableTiles?.length || 0})
        </button>
        <button
          onClick={handleReset}
          disabled={(placedTiles.length === 0 && pointsToAssign === 0) || saving}
          className="px-2 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-gray-500 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Zresetuj
        </button>
        <button
          onClick={() => setShowPointsModal(true)}
          disabled={saving}
          className="px-2 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-purple-500 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Przydziel punkty {pointsToAssign > 0 && `(${pointsToAssign})`}
        </button>
        <button
          onClick={handleConfirm}
          disabled={placedTiles.length === 0 || saving}
          className="px-2 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-green-500 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Zapisywanie...' : 'Zatwierdź ruch'}
        </button>
      </div>

      <TileBagModal
        isOpen={showTileBagModal}
        tiles={game.availableTiles}
        onClose={() => setShowTileBagModal(false)}
      />
      
      <PointsModal
        isOpen={showPointsModal}
        points={pointsToAssign}
        onPointsChange={setPointsToAssign}
        onConfirm={() => setShowPointsModal(false)}
        onCancel={() => setShowPointsModal(false)}
      />
    </div>
  );
}