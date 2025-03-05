import React, { useState } from 'react';
import { GameType } from '../models/Game';

interface GameSetupProps {
  onGameStart: (gameConfig: {
    gameType: GameType;
    startingScore: number;
    playerNames: string[];
  }) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onGameStart }) => {
  const [gameType, setGameType] = useState<GameType>(GameType.X01);
  const [startingScore, setStartingScore] = useState<number>(501);
  const [inputPlayer, setInputPlayer] = useState<string>('');
  const [ExistingPlayers, setExistingPlayers] = useState<string[]>([]);

  const handleAddPlayer = () => {
    const trimmedName = inputPlayer.trim();

    if (!trimmedName) return; // Prevent adding empty names

    if (ExistingPlayers.includes(trimmedName)) {
      alert('This name is already taken. Please choose a different name.');
      return;
    }

    setExistingPlayers([...ExistingPlayers, trimmedName]);
    setInputPlayer('');
  };

  const handleRemovePlayer = (index: number) => {
    setExistingPlayers(ExistingPlayers.filter((_, i) => i !== index));
  };

  const handleStartGame = () => {
    if (ExistingPlayers.length > 0) {
      onGameStart({
        gameType,
        startingScore,
        playerNames: ExistingPlayers,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Game Setup</h2>
      
      <div className="mb-4">
        <label htmlFor="game-type" className="block mb-1 font-medium">
          Game Type:
        </label>
        <select
          id="game-type"
          value={gameType}
          onChange={(e) => setGameType(e.target.value as GameType)}
          className="w-full border rounded px-3 py-2"
        >
          <option value={GameType.X01}>X01</option>
          <option value={GameType.Cricket}>Cricket</option>
          <option value={GameType.AroundTheClock}>Around the Clock</option>
        </select>
      </div>
      
      {gameType === GameType.X01 && (
        <div className="mb-4">
          <label htmlFor="starting-score" className="block mb-1 font-medium">
            Starting Score:
          </label>
          <select
            id="starting-score"
            value={startingScore}
            onChange={(e) => setStartingScore(parseInt(e.target.value))}
            className="w-full border rounded px-3 py-2"
          >
            <option value={301}>301</option>
            <option value={501}>501</option>
            <option value={701}>701</option>
            <option value={1001}>1001</option>
          </select>
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="player-name" className="block mb-1 font-medium">
          Player Name:
        </label>
        <div className="flex">
          <input
            id="player-name"
            type="text"
            value={inputPlayer}
            onChange={(e) => setInputPlayer(e.target.value)}
            className="flex-1 border rounded px-3 py-2 mr-2"
          />
          <button
            onClick={handleAddPlayer}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Player
          </button>
        </div>
      </div>
      
      {ExistingPlayers.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2">Players:</h3>
          <ul className="border rounded divide-y">
            {ExistingPlayers.map((name, index) => (
              <li
                key={index}
                data-testid="player-item"
                className="flex justify-between items-center p-2"
              >
                <span>{name}</span>
                <button
                  onClick={() => handleRemovePlayer(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <button
        onClick={handleStartGame}
        disabled={ExistingPlayers.length === 0}
        className={`w-full py-2 rounded text-white font-medium ${
          ExistingPlayers.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        Start Game
      </button>
    </div>
  );
};

export default GameSetup; 