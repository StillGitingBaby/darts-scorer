import React, { useState } from 'react';

import GameSetup from './GameSetup';
import PlayerList from './PlayerList';
import ScoreInput from './ScoreInput';
import { Game, GameType } from '../models/Game';

const GameBoard: React.FC = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const handleGameStart = (gameConfig: {
    gameType: GameType;
    startingScore: number;
    playerNames: string[];
  }) => {
    const newGame = new Game(gameConfig.gameType, gameConfig.startingScore);

    // Add all players
    gameConfig.playerNames.forEach(name => {
      newGame.addPlayer(name);
    });

    setGame(newGame);
    setGameOver(false);
  };

  const handleScoreSubmit = (score: number) => {
    if (!game || gameOver) return;

    // Create a deep copy of the current game
    const updatedGame = new Game(game.type, game.startingScore);

    // Copy all players with their current scores
    game.players.forEach(player => {
      updatedGame.addPlayer(player.name);
      // Set the score to match the original player's score
      updatedGame.players[updatedGame.players.length - 1].score = player.score;
    });

    // Set the current player index to match the original game
    updatedGame.currentPlayerIndex = game.currentPlayerIndex;

    // Record the score in the updated game
    updatedGame.recordScore(score);

    // Update the game state
    setGame(updatedGame);

    // Check if the game is over
    if (updatedGame.isGameOver) {
      setGameOver(true);
    }
  };

  const handleResetGame = () => {
    if (!game) return;

    // Create a new game with the same settings
    const resetGame = new Game(game.type, game.startingScore);

    // Add all players with reset scores
    game.players.forEach(player => {
      resetGame.addPlayer(player.name);
    });

    setGame(resetGame);
    setGameOver(false);
  };

  const handleNewGame = () => {
    setGame(null);
    setGameOver(false);
  };

  return (
    <div className="container mx-auto p-4">
      {!game ? (
        <GameSetup onGameStart={handleGameStart} />
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
              {game.type === GameType.X01 ? `${game.startingScore} ${game.type}` : game.type}
            </h1>
            <div>
              <button
                onClick={handleResetGame}
                className="bg-yellow-500 text-white px-4 py-2 rounded mr-2 hover:bg-yellow-600"
              >
                Reset Game
              </button>
              <button
                onClick={handleNewGame}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                New Game
              </button>
            </div>
          </div>

          {gameOver ? (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
              <p className="font-bold">Game Over!</p>
              <p>{game.winner ? `${game.winner.name} has won the game!` : 'The game has ended.'}</p>
            </div>
          ) : (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
              <p className="font-bold">Current Turn</p>
              <p>
                {game.players.length > 0
                  ? `${game.currentPlayer.name}'s turn to throw`
                  : 'No players added yet'}
              </p>
            </div>
          )}

          <PlayerList players={game.players} currentPlayerIndex={game.currentPlayerIndex} />

          {!gameOver && <ScoreInput onScoreSubmit={handleScoreSubmit} />}
        </div>
      )}
    </div>
  );
};

export default GameBoard;
