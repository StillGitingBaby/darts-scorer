import { Game, GameType } from '../../models/Game';

describe('Game', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game(GameType.X01, 501);
    game.addPlayer('Player 1');
    game.addPlayer('Player 2');
  });

  describe('constructor', () => {
    it('should initialize with the correct values', () => {
      expect(game.type).toBe(GameType.X01);
      expect(game.startingScore).toBe(501);
      expect(game.players.length).toBe(2);
      expect(game.currentPlayerIndex).toBe(0);
      expect(game.isGameOver).toBe(false);
      expect(game.winner).toBeNull();
      expect(game.scoreHistory).toEqual([]);
    });
  });

  describe('addPlayer', () => {
    it('should add a player with the correct starting score', () => {
      const newGame = new Game(GameType.X01, 301);
      newGame.addPlayer('New Player');
      expect(newGame.players.length).toBe(1);
      expect(newGame.players[0].name).toBe('New Player');
      expect(newGame.players[0].score).toBe(301);
    });
  });

  describe('nextTurn', () => {
    it('should move to the next player', () => {
      expect(game.currentPlayerIndex).toBe(0);
      game.nextTurn();
      expect(game.currentPlayerIndex).toBe(1);
      game.nextTurn();
      expect(game.currentPlayerIndex).toBe(0);
    });
  });

  describe('recordScore', () => {
    it('should subtract score from current player in X01 games', () => {
      game.recordScore(60);
      expect(game.players[0].score).toBe(441);
      expect(game.currentPlayerIndex).toBe(1);
    });

    it('should add the score to the player visit scores', () => {
      game.recordScore(60);
      expect(game.players[0].visitScores).toEqual([60]);
    });

    it('should add the score to the score history', () => {
      game.recordScore(60);
      expect(game.scoreHistory).toEqual([
        {
          playerIndex: 0,
          score: 60,
          previousScore: 501,
        },
      ]);
    });

    it('should not subtract score if it would go below 0 (bust)', () => {
      game.players[0].score = 40;
      game.recordScore(60);
      expect(game.players[0].score).toBe(40);
      expect(game.currentPlayerIndex).toBe(0);
      expect(game.players[0].visitScores).toEqual([]);
    });

    it('should end the game when a player reaches 0', () => {
      game.players[0].score = 60;
      game.recordScore(60);
      expect(game.players[0].score).toBe(0);
      expect(game.isGameOver).toBe(true);
      expect(game.winner).toBe(game.players[0]);
      expect(game.currentPlayerIndex).toBe(0);
    });

    it('should do nothing if the game is already over', () => {
      // First end the game
      game.players[0].score = 60;
      game.recordScore(60);
      expect(game.isGameOver).toBe(true);
      
      // Try to record another score
      game.recordScore(40);
      
      // Nothing should change
      expect(game.players[0].score).toBe(0);
      expect(game.isGameOver).toBe(true);
      expect(game.currentPlayerIndex).toBe(0);
      expect(game.scoreHistory.length).toBe(1); // Only the winning score should be recorded
    });
  });

  describe('undoLastMove', () => {
    it('should revert the last move', () => {
      game.recordScore(60);
      expect(game.players[0].score).toBe(441);
      expect(game.currentPlayerIndex).toBe(1);

      game.undoLastMove();
      expect(game.players[0].score).toBe(501);
      expect(game.currentPlayerIndex).toBe(0);
      expect(game.scoreHistory).toEqual([]);
    });

    it('should revert the game over state if necessary', () => {
      game.players[0].score = 60;
      game.recordScore(60);
      expect(game.isGameOver).toBe(true);
      expect(game.winner).toBe(game.players[0]);

      game.undoLastMove();
      expect(game.isGameOver).toBe(false);
      expect(game.winner).toBeNull();
      expect(game.players[0].score).toBe(60);
    });

    it('should do nothing if there is no move history', () => {
      // Game starts with no moves
      expect(game.scoreHistory.length).toBe(0);
      
      // Current state
      const initialPlayerIndex = game.currentPlayerIndex;
      const initialScore = game.players[0].score;
      
      // Try to undo
      game.undoLastMove();
      
      // Nothing should change
      expect(game.currentPlayerIndex).toBe(initialPlayerIndex);
      expect(game.players[0].score).toBe(initialScore);
      expect(game.scoreHistory.length).toBe(0);
    });

    it('should handle case where the player has no visit scores', () => {
      // Add a score entry to history without adding to visitScores
      game.scoreHistory.push({
        playerIndex: 0,
        score: 40,
        previousScore: 501
      });
      game.players[0].score = 461; // Manually update score
      
      // Player has no visit scores yet
      expect(game.players[0].visitScores.length).toBe(0);
      
      game.undoLastMove();
      
      // Should still restore the previous score
      expect(game.players[0].score).toBe(501);
      expect(game.scoreHistory.length).toBe(0);
    });
  });

  describe('reset', () => {
    it('should reset all game state', () => {
      game.recordScore(60);
      game.recordScore(40);
      game.reset();

      expect(game.currentPlayerIndex).toBe(0);
      expect(game.isGameOver).toBe(false);
      expect(game.winner).toBeNull();
      expect(game.scoreHistory).toEqual([]);
      expect(game.players[0].score).toBe(501);
      expect(game.players[1].score).toBe(501);
      expect(game.players[0].visitScores).toEqual([]);
      expect(game.players[1].visitScores).toEqual([]);
    });

    it('should reset even if game was over', () => {
      // End the game
      game.players[0].score = 60;
      game.recordScore(60);
      expect(game.isGameOver).toBe(true);
      expect(game.winner).toBe(game.players[0]);
      
      game.reset();
      
      expect(game.isGameOver).toBe(false);
      expect(game.winner).toBeNull();
      expect(game.players[0].score).toBe(501);
    });
  });

  describe('clone', () => {
    it('should create a deep copy of the game with all properties', () => {
      // Setup a game with some history
      game.recordScore(60); // Player 1 scores 60
      game.recordScore(45); // Player 2 scores 45

      // Create a clone
      const clonedGame = game.clone();

      // Verify it's a different instance
      expect(clonedGame).not.toBe(game);

      // Verify all properties are correctly copied
      expect(clonedGame.type).toBe(game.type);
      expect(clonedGame.startingScore).toBe(game.startingScore);
      expect(clonedGame.currentPlayerIndex).toBe(game.currentPlayerIndex);
      expect(clonedGame.isGameOver).toBe(game.isGameOver);
      expect(clonedGame.scoreHistory).toEqual(game.scoreHistory);

      // Check that the players are deep copied
      expect(clonedGame.players.length).toBe(game.players.length);
      game.players.forEach((player, index) => {
        expect(clonedGame.players[index].name).toBe(player.name);
        expect(clonedGame.players[index].score).toBe(player.score);
        expect(clonedGame.players[index].visitScores).toEqual(player.visitScores);
        // Verify the player objects are different instances
        expect(clonedGame.players[index]).not.toBe(player);
      });
    });

    it('should create independent copies that can be modified separately', () => {
      // Setup initial game
      game.recordScore(60);

      // Clone the game
      const clonedGame = game.clone();

      // Modify the original game
      game.recordScore(40);

      // Verify clone wasn't affected
      expect(clonedGame.currentPlayerIndex).toBe(1);
      expect(clonedGame.scoreHistory.length).toBe(1);
      expect(clonedGame.players[0].score).toBe(441);

      // Modify the clone
      clonedGame.recordScore(50);

      // Verify original wasn't affected by clone's changes
      expect(game.players[1].score).toBe(461); // From the 40 score above
      expect(clonedGame.players[1].score).toBe(451); // From the 50 score
    });

    it('should maintain the winner reference when cloning a finished game', () => {
      // Setup a game where Player 1 wins
      game.players[0].score = 60;
      game.recordScore(60);
      expect(game.isGameOver).toBe(true);
      expect(game.winner).toBe(game.players[0]);

      // Clone the game
      const clonedGame = game.clone();

      // Verify the winner reference is maintained
      expect(clonedGame.isGameOver).toBe(true);
      expect(clonedGame.winner).toBe(clonedGame.players[0]);
      expect(clonedGame.winner).not.toBe(game.winner); // Different object references
    });

    it('should handle cloning a game with no winner correctly', () => {
      // Game has no winner yet
      expect(game.winner).toBeNull();
      
      const clonedGame = game.clone();
      
      // Clone should also have no winner
      expect(clonedGame.winner).toBeNull();
    });

    it('should handle empty players array', () => {
      // Create a game with no players
      const emptyGame = new Game(GameType.X01, 501);
      expect(emptyGame.players.length).toBe(0);
      
      // Clone the empty game
      const clonedGame = emptyGame.clone();
      
      // Verify the clone also has no players
      expect(clonedGame.players.length).toBe(0);
    });
  });

  describe('currentPlayer getter', () => {
    it('should return the current player based on the index', () => {
      expect(game.currentPlayer).toBe(game.players[0]);
      
      game.nextTurn();
      expect(game.currentPlayer).toBe(game.players[1]);
      
      game.nextTurn();
      expect(game.currentPlayer).toBe(game.players[0]);
    });
  });
});
