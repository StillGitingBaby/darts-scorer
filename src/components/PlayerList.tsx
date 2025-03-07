import React from 'react';

import { Player } from '../models/Player';

interface PlayerListProps {
  players: Player[];
  currentPlayerIndex: number;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, currentPlayerIndex }) => {
  if (players.length === 0) {
    return <div className="text-center p-4 text-gray-500">No players added yet</div>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Players</h2>
      <ul className="divide-y divide-gray-200 border rounded-lg overflow-hidden">
        {players.map((player, index) => (
          <li
            key={index}
            data-testid="player-item"
            className={`p-4 flex justify-between items-center ${
              index === currentPlayerIndex ? 'bg-blue-100' : ''
            }`}
          >
            <div className="flex items-center">
              {index === currentPlayerIndex && (
                <span className="mr-2 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
              <span className="font-medium">{player.name}</span>
            </div>
            <span className="text-xl font-bold">{player.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
