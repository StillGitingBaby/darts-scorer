import React, { useState, useEffect } from 'react';
import { Game, GameType } from '../models/Game';
import PlayerList from './PlayerList';
import ScoreInput from './ScoreInput';
import GameSetup from './GameSetup';

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
    
    game.recordScore(score);
    
    // Force a re-render by creating a new Game instance with the same properties
    setGame(new Game(game.type, game.startingScore));
    
    // Copy players and state from the existing game
    game.players.forEach(player => {
      setGame(prevGame => {
        if (!prevGame) return prevGame;
        prevGame.addPlayer(player.name);
        prevGame.players[prevGame.players.length - 1].score = player.score;
        return prevGame;
      });
    });
    
    setGame(prevGame => {
      if (!prevGame) return prevGame;
      prevGame.currentPlayerIndex = game.currentPlayerIndex;
      prevGame.isGameOver = game.isGameOver;
      prevGame.winner = game.winner;
      return prevGame;
    });
    
    if (game.isGameOver) {
      setGameOver(true);
    }
  };

  const handleResetGame = () => {
    if (!game) return;
    
    game.reset();
    setGame(new Game(game.type, game.startingScore));
    
    // Copy players from the existing game
    game.players.forEach(player => {
      setGame(prevGame => {
        if (!prevGame) return prevGame;
        prevGame.addPlayer(player.name);
        return prevGame;
      });
    });
    
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
              <p>
                {game.winner
                  ? `${game.winner.name} has won the game!`
                  : 'The game has ended.'}
              </p>
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
          
          <PlayerList
            players={game.players}
            currentPlayerIndex={game.currentPlayerIndex}
          />
          
          {!gameOver && (
            <ScoreInput onScoreSubmit={handleScoreSubmit} />
          )}
        </div>
      )}
    </div>
  );
};

export default GameBoard; 