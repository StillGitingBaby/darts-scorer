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
      <div className="grid grid-cols-2 gap-4">
        {players.map((player, index) => (
          <div
            key={index}
            data-testid="player-item"
            className={`p-4 border rounded-lg ${
              index === currentPlayerIndex ? 'bg-blue-100' : ''
            }`}
          >
            <div className="flex items-center mb-2">
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
              <span className="font-medium text-lg">{player.name}</span>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold">{player.score}</span>
              {player.visitScores.length > 0 && (
                <div className="mt-2">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Last visit: </span>
                    <span>{player.visitScores[player.visitScores.length - 1]}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    <span>Visit history: </span>
                    <span>{player.visitScores.join(', ')}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerList;
