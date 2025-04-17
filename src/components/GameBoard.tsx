import React, { useState, useCallback, useRef, useEffect } from 'react';

import CheckoutDisplay from './CheckoutDisplay';
import GameSetup from './GameSetup';
import PlayerList from './PlayerList';
import ScoreInput from './ScoreInput';
import { Game, GameType } from '../models/Game';
import { MAX_CHECKOUT_SCORE } from '../utils/checkoutRoutes';

const GameBoard: React.FC = () => {
  const [game, setGame] = useState<Game | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const gameRef = useRef<Game | null>(null);

  // Keep gameRef in sync with game state
  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  const handleGameStart = useCallback(
    (gameConfig: { gameType: GameType; startingScore: number; playerNames: string[] }) => {
      const newGame = new Game(gameConfig.gameType, gameConfig.startingScore);

      // Add all players
      gameConfig.playerNames.forEach(name => {
        newGame.addPlayer(name);
      });

      setGame(newGame);
      setGameOver(false);
    },
    []
  );

  const handleScoreSubmit = useCallback(
    (score: number) => {
      // Always use the current game reference to ensure we have the latest state
      const currentGame = gameRef.current;

      if (!currentGame || gameOver) {
        return;
      }

      // Create a deep copy of the current game using clone method
      const updatedGame = currentGame.clone();

      // Record the score in the updated game
      updatedGame.recordScore(score);

      // Update the game state
      setGame(updatedGame);

      // Check if the game is over
      if (updatedGame.isGameOver) {
        setGameOver(true);
      }
    },
    [gameOver]
  );

  const handleUndoLastScore = useCallback(() => {
    if (!game || game.scoreHistory.length === 0) {
      return;
    }

    // Create a deep copy of the current game using clone method
    const updatedGame = game.clone();

    // Undo the last move
    updatedGame.undoLastMove();

    // Update the game state
    setGame(updatedGame);
    // Reset game over state if it was previously over
    if (gameOver) {
      setGameOver(false);
    }
  }, [game, gameOver]);

  const handleResetGame = useCallback(() => {
    if (!game) return;

    // Create a new game with the same settings
    const resetGame = new Game(game.type, game.startingScore);

    // Add all players with reset scores
    game.players.forEach(player => {
      resetGame.addPlayer(player.name);
    });

    setGame(resetGame);
    setGameOver(false);
  }, [game]);

  const handleNewGame = useCallback(() => {
    setGame(null);
    setGameOver(false);
  }, []);

  // Helper function to determine if we should show checkout routes
  const shouldShowCheckoutRoutes = (): boolean => {
    if (!game || gameOver || game.type !== GameType.X01) {
      return false;
    }
    // Only show checkout routes for X01 games when score is at or below MAX_CHECKOUT_SCORE
    return game.currentPlayer && game.currentPlayer.score <= MAX_CHECKOUT_SCORE;
  };

  // Helper function to get the undo button text
  const getUndoButtonText = (): string => {
    if (!game || game.scoreHistory.length === 0) return 'Undo Last Score';

    // Get the last score entry
    const lastScore = game.scoreHistory[game.scoreHistory.length - 1];
    const playerName = game.players[lastScore.playerIndex].name;

    return `Undo ${playerName}'s Last Score (${lastScore.score})`;
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
                onClick={handleUndoLastScore}
                disabled={!game || game.scoreHistory.length === 0}
                className="bg-orange-500 text-white px-4 py-2 rounded mr-2 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {getUndoButtonText()}
              </button>
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

          {/* Show checkout routes for X01 games when not game over */}
          {shouldShowCheckoutRoutes() && game.currentPlayer && (
            <CheckoutDisplay score={game.currentPlayer.score} />
          )}

          <PlayerList players={game.players} currentPlayerIndex={game.currentPlayerIndex} />

          {!gameOver && <ScoreInput onScoreSubmit={handleScoreSubmit} autoFocus={true} />}
        </div>
      )}
    </div>
  );
};

export default GameBoard;
