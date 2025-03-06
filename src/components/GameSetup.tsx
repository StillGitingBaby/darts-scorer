import React, { useState } from 'react';
import { GameType } from '../models/Game';

interface GameSetupProps {
  onGameStart: (config: {
    gameType: GameType;
    startingScore: number;
    playerNames: string[];
    doubleOutRequired: boolean;
  }) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onGameStart }) => {
  const [gameType, setGameType] = useState<GameType>(GameType.X01);
  const [startingScore, setStartingScore] = useState<number>(501);
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<string[]>([]);
  const [doubleOutRequired, setDoubleOutRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateX01Score = (score: number): boolean => {
    return score % 100 === 1 || score === 301 || score === 501 || score === 701 || score === 1001;
  };

  const handleAddPlayer = () => {
    const trimmedName = playerName.trim();
    if (!trimmedName) {
      setError('Player name cannot be empty');
      return;
    }
    if (players.includes(trimmedName)) {
      setError('Player name must be unique');
      return;
    }

    setPlayers([...players, trimmedName]);
    setPlayerName('');
    setError(null);
  };

  const handleRemovePlayer = (index: number) => {
    const updatedPlayers = players.filter((_, i) => i !== index);
    setPlayers(updatedPlayers);
    if (updatedPlayers.length === 0) {
      setError('At least one player is required');
    }
  };

  const handleStartGame = () => {

    if (players.length === 0) {
      setError('At least one player is required');
      return;
    }

    if (gameType === GameType.X01 && !validateX01Score(startingScore)) {
      setError('X01 games must start with a score ending in 01');
      return;
    }

    setError(null);
    onGameStart({
      gameType,
      startingScore,
      playerNames: players,
      doubleOutRequired
    });
  };

  const handleStartingScoreChange = (value: string) => {
    const score = Number(value);
    setStartingScore(score);
    
    if (gameType === GameType.X01 && !validateX01Score(score)) {
      setError('X01 games must start with a score ending in 01');
    } else {
      setError(null);
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
          className="w-full border rounded px-3 py-2"
          value={gameType}
          onChange={(e) => {
            setGameType(e.target.value as GameType);
            setError(null);
          }}
        >
          <option value={GameType.X01}>X01</option>
          <option value={GameType.Cricket}>Cricket</option>
          <option value={GameType.AroundTheClock}>Around the Clock</option>
        </select>
      </div>

      {gameType === GameType.X01 && (
        <>
          <div className="mb-4">
            <label htmlFor="starting-score" className="block mb-1 font-medium">
              Starting Score:
            </label>
            <select
              id="starting-score"
              className="w-full border rounded px-3 py-2"
              value={startingScore}
              onChange={(e) => handleStartingScoreChange(e.target.value)}
            >
              <option value={301}>301</option>
              <option value={501}>501</option>
              <option value={701}>701</option>
              <option value={1001}>1001</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={doubleOutRequired}
                onChange={(e) => setDoubleOutRequired(e.target.checked)}
              />
              <span>Double Out Required</span>
            </label>
          </div>
        </>
      )}

      <div className="mb-4">
        <label htmlFor="player-name" className="block mb-1 font-medium">
          Player Name:
        </label>
        <div className="flex">
          <input
            type="text"
            id="player-name"
            className="flex-1 border rounded px-3 py-2 mr-2"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleAddPlayer}
          >
            Add Player
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded" role="alert">
          {error}
        </div>
      )}

      {players.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2">Players:</h3>
          <ul className="border rounded divide-y">
            {players.map((player, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2"
                data-testid="player-item"
              >
                <span>{player}</span>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleRemovePlayer(index)}
                  aria-label={`Remove ${player}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        className={`w-full py-2 rounded text-white font-medium ${
          players.length > 0
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
        onClick={handleStartGame}
        disabled={players.length === 0}
      >
        Start Game
      </button>
    </div>
  );
};

export default GameSetup; 